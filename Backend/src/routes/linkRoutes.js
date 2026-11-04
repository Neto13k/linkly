// Rotas de links (montadas em /api/links pelo app).
// O authenticateToken é aplicado a todas as rotas deste router, pois o CRUD de links
// exige usuário autenticado. A rota pública de redirecionamento fica no app (/).
import express from 'express';
const router = express.Router();
import * as linkController from '../controllers/linkController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

router.use(authenticateToken);
router.get('/:id', linkController.getLinkById);
router.post('/', linkController.createLink);
router.put('/:id', linkController.updateLink);
router.delete('/:id', linkController.deleteLink);
router.get('/user/:userId', linkController.getLinksByUserId);

export default router;