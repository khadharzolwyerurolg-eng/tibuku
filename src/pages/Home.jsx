import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Layout from "../components/Layout";

export default function Home () {
    return (
        <div className="app-container">
            <Navbar />
            <Layout />
            <Footer />
        </div>
    )
}