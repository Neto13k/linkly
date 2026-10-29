import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Link } from "../types/link";
import { getUser, removeToken, removeUser } from "../services/sessionService";
import { getLinksByUserId, createLink, updateLink,  deleteLink  } from "../services/linkService";

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

    // useEffect para buscar os links do usuário quando o componente é montado
    useEffect(() => { 
        const fetchLinks = async () => {
            const user = getUser(); // pega o usuário do sessionStorage
            if (!user) { // Se não houver usuário, significa que o token expirou ou o usuário não está logado
                setError("User not found");
                setLoading(false);
                return;
            }
            try { // Pega os links do usuário usando o ID do usuário
                const userLinks = await getLinksByUserId(user.id);
                setLinks(userLinks);
            } catch {
                setError("Failed to fetch links");
            } finally {
                setLoading(false);
            }
        };
        fetchLinks(); // Chama a função para buscar os links quando o componente é montado
    }, []);

    // Função para criar um novo link
    const handleCreateLink = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCreating(true);
        setActionError("");

        try { // Cria um novo link usando o ID do usuário
            const createdLink = await createLink(newLink.slug, newLink.destination_url);
            setLinks((prevLinks) => [...prevLinks, createdLink]); // Adiciona o novo link à lista de links
            setNewLink({ destination_url: "", slug: "" }); // Limpa o formulário após a criação do link
        } catch {
            setActionError("Failed to create link");
        } finally {
            setCreating(false);
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
        } catch {
            setActionError("Failed to update link");
        } finally {
            setUpdating(false);
        }
    };

    //função para deletar um link existente.
    const handleDeleteLink = async (linkId: number) => {
        setActionError("");
        try {
            await deleteLink(linkId);
            setLinks((prevLinks) => prevLinks.filter((link) => link.id !== linkId));
            
            if (editingLinkId === linkId) {
                setEditingLinkId(null); // Limpa o estado de edição se o link deletado estava sendo editado
            }
        }       
        catch {
            setActionError("Failed to delete link");
        }
    };

    const user = getUser(); // Pega o usuário do sessionStorage para exibir o nome do usuário no dashboard

    //função para deslogar o usuário, removendo o token e o usuário do sessionStorage e redirecionando para a página de login.
    const navigate = useNavigate();
    const handleLogout = () => {
        removeToken();
        removeUser();
        navigate("/login", { replace: true });;
    }

    return (
        <div>
            {/* Formulario para mostrar os links já criados */}
            <h1>Dashboard</h1>
            {/* Mostra "Loading..." enquanto os links estão sendo carregados */}
            {loading && <p>Loading...</p>} 
            {/* Mostra a mensagem de erro se houver algum erro no carregamento dos links */}
            {error && <p>{error}</p>}
            {/* Mostra a mensagem de erro de ação se houver algum erro ao criar, atualizar ou deletar um link */}
            {actionError && <p>{actionError}</p>}
            {/* Mostra a lista de links se não houver carregamento e erro */}
            {!loading && !error && (
                links.length === 0 ? (
                    <p>No links found</p>
                ) : (
                <ul> 
                    {links.map((link) => (
                        <li key={link.id}>
                            <p>{link.destination_url}</p>
                            <p>{link.click_count}</p>
                            <a href={user ? `${import.meta.env.VITE_SHORT_URL_BASE}/${user.username}/${link.slug}` : "#"} target="_blank" rel="noopener noreferrer">{link.slug}</a> {/* Mostra o slug do link como um link clicável */}
                            <button type="button" onClick={() => handleStartEdit(link)}>Editar</button> {/* Botão para iniciar a edição do link */}
                            <button type="button" onClick={() => handleDeleteLink(link.id)}>Deletar</button> {/* Botão para deletar o link */}
                        </li>
                    ))}
                </ul>
            ))}
            
            
        {/* Formulario para editar um link existente */}
        {editingLinkId !== null && (
        <form onSubmit={(e) => {
        e.preventDefault();
        handleUpdateLink(editingLinkId, editLink.slug, editLink.destination_url);
        }}>
            <input type="text" placeholder="Slug" value={editLink.slug} onChange={(e) => setEditLink({ ...editLink, slug: e.target.value })}/> {/* Input para o slug do link */}
            <input type="text" placeholder="Destination URL" value={editLink.destination_url} onChange={(e) => setEditLink({ ...editLink, destination_url: e.target.value })}/> {/* Input para a URL de destino do link */}
            <button type="submit" disabled={updating}>{updating ? "Updating..." : "Update Link"}</button> {/* Botão para atualizar o link, desabilitado enquanto o link está sendo atualizado */}
        </form>
        )}

        {/* Formulario para criar um novo link */}
        <form onSubmit={handleCreateLink}>
            <input type="text" placeholder="Slug" value={newLink.slug} onChange={(e) => setNewLink({ ...newLink, slug: e.target.value })}/> {/* Input para o slug do link */}
            <input type="text" placeholder="Destination URL" value={newLink.destination_url} onChange={(e) => setNewLink({ ...newLink, destination_url: e.target.value })}/> {/* Input para a URL de destino do link */}
            <button type="submit" disabled={creating}>{creating ? "Creating..." : "Create Link"}</button> {/* Botão para criar o link, desabilitado enquanto o link está sendo criado */}
        </form>

        <button type="button" onClick={handleLogout}>Logout</button>
    </div>
    );
}