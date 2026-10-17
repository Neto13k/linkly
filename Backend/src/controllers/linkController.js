import * as linkService from '../services/linkService.js';

export const getLinkById = async (req, res) => {
    try {
        //validar se o ID do link é um número inteiro
        const linkId = Number(req.params.id);
        if (isNaN(linkId) || linkId <= 0 || !Number.isInteger(linkId)) {
            return res.status(400).json({ message: 'ID de link inválido' });
        }
        const link = await linkService.getLinkById(linkId);
        if (!link) {
            return res.status(404).json({ message: 'Link não encontrado' });
        }
        res.json(link);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar o link' });
    }
};

export const getLinksByUserId = async (req, res) => {
    try {
        //validar se o ID do usuário é um número inteiro
        const userId = Number(req.params.userId);
        if (isNaN(userId) || userId <= 0 || !Number.isInteger(userId)) {
            return res.status(400).json({ message: 'ID de usuário inválido' });
        }
        const links = await linkService.getLinksByUserId(userId);
        res.json(links);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar os links do usuário' });
    }
};

export const createLink = async (req, res) => {
    try {
        const { userId, slug, destinationUrl } = req.body;
        //validar se o ID do usuário é um número inteiro
        if (!userId || typeof userId !== 'number' || userId <= 0 || !Number.isInteger(userId)) {
            return res.status(400).json({ message: 'ID de usuário inválido' });
        }
        //validar se a URL de destino é uma string não vazia
        if (!destinationUrl || typeof destinationUrl !== 'string' || !destinationUrl.trim()) {
            return res.status(400).json({ message: 'URL de destino inválida' });
        }
        //validar se a URL de destino é uma URL válida http ou https
        try {
            const url = new URL(destinationUrl);
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                return res.status(400).json({ message: 'URL de destino inválida' });
            }
        } catch (error) {
            return res.status(400).json({ message: 'URL de destino inválida' });
        }
        //validar se o slug é uma string não vazia e contém apenas letras, números e hífens 
        const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
        if (!slug || typeof slug !== 'string' || !slugRegex.test(slug.trim())) {
            return res.status(400).json({ message: 'Slug inválido' });
        }
        const link = await linkService.createLink( userId, destinationUrl, slug );
        res.status(201).json(link);
    } catch (error) {
        if (error.code === '23505') { // código de erro para violação de chave única no PostgreSQL
            return res.status(409).json({ message: 'Slug já em uso' });
        }
        res.status(500).json({ message: 'Erro ao criar o link' });
    }
};

export const updateLink = async (req, res) => {
    try {
        const { id, user_id, slug, destinationUrl } = req.body;
        //validar se o ID do link é um número inteiro
        if (!id || typeof id !== 'number' || id <= 0 || !Number.isInteger(id)) {
            return res.status(400).json({ message: 'ID de link inválido' });
        }
        //validar se o ID do usuário é um número inteiro
        if (!user_id || typeof user_id !== 'number' || user_id <= 0 || !Number.isInteger(user_id)) {
            return res.status(400).json({ message: 'ID de usuário inválido' });
        }
        //validar se a URL de destino é uma string não vazia
        if (!destinationUrl || typeof destinationUrl !== 'string' || !destinationUrl.trim()) {
            return res.status(400).json({ message: 'URL de destino inválida' });
        }
        //validar se a URL de destino é uma URL válida http ou https
        try {
            const url = new URL(destinationUrl);
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                return res.status(400).json({ message: 'URL de destino inválida' });
            }
        } catch (error) {
            return res.status(400).json({ message: 'URL de destino inválida' });
        }
        //validar se o slug é uma string não vazia e contém apenas letras, números e hífens
        const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
        if (!slug || typeof slug !== 'string' || !slugRegex.test(slug.trim())) {
            return res.status(400).json({ message: 'Slug inválido' });
        }
        const link = await linkService.updateLink( id, user_id, destinationUrl, slug );
        res.json(link);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o link' });
    }
};