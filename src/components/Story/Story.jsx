import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import axios from "axios";
import DOMPurify from "dompurify";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../Story.css";

export default function Story() {
    const { storyId } = useParams();
    const [story, setStory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const fetchStory = async () => {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const response = await axios.get(
                    `http://localhost:5000/api/story/find/${storyId}`,
                    { signal: controller.signal }
                );
                setStory(response.data.story);
            } catch (error) {
                if (controller.signal.aborted) return;
                console.error("Erro ao carregar a história:", error);
                setErrorMessage(
                    error.response?.data?.message || "Não foi possível carregar esta história."
                );
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        };

        fetchStory();
        return () => controller.abort();
    }, [storyId]);

    return (
        <div className="app-container">
            <Navbar />
            <main className="main-content-layout">
                <div className="card-elenco">
                    <div className="reader-header">
                        <div className="reader-titles">
                            <h1>{story?.title || (isLoading ? "Carregando..." : "")}</h1>
                            {story && <h3>{story.category}</h3>}
                        </div>
                        <Link className="baxk-btn" to="/explorer">Voltar</Link>
                    </div>

                    {isLoading && <p role="status">Carregando história...</p>}
                    {errorMessage && <p role="alert">{errorMessage}</p>}
                    {story && (
                        <div className="content-to-read">
                        <div
                            className="elenco-text-content"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(story.content || "")
                            }}
                        />
                        <div className="author-description">
                                <p className="author">por {story.authorWork}</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
