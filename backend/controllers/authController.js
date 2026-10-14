const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');
const { SEGREDO, EXPIRA_EM } = require('../config/jwt');

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
    res.json({ token, nome: usuario.nome });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao fazer login.' });
  }
}

module.exports = { login };
