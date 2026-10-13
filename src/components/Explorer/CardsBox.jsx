import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import romanceIllustration from "../../img/Romance.jpeg";
import trillerIllustrations from "../../img/Thriller.jpeg";
import fantasiaIllustrations from "../../img/Fantasia.jpeg";
import ficcaoIllustrations from "../../img/Ficcao_Cientifica.jpeg";
import cronicasIllustrations from "../../img/Cronicas.jpeg";
import fabulasIllustrations from "../../img/Fabulas.jpeg";
import "../../CardsBox.css";

const API_URL = "http://localhost:5000";
const ITEMS_PER_PAGE = 10;

const genreOptions = [
  { value: "todos", label: "Todos" },
  { value: "romance", label: "Romance" },
  { value: "terror", label: "Terror" },
  { value: "fantasia", label: "Fantasia" },
  { value: "ficção científica", label: "Ficção Científica" },
  { value: "crônicas", label: "Crônicas" },
  { value: "fábulas", label: "Fábulas" },
];

const fallbackCovers = {
  romance: romanceIllustration,
  terror: trillerIllustrations,
  fantasia: fantasiaIllustrations,
  "ficção científica": ficcaoIllustrations,
  crônicas: cronicasIllustrations,
  fábulas: fabulasIllustrations,
};

const normalizeSearchText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const getStoryCover = (coverImage, category) => {
  if (coverImage) {
    return coverImage.startsWith("http")
      ? coverImage
      : `${API_URL}${coverImage.startsWith("/") ? "" : "/"}${coverImage}`;
  }

  return fallbackCovers[category] || romanceIllustration;
};

const CardBox = ({ searchTerm = "" }) => {
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("recent");
  const [activeGenre, setActiveGenre] = useState("todos");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchStories = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await axios.get(`${API_URL}/api/story`, {
          params: { status: "published" },
          signal: controller.signal,
        });
        setStories(response.data.stories);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Erro ao carregar histórias para o Explorer:", error);
        setErrorMessage(
          "Não foi possível carregar as histórias. Verifique se o servidor está ativo e tente novamente."
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    fetchStories();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, activeGenre]);

  const filteredStories = useMemo(() => {
    const normalizedSearch = normalizeSearchText(searchTerm.trim());

    const result = stories.filter((story) => {
      const matchesGenre =
        activeGenre === "todos" || story.category === activeGenre;
      const searchableText = [
        story.title,
        story.authorWork,
        story.content?.replace(/<[^>]*>/g, " "),
        story.category,
      ]
        .map(normalizeSearchText)
        .join(" ");

      return matchesGenre && (!normalizedSearch || searchableText.includes(normalizedSearch));
    });

    return [...result].sort((a, b) => {
      if (sortBy === "popular") return (b.views || 0) - (a.views || 0);
      return new Date(b.createdAt || b._id).getTime() - new Date(a.createdAt || a._id).getTime();
    });
  }, [activeGenre, searchTerm, sortBy, stories]);

  const totalPages = Math.max(1, Math.ceil(filteredStories.length / ITEMS_PER_PAGE));
  const currentSafePage = Math.min(currentPage, totalPages);
  const visibleStories = filteredStories.slice(
    (currentSafePage - 1) * ITEMS_PER_PAGE,
    currentSafePage * ITEMS_PER_PAGE
  );

  return (
    <main>
      <div className="explorer_cat-explorer">
        <div className="page-inner-content">
          <div className="section_category">
            <div className="explorer-toolbar">
              <div className="genre-pill-select">
                <select
                  className="genre-pill"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  aria-label="Ordenar histórias"
                >
                  <option value="recent">Mais Recentes</option>
                  <option value="popular">Mais Visualizadas</option>
                </select>
                {genreOptions.map((genre) => (
                  <button
                    key={genre.value}
                    type="button"
                    className={`genre-pill ${activeGenre === genre.value ? "is-active" : ""}`}
                    onClick={() => setActiveGenre(genre.value)}
                  >
                    {genre.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading && <p role="status">Carregando histórias...</p>}
            {errorMessage && <p role="alert">{errorMessage}</p>}
            {!isLoading && !errorMessage && filteredStories.length === 0 && (
              <p>Nenhuma história publicada encontrada.</p>
            )}

            {!isLoading && !errorMessage && filteredStories.length > 0 && (
              <>
                <div className="category_grid story_grid" id="story_grid">
                  {visibleStories.map((story) => {
                    const genreLabel =
                      genreOptions.find((genre) => genre.value === story.category)?.label ||
                      story.category;

                    return (
                      <div
                        key={story._id}
                        className={`category_card mix story-card`}
                      >
                        <Link to={`/story/${story._id}`}>
                          <div className="story_cover" style={{ position: "relative" }}>
                            <span
                              className="story-genre-badge"
                              style={{ position: "absolute", top: "10px", left: "10px", zIndex: 10 }}
                            >
                              {genreLabel}
                            </span>
                            <img
                              src={getStoryCover(story.coverImage, story.category)}
                              alt={`Capa de ${story.title}`}
                            />
                          </div>
                          <div className="story_card_body">
                            <h4>{story.title}</h4>
                            <p className="story_author">por {story.authorWork}</p>
                            <div className="story_meta">
                              <span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                {story.views || 0}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div
                    className="pagination"
                    style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "24px" }}
                  >
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentSafePage === 1}
                      className="genre-pill"
                    >
                      Anterior
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`genre-pill ${page === currentSafePage ? "is-active" : ""}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      disabled={currentSafePage === totalPages}
                      className="genre-pill"
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CardBox;
