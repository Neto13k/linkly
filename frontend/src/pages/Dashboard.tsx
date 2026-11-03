import { useState, useEffect } from "react";
import type { Link } from "../types/link";
import { getUser, removeToken, removeUser } from "../services/sessionService";
import { getLinksByUserId, createLink, updateLink,  deleteLink  } from "../services/linkService";
import useSessionError from "../hooks/useSessionError";
import { useNavigate, Link as RouterLink } from "react-router";
import CopyLinkButton from "../components/CopyLinkButton";



export default function Dashboard() {
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState(""); // Estado para armazenar erros de ações (criação, atualização, exclusão)
    const [newLink, setNewLink] = useState({ destination_url: "", slug: "" });
    const [creating, setCreating] = useState(false);

    // Estados para edição de links 
    const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
    const [editLink, setEditLink] = useState({ slug: "", destination_url: "" });
    const [updating, setUpdating] = useState(false);

    // Hook customizado para lidar com erros de sessão
    const { handleSessionError } = useSessionError();

    // useEffect para buscar os links do usuário quando o componente é montado
    useEffect(() => { 
        const fetchLinks = async () => {
            const user = getUser(); // pega o usuário do sessionStorage
            if (!user) { // Se não houver usuário, significa que o token expirou ou o usuário não está logado
                setError("usuário não encontrado. Faça login novamente.");
                setLoading(false);
                return;
            }
            try { // Pega os links do usuário usando o ID do usuário
                const userLinks = await getLinksByUserId(user.id);
                setLinks(userLinks);
            } catch (err) {
                if(!handleSessionError(err)) { // Verifica se o erro é de sessão
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("Falha ao buscar links"); // Se não for, mostra uma mensagem de erro genérica
                    }
                }
            } finally {
                setLoading(false);
            }
        };
        fetchLinks(); // Chama a função para buscar os links quando o componente é montado
    }, [handleSessionError]);

    // Função para criar um novo link
    const handleCreateLink = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCreating(true);
        setActionError("");

        try {
        const createdLink = await createLink(newLink.slug, newLink.destination_url); // Chama a função para criar o link usando o slug e a URL de destino do estado newLink
        setLinks((prevLinks) => [...prevLinks, createdLink]); // Adiciona o novo link à lista de links no estado
        setNewLink({ destination_url: "", slug: "" }); // Limpa os campos do formulário após a criação do link

    } catch (err) { // Se houver um erro ao criar o link, verifica se é um erro de sessão
        if (!handleSessionError(err)) { // Se não for um erro de sessão, mostra uma mensagem de erro genérica
            if (err instanceof Error) {
                setActionError(err.message);
            } else {
                setActionError("Erro ao criar o link");
            }
        }
    } finally {
        setCreating(false); // Define o estado de criação como falso após a tentativa de criação do link
    }
    };

    // Função para iniciar a edição de um link existente
    const handleStartEdit = (link: Link) => {
        setEditingLinkId(link.id);
        setEditLink({ slug: link.slug, destination_url: link.destination_url });
    }

    // Função para atualizar um link existente
    const handleUpdateLink = async (linkId: number, slug: string, destinationUrl: string) => {
        setUpdating(true);
        setActionError("");
        try {
            const updatedLink = await updateLink(linkId, slug, destinationUrl);
            setLinks((prevLinks) => prevLinks.map((link) => (link.id === linkId ? updatedLink : link)));
            setEditingLinkId(null); // Limpa o estado de edição após a atualização
        } catch (err) {
            if(!handleSessionError(err)) { // Verifica se o erro é de sessão
                if (err instanceof Error) {
                    setActionError(err.message);
                } else {
                    setActionError("Erro ao atualizar o link");
                }
            }
        } finally {
            setUpdating(false);
        }
    };

    //função para deletar um link existente.
    const handleDeleteLink = async (linkId: number) => {
        const confirmed = window.confirm("Tem certeza que deseja deletar este link? Esta ação não pode ser desfeita."); // Confirmação do usuário antes de deletar o link
        if (!confirmed) {
            return;
        }
        setActionError("");
        try {
        await deleteLink(linkId); // Chama a função para deletar o link usando o ID do link
        setLinks((prevLinks) => prevLinks.filter((link) => link.id !== linkId)
        );

        // Fecha o formulário se o link excluído estava sendo editado
        if (editingLinkId === linkId) {
            setEditingLinkId(null);
        }

        setActionError("Link excluído com sucesso!");

    } catch (err) {
        if (!handleSessionError(err)) {
            if (err instanceof Error) {
                setActionError(err.message);
            } else {
                setActionError("Erro ao excluir o link");
            }
        }
    }
};

    const user = getUser(); // Pega o usuário do sessionStorage para exibir o nome do usuário no dashboard

    //função para deslogar o usuário, removendo o token e o usuário do sessionStorage e redirecionando para a página de login.
    const navigate = useNavigate();
    const handleLogout = () => {
        removeToken();
        removeUser();
        navigate("/login", { replace: true });
    }

    return (
        <div className="page">
            <header className="topbar">
                <h1 className="topbar__title">Dashboard</h1>
                <nav className="topbar__nav">
                    <RouterLink className="nav-link" to="/profile">Meu Perfil</RouterLink>
                    <RouterLink className="nav-link" to="/regras">Regras</RouterLink>
                </nav>
                <button type="button" className="btn btn--ghost" onClick={handleLogout}>Sair</button>
            </header>

            {/* Mostra "Carregando..." enquanto os links estão sendo carregados */}
            {loading && <p className="status" role="status">Carregando...</p>}
            {/* Mostra a mensagem de erro se houver algum erro no carregamento dos links */}
            {error && <p className="alert alert--error" role="alert">{error}</p>}
            {/* Mostra a mensagem de ação (sucesso ou erro) ao criar, atualizar ou deletar um link */}
            {actionError && <p className="alert" role="status">{actionError}</p>}

            {/* Mostra a lista de links se não houver carregamento e erro */}
            {!loading && !error && (
                <section className="card">
                    <h2 className="card__title">Meus links</h2>
                    {links.length === 0 ? (
                        <p className="empty">Nenhum link encontrado</p>
                    ) : (
                        <ul className="link-list">
                            {links.map((link) => (
                                <li className="link-card" key={link.id}>
                                    <p className="link-card__url">{link.destination_url}</p>
                                    <p className="badge">Cliques: {link.click_count}</p>
                                    {/* Mostra o slug do link como um link clicável */}
                                    <a className="link-card__short" href={user ? `${import.meta.env.VITE_SHORT_URL_BASE}/${user.username}/${link.slug}` : "#"} target="_blank" rel="noopener noreferrer"> {user ? `${import.meta.env.VITE_SHORT_URL_BASE}/${user.username}/${link.slug}` : "#"}</a>
                                    <CopyLinkButton link={user ? `${import.meta.env.VITE_SHORT_URL_BASE}/${user.username}/${link.slug}` : "#"} /> {/* Componente para copiar o link encurtado para a área de transferência */}
                                    <div className="link-card__actions">
                                        <button type="button" className="btn btn--secondary" onClick={() => handleStartEdit(link)}>Editar</button> {/* Botão para iniciar a edição do link */}
                                        <button type="button" className="btn btn--danger" onClick={() => handleDeleteLink(link.id)}>Deletar</button> {/* Botão para deletar o link */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            )}

            {/* Formulario para editar um link existente */}
            {editingLinkId !== null && (
                <section className="card">
                    <h2 className="card__title">Editar link</h2>
                    <form className="form" onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateLink(editingLinkId, editLink.slug, editLink.destination_url);
                    }}>
                        <div className="form__field">
                            <label htmlFor="edit-slug">Slug</label>
                            <input id="edit-slug" type="text" placeholder="Slug" required value={editLink.slug} onChange={(e) => setEditLink({ ...editLink, slug: e.target.value })}/> {/* Input para o slug do link */}
                            <small>Slug é o final personalizado do link. Use apenas letras, números e hífens (ex.: meu-link).</small>
                        </div>
                        <div className="form__field">
                            <label htmlFor="edit-url">URL de Destino</label>
                            <input id="edit-url" type="url" placeholder="URL de Destino" required value={editLink.destination_url} onChange={(e) => setEditLink({ ...editLink, destination_url: e.target.value })}/> {/* Input para a URL de destino do link */}
                        </div>
                        <button type="submit" className="btn btn--primary" disabled={updating}>{updating ? "Atualizando..." : "Atualizar Link"}</button> {/* Botão para atualizar o link, desabilitado enquanto o link está sendo atualizado */}
                    </form>
                </section>
            )}

            {/* Formulario para criar um novo link */}
            <section className="card">
                <h2 className="card__title">Criar novo link</h2>
                <form className="form" onSubmit={handleCreateLink}>
                    <div className="form__field">
                        <label htmlFor="new-slug">Slug</label>
                        <input id="new-slug" type="text" placeholder="Slug" required value={newLink.slug} onChange={(e) => setNewLink({ ...newLink, slug: e.target.value })}/> {/* Input para o slug do link */}
                        <small>Slug é o final personalizado do link. Use apenas letras, números e hífens (ex.: meu-link).</small>
                    </div>
                    <div className="form__field">
                        <label htmlFor="new-url">URL de Destino</label>
                        <input id="new-url" type="url" placeholder="URL de Destino" required value={newLink.destination_url} onChange={(e) => setNewLink({ ...newLink, destination_url: e.target.value })}/> {/* Input para a URL de destino do link */}
                    </div>
                    <button type="submit" className="btn btn--primary" disabled={creating}>{creating ? "Criando..." : "Criar Link"}</button> {/* Botão para criar o link, desabilitado enquanto o link está sendo criado */}
                </form>
            </section>
        </div>
    );
}