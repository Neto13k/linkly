// Este hook customizado lida com erros de sessão, como a expiração do token. Quando um erro de sessão é detectado, ele remove o token e o usuário do sessionStorage e redireciona o usuário para a página de login.

import { useCallback } from "react";
import { useNavigate } from "react-router";
import { removeToken, removeUser } from "../services/sessionService";

// Retorna `handleSessionError`, uma função reutilizada pelas páginas protegidas.
// Ela devolve true quando o erro era de sessão (e já foi tratado) ou false caso contrário,
// permitindo que quem chama decida se exibe a mensagem de erro genérica.
// É memoizada com useCallback para manter a referência estável e poder ser usada
// com segurança em dependências de useEffect.
export default function useSessionError() {
    const navigate = useNavigate();

    const handleSessionError = useCallback((error: unknown) => { // Função para lidar com erros de sessão
        if (error instanceof Error && error.message === 'SESSION_EXPIRED') { // Verifica se o erro é de sessão expirada
            removeToken(); // Remove o token do sessionStorage
            removeUser(); // Remove o usuário do sessionStorage
            navigate("/login", { replace: true }); // Redireciona para a página de login
            return true;
        }
        return false;
    }, [navigate]);

    return { handleSessionError };
}
