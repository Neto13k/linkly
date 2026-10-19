import express from 'express';
import userRoutes from './routes/userRoutes.js';
import linkRoutes from './routes/linkRoutes.js';

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
    return res.status(200).json({ message: 'API is running' });
});

app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);


export { app };