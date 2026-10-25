import express from 'express';
const router = express.Router();
import verificarToken from '../middleware/authMiddleware.js';

import produtoController from '../controllers/produtoController.js'

router.use(verificarToken)
router.post('/cadastrar', produtoController.cadastrar)
router.get('/', produtoController.buscar)
router.put('/:id', produtoController.editar)
router.delete('/:id', produtoController.excluir)



export default router;
