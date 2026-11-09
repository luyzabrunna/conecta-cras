const { emailConfigurado, variaveisFaltando, obterTransporte } = require('../config/mail');
const { emailValido } = require('../utils/validacao');

const NOME_REMETENTE = 'CRAS Ouvidoria';

const ROTULOS = {
  sugestao: 'Sugestão',
  reclamacao: 'Reclamação',
  elogio: 'Elogio',
  duvida: 'Dúvida',
  outro: 'Outro',
};

// Evita que o texto digitado no formulário vire HTML dentro do e-mail
function escapar(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Deixa o texto em uma linha só, para usar em assunto e nome sem quebrar o cabeçalho do e-mail
function umaLinha(texto, limite = 80) {
  return String(texto).replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, limite);
}

function dataHoraAgora() {
  try {
    return new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  } catch (erro) {
    return new Date().toISOString();
  }
}

// Transforma o erro do envio em uma frase útil para o log, sem despejar o objeto inteiro
function descreverErro(erro) {
  const codigo = [erro.code, erro.responseCode].filter(Boolean).join(' ') || 'ERRO';
  const detalhe = String(erro.message || '').split('\n')[0].slice(0, 200);
  let dica = '';
  if (erro.code === 'EAUTH') {
    dica = ' Dica: confira MAIL_USER e se MAIL_PASS é a senha de aplicativo do Gmail, não a senha normal.';
  } else if (['ECONNECTION', 'ETIMEDOUT', 'ESOCKET', 'EDNS', 'ECONNREFUSED'].includes(erro.code)) {
    dica = ' Dica: o servidor SMTP não respondeu. Confira MAIL_HOST, MAIL_PORT e a conexão com a internet.';
  }
  return `${codigo}: ${detalhe}.${dica}`;
}

// Monta e envia o e-mail de uma manifestação. Lança erro se o envio falhar.
// Retorna true se enviou e false se o e-mail não está configurado.
async function enviarOuvidoria({ id, nome, email, tipo, mensagem }) {
  if (!emailConfigurado()) {
    console.warn(
      `[ouvidoria] E-mail não configurado, faltando: ${variaveisFaltando().join(', ')}. ` +
        `Manifestação ${id ? '#' + id + ' ' : ''}salva apenas no banco.`
    );
    return false;
  }

  const rotulo = ROTULOS[tipo] || 'Mensagem';
  const nomeLinha = umaLinha(nome);
  // Só permite responder diretamente ao cidadão se o e-mail dele for válido
  const emailCidadao = email && emailValido(String(email).trim()) ? String(email).trim() : null;
  const contato = emailCidadao || 'não informado';
  const protocolo = id ? `#${id}` : '';
  const dataHora = dataHoraAgora();

  const info = await obterTransporte().sendMail({
    from: { name: NOME_REMETENTE, address: process.env.MAIL_USER.trim() },
    to: process.env.MAIL_TO.trim(),
    replyTo: emailCidadao ? { name: nomeLinha, address: emailCidadao } : undefined,
    subject: umaLinha(`[Ouvidoria] ${rotulo} ${protocolo} de ${nomeLinha}`, 150),
    text:
      `Nova manifestação pela Ouvidoria do site\n\n` +
      `Protocolo: ${protocolo || 'não se aplica'}\n` +
      `Recebida em: ${dataHora}\n` +
      `Tipo: ${rotulo}\n` +
      `Nome: ${nome}\n` +
      `E-mail: ${contato}\n\n` +
      `Mensagem:\n${mensagem}\n` +
      (emailCidadao ? `\nPara responder, use o botão Responder do seu e-mail.\n` : ''),
    html:
      `<h2>Nova manifestação pela Ouvidoria do site</h2>` +
      `<p><strong>Protocolo:</strong> ${escapar(protocolo || 'não se aplica')}<br>` +
      `<strong>Recebida em:</strong> ${escapar(dataHora)}<br>` +
      `<strong>Tipo:</strong> ${escapar(rotulo)}<br>` +
      `<strong>Nome:</strong> ${escapar(nome)}<br>` +
      `<strong>E-mail:</strong> ${escapar(contato)}</p>` +
      `<h3>Mensagem</h3>` +
      `<p style="white-space:pre-wrap">${escapar(mensagem)}</p>` +
      (emailCidadao ? `<p><em>Para responder, use o botão Responder do seu e-mail.</em></p>` : ''),
  });

  if (info.rejected && info.rejected.length > 0) {
    throw Object.assign(new Error('O servidor de e-mail recusou o destinatário.'), { code: 'EREJECTED' });
  }
  return true;
}

// Versão usada pelo controller: NUNCA lança erro e só escreve no log o necessário
// (número da manifestação e o motivo técnico), sem nome, e-mail ou texto do cidadão.
async function notificarOuvidoria(dados) {
  try {
    const enviou = await enviarOuvidoria(dados);
    if (enviou) console.log(`[ouvidoria] E-mail da manifestação #${dados.id} enviado.`);
  } catch (erro) {
    console.error(`[ouvidoria] Falha ao enviar o e-mail da manifestação #${dados.id}. ${descreverErro(erro)}`);
  }
}

// Confere conexão e login no servidor de e-mail sem enviar nada
async function verificarConexao() {
  if (!emailConfigurado()) return { ok: false, motivo: `faltando: ${variaveisFaltando().join(', ')}` };
  try {
    await obterTransporte().verify();
    return { ok: true };
  } catch (erro) {
    return { ok: false, motivo: descreverErro(erro) };
  }
}

module.exports = { enviarOuvidoria, notificarOuvidoria, verificarConexao, descreverErro };
