const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
    {
        title: {
            type: String, 
            required: true, 
            unique: true, // Garante a unicidade a nível de banco de dados
            trim: true
        },
        content: {
            type: String, 
            required: true 
        },
        category: {
            type: String, 
            required: true,
            lowercase: true,
            enum: ["romance", "terror", "fantasia", "ficção científica", "crônicas", "fábulas"]
        },
        coverImage: {
            type: String, 
            default: "" 
        },
        status: {
            type: String, 
            enum: ["draft", "published"], 
            default: "draft" 
        },
        views: {
            type: Number, 
            default: 0 
        },
        authorWork: {
            type: String, // Mantido como texto puro para guardar o nome do autor do livro
            required: true,
            trim: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Aponta corretamente para o seu modelo de coleções de usuários
            required: true
        }
    }, 
    { timestamps: true }
);

module.exports = mongoose.model("Story", StorySchema);
