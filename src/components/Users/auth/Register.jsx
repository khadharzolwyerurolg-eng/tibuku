import './MainAuth.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Register() {
    // 1. Unificação correta do estado dos inputs
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
    });
    
    // Declaração dos estados utilitários em falta
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // Função genérica e otimizada que atualiza os campos com base no atributo 'name'
    const handleChanges = (e) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // 2. Lógica Assíncrona Corrigida (Sem setTimeout quebrando o fluxo)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null); 

        try {
            await axios.post("http://localhost:5000/api/auth/register", inputs);
            setIsLoading(false);
            navigate('/login'); 
        } catch (err) {
            setIsLoading(false);
            
            if (err.response && err.response.data) {
                if (typeof err.response.data === 'object' && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError(err.response.data);
                }
            } else {
                setError("Ocorreu um erro inesperado. Tente novamente mais tarde.");
            }
        }
    };


    return (
        <div className="auth-page-wrapper">
            <div className="auth-card">
                
                {/* Cabeçalho do Card */}
                <div className="auth-header">
                    <Link to="/" className="auth-logo">TIBUKU</Link>
                </div>

                {/* Formulário de Registo */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    
                    {/* Campo de Username */}
                    <div className="auth-input-group">
                        <input
                            type="text"
                            id="username"
                            name="username" // ADICIONADO: Necessário para a função handleChanges mapear o campo
                            required
                            placeholder="username"
                            value={inputs.username} // CORRIGIDO: Vinculado ao objeto estruturado
                            onChange={handleChanges} // CORRIGIDO: Usando a sua função padrão de mudança
                            disabled={isLoading}
                        />
                    </div>

                    {/* Campo de Email */}
                    <div className="auth-input-group">
                        <input
                            type="email"
                            id="email"
                            name="email" // ADICIONADO
                            required
                            placeholder="email"
                            value={inputs.email} // CORRIGIDO
                            onChange={handleChanges} // CORRIGIDO
                            disabled={isLoading}
                        />
                    </div>

                    {/* Campo de Senha */}
                    <div className="auth-input-group">
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password" // ADICIONADO
                                required
                                placeholder="password"
                                value={inputs.password} // CORRIGIDO
                                onChange={handleChanges} // CORRIGIDO
                                disabled={isLoading}
                            />
                            <button 
                                type="button" 
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? (
                                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"></path></svg>
                                ) : (
                                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* 3. EXIBIÇÃO DO ERRO DO BACKEND: Renderiza dinamicamente abaixo dos inputs se existir */}
                    {error && <p className="auth-error-message">{error}</p>}

                    {/* Botão de Submissão Dinâmico */}
                    <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                        {isLoading ? "A carregar..." : "Register"}
                    </button>
                </form>

                {/* Rodapé do Card */}
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>

            </div>
        </div>
    );
}
