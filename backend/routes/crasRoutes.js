const express = require('express');
const router = express.Router();
const crasController = require('../controllers/crasController');

// Aqui só define os caminhos e qual função do controller cada um chama.

router.get('/', crasController.listarTodos);
router.get('/parceiro', crasController.buscarParceiro);
router.get('/:id', crasController.buscarPorId);

module.exports = router;
