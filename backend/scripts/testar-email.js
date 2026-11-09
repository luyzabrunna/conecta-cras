// Teste do envio de e-mail da Ouvidoria, sem precisar do banco nem do formulário.
//
// Como usar, na pasta backend ou dentro do container:
//   node scripts/testar-email.js               confere a configuração, o login e envia um e-mail de teste
//   node scripts/testar-email.js --so-verificar confere configuração e login, sem enviar nada
//
// No Docker:
//   docker compose exec backend node scripts/testar-email.js
//
// A senha nunca é mostrada, só se está preenchida.

const { emailConfigurado, variaveisFaltando, senhaDoEmail } = require('../config/mail');
const { enviarOuvidoria, verificarConexao, descreverErro } = require('../services/emailService');

const soVerificar = process.argv.includes('--so-verificar');
const mostrar = (nome) => `${nome}=${process.env[nome] ? process.env[nome].trim() : '(vazia)'}`;

(async () => {
  console.log('--- Configuração de e-mail que o backend enxerga ---');
  ['MAIL_HOST', 'MAIL_PORT', 'MAIL_SECURE', 'MAIL_USER', 'MAIL_TO'].forEach((n) => console.log(mostrar(n)));
  const tamanho = senhaDoEmail().length;
  console.log(`MAIL_PASS=${tamanho ? `definida (${tamanho} caracteres)` : '(VAZIA)'}`);

  if (!emailConfigurado()) {
    console.error(`\nFALTANDO: ${variaveisFaltando().join(', ')}`);
    console.error('Preencha no backend/.env e recrie o container (veja o passo a passo).');
    process.exit(1);
  }
  if (tamanho && tamanho !== 16) {
    console.warn('\nAviso: a senha de aplicativo do Gmail tem 16 letras. Confira se copiou inteira, sem aspas.');
  }

  console.log('\n--- Conexão e login no servidor de e-mail ---');
  const conexao = await verificarConexao();
  if (!conexao.ok) {
    console.error(`FALHOU: ${conexao.motivo}`);
    process.exit(1);
  }
  console.log('OK: conexão criptografada e login aceitos.');

  if (soVerificar) {
    console.log('\nNada foi enviado (--so-verificar).');
    return;
  }

  console.log('\n--- Enviando e-mail de teste ---');
  try {
    await enviarOuvidoria({
      id: 0,
      nome: 'Teste do sistema',
      email: '',
      tipo: 'outro',
      mensagem: 'Este é um e-mail de teste do Conecta CRAS. Se você leu isso na caixa de entrada, a integração está funcionando.',
    });
    console.log(`OK: e-mail enviado para ${process.env.MAIL_TO.trim()}. Agora confira a caixa de entrada e o spam.`);
  } catch (erro) {
    console.error(`FALHOU: ${descreverErro(erro)}`);
    process.exit(1);
  }
})();
