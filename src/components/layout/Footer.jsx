import { Link } from "react-router-dom";
import '../../Footer.css'
export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-top">
                    
                    <div className="footer-brand">
                        <h2 className="footer-logo">Tibuku</h2> 
                        <p className="footer-tagline">
                            Onde histórias ganham vida. Leia e compartilhe narrativas que emocionam.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h3>A Nossa Livraria</h3>
                        <Link className="link" to="/sobre">A Nossa Livraria</Link>
                        <Link className="link" to="/lojas">A Nossa Loja</Link>
                        <Link className="link" to="/contato">Contactos</Link>
                    </div>

                    <div className="footer-col">
                        <h3>Links Úteis</h3>
                        <Link className="link" to="/envio">Condições de Envio</Link>
                        <Link className="link" to="/privacidade">Política de Privacidade</Link>
                        <Link className="link" to="/reclamacoes">Livro de Reclamação</Link>
                    </div>

                    <div className="footer-col">
                        <h3>Contactos</h3>
                        <span className="footer-info">Avenida Julius Nyerere 820, Maputo</span>
                        <a className="link" href="mailto:info@tibuko.co.mz">Email: info@tibuko.co.mz</a>
                        <a className="link" href="tel:+258858424153">Cel.: (+258) 85 842 4153</a>
                    </div>

                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Tibuku. Todos os direitos reservados - Desenvolvido por Terdeu Abdullah.</p>
                </div>
            </div>
        </footer>
    );
}
