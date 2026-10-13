import Footer from "./layout/Footer";
import Main from "./layout/Main";
import Navbar from "./layout/Navbar";

export default function Layout ({children}) {
    return (
        <div className="app-container">
            <Navbar />
            <Main />
            <Footer />
        </div>
    )
}