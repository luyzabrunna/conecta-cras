const pool = require('../config/db');

const CAMPOS = 'id, titulo, mensagem, `data`';

async function listar() {
  const [rows] = await pool.query(
    `SELECT ${CAMPOS} FROM avisos ORDER BY \`data\` DESC, id DESC`
  );
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query(`SELECT ${CAMPOS} FROM avisos WHERE id = ?`, [id]);
  return rows[0];
}

// Se a data não for informada, usa o dia de hoje (CURDATE do banco)
async function criar({ titulo, mensagem, data }) {
  const [r] = await pool.query(
    'INSERT INTO avisos (titulo, mensagem, `data`) VALUES (?, ?, COALESCE(?, CURDATE()))',
    [titulo, mensagem, data || null]
  );
  return buscarPorId(r.insertId);
}

async function atualizar(id, { titulo, mensagem }) {
  await pool.query('UPDATE avisos SET titulo = ?, mensagem = ? WHERE id = ?', [titulo, mensagem, id]);
  return buscarPorId(id);
}

async function remover(id) {
  const [r] = await pool.query('DELETE FROM avisos WHERE id = ?', [id]);
  return r.affectedRows > 0;
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
