import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';

router.get('/email/:email', userController.getUserByEmail);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;