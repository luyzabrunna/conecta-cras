const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const { exigirLogin } = require('../middleware/auth');

router.get('/', eventoController.listarPublicos);               // site público
router.get('/admin', exigirLogin, eventoController.listarTodos); // painel
router.post('/', exigirLogin, eventoController.criar);
router.put('/:id', exigirLogin, eventoController.atualizar);
router.delete('/:id', exigirLogin, eventoController.remover);

module.exports = router;
