import type {
    Request,
    Response,
    NextFunction,
  } from 'express';
  
  interface RespostaTurnstile {
    success: boolean;
  }
  
  const verificarTurnstile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.body?.turnstileToken;
    const secret = process.env.TURNSTILE_SECRET_KEY;
  
    if (typeof token !== 'string' || !token.trim()) {
      return res.status(400).json({
        message: 'Conclua a verificação de segurança.',
      });
    }
  
    if (!secret) {
      return res.status(500).json({
        message: 'Verificação de segurança não configurada.',
      });
    }
  
    try {
      const resposta = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          body: new URLSearchParams({
            secret,
            response: token,
          }),
        }
      );
  
      if (!resposta.ok) {
        return res.status(503).json({
          message:
            'Não foi possível verificar a segurança. Tente novamente.',
        });
      }
  
      const resultado: RespostaTurnstile =
        await resposta.json();
  
      if (!resultado.success) {
        return res.status(400).json({
          message:
            'Verificação inválida ou expirada. Tente novamente.',
        });
      }
  
      next();
    } catch {
      return res.status(503).json({
        message:
          'Não foi possível verificar a segurança. Tente novamente.',
      });
    }
  };
  
  export default verificarTurnstile;