const express = require('express');
const router = express.Router();
const avisoController = require('../controllers/avisoController');
const { exigirLogin } = require('../middleware/auth');

router.get('/', avisoController.listar);                        // site público e painel
router.post('/', exigirLogin, avisoController.criar);
router.put('/:id', exigirLogin, avisoController.atualizar);
router.delete('/:id', exigirLogin, avisoController.remover);

module.exports = router;
