import './MainAuth.css';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

export default function Login() {
    // 1. CORRIGIDO: Chaves do estado agora combinam com os campos do formulário
    const [inputs, setInputs] = useState({
        username: "", 
        password: "",
    });
    
    // 2. ADICIONADO: Estados utilitários necessários para o controle da interface
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    // Manipulador genérico que atualiza o estado com base no atributo 'name' do input
    const handleChanges = (e) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null); // Limpa falhas anteriores

        try {
            // Dispara as credenciais armazenadas no objeto inputs para o Contexto
            await login(inputs);
            setIsLoading(false);
            navigate("/");
        } catch (err) {
            setIsLoading(false);
            
            // 3. SEGURO: Extrai apenas a string de texto caso o backend responda com um objeto {message: "..."}
            if (err.response && err.response.data) {
                if (typeof err.response.data === 'object' && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError(err.response.data);
                }
            } else {
                setError("Something went wrong. Please try again.");
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

                {/* Formulário de Acesso */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    
                    {/* Campo de Email */}
                    <div className="auth-input-group">
                        <label htmlFor="email">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username" // ADICIONADO: Essencial para o mapeamento da função handleChanges
                            required
                            placeholder="username"
                            value={inputs.username} // CORRIGIDO: Vinculado à propriedade correta do objeto de estados
                            onChange={handleChanges} // CORRIGIDO: Vinculado à função genérica de monitorização
                            disabled={isLoading}
                        />
                    </div>

                    {/* Campo de Senha */}
                    <div className="auth-input-group">
                        <div className="label-row">
                            <label htmlFor="password">Palavra-passe</label>
                            <Link to="/recuperar" className="forgot-link">Esqueceu-se?</Link>
                        </div>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password" // ADICIONADO
                                required
                                placeholder="••••••••"
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
                                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"></path></svg>
                                ) : (
                                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Alerta Visual de Erro de Autenticação */}
                    {error && <p className="auth-error-message">{error}</p>}

                    {/* Botão de Submissão Controlado pelo Carregamento */}
                    <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                        {isLoading ? (
                            <span className="spinner">A iniciar sessão...</span>
                        ) : (
                            "Iniciar Sessão"
                        )}
                    </button>
                </form>

                {/* Rodapé do Card */}
                <div className="auth-footer">
                    <p>Não tem uma conta? <Link to="/register">Criar conta</Link></p>
                </div>

            </div>
        </div>
    );
}
