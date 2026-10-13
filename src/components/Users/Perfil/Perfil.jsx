import Navbar from "../../layout/Navbar";
import Footer from "../../layout/Footer";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import Write from "../../others/Write";
import './Perfil.css'

export default function Perfil() {
    const [user, setUser] = useState(null)
    const { currentUser } = useContext(AuthContext)
    const { userId } = useParams()
    const resolvedUserId = userId || currentUser?._id

    useEffect(() => {
        const fetchUserData = async () => {
            if (!resolvedUserId) return

            try {
                const res = await axios.get(`http://localhost:5000/api/users/find/${resolvedUserId}`, {
                    headers: {
                        Authorization: `Bearer ${currentUser?.accessToken}`
                    }
                })

                setUser(res.data)
            } catch (error) {
                console.error("Erro ao carregar dados do usuário:", error)
                setUser(currentUser)
            }
        }

        fetchUserData()
    }, [resolvedUserId, currentUser])

    const activeUser = user || currentUser;

    return(
        
        <div className="app-container-global">
            <Navbar />
            
            <main className="main-content-layout">
                <div className="write-page-inner">
                    
                    {activeUser?.isAdmin ? (
                        
                        <Write />
                    ) : (
                        <div className="user-profile-bar">
                            <div className="user-avatar-circle">
                                {activeUser?.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="user-metadata">
                                <span className="welcome-msg">
                                    Bem-vindo, <strong>{activeUser?.username || "Usuário"}</strong>
                                </span>
                                <span className="user-email-text">
                                    {activeUser?.email || "email@naocadastrado.com"}
                                </span>
                            </div>
                        </div>
                    )}
                    
                </div>
            </main>
            <Footer />
        </div>
    )
}
