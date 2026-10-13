import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Importa os estilos obrigatórios do Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import '../../HeroSlider.css'

export default function HeroSlider() {
    // Array de objetos contendo os dados de cada slide para o mapeamento
    const slidesData = [
        {
            id: 1,
            title: "Portes Grátis - Ler Sem Barreiras",
            description: "Desfrute de portes gratuitos em todas as encomendas acima de 50 euros para Portugal Continental. Aproveite esta oferta e comece a sua jornada literária hoje.",
            btnText: "Ver Loja",
            btnLink: "/loja",
            bgImage: "https://i.pinimg.com/1200x/3b/25/09/3b2509059b436362cf48a7a858c1436e.jpg" // Substitua pela sua imagem de livros
        },
        {
            id: 2,
            title: "Novidades Literárias",
            description: "Descubra os livros mais vendidos e os lançamentos que estão a dar que falar este mês.",
            btnText: "Explorar",
            btnLink: "/novidades",
            bgImage: "https://i.pinimg.com/1200x/59/95/3f/59953f29aed53741edd8217d07089506.jpg"
        }
    ];

    return (
        <section className="hero-slider-container">
            <Swiper
                modules={[Navigation, Autoplay]}
                navigation={true} // Ativa as setas laterais (< e >)
                autoplay={{ delay: 25000, disableOnInteraction: false }} // Passa sozinho a cada 5s
                loop={true} // Volta ao início infinitamente
                className="main-swiper"
            >
                {slidesData.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        {/* Cada slide recebe a imagem de fundo de forma dinâmica */}
                        <div 
                            className="slide-item" 
                            style={{ backgroundImage: `url(${slide.bgImage})` }}
                        >
                            {/* O overlay escurece a imagem de fundo para dar leitura ao texto */}
                            <div className="slide-overlay">
                                <div className="slide-content">
                                    <h1 className="slide-title">{slide.title}</h1>
                                    <p className="slide-description">{slide.description}</p>
                                    <a href={slide.btnLink} className="slide-btn">
                                        {slide.btnText}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
