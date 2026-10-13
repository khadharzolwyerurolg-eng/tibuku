import romanceIllustration from '../../img/Romance.jpeg';
import trillerIllustration from '../../img/Thriller.jpeg';
import aventuraIllustration from '../../img/Aventura.jpeg';
import fantasiaIllustration from '../../img/Fantasia.jpeg';
import ficcaoIllustration from '../../img/Ficcao_Cientifica.jpeg';
import cronicasIllustration from '../../img/Cronicas.jpeg';
import fabulasIllustration from '../../img/Fabulas.jpeg';
import '../../Books.css'

export default function Books() {
    return(
        <div className="page-inner-content">
            <div className="cards-genero-template">
                <h2 className="hsh2">Categorias em destaque </h2>
            {/* O container principal do Grid */}
            <div className="cols-books"> 
                <div className="obras-genero">
                <img src={cronicasIllustration} alt="Ilustração de uma capa de Crônicas" />
                <div className="obra-name">Crônicas</div>
                <p className="rate">&#9733;&#9733;&#9733;&#9734;&#9734;</p>
                </div>
                <div className="obras-genero">
                <img src={fabulasIllustration} alt="Ilustração de uma capa de Fabulas" />
                <div className="obra-name">Fabulas</div>
                <p className="rate">&#9733;&#9733;&#9734;&#9734;&#9734;</p>
                </div>
                <div className="obras-genero">
                <img src={ficcaoIllustration} alt="Ilustração de uma capa de Ficção Científica" />
                <div className="obra-name">Ficção</div>
                <p className="rate">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
                </div>
                <div className="obras-genero">
                <img src={fantasiaIllustration} alt="Ilustração de uma capa de Fantasia" />
                <div className="obra-name">Fantasia</div>
                <p className="rate">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
                </div>
                <div className="obras-genero">
                <img src={romanceIllustration} alt="Ilustração de uma capa de Romance" />
                <div className="obra-name">Romance</div>
                <p className="rate">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
                </div>
                <div className="obras-genero">
                <img src={aventuraIllustration} alt="Ilustração de uma capa de Terror" />
                <div className="obra-name">Terror</div>
                <p className="rate">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
                </div>
                <div className="obras-genero">
                <img src={aventuraIllustration} alt="Ilustração de uma capa de Aventura" />
                <div className="obra-name">Aventura</div>
                <p className="rate">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
                </div>

                <div className="obras-genero">
                <img src={trillerIllustration} alt="Ilustração de uma capa de Thriller" />
                <div className="obra-name">Thriller</div>
                <p className="rate">&#9733;&#9734;&#9734;&#9734;&#9734;</p>
                </div>

                <div className="obras-genero">
                <img src={trillerIllustration} alt="Ilustração de uma capa de Thriller" />
                <div className="obra-name">Thriller</div>
                <p className="rate">&#9733;&#9734;&#9734;&#9734;&#9734;</p>
                </div>

                <div className="obras-genero">
                <img src={trillerIllustration} alt="Ilustração de uma capa de Thriller" />
                <div className="obra-name">Thriller</div>
                <p className="rate">&#9733;&#9734;&#9734;&#9734;&#9734;</p>
                </div>
                
                <div className="obras-genero">
                <img src={trillerIllustration} alt="Ilustração de uma capa de Thriller" />
                <div className="obra-name">Thriller</div>
                <p className="rate">&#9733;&#9734;&#9734;&#9734;&#9734;</p>
                </div>
                
            </div>
            </div>
        </div>
    )
}