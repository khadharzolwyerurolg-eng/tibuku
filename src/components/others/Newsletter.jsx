import { useState } from "react";
import '../../Newsletter.css'

export default function Newsletter() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica de envio do e-mail para a API aqui
        console.log("E-mail inscrito:", email);
    };

    return (
        <section className="explorer-newsletter">
            <div className="newsletter-overlay">
                <div className="newsletter-inner">
                    
                    <h2 className="newsletter-title">Subscreva a Nossa Newsletter</h2>
                    
                    <p className="newsletter-description">
                        Receba em primeira mão as últimas novidades, lançamentos exclusivos e catálogos 
                        personalizados. Junte-se à nossa comunidade de amantes de livros.
                    </p>

                    <form className="newsletter-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input 
                                type="email" 
                                id="newsletter-email"
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder=" "
                            />
                            <label htmlFor="newsletter-email">EMAIL</label>
                        </div>

                        <button type="submit" className="btn-confirm">
                            CONFIRMAR
                        </button>
                    </form>

                </div>
            </div>
        </section>
    );
}
