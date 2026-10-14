const express = require('express');
const path = require('path');
const pool = require('./config/db');

const eventoRoutes = require('./routes/eventoRoutes');
const avisoRoutes = require('./routes/avisoRoutes');
const ouvidoriaRoutes = require('./routes/ouvidoriaRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Frontend: site público na raiz e painel administrativo em /admin
app.use('/', express.static(path.join(__dirname, '../frontend/public')));
app.use('/admin', express.static(path.join(__dirname, '../frontend/admin')));

// Teste rápido: confirma que a API está de pé e conversando com o banco
app.get('/api/status', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', banco: 'conectado' });
  } catch (erro) {
    res.status(500).json({ status: 'erro', banco: 'sem conexão' });
  }
});

// Rotas da API
app.use('/api/eventos', eventoRoutes);
app.use('/api/avisos', avisoRoutes);
app.use('/api/ouvidoria', ouvidoriaRoutes);
app.use('/api', authRoutes); // POST /api/login

// Qualquer outra rota /api/... que não existe
app.use('/api', (req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// JSON malformado e outros erros inesperados
app.use((erro, req, res, next) => {
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido.' });
  }
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
