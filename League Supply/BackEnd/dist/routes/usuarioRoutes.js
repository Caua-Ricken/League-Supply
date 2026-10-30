import { Router } from 'express';
import usuarioController from '../controllers/usuarioController.js';
import verificarToken from '../middleware/authMiddleware.js';
import verificarAdmin from '../middleware/verificarAdmin.js';
const router = Router();
router.use(verificarToken, verificarAdmin);
router.get('/', usuarioController.buscar);
router.post('/cadastrar', usuarioController.cadastrar);
router.put('/:id', usuarioController.editar);
router.delete('/:id', usuarioController.excluir);
export default router;
//# sourceMappingURL=usuarioRoutes.js.map