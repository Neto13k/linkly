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
        setActionError("");
        try {
            await deleteLink(linkId);
            setLinks((prevLinks) => prevLinks.filter((link) => link.id !== linkId));
            
            if (editingLinkId === linkId) {
                setEditingLinkId(null); // Limpa o estado de edição se o link deletado estava sendo editado
            }
        }       
        catch (err) {
            if(!handleSessionError(err)) { // Verifica se o erro é de sessão
                if (err instanceof Error) {
                    setActionError(err.message);
                } else {
                    setActionError("Erro ao deletar o link");
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
        <div>
            {/* Formulario para mostrar os links já criados */}
            <h1>Dashboard</h1>

            <RouterLink to="/profile">Meu Perfil</RouterLink> 
            {/* Mostra "Loading..." enquanto os links estão sendo carregados */}
            {loading && <p>Carregando...</p>} 
            {/* Mostra a mensagem de erro se houver algum erro no carregamento dos links */}
            {error && <p>{error}</p>}
            {/* Mostra a mensagem de erro de ação se houver algum erro ao criar, atualizar ou deletar um link */}
            {actionError && <p>{actionError}</p>}
            {/* Mostra a lista de links se não houver carregamento e erro */}
            {!loading && !error && (
                links.length === 0 ? (
                    <p>Nenhum link encontrado</p>
                ) : (
                <ul> 
                    {links.map((link) => (
                        <li key={link.id}>
                            <p>{link.destination_url}</p>
                            <p>{link.click_count}</p>
                            {/* Mostra o slug do link como um link clicável */}
                            <a href={user ? `${import.meta.env.VITE_SHORT_URL_BASE}/${user.username}/${link.slug}` : "#"} target="_blank" rel="noopener noreferrer"> {user ? `${import.meta.env.VITE_SHORT_URL_BASE}/${user.username}/${link.slug}` : "#"}</a> 
                            <CopyLinkButton link={user ? `${import.meta.env.VITE_SHORT_URL_BASE}/${user.username}/${link.slug}` : "#"} /> {/* Componente para copiar o link encurtado para a área de transferência */}
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
            <input type="text" placeholder="URL de Destino" value={editLink.destination_url} onChange={(e) => setEditLink({ ...editLink, destination_url: e.target.value })}/> {/* Input para a URL de destino do link */}
            <button type="submit" disabled={updating}>{updating ? "Atualizando..." : "Atualizar Link"}</button> {/* Botão para atualizar o link, desabilitado enquanto o link está sendo atualizado */}
        </form>
        )}

        <RouterLink to="/regras">Regras</RouterLink> 

        {/* Formulario para criar um novo link */}
        <form onSubmit={handleCreateLink}>
            <input type="text" placeholder="Slug" value={newLink.slug} onChange={(e) => setNewLink({ ...newLink, slug: e.target.value })}/> {/* Input para o slug do link */}
            <input type="text" placeholder="URL de Destino" value={newLink.destination_url} onChange={(e) => setNewLink({ ...newLink, destination_url: e.target.value })}/> {/* Input para a URL de destino do link */}
            <button type="submit" disabled={creating}>{creating ? "Criando..." : "Criar Link"}</button> {/* Botão para criar o link, desabilitado enquanto o link está sendo criado */}
        </form>

        <button type="button" onClick={handleLogout}>Sair</button>
    </div>
    );
}