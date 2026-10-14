
const eventoModel = require('../models/eventoModel');
const { dataValida } = require('../utils/validacao');

const STATUS_VALIDOS = ['Ativo', 'Rascunho', 'Encerrado'];

function validar(body) {
  const nome = String(body.nome || '').trim();
  const data = String(body.data || '').trim();
  const status = body.status || 'Ativo';
  const descricao = String(body.descricao || '').trim();
  const categoria = String(body.categoria || '').trim();
  const horario = String(body.horario || '').trim();
  const local = String(body.local || '').trim();

  if (!nome) {
    return { erro: 'Informe o nome do evento.' };
  }

  if (!dataValida(data)) {
    return {
      erro: 'Informe uma data válida no formato AAAA-MM-DD.'
    };
  }

  if (!STATUS_VALIDOS.includes(status)) {
    return { erro: 'Status inválido.' };
  }

  return {
    dados: {
      nome,
      data,
      status,
      descricao,
      categoria,
      horario,
      local
    }
  };
}

async function listarPublicos(req, res) {
  try {
    const eventos = await eventoModel.listarAtivos();
    res.json(eventos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar os eventos.' });
  }
}

async function listarTodos(req, res) {
  try {
    const eventos = await eventoModel.listarTodos();
    res.json(eventos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar os eventos.' });
  }
}

async function criar(req, res) {
  const { erro, dados } = validar(req.body);

  if (erro) {
    return res.status(400).json({ erro });
  }

  try {
    const evento = await eventoModel.criar(dados);
    res.status(201).json(evento);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao salvar o evento.' });
  }
}

async function atualizar(req, res) {
  const { erro, dados } = validar(req.body);

  if (erro) {
    return res.status(400).json({ erro });
  }

  try {
    const existente = await eventoModel.buscarPorId(req.params.id);

    if (!existente) {
      return res.status(404).json({ erro: 'Evento não encontrado.' });
    }

    const evento = await eventoModel.atualizar(req.params.id, dados);
    res.json(evento);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar o evento.' });
  }
}

async function remover(req, res) {
  try {
    const apagou = await eventoModel.remover(req.params.id);

    if (!apagou) {
      return res.status(404).json({ erro: 'Evento não encontrado.' });
    }

    res.status(204).end();
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao apagar o evento.' });
  }
}

module.exports = {
  listarPublicos,
  listarTodos,
  criar,
  atualizar,
  remover
};
