const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');
const { SEGREDO, EXPIRA_EM, COOKIE_SESSAO } = require('../config/jwt');

// httpOnly: o JavaScript da página não consegue ler o cookie (protege contra roubo de sessão)
// sameSite strict: o cookie não vai em pedidos vindos de outros sites
function opcoesCookie(req) {
  return { httpOnly: true, sameSite: 'strict', secure: req.secure, path: '/' };
}

async function login(req, res) {
  const email = String(req.body.email || '').trim().toLowerCase();
  const senha = String(req.body.senha || '');

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe e-mail e senha.' });
  }

  try {
    const usuario = await usuarioModel.buscarPorEmail(email);
    const senhaOk = usuario && (await bcrypt.compare(senha, usuario.senha_hash));
    if (!senhaOk) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nome: usuario.nome },
      SEGREDO,
      { expiresIn: EXPIRA_EM }
    );
    res.cookie(COOKIE_SESSAO, token, opcoesCookie(req)); // dura até fechar o navegador
    res.json({ token, nome: usuario.nome });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao fazer login.' });
  }
}

// Sair: o servidor apaga o cookie de sessão.
// Por GET (botão Sair do painel) devolve a pessoa para a tela de login.
async function logout(req, res) {
  res.clearCookie(COOKIE_SESSAO, opcoesCookie(req));
  res.set('Cache-Control', 'no-store');
  if (req.method === 'GET') return res.redirect('/admin/login.html');
  res.status(204).end();
}

module.exports = { login, logout };
