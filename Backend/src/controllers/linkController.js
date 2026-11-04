// Controller de links: CRUD dos links encurtados e a rota pública de redirecionamento.
// As operações de CRUD exigem autenticação (garantida nas rotas) e usam o id do usuário
// autenticado em req.user. As validações replicam as restrições definidas no Schema.sql.
import * as linkService from '../services/linkService.js';

// Busca um link específico do usuário autenticado (GET /api/links/:id).
// A consulta no service filtra por id E user_id, impedindo acesso a links de terceiros.
export const getLinkById = async (req, res) => {
    try {
        //validar se o ID do link é um número inteiro
        const linkId = Number(req.params.id);
        if (isNaN(linkId) || linkId <= 0 || !Number.isInteger(linkId)) {
            return res.status(400).json({ message: 'ID de link inválido' });
        }

        //validar se o ID do usuário é um número inteiro
        const userId = req.user.id;
        if (!userId || typeof userId !== 'number' || userId <= 0 || !Number.isInteger(userId)) {
            return res.status(400).json({ message: 'ID de usuário inválido' });
        }

        const link = await linkService.getLinkById(linkId, userId);
        if (!link) {
            return res.status(404).json({ message: 'Link não encontrado' });
        }
        res.json(link);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar o link' });
    }
};

// Lista todos os links de um usuário (GET /api/links/user/:userId).
// O usuário só pode consultar os próprios links: se o userId da rota diferir do autenticado, retorna 403.
export const getLinksByUserId = async (req, res) => {
    try {
        //validar se o ID do usuário é um número inteiro
        const userId = Number(req.params.userId);
        if (isNaN(userId) || userId <= 0 || !Number.isInteger(userId)) {
            return res.status(400).json({ message: 'ID de usuário inválido' });
        }

        //validar autenticação do usuário (exemplo: verificar se o usuário logado é o mesmo que está sendo consultado)
        if (req.user.id !== userId) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        const links = await linkService.getLinksByUserId(userId);
        res.json(links);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar os links do usuário' });
    }
};

// Cria um novo link encurtado para o usuário autenticado (POST /api/links).
// Entrada: { slug, destinationUrl }. O slug é único por usuário (unicidade garantida pelo banco).
// A URL precisa ser http/https válida, sem espaços e com no máximo 2048 caracteres.
export const createLink = async (req, res) => {
    try {
        const userId = req.user.id;
        const { slug, destinationUrl } = req.body ?? {};

        // Validar se o ID do usuário é um número inteiro
        if (!userId || typeof userId !== 'number' || userId <= 0 || !Number.isInteger(userId)) {
            return res.status(400).json({ message: 'ID de usuário inválido' });
        }

        // Validar se a URL de destino é uma string
        if (typeof destinationUrl !== 'string') {
            return res.status(400).json({ message: 'URL de destino inválida' });
        }

        // Normalizar a URL de destino
        const normalizedDestinationUrl = destinationUrl.trim();

        // Validar se a URL está vazia, contém espaços ou excede 2048 caracteres
        if (!normalizedDestinationUrl || /\s/.test(normalizedDestinationUrl) || normalizedDestinationUrl.length > 2048) {
            return res.status(400).json({ message: 'URL de destino inválida' });
        }

        // Validar se a URL utiliza HTTP ou HTTPS
        try {
            const url = new URL(normalizedDestinationUrl);

            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                return res.status(400).json({ message: 'URL de destino inválida' });
            }
        } catch (error) {
            return res.status(400).json({ message: 'URL de destino inválida' });
        }

        // Validar o slug
        const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

        if (!slug || typeof slug !== 'string' || !slugRegex.test(slug.trim()) || slug.trim().length < 4 || slug.trim().length > 30) {
            return res.status(400).json({ message: 'Slug inválido' });
        }

        // Normalizar o slug
        const normalizedSlug = slug.trim();

        // Criar o link
        const link = await linkService.createLink(userId, normalizedDestinationUrl, normalizedSlug);
        return res.status(201).json(link);

    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Slug já em uso' });
        }
        console.error(error);
        return res.status(500).json({ message: 'Erro ao criar o link' });
    }
};

// Atualiza slug e URL de um link existente do usuário (PUT /api/links/:id).
// O UPDATE no service é restrito a id + user_id; se nenhuma linha casar, retorna 404.
export const updateLink = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user_id = req.user.id;
        const {slug, destinationUrl } = req.body ?? {};

        // Validar se o ID do link é um número inteiro
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: 'ID de link inválido' });
        }

        // Validar se o ID do usuário é um número inteiro
        if (!user_id || typeof user_id !== 'number' || user_id <= 0 || !Number.isInteger(user_id)) {
            return res.status(400).json({ message: 'ID de usuário inválido' });
        }

        // Validar se a URL de destino é uma string
        if (typeof destinationUrl !== 'string') {
            return res.status(400).json({ message: 'URL de destino inválida' });
        }

        // Normalizar a URL de destino
        const normalizedDestinationUrl = destinationUrl.trim();

        // Validar se a URL está vazia, contém espaços ou excede 2048 caracteres
        if (!normalizedDestinationUrl || /\s/.test(normalizedDestinationUrl) || normalizedDestinationUrl.length > 2048) {
            return res.status(400).json({ message: 'URL de destino inválida' });
        }

        // Validar se a URL de destino é uma URL válida http ou https
        try {
            const url = new URL(normalizedDestinationUrl);
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                return res.status(400).json({ message: 'URL de destino inválida' });
            }
        } catch (error) {
            return res.status(400).json({ message: 'URL de destino inválida' });
        }

        // Validar se o slug contém apenas letras minúsculas, números e hífens
        const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
        if (!slug || typeof slug !== 'string' || !slugRegex.test(slug.trim()) || slug.trim().length < 4 || slug.trim().length > 30) {
            return res.status(400).json({ message: 'Slug inválido' });
        }

        // Validar o slug normalizado
        const normalizedSlug = slug.trim();

        const link = await linkService.updateLink(id, user_id, normalizedDestinationUrl, normalizedSlug);

        if (!link) {
            return res.status(404).json({ message: 'Link não encontrado' });
        }

        res.json(link);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Slug já em uso' });
        }

        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar o link' });
    }
};

// Remove um link do usuário (DELETE /api/links/:id).
// A exclusão é restrita a id + user_id; se nada for removido, retorna 404.
export const deleteLink = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user_id  = req.user.id;

        // Validar se o ID do link é um número inteiro
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: 'ID de link inválido' });
        }

        // Validar se o ID do usuário é um número inteiro
        if (!user_id || typeof user_id !== 'number' || user_id <= 0 || !Number.isInteger(user_id)) {
            return res.status(400).json({ message: 'ID de usuário inválido' });
        }

        const link = await linkService.deleteLink(id, user_id);

        if (!link) {
            return res.status(404).json({ message: 'Link não encontrado' });
        }

        res.json({ message: 'Link deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar o link' });
    }
};

// Rota pública de redirecionamento (GET /:username/:slug).
// Esta é a URL que o visitante final acessa: resolve o link pelo par (username, slug),
// incrementa o contador de cliques e redireciona para a URL de destino.
export const redirectLink = async (req, res) => {
    try {
        // Validar se o slug contém apenas letras minúsculas, números e hífens
        const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
        const { slug } = req.params;

        if (!slug || typeof slug !== 'string' || !slugRegex.test(slug.trim())) {
            return res.status(400).json({ message: 'Slug inválido' });
        }

        // Validar se o nome de usuário é uma string não vazia
        const username = req.params.username;

        if (!username || typeof username !== 'string' || !username.trim()) {
            return res.status(400).json({ message: 'Nome de usuário inválido' });
        }

        const usernameRegex =  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

        if (!usernameRegex.test(username.trim()) || username.trim().length < 3 || username.trim().length > 30) {
            return res.status(400).json({ message: 'Nome de usuário inválido' });
        }

        const link = await linkService.getLinkBySlug(slug, username);

        if (!link) {
            return res.status(404).json({ message: 'Link não encontrado' });
        }

        // Incrementar o contador de cliques antes do redirecionamento
        await linkService.incrementClickCount(link.id);

        return res.redirect(link.destination_url);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao redirecionar o link' });
    }
};