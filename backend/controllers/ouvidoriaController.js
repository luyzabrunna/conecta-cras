const ouvidoriaModel = require('../models/ouvidoriaModel');
const emailService = require('../services/emailService');
const { emailValido } = require('../utils/validacao');

const TIPOS_VALIDOS = ['sugestao', 'reclamacao', 'elogio', 'duvida', 'outro'];

// Limites alinhados com o banco (nome e e-mail têm 150 caracteres) e com um tamanho razoável de e-mail
const LIMITES = { nome: 150, email: 150, mensagem: 5000 };

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
  if (nome.length > LIMITES.nome) return res.status(400).json({ erro: `Nome muito longo (máximo de ${LIMITES.nome} caracteres).` });
  if (email.length > LIMITES.email) return res.status(400).json({ erro: `E-mail muito longo (máximo de ${LIMITES.email} caracteres).` });
  if (mensagem.length > LIMITES.mensagem) return res.status(400).json({ erro: `Mensagem muito longa (máximo de ${LIMITES.mensagem} caracteres).` });

  try {
    const id = await ouvidoriaModel.criar({ nome, email, tipo, mensagem });

    // A manifestação já está salva. O e-mail sai em segundo plano: se falhar, nada muda
    // para o cidadão. O próprio serviço registra o motivo no log, sem expor dados pessoais.
    emailService.notificarOuvidoria({ id, nome, email, tipo, mensagem });
    
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
