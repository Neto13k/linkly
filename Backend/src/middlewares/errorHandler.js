// Middleware central de tratamento de erros (deve ser o último middleware registrado).
// Normaliza o status HTTP, trata erros específicos (JSON inválido) e evita vazar
// detalhes internos: para status 5xx devolve uma mensagem genérica.
export const errorHandler =(err, req, res, next) => {
    console.error(err);

    // Se a resposta já começou a ser enviada, delega ao Express para não corromper o corpo
    if (res.headersSent) {
        return next(err);
    }

    const status = err.statusCode || err.status;

    // Usa o status do erro apenas se for um código HTTP válido (400–599); caso contrário, 500
    const statusCode =
        Number.isInteger(status) && status >= 400 && status <= 599
            ? status
            : 500;

    // Erro lançado pelo parser de JSON do Express quando o corpo da requisição é inválido
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON body' });
    }

    return res.status(statusCode).json({
        error: statusCode >= 500
            ? 'Internal server error'
            : err.message,
    });
};