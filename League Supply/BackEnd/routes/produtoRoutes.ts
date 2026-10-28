import express from 'express';
const router = express.Router();
import verificarToken from '../middleware/authMiddleware.js';
import verificarAdmin from '../middleware/verificarAdmin.js';

import produtoController from '../controllers/produtoController.js'

router.post('/cadastrar', verificarToken, verificarAdmin, produtoController.cadastrar)
router.get('/', verificarToken, produtoController.buscar)
router.put('/:id', verificarToken, verificarAdmin, produtoController.editar)
router.delete('/:id', verificarToken, verificarAdmin, produtoController.excluir)



export default router;
