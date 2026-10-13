import { Link, NavLink } from "react-router-dom";
import { useState, useContext } from "react"; // 1. ADICIONADO: Importação do useContext
import { AuthContext } from "../context/authContext"; // 2. ADICIONADO: Importação do seu contexto real
import SearchBar from "../others/SearchBar";
import CartWidget from "../others/CartWidget";
import Users from "../Users/Users";
import '../../Header.css';

export default function Header({ searchTerm: sharedSearchTerm, setSearchTerm: setSharedSearchTerm } = {}) {
    const [localSearchTerm, setLocalSearchTerm] = useState("");
    const searchTerm = setSharedSearchTerm ? sharedSearchTerm : localSearchTerm;
    const updateSearchTerm = setSharedSearchTerm || setLocalSearchTerm;

    // 3. ATUALIZADO: Consome o estado global do usuário do contexto que criamos
    const { currentUser } = useContext(AuthContext); 

    return (
        <header className="site-header">
            <div className="header-top">
                <div className="header-top-inner">
                    
                    <Link to="/" className="header-logo-container">
                        <div className="logo-placeholder">
                            <span className="logo-text-main">TIBUKU</span>
                        </div>
                    </Link>

                    <div className="header-search-wrapper">
                        <SearchBar
                            id="headerSearch"
                            searchTerm={searchTerm}
                            setSearchTerm={updateSearchTerm}
                        />
                    </div>
                    
                    <div className="header-actions">
                        <CartWidget total="0 MZN" count={0} />
                        
                        {/* 4. RENDERIZAÇÃO CONDICIONAL INTEGRADA À API DO BACKEND */}
                        {currentUser ? (
                            // Se existir um currentUser no estado: Renderiza o menu suspenso do usuário
                            <Users />
                        ) : (
                            // Se for null: Mostra o botão para ir à página de autenticação
                            <Link to="/login" className="login-link">
                                Login
                            </Link>
                        )}
                    </div>

                </div>
            </div>

            <nav className="header-nav">
                <div className="header-nav-inner">
                    <NavLink to="/about" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>MEMBROS</NavLink>
                    <NavLink to="/categorias" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>AUTORES</NavLink>
                    <NavLink to="/categorias" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>LIVROS</NavLink>
                    <NavLink to="/explorer" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>EXPLORAR</NavLink>
                    <NavLink to="/categorias" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>BLOG</NavLink>
                </div>
            </nav>
        </header>
    );
}
