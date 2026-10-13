import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./authContext"; // Ajuste o caminho do arquivo do seu contexto

export default function ProtectedRoute({ children }) {
    const { currentUser, isAuthLoading, authError } = useContext(AuthContext);

    if (isAuthLoading) {
        return <p role="status">A verificar sessão...</p>;
    }

    if (authError) {
        return <p role="alert">{authError}</p>;
    }

    // Se o usuário NÃO estiver logado, redireciona imediatamente para a página de Login
    if (!currentUser?.accessToken) {
        return <Navigate to="/login" replace />;
    }

    // Se estiver logado, permite que o componente filho (página privada) seja renderizado
    return children;
}
