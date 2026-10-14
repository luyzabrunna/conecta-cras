const ouvidoriaModel = require('../models/ouvidoriaModel');
const { emailValido } = require('../utils/validacao');

const TIPOS_VALIDOS = ['sugestao', 'reclamacao', 'elogio', 'duvida', 'outro'];

// Público: qualquer pessoa pode enviar pelo formulário de contato
async function criar(req, res) {
  const nome = String(req.body.nome || '').trim();
  const email = String(req.body.email || '').trim();
  const tipo = String(req.body.tipo || '').trim();
  const mensagem = String(req.body.mensagem || '').trim();

  if (!nome) return res.status(400).json({ erro: 'Informe seu nome.' });
  if (email && !emailValido(email)) return res.status(400).json({ erro: 'E-mail inválido.' });
  if (!TIPOS_VALIDOS.includes(tipo)) return res.status(400).json({ erro: 'Tipo de mensagem inválido.' });
  if (!mensagem) return res.status(400).json({ erro: 'Escreva sua mensagem.' });

  try {
    const id = await ouvidoriaModel.criar({ nome, email, tipo, mensagem });
    res.status(201).json({ id, mensagem: 'Mensagem recebida. Obrigado pelo contato!' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao enviar a mensagem.' });
  }
}

// Painel: só quem está logado vê as mensagens recebidas
async function listar(req, res) {
  try {
    res.json(await ouvidoriaModel.listar());
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao buscar as mensagens.' });
  }
}

module.exports = { criar, listar };
