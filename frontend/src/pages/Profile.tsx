import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { User } from "../types/auth";
import { getUserById, updateUser, deleteUser } from "../services/userService";
import { getUser, saveUser, removeToken, removeUser } from "../services/sessionService";
import useSessionError from "../hooks/useSessionError";
import { Link } from "react-router";

export default function Profile() {
    const [user, setUser] = useState<User | null>(null); // Estado para armazenar os dados do usuário
    const [loading, setLoading] = useState(true); // Estado para controlar o carregamento dos dados do usuário
    const [error, setError] = useState<string | null>(null); // Estado para armazenar mensagens de erro
    const [email, setEmail] = useState(""); // Estado para armazenar o email do usuário
    const [actionError, setActionError] = useState<string | null>(null); // Estado para armazenar mensagens de erro de ações (atualização, exclusão)

    const { handleSessionError } = useSessionError(); // Hook customizado para lidar com erros de sessão 

    // useEffect para buscar os dados do usuário quando o componente é montado
    useEffect(() => {
        const fetchUser = async () => {
            const fetchedUser = getUser();
            if (!fetchedUser) {
                setError("User not found");
                setLoading(false);
                return;
            }

            try {
                const userData = await getUserById(fetchedUser.id);
                setUser(userData);
                setEmail(userData.email);
            } catch (err) {
                if (!handleSessionError(err)) { // Verifica se o erro é de sessão
                    setError("Failed to fetch user data");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [handleSessionError]);

    // Função para atualizar os dados do usuário

    const handleUpdateUser = async () => {
        if (!user) return;
        setActionError("");
        try {
            const updatedUser = await updateUser(user.id, email);
            setUser(updatedUser);
            saveUser(updatedUser);
            setEmail(updatedUser.email);
        } catch (err) {
            if (!handleSessionError(err)) { // Verifica se o erro é de sessão
                setActionError("Failed to update user data");               
            }
        }
    }

    // Função para deletar o usuário
    const navigate = useNavigate();
    const handleDeleteUser = async () => {     //Verificar se usuario existe antes de deletar
        if (!user) return; 
        if (!window.confirm("você tem certeza que deseja deletar sua conta?")) {
            return;
        }
        setActionError("");  // Limpar mensagem de erro antes de tentar deletar o usuário

        try {
            await deleteUser(user.id); //execução sem erros
            removeToken();  // Remover token de autenticação
            removeUser();  // Remover dados do usuário da sessão
            navigate("/login", { replace: true });
        } catch (err) {
            if (!handleSessionError(err)) { // Verifica se o erro é de sessão
            setActionError("Failed to delete user");               
            }
        }

    }    


    return (
        <div >
            <h1>Profile Page</h1>

            <Link to="/dashboard">Voltar ao Dashboard</Link>
            {/* Mostra "Loading..." enquanto os links estão sendo carregados */}
            {loading && <p>Loading...</p>} 
            {/* Mostra a mensagem de erro se houver algum erro no carregamento dos links */}
            {error && <p>{error}</p>}
            {/* Mostra os detalhes do usuário se não houver erro e o usuário estiver carregado */}
            {!loading && !error && user && (
                <div>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Criado em:</strong> {new Date(user.created_at).toLocaleDateString("pt-BR")}</p>
                    
            {/* Formulário para atualizar o email do usuário */}
            <form onSubmit={(e) => {e.preventDefault(); handleUpdateUser();}}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <button type="submit">Update Email</button>
            </form> 

            {/* Mostra a mensagem de erro de ação se houver algum erro ao atualizar os dados do usuário */}
            {actionError && <p>{actionError}</p>}

            {/* Botão para deletar o usuário */}
            <button type="button" onClick={handleDeleteUser}>Delete Account</button>
            </div>
            )}
        </div>
    );
}