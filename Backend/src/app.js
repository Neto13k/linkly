import express from 'express';
import userRoutes from './routes/userRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { redirectLink } from './controllers/linkController.js';
import pool from './config/db.js';

const app = express();

app.use(express.json());

// Verifica se a API e o banco PostgreSQL estão funcionando
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');

        return res.status(200).json({
            message: 'API e banco de dados funcionando'
        });
    } catch (error) {
        console.error('Erro ao verificar conexão com o banco de dados:', error);

        return res.status(503).json({
            message: 'Banco de dados indisponível'
        });
    }
});

app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/auth', authRoutes);

app.get('/:username/:slug', redirectLink);

app.use(notFound);
app.use(errorHandler);

export { app };