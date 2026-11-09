const nodemailer = require('nodemailer');
require('dotenv').config({ quiet: true });

// Variáveis que precisam estar preenchidas no .env do backend para o e-mail funcionar.
// Sem elas, a ouvidoria continua gravando no banco normalmente.
const VARIAVEIS_OBRIGATORIAS = ['MAIL_HOST', 'MAIL_USER', 'MAIL_PASS', 'MAIL_TO'];

function valor(nome) {
  return String(process.env[nome] || '').trim();
}

// Devolve só os NOMES das variáveis que faltam, nunca os valores
function variaveisFaltando() {
  return VARIAVEIS_OBRIGATORIAS.filter((nome) => !valor(nome));
}

function emailConfigurado() {
  return variaveisFaltando().length === 0;
}

// O Google mostra a senha de aplicativo em blocos separados por espaço.
// Tirar os espaços evita erro de login por causa de um copiar e colar.
function senhaDoEmail() {
  return valor('MAIL_PASS').replace(/\s+/g, '');
}

let transporte = null;

// Cria o transporte SMTP uma única vez e reaproveita nos próximos envios
function obterTransporte() {
  if (!transporte) {
    const seguro = valor('MAIL_SECURE').toLowerCase() === 'true'; // true só para a porta 465
    transporte = nodemailer.createTransport({
      host: valor('MAIL_HOST'),
      port: Number(valor('MAIL_PORT')) || 587,
      secure: seguro,
      // Na porta 587 a conexão precisa virar criptografada (STARTTLS) antes do login.
      // Se o servidor não oferecer isso, o envio falha em vez de mandar a senha sem proteção.
      requireTLS: !seguro && valor('MAIL_REQUIRE_TLS').toLowerCase() !== 'false',
      auth: { user: valor('MAIL_USER'), pass: senhaDoEmail() },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }
  return transporte;
}

module.exports = {
  emailConfigurado,
  variaveisFaltando,
  senhaDoEmail,
  obterTransporte,
};
