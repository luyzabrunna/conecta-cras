const express = require('express');
const path = require('path');
const crasRoutes = require('./routes/crasRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '../frontend/public')));
app.use('/admin', express.static(path.join(__dirname, '../frontend/admin')));

// Rota de teste
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'API do Conecta CRAS rodando' });
});

// Rotas do CRAS (listagem, detalhe, CRAS parceiro)
app.use('/api/cras', crasRoutes);

// TODO: rotas administrativas (login, atualização de horários/avisos)

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
