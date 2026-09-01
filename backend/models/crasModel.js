const pool = require('../config/db');

// Aqui ficam só as queries — nada de lógica de requisição/resposta,
// isso é responsabilidade do controller.

async function listarTodos() {
  const [rows] = await pool.query('SELECT * FROM cras');
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM cras WHERE id = ?', [id]);
  return rows[0];
}

async function buscarParceiro() {
  const [rows] = await pool.query('SELECT * FROM cras WHERE parceiro = TRUE LIMIT 1');
  return rows[0];
}

module.exports = {
  listarTodos,
  buscarPorId,
  buscarParceiro,
};
