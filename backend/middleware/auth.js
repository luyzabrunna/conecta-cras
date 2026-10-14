const jwt = require('jsonwebtoken');
const { SEGREDO } = require('../config/jwt');

// Middleware para exigir login em rotas protegidas
function exigirLogin(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Faça login para continuar.' });
  }
  try {
    req.usuario = jwt.verify(token, SEGREDO);
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Sessão expirada. Entre novamente.' });
  }
}

module.exports = { exigirLogin };
