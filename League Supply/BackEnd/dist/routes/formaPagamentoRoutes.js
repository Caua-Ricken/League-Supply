import { Router } from 'express';
import formaPagamentoController from '../controllers/formaPagamentoController.js';
import verificarToken from '../middleware/authMiddleware.js';
import verificarAdmin from '../middleware/verificarAdmin.js';
const router = Router();
router.get('/', verificarToken, formaPagamentoController.buscar);
router.post('/cadastrar', verificarToken, verificarAdmin, formaPagamentoController.cadastrar);
router.put('/:id', verificarToken, verificarAdmin, formaPagamentoController.editar);
router.delete('/:id', verificarToken, verificarAdmin, formaPagamentoController.excluir);
export default router;
//# sourceMappingURL=formaPagamentoRoutes.js.map