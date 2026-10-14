const avisoModel = require('../models/avisoModel');

function validar(body) {
  const titulo = String(body.titulo || '').trim();
  const mensagem = String(body.mensagem || '').trim();
  if (!titulo) return { erro: 'Informe o título do aviso.' };
  if (!mensagem) return { erro: 'Informe a mensagem do aviso.' };
  return { dados: { titulo, mensagem } };
}

async function listar(req, res) {
  try {
    res.json(await avisoModel.listar());
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar os avisos.' });
  }
}

async function criar(req, res) {
  const { erro, dados } = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  try {
    res.status(201).json(await avisoModel.criar(dados));
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao salvar o aviso.' });
  }
}

async function atualizar(req, res) {
  const { erro, dados } = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  try {
    const existente = await avisoModel.buscarPorId(req.params.id);
    if (!existente) return res.status(404).json({ erro: 'Aviso não encontrado.' });
    res.json(await avisoModel.atualizar(req.params.id, dados));
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao atualizar o aviso.' });
  }
}

async function remover(req, res) {
  try {
    const apagou = await avisoModel.remover(req.params.id);
    if (!apagou) return res.status(404).json({ erro: 'Aviso não encontrado.' });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao apagar o aviso.' });
  }
}

module.exports = { listar, criar, atualizar, remover };
