import { Router } from 'express';
import pedidoController from '../controllers/pedidoController.js';
import verificarToken from '../middleware/authMiddleware.js';
import verificarAdmin from '../middleware/verificarAdmin.js';
const router = Router();
router.use(verificarToken);
router.post('/', pedidoController.cadastrar);
router.get('/meus', pedidoController.buscarMeus);
router.get('/pedidos', verificarToken, verificarAdmin, pedidoController.buscarTodos);
export default router;
//# sourceMappingURL=pedidoRoutes.js.map