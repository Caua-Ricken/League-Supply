import express from 'express';
const router = express.Router();

import authController from '../controllers/authController.js';
import verificarTurnstile from '../middleware/verificarTurnstile.js';

router.post('/login', verificarTurnstile, authController.login);

router.post('/cadastrar', authController.cadastrar);


export default router;