const router = require("express").Router();
const Story = require("../models/Story");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const { verifyTokenAndAdmin } = require("./verifyToken");

const coversDirectory = path.join(__dirname, "../uploads/covers");
const allowedCoverTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp"
};

fs.mkdirSync(coversDirectory, { recursive: true });

const uploadCover = multer({
    storage: multer.diskStorage({
        destination: coversDirectory,
        filename: (req, file, callback) => {
            const extension = path.extname(file.originalname).toLowerCase();
            callback(null, `${randomUUID()}${extension}`);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        if (allowedCoverTypes[extension] !== file.mimetype) {
            return callback(new Error("A capa deve estar no formato JPG, PNG ou WebP."));
        }
        callback(null, true);
    }
});

const receiveCover = (req, res, next) => {
    uploadCover.single("cover")(req, res, (error) => {
        if (!error) return next();

        if (error instanceof multer.MulterError) {
            const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
            return res.status(status).json({
                success: false,
                message: status === 413
                    ? "A capa deve ter no máximo 5 MB."
                    : "Não foi possível processar o arquivo da capa."
            });
        }

        if (error.message === "A capa deve estar no formato JPG, PNG ou WebP.") {
            return res.status(400).json({ success: false, message: error.message });
        }

        console.error("Error saving uploaded cover:", error);
        return res.status(500).json({
            success: false,
            message: "Ocorreu um erro ao salvar a capa."
        });
    });
};

const removeUploadedCover = async (req) => {
    if (!req.file) return;

    try {
        await fs.promises.unlink(req.file.path);
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.error("Error removing an unused uploaded cover:", error);
        }
    }
};

// Rota para criar uma nova história
router.post("/register", verifyTokenAndAdmin, receiveCover, async (req, res) => {
    try {
        const { title, content, category, status, authorWork, author } = req.body;

        // 1. Validação de dados de entrada obrigatórios
        if (!title || !content || !category || !authorWork || !author) {
            await removeUploadedCover(req);
            return res.status(400).json({
                success: false,
                message: "Missing required story data (title, content, category, authorWork, or author)!"
            });
        }

        // 2. Validação de Segurança: Garante que o ID do autor enviado é um ObjectId válido do MongoDB
        if (!mongoose.Types.ObjectId.isValid(author)) {
            await removeUploadedCover(req);
            return res.status(400).json({
                success: false,
                message: "Invalid author ID format!"
            });
        }

        // 3. CORREÇÃO CRÍTICA DO BUG DO $or: Verifica duplicidade EXCLUSIVAMENTE pelo título
        const verifyStory = await Story.findOne({ title: title.trim() });
        if (verifyStory) {
            await removeUploadedCover(req);
            return res.status(409).json({
                success: false,
                message: "A story with this title already exists!"
            });
        }

        // 4. Instanciação e gravação limpa no banco de dados
        const newStory = new Story({
            title: title.trim(),
            content,
            category: category.toLowerCase(), // Força lowercase para bater com o enum do Schema
            coverImage: req.file ? `/uploads/covers/${req.file.filename}` : "",
            status: status || "draft",
            views: 0, // Inicia obrigatoriamente com zero visualizações
            authorWork,
            author
        });

        const savedStory = await newStory.save();

        return res.status(201).json({
            success: true,
            message: "Story has been successfully created!",
            savedStory
        });

    } catch (err) {
        await removeUploadedCover(req);
        console.error("Error registering story:", err);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred while processing the request.",
            error: err.message // Auxilia na depuração em desenvolvimento
        });
    }
});

// ==========================================================================
// 1. OPERAÇÃO READ (Ler/Listar Histórias)
// ==========================================================================

/**
 * @route   GET /api/story/find/:id
 * @desc    Obter uma história específica pelo ID (PÚBLICO - Qualquer um pode ler)
 */
router.get("/find/:id", async (req, res) => {
    try {
        // O .populate("author", "username email") traz os dados do criador automaticamente, ocultando a senha
        const story = await Story.findById(req.params.id).populate("author", "username email");
        
        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Story not found!"
            });
        }

        // Incrementa o contador de visualizações (views) automaticamente a cada leitura
        story.views += 1;
        await story.save();

        return res.status(200).json({
            success: true,
            story
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving the story.",
            error: err.message
        });
    }
});

/**
 * @route   GET /api/story
 * @desc    Listar todas as histórias com filtros opcionais por categoria ou status (PÚBLICO)
 */
router.get("/", async (req, res) => {
    const qCategory = req.query.category;
    const qStatus = req.query.status;

    try {
        let stories;

        // Permite buscar na API filtrando na URL, ex: /api/story?category=romance
        if (qCategory && qStatus) {
            stories = await Story.find({ category: qCategory.toLowerCase(), status: qStatus });
        } else if (qCategory) {
            stories = await Story.find({ category: qCategory.toLowerCase() });
        } else if (qStatus) {
            stories = await Story.find({ status: qStatus });
        } else {
            stories = await Story.find(); // Se não passar filtros, traz tudo
        }

        return res.status(200).json({
            success: true,
            count: stories.length,
            stories
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving stories.",
            error: err.message
        });
    }
});

// ==========================================================================
// 2. OPERAÇÃO UPDATE (Atualizar História)
// ==========================================================================

/**
 * @route   PUT /api/story/:id
 * @desc    Atualizar os dados de um livro (PROTEGIDO - Apenas Administradores)
 */
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        // Se o título estiver a ser atualizado, verifica se já não existe outro livro com o mesmo nome
        if (req.body.title) {
            const existingStory = await Story.findOne({ 
                title: req.body.title.trim(), 
                _id: { $ne: req.params.id } // Ignora o próprio livro que está a ser editado
            });

            if (existingStory) {
                return res.status(409).json({
                    success: false,
                    message: "A story with this new title already exists!"
                });
            }
            req.body.title = req.body.title.trim();
        }

        // Força a categoria a salvar em minúsculo se ela for enviada
        if (req.body.category) {
            req.body.category = req.body.category.toLowerCase();
        }

        const updatedStory = await Story.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body // Atualiza apenas os campos enviados no corpo da requisição
            },
            { new: true, runValidators: true } // 'new: true' faz retornar o objeto já atualizado
        );

        if (!updatedStory) {
            return res.status(404).json({
                success: false,
                message: "Story not found to update!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Story has been successfully updated!",
            updatedStory
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the story.",
            error: err.message
        });
    }
});

// ==========================================================================
// 3. OPERAÇÃO DELETE (Remover História)
// ==========================================================================

/**
 * @route   DELETE /api/story/:id
 * @desc    Apagar um livro permanentemente do banco (PROTEGIDO - Apenas Administradores)
 */
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedStory = await Story.findByIdAndDelete(req.params.id);

        if (!deletedStory) {
            return res.status(404).json({
                success: false,
                message: "Story not found to delete!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Story has been successfully deleted from the database!"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while trying to delete the story.",
            error: err.message
        });
    }
});


module.exports = router;
