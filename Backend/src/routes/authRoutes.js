// Rotas de autenticação (montadas em /api/auth pelo app).
// São públicas: não passam pelo middleware authenticateToken.
import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);

export default router;