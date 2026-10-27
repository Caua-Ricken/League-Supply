import { Router } from 'express';
import formaPagamentoController from '../controllers/formaPagamentoController.js';
import verificarToken from '../middleware/authMiddleware.js';
import verificarAdmin from '../middleware/verificarAdmin.js';

const router = Router();

router.use(verificarToken, verificarAdmin);

router.get('/', formaPagamentoController.buscar);
router.post('/cadastrar', formaPagamentoController.cadastrar);
router.put('/:id', formaPagamentoController.editar);
router.delete('/:id', formaPagamentoController.excluir);

export default router;