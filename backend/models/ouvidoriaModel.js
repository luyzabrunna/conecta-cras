const pool = require('../config/db');

async function criar({ nome, email, tipo, mensagem }) {
  const [r] = await pool.query(
    'INSERT INTO mensagens_ouvidoria (nome, email, tipo, mensagem) VALUES (?, ?, ?, ?)',
    [nome, email || null, tipo, mensagem]
  );
  return r.insertId;
}

async function listar() {
  const [rows] = await pool.query(
    'SELECT id, nome, email, tipo, mensagem, criado_em FROM mensagens_ouvidoria ORDER BY id DESC'
  );
  return rows;
}

module.exports = { criar, listar };
