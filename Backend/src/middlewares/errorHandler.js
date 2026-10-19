export const errorHandler =(err, req, res, next) => {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    const status = err.statusCode || err.status;

    const statusCode =
        Number.isInteger(status) && status >= 400 && status <= 599
            ? status
            : 500;

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON body' });
    }

    return res.status(statusCode).json({
        error: statusCode >= 500
            ? 'Internal server error'
            : err.message,
    });
};