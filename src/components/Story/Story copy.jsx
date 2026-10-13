import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import '../../Story.css'

const storyChapters = {
    26: {
        id: 26,
        title: 'O Último Guardião de Éldora',
        author: 'Carlos Mendes',
        genre: 'Fantasia',
        description: 'Em um mundo onde a magia está morrendo, um jovem e carrega o destino de todo um reino em suas mãos. Uma jornada épica de coragem, sacrifício e amor proibido.',
        cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
        views: 5840,
        likes: 342,
        followers: 198,
        chapters: [
        { id: 1, title: 'O Despertar', words: 165, date: '16 mar 2026', content: 'A luz da manhã encontrou a cidade em silêncio, Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam fuga earum obcaecati natus quod eius deleniti maiores vitae, corporis quos laboriosam nulla maxime provident ex quis exercitationem, nostrum et doloribus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere aperiam beatae cumque sint, eius velit. Eos omnis praesentium harum at, vero tenetur officia optio natus corporis iste doloremque quas nulla. Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, quas rerum! Similique velit blanditiis deleniti odit inventore quae hic, optio veritatis sed autem officiis obcaecati dolore est consectetur rerum labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero nam, similique quae eveniet, porro consequatur eos dolorum, aliquid ratione optio reiciendis? Nam, ab libero! Praesentium exercitationem cum sapiente dolorem quae. enquanto o primeiro mistério ainda dormia nos cantos da rua.' },
        { id: 2, title: 'A Floresta Proibida', words: 172, date: '16 mar 2026', content: 'Ao entrar no velho escritório, ela percebeu que o papel no topo da mesa não era uma nota qualquer, mas um aviso que parecia ter sido escrito para ela.' },
        { id: 3, title: 'A Guardiã Adormecida', words: 185, date: '16 mar 2026', content: 'As janelas tremiam com o vento, e cada traço da mensagem parecia apontar para um nome que ela jurava nunca ter ouvido.' },
        { id: 4, title: 'O Voto do Fogo', words: 198, date: '16 mar 2026', content: 'O tempo passou, mas o mistério não recuou. A cada passo, a verdade se aproximava como uma sombra que já conhecia seu rosto.' }
        ]
    },
    12: {
        id: 12,
        title: 'A Cidade das Sombras',
        author: 'Terdeu',
        genre: 'Mistério',
        description: 'Uma cidade escondida entre ruínas e memórias, onde cada noite reveals um segredo antigo.',
        cover: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=82',
        views: 3210,
        likes: 200,
        followers: 82,
        chapters: [
        { id: 1, title: 'Na praça', words: 120, date: '10 mar 2026', content: 'Na praça vazia, a música do relógio marca o início de uma noite de segredos e promessas.' },
        { id: 2, title: 'Cartas Antigas 2', words: 150, date: '12 mar 2026', content: 'As cartas antigas revelavam um mapa que ninguém mais lembrava ter existido.' }
        ]
    }
};

export default function Story () {

    const { storyId } = useParams();
    const story = storyChapters[Number(storyId)] || storyChapters[26];
    const chapters = story.chapters || [];

    // 1. Estado para controlar o índice do capítulo ativo (começa no 0, ou seja, Capítulo 1)
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);

    // Se a história mudar pela URL, reinicia para o primeiro capítulo
    useEffect(() => {
        setActiveChapterIndex(0);
    }, [storyId]);

    // Captura o objeto do capítulo que está atualmente selecionado
    const currentChapter = chapters[activeChapterIndex] || { title: 'Nenhum Capítulo', content: '' };

    // 2. Manipulador para a mudança no componente <select>
    const handleSelectChapter = (e) => {
        setActiveChapterIndex(Number(e.target.value));
    };



    return (
        <div className="app-container">
            <Navbar />
            <main className="main-content-layout">
                <div className='card-elenco'>
                    
                    {/* Painel Esquerdo: Detalhes do Livro */}
                    <section className='elenco-view-box'>
                        <div className='elenco-view-box-category'>
                            <button className="btn-read-action">
                                <Link to="/explorer">Voltar</Link>
                            </button>
                        </div>
                        <div className='elenco-view-box-category'>{story.genre}</div>

                        <h1 className="story-main-title">{story.title}</h1>
                        <p className='author'>por {story.author}</p>
                        <p className='elenco'>{story.description}</p>

                        <div className="book-stats">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                {story.views} visualizações
                            </span>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>
                                {chapters.length} capítulos
                            </span>
                        </div>

                        {/* Bloco de Ações Alinhado */}
                        <div className="actions-row">
                            <button className='btn-read-action' onClick={() => setActiveChapterIndex(0)}>
                                Ler
                            </button>

                            <div className="select-wrapper">
                                <select 
                                    className="chapter-select" 
                                    value={activeChapterIndex} 
                                    onChange={(e) => {
                                        setActiveChapterIndex(Number(e.target.value));
                                        if(handleSelectChapter) handleSelectChapter(e);
                                    }}
                                >
                                    {chapters.map((chap, idx) => (
                                        <option key={chap.id} value={idx}>
                                            {chap.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Painel Direito: Área de Leitura Otimizada */}
                    <section className='elenco-view-box-content'>
                        <div className="reader-header">
                            <div className="reader-titles">
                                <h1>{currentChapter.title}</h1>
                                <h3>Capítulo {activeChapterIndex + 1}</h3>
                            </div>
                            
                        </div>

                        {/* Conteiner de texto purificado sem os bugs do <pre> nativo */}
                        <div className="content-to-read">
                            <p className='elenco-text-content'>
                                {currentChapter.content}
                            </p>
                        </div>

                        {/* Navegação de Rodapé do Capítulo */}
                        <div className="reader-navigation">
                            <button 
                                className="nav-pill"
                                disabled={activeChapterIndex === 0}
                                onClick={() => setActiveChapterIndex(prev => prev - 1)}
                            >
                                Anterior
                            </button>
                            <button 
                                className="nav-pill"
                                disabled={activeChapterIndex === chapters.length - 1}
                                onClick={() => setActiveChapterIndex(prev => prev + 1)}
                            >
                                Próximo
                            </button>
                        </div>
                    </section>

                </div>
            </main>
            <Footer />
        </div>
    );
}






