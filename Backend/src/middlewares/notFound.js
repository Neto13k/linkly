//Tratamento de rota não encontrada

export const notFound = (req, res) => {
    return res.status(404).json({
        error: 'Route not found',
    });
}