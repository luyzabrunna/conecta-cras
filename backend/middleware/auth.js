const jwt = require('jsonwebtoken');
const { SEGREDO, COOKIE_SESSAO } = require('../config/jwt');

// Lê um cookie do cabeçalho da requisição, sem precisar de pacote extra
function lerCookie(req, nome) {
  for (const parte of (req.headers.cookie || '').split(';')) {
    const [chave, ...resto] = parte.trim().split('=');
    if (chave === nome) return decodeURIComponent(resto.join('='));
  }
  return null;
}

// Devolve os dados de quem está logado, ou null.
// A sessão vem do cookie (usado pelo navegador) ou do cabeçalho Authorization (usado por testes).
function usuarioDaRequisicao(req) {
  const [tipo, tokenCabecalho] = (req.headers.authorization || '').split(' ');
  const token = tipo === 'Bearer' && tokenCabecalho ? tokenCabecalho : lerCookie(req, COOKIE_SESSAO);
  if (!token) return null;
  try {
    return jwt.verify(token, SEGREDO);
  } catch (erro) {
    return null; // token adulterado ou vencido
  }
}

// Protege as rotas da API do painel
function exigirLogin(req, res, next) {
  const usuario = usuarioDaRequisicao(req);
  if (!usuario) {
    return res.status(401).json({ erro: 'Faça login para continuar.' });
  }
  req.usuario = usuario;
  next();
}

// Protege as PÁGINAS do painel: sem sessão válida, o servidor nem entrega o HTML,
// manda direto para o login. Só a própria tela de login é liberada,
// e quem já está logado é levado direto ao painel.
function protegerPaginasAdmin(req, res, next) {
  const logado = Boolean(usuarioDaRequisicao(req));
  if (req.path === '/login.html') {
    return logado ? res.redirect('/admin/dashboard.html') : next();
  }
  if (!logado) return res.redirect('/admin/login.html');
  next();
}

module.exports = { exigirLogin, protegerPaginasAdmin };
