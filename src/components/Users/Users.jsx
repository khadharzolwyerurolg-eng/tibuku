import { useEffect, useRef, useState, useContext } from "react"; // ADICIONADO: useContext
import { Link, useNavigate } from "react-router-dom"; // ADICIONADO: useNavigate
import { AuthContext } from "../context/authContext"; // ADICIONADO: Importação do seu contexto real
import '../../Users.css';

export default function Users() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const searchPanelRef = useRef(null);
    const searchToggleRef = useRef(null);
    const searchInputRef = useRef(null);
    const accountMenuRef = useRef(null);

    // Conecta o componente ao gerenciador de rotas e ao contexto global de autenticação
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            const timer = setTimeout(() => searchInputRef.current.focus(), 150);
            return () => clearTimeout(timer);
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
                setIsAccountOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                searchPanelRef.current && !searchPanelRef.current.contains(e.target) &&
                searchToggleRef.current && !searchToggleRef.current.contains(e.target)
            ) {
                setIsSearchOpen(false);
            }
            if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
                setIsAccountOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('nav-lock');
        } else {
            document.body.classList.remove('nav-lock');
        }
        return () => document.body.classList.remove('nav-lock');
    }, [isMobileMenuOpen]);

    // Função assíncrona que processa o encerramento seguro de sessão
    const handleLogout = async (e) => {
        e.preventDefault(); // Impede o comportamento de navegação padrão da tag
        try {
            await logout(); // Limpa os cookies no backend via Axios e zera o estado/localStorage
            setIsAccountOpen(false); // Fecha o painel flutuante
            navigate("/"); // Redireciona o usuário para a Home deslogada
        } catch (err) {
            console.error("Erro ao efetuar o encerramento de sessão:", err);
        }
    };

    return (
        <div className="app-container">
            <div className="account-menu" ref={accountMenuRef}>
                <button 
                    id="accountToggle"
                    className="icon-btn" 
                    aria-expanded={isAccountOpen}
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                </button>
              
                <div id="accountDropdown" className={`account-dropdown ${isAccountOpen ? 'is-open' : ''}`}>
                    <Link to="/perfil" className="account-dropdown-item" onClick={() => setIsAccountOpen(false)}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Meu Perfil
                    </Link>
                    
                    <div className="account-dropdown-divider" />
                    
                    {/* CORRIGIDO: Convertido para usar a função handleLogout conectada ao Axios */}
                    <button 
                        className="account-dropdown-item account-dropdown-logout" 
                        onClick={handleLogout}
                        style={{ width: '100%', background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
                    >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
}
