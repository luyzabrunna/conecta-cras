const pool = require('../config/db');

async function buscarPorEmail(email) {
  const [rows] = await pool.query(
    'SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?',
    [email]
  );
  return rows[0];
}

module.exports = { buscarPorEmail };
