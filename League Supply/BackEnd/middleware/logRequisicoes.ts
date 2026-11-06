import type {
    Request,
    Response,
    NextFunction,
  } from 'express';
  
  import { registrarLog } from '../utils/logger.js';
  
  function logRequisicoes(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const inicio = Date.now();
  
    res.on('finish', () => {
      const duracao = Date.now() - inicio;
  
      registrarLog(
        `${req.method} ${req.path} ${res.statusCode} ${duracao}ms`
      );
    });
  
    next();
  }
  
  export default logRequisicoes;