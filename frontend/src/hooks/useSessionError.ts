import { useNavigate } from "react-router";
import { removeToken, removeUser } from "../services/sessionService";

export default function useSessionError() {
    const navigate = useNavigate();

    const handleSessionError = (error: unknown) => {
        if (error instanceof Error && error.message === 'SESSION_EXPIRED') {
            // Trata o erro de sessão expirada
        removeToken(); // Remove o token do sessionStorage
        removeUser(); // Remove o usuário do sessionStorage
        navigate("/login", { replace: true }); // Redireciona para a página de login
        return true
        }
        return false
    };

    return { handleSessionError };
}