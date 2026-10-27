import express from 'express'
const router = express.Router();

import athRoutes from './authRoutes.js'
router.use('/auth', athRoutes);

import produtoRoutes from './produtoRoutes.js'
router.use('/produtos', produtoRoutes);

import categoriaRoutes from './categoriaRoutes.js'
router.use('/categorias', categoriaRoutes);

import usuarioRoutes from './usuarioRoutes.js';
router.use('/usuarios', usuarioRoutes);

import formaPagamentoRoutes from './formaPagamentoRoutes.js';
router.use('/formas-pagamento', formaPagamentoRoutes);

export default router;