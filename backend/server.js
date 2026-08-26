const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '../frontend/public')));
app.use('/admin', express.static(path.join(__dirname, '../frontend/admin')));

// Rota de teste
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'API do Conecta CRAS rodando' });
});

// TODO: rotas de CRAS (listagem, detalhe do CRAS parceiro, avisos)
// TODO: rotas administrativas (login, atualização de horários/avisos)

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
