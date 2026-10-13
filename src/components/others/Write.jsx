import React, {useContext, useRef, useState } from 'react'
import {useNavigate} from "react-router-dom"
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import '../../Write.css'
import axios from 'axios'
import { AuthContext } from '../context/authContext'


export default function WriteStory() {
    const [title, setTitle] = useState("");
    const [value, setValue] = useState("");
    const [category, setCategory] = useState("");
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const coverInputRef = useRef(null);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate()

    const handleSubmit = async (status) => {
        setMessage(null);

        if (!currentUser?.accessToken || !currentUser?._id) {
            setMessage({ type: 'error', text: 'Inicie sessão para salvar uma história.' });
            return;
        }

        if (!currentUser.isAdmin) {
            setMessage({ type: 'error', text: 'A API permite criar histórias apenas para administradores.' });
            return;
        }

        if (!title.trim() || !value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() || !category) {
            setMessage({ type: 'error', text: 'Preencha o título, o conteúdo e a categoria.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const storyData = new FormData();
            storyData.append('title', title.trim());
            storyData.append('content', value);
            storyData.append('category', category);
            storyData.append('status', status);
            storyData.append('authorWork', currentUser.username);
            storyData.append('author', currentUser._id);
            if (file) storyData.append('cover', file);

            const response = await axios.post(
                'http://localhost:5000/api/story/register',
                storyData,
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.accessToken}`
                    }
                }
            );

            setMessage({ type: 'success', text: response.data.message || 'História salva com sucesso.' });
            setTitle("");
            setValue("");
            setCategory("");
            setFile(null);
            if (coverInputRef.current) coverInputRef.current.value = "";

            navigate('/explorer')

        } catch (error) {
            console.error('Erro ao salvar história:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Não foi possível salvar a história. Verifique sua conexão e tente novamente.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="write-elenco-page">
            <div className="write-elenco-container">
                
                {/* Painel Esquerdo: Título e Editor */}
                <div className="content-area">
                    <input 
                        type="text" 
                        placeholder='Título da História / Livro...' 
                        className="title-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="editor-container">
                        <ReactQuill 
                            className="editor" 
                            theme="snow" 
                            value={value} 
                            onChange={setValue} 
                        />
                    </div>
                </div>

                {/* Painel Direito: Menus de Configuração */}
                <div className="menu-area">
                    
                    {/* Item 1: Publicação */}
                    <div className="menu-item">
                        <h2>Publicar</h2>
                        <div className="status-info">
                            <span><b>Estado:</b> Rascunho</span>
                            <span><b>Visibilidade:</b> Público</span>
                        </div>
                        
                        <div className="file-upload-wrapper">
                            <input 
                                style={{display:"none"}} 
                                type="file" 
                                id='file' 
                                ref={coverInputRef}
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => setFile(e.target.files[0])} 
                            />
                            <label className="file-label" htmlFor="file">
                                <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4M17 8l-5-5-5 5M12 3v12"/></svg>
                                {file ? file.name : "Carregar Capa do Livro"}
                            </label>
                        </div>

                        <div className="action-buttons">
                            <button
                                type="button"
                                className="btn-draft"
                                disabled={isSubmitting}
                                onClick={() => handleSubmit('draft')}
                            >
                                {isSubmitting ? 'Salvando...' : 'Salvar Rascunho'}
                            </button>
                            <button
                                type="button"
                                className="btn-publish"
                                disabled={isSubmitting}
                                onClick={() => handleSubmit('published')}
                            >
                                {isSubmitting ? 'Salvando...' : 'Publicar'}
                            </button>
                        </div>
                        {message && (
                            <p role={message.type === 'error' ? 'alert' : 'status'}>
                                {message.text}
                            </p>
                        )}
                        <small>Formatos aceitos: JPG, PNG ou WebP. Tamanho máximo: 5 MB.</small>
                    </div>

                    {/* Item 2: Categorias baseadas no seu projeto de livros */}
                    <div className="menu-item">
                        <h2>Categorias / Gêneros</h2>
                        <div className="categories-list">
                            {['Romance', 'Terror', 'Fantasia', 'Ficção Científica', 'Crônicas', 'Fábulas'].map((cat) => (
                                <div className="cat-option" key={cat}>
                                    <input 
                                        type="radio" 
                                        name='cat' 
                                        value={cat.toLowerCase()} 
                                        id={cat.toLowerCase()}
                                        checked={category === cat.toLowerCase()}
                                        onChange={(e) => setCategory(e.target.value)}
                                    />
                                    <label htmlFor={cat.toLowerCase()}>{cat}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
