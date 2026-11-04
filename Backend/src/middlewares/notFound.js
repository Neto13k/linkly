//Tratamento de rota não encontrada
// Captura qualquer requisição que não casou com nenhuma rota registrada e responde 404 em JSON.

export const notFound = (req, res) => {
    return res.status(404).json({
        error: 'Route not found',
    });
}