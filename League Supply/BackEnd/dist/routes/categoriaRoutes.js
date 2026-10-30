import express from 'express';
const router = express.Router();
import verificarToken from '../middleware/authMiddleware.js';
import verificarAdmin from '../middleware/verificarAdmin.js';
import categoriaController from '../controllers/categoriaController.js';
router.post('/cadastrar', verificarToken, verificarAdmin, categoriaController.cadastrar);
router.get('/', verificarToken, categoriaController.buscar);
router.put('/:id', verificarToken, verificarAdmin, categoriaController.editar);
router.delete('/:id', verificarToken, verificarAdmin, categoriaController.excluir);
export default router;
//# sourceMappingURL=categoriaRoutes.js.map