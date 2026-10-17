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
