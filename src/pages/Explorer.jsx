import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CardsBox from "../components/Explorer/CardsBox";

export default function Explorer () {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="app-container">
            <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <CardsBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Footer />
        </div>
    )
}