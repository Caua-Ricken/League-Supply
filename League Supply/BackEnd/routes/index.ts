import express from 'express'
const router = express.Router();

import athRoutes from './authRoutes.js'
router.use('/auth', athRoutes);

import produtoRoutes from './produtoRoutes.js'
router.use('/produtos', produtoRoutes)

export default router;