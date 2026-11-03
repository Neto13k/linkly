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
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("Falha ao buscar dados do usuário");
                    }
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
        const confirmation = window.confirm("Você tem certeza que deseja atualizar seu email?");
        if (!confirmation) {
            return;
        }

        setActionError("");
        try {
            const updatedUser = await updateUser(user.id, email);
            setUser(updatedUser);
            saveUser(updatedUser);
            setEmail(updatedUser.email);
        } catch (err) {
            if (!handleSessionError(err)) { // Verifica se o erro é de sessão
                if (err instanceof Error) {
                    setActionError(err.message);
                } else {
                    setActionError("Falha ao atualizar o usuário");
                }           
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
                if (err instanceof Error) {
                    setActionError(err.message);
                } else {
                    setActionError("Falha ao deletar o usuário");
                }
            }
        }

    }    


    return (
        <div className="page">
            <header className="topbar">
                <h1 className="topbar__title">Meu Perfil</h1>
                <Link className="nav-link" to="/dashboard">Voltar ao Dashboard</Link>
            </header>

            {/* Mostra "Carregando..." enquanto os dados do usuário são carregados */}
            {loading && <p className="status" role="status">Carregando...</p>}
            {/* Mostra a mensagem de erro se houver algum erro no carregamento */}
            {error && <p className="alert alert--error" role="alert">{error}</p>}
            {/* Mostra os detalhes do usuário se não houver erro e o usuário estiver carregado */}
            {!loading && !error && user && (
                <section className="card">
                    <div className="profile-info">
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Criado em:</strong> {new Date(user.created_at).toLocaleDateString("pt-BR")}</p>
                    </div>

                    {/* Formulário para atualizar o email do usuário */}
                    <form className="form" onSubmit={(e) => {e.preventDefault(); handleUpdateUser();}}>
                        <div className="form__field">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <button type="submit" className="btn btn--primary">Atualizar email</button>
                    </form>

                    {/* Mostra a mensagem de erro de ação se houver algum erro ao atualizar os dados do usuário */}
                    {actionError && <p className="alert alert--error" role="alert">{actionError}</p>}

                    {/* Botão para deletar o usuário */}
                    <button type="button" className="btn btn--danger" onClick={handleDeleteUser}>Excluir Conta</button>
                </section>
            )}
        </div>
    );
}