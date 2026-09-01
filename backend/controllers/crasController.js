const crasModel = require('../models/crasModel');

// Cada função aqui recebe a requisição (req) e devolve uma resposta (res).
// A lógica de "o que fazer" fica aqui; a query em si fica no model.

async function listarTodos(req, res) {
  try {
    const cras = await crasModel.listarTodos();
    res.json(cras);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar os CRAS' });
  }
}

async function buscarPorId(req, res) {
  try {
    const cras = await crasModel.buscarPorId(req.params.id);
    if (!cras) {
      return res.status(404).json({ erro: 'CRAS não encontrado' });
    }
    res.json(cras);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar o CRAS' });
  }
}

async function buscarParceiro(req, res) {
  try {
    const cras = await crasModel.buscarParceiro();
    res.json(cras);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar o CRAS parceiro' });
  }
}

module.exports = {
  listarTodos,
  buscarPorId,
  buscarParceiro,
};
