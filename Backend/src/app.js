import express from 'express';
import userRoutes from './routes/userRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { redirectLink } from './controllers/linkController.js';


const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
    return res.status(200).json({ message: 'API is running' });
});

app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/auth', authRoutes);
app.get('/:username/:slug', redirectLink);
app.use(notFound);
app.use(errorHandler);

export { app };