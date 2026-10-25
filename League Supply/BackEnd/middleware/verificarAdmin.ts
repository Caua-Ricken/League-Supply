import type { Response, NextFunction } from 'express';
import type { RequestAutenticado } from './authMiddleware.js';

function verificarAdmin(
  req: RequestAutenticado,
  res: Response,
  next: NextFunction
) {
  const usuario = req.usuario;

  if (!usuario || typeof usuario === 'string') {
    return res.status(401).json({
      message: 'Usuário não autenticado',
    });
  }

  if (usuario.role !== 'admin') {
    return res.status(403).json({
      message: 'Acesso permitido apenas para administradores',
    });
  }

  next();
}

export default verificarAdmin;