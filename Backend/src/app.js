import express from 'express';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
    return res.status(200).json({ message: 'API is running' });
});

app.use('/api/users', userRoutes);

// 404: nenhuma rota correspondeu à requisição
app.use((req, res) => {
    return res.status(404).json({
        error: 'Route not found',
    });
});

// Middleware centralizado de erros
app.use((err, req, res, next) => {
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
});

export { app };