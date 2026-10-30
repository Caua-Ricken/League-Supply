import express from 'express';
const router = express.Router();
import authController from '../controllers/authController.js';
router.post('/login', authController.login);
router.post('/cadastrar', authController.cadastrar);
export default router;
//# sourceMappingURL=authRoutes.js.map