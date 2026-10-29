import { Router } from 'express';

import pedidoController from '../controllers/pedidoController.js';
import verificarToken from '../middleware/authMiddleware.js';

const router = Router();

router.use(verificarToken);

router.post('/', pedidoController.cadastrar);
router.get('/meus', pedidoController.buscarMeus);

export default router;