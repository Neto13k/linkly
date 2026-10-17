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
