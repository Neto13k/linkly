// Rotas de usuários (montadas em /api/users pelo app).
// Cada rota exige o middleware authenticateToken individualmente.
import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

export default router;