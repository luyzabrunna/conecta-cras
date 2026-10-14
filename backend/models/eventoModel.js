
const pool = require('../config/db');

const CAMPOS = 'id, nome, `data`, status, descricao, categoria, horario, local';

async function listarAtivos() {
  const [rows] = await pool.query(
    `SELECT ${CAMPOS} FROM eventos WHERE status = 'Ativo' ORDER BY \`data\` ASC`
  );
  return rows;
}

async function listarTodos() {
  const [rows] = await pool.query(
    `SELECT ${CAMPOS} FROM eventos ORDER BY \`data\` ASC`
  );
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query(
    `SELECT ${CAMPOS} FROM eventos WHERE id = ?`,
    [id]
  );
  return rows[0];
}

async function criar({ nome, data, status, descricao, categoria, horario, local }) {
  const [r] = await pool.query(
    `INSERT INTO eventos
      (nome, \`data\`, status, descricao, categoria, horario, local)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      nome,
      data,
      status,
      descricao,
      categoria,
      horario,
      local
    ]
  );

  return buscarPorId(r.insertId);
}

async function atualizar(id, { nome, data, status, descricao, categoria, horario, local }) {
  await pool.query(
    `UPDATE eventos
     SET nome = ?, \`data\` = ?, status = ?, descricao = ?,
         categoria = ?, horario = ?, local = ?
     WHERE id = ?`,
    [
      nome,
      data,
      status,
      descricao,
      categoria,
      horario,
      local,
      id
    ]
  );

  return buscarPorId(id);
}

async function remover(id) {
  const [r] = await pool.query(
    'DELETE FROM eventos WHERE id = ?',
    [id]
  );

  return r.affectedRows > 0;
}

module.exports = {
  listarAtivos,
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  remover
};
