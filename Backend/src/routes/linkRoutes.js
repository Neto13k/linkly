import express from 'express';
const router = express.Router();
import * as linkController from '../controllers/linkController.js';

router.get('/:id', linkController.getLinkById);
router.post('/', linkController.createLink);
router.put('/:id', linkController.updateLink);
router.delete('/:id', linkController.deleteLink);
router.get('/user/:userId', linkController.getLinksByUserId);

export default router;