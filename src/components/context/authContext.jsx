import axios from "axios"
// Corrigido: Adicionado o useEffect na importação do React
import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext()

// Corrigido: Adicionado o 't' em AuthContextProvider para bater certo com o seu main.jsx
export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || null
        } catch (error) {
            console.error("Could not read the saved user session:", error)
            localStorage.removeItem("user")
            return null
        }
    })
    const [isAuthLoading, setIsAuthLoading] = useState(
        () => Boolean(currentUser?.accessToken)
    )
    const [authError, setAuthError] = useState(null)

    const login = async (inputs) => {
        // Corrigido: Adicionada a vírgula antes de { withCredentials: true }
        const res = await axios.post("http://localhost:5000/api/auth/login", inputs, { withCredentials: true });
        setAuthError(null)
        setCurrentUser(res.data)
    }

    useEffect(() => {
        const token = currentUser?.accessToken
        if (!token) {
            setIsAuthLoading(false)
            return
        }

        const controller = new AbortController()
        setIsAuthLoading(true)
        setAuthError(null)

        axios.get("http://localhost:5000/api/auth/verify", {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal
        }).catch((error) => {
            if (controller.signal.aborted) return

            if (error.response?.status === 401 || error.response?.status === 403) {
                setCurrentUser(null)
                return
            }

            console.error("Could not verify the saved user session:", error)
            setAuthError("Não foi possível verificar a sessão. Verifique a ligação e tente novamente.")
        }).finally(() => {
            if (!controller.signal.aborted) setIsAuthLoading(false)
        })

        return () => controller.abort()
    }, [currentUser?.accessToken])

    const logout = async () => {
        const token = currentUser?.accessToken
        if (token) {
            await axios.post("http://localhost:5000/api/auth/logout", null, {
                headers: { Authorization: `Bearer ${token}` }
            })
        }
        setAuthError(null)
        setCurrentUser(null)
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser))
    }, [currentUser])

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, isAuthLoading, authError }}>
            {children}
        </AuthContext.Provider>
    )
}
