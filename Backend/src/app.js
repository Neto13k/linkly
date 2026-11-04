// Configuração central da aplicação Express.
// Aqui são registrados os middlewares globais, as rotas da API e os tratamentos
// de rota inexistente e de erros. O objeto `app` é exportado para ser iniciado pelo server.js.
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { redirectLink } from './controllers/linkController.js';
import pool from './db/db.js';

const app = express();

// Habilita a leitura de corpos de requisição em JSON (req.body) em todas as rotas
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

// Rotas da API (usuários, links e autenticação), todas sob o prefixo /api
app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/auth', authRoutes);

// Rota pública de redirecionamento dos links encurtados no formato /:username/:slug.
// Fica fora do prefixo /api e sem autenticação, pois é a URL que o visitante final acessa.
app.get('/:username/:slug', redirectLink);

// Middlewares de fim de cadeia: primeiro trata rotas não encontradas (404)
// e, em seguida, centraliza o tratamento de erros da aplicação.
app.use(notFound);
app.use(errorHandler);

export { app };