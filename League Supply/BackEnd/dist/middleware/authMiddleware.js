import jwt from 'jsonwebtoken';
import 'dotenv/config';
const JWT_SECRET = process.env.JWT_SECRET;
function verificarToken(req, res, next) {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET não configurado no .env');
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: "Token não informado",
        });
    }
    const partes = authHeader.split(" ");
    const token = partes[1];
    if (partes.length !== 2 || partes[0] !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Formato do token inválido",
        });
    }
    try {
        const usuarioDecodificado = jwt.verify(token, JWT_SECRET);
        req.usuario = usuarioDecodificado;
    }
    catch (error) {
        return res.status(401).json({
            message: error instanceof jwt.TokenExpiredError
                ? 'Sua sessão expirou. Faça login novamente para cadastrar o produto.'
                : 'Token inválido. Faça login novamente para atualizar sua sessão.',
        });
    }
    next();
}
export default verificarToken;
//# sourceMappingURL=authMiddleware.js.map