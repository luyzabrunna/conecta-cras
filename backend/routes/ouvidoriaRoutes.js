const express = require('express');
const router = express.Router();
const ouvidoriaController = require('../controllers/ouvidoriaController');
const { exigirLogin } = require('../middleware/auth');

router.post('/', ouvidoriaController.criar);                    // formulário de contato
router.get('/', exigirLogin, ouvidoriaController.listar);       // painel

module.exports = router;
