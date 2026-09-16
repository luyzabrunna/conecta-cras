// ============================================================
// SCRIPT DA PÁGINA DE CONTATO — arquivo próprio e independente
// (não depende do script.js da Home nem do eventos.js). Contém:
// menu mobile, acessibilidade (fonte e alto contraste) e a
// validação do formulário de Ouvidoria / Sugestões.
// ============================================================

// ---------- Menu mobile (aparece abaixo do cabeçalho em telas pequenas) ----------
const menuToggle = document.getElementById('menuToggle');   // botão "hambúrguer"
const mobileNav = document.getElementById('mobileNav');     // painel do menu mobile
const menuIconOpen = document.getElementById('iconMenu');   // ícone de "abrir" (3 linhas)
const menuIconClose = document.getElementById('iconClose'); // ícone de "fechar" (X)

function closeMobileMenu(){
  mobileNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuIconOpen.style.display = '';
  menuIconClose.style.display = 'none';
}
function toggleMobileMenu(){
  const isOpen = mobileNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuIconOpen.style.display = isOpen ? 'none' : '';
  menuIconClose.style.display = isOpen ? '' : 'none';
}
menuToggle.addEventListener('click', toggleMobileMenu);
document.querySelectorAll('.mobile-nav a').forEach(a => {
  a.addEventListener('click', closeMobileMenu);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 1023) closeMobileMenu();
});

// ---------- Acessibilidade: tamanho da fonte (14px a 24px, de 2 em 2, padrão 18px) ----------
// Todo o site usa "rem", que é relativo ao <html> (raiz) — por isso
// mudamos o font-size do <html> aqui, e não do <body>.
const root = document.documentElement;
let fontSize = 18;
const MIN_FONT = 14, MAX_FONT = 24, STEP = 2;

function applyFontSize(){
  root.style.fontSize = fontSize + 'px';
}
document.getElementById('fontInc').addEventListener('click', () => {
  fontSize = Math.min(MAX_FONT, fontSize + STEP);
  applyFontSize();
});
document.getElementById('fontDec').addEventListener('click', () => {
  fontSize = Math.max(MIN_FONT, fontSize - STEP);
  applyFontSize();
});
document.getElementById('fontReset').addEventListener('click', () => {
  fontSize = 18;
  applyFontSize();
});

// ---------- Acessibilidade: alto contraste ----------
const contrastBtn = document.getElementById('contrastToggle');
contrastBtn.addEventListener('click', () => {
  const on = document.body.classList.toggle('contrast');
  contrastBtn.setAttribute('aria-pressed', String(on));
});

// ============================================================
// FORMULÁRIO DE OUVIDORIA — validação
// Campos obrigatórios (com *): nome, tipo de mensagem e mensagem.
// O e-mail é opcional, mas se for preenchido precisa ter um formato válido.
// O formulário SÓ é considerado "enviado" se passar em todas as regras;
// caso contrário, a mensagem NÃO é enviada e o campo com problema é
// destacado em vermelho com o aviso embaixo dele.
// ============================================================
const form = document.getElementById('ouvidoriaForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

const campoNome = document.getElementById('nome');
const campoEmail = document.getElementById('email');
const campoTipo = document.getElementById('tipo');
const campoMensagem = document.getElementById('mensagem');

// Marca (ou desmarca) um campo como inválido, mostrando/escondendo o erro
function marcarValidade(campo, valido){
  const wrapper = campo.closest('.form-field');
  wrapper.classList.toggle('invalid', !valido);
  return valido;
}

// Valida um e-mail apenas se algo foi digitado (o campo é opcional)
function emailValido(valor){
  if (valor.trim() === '') return true; // vazio é permitido, é opcional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim());
}

// Confere todos os campos obrigatórios de uma vez.
// Retorna true só se TODOS estiverem corretos.
function validarFormulario(){
  const nomeOk = marcarValidade(campoNome, campoNome.value.trim() !== '');
  const emailOk = marcarValidade(campoEmail, emailValido(campoEmail.value));
  const tipoOk = marcarValidade(campoTipo, campoTipo.value !== '');
  const mensagemOk = marcarValidade(campoMensagem, campoMensagem.value.trim() !== '');

  return nomeOk && emailOk && tipoOk && mensagemOk;
}

// Assim que a pessoa começa a corrigir um campo com erro, tira o
// destaque vermelho na hora (sem precisar clicar em enviar de novo)
[campoNome, campoEmail, campoTipo, campoMensagem].forEach(campo => {
  const evento = campo.tagName === 'SELECT' ? 'change' : 'input';
  campo.addEventListener(evento, () => {
    const wrapper = campo.closest('.form-field');
    if (!wrapper.classList.contains('invalid')) return;
    if (campo === campoEmail) {
      marcarValidade(campoEmail, emailValido(campoEmail.value));
    } else if (campo.tagName === 'SELECT') {
      marcarValidade(campo, campo.value !== '');
    } else {
      marcarValidade(campo, campo.value.trim() !== '');
    }
  });
});

form.addEventListener('submit', (event) => {
  // Sempre impede o comportamento padrão do navegador primeiro
  event.preventDefault();

  const valido = validarFormulario();
  if (!valido) {
    // Existe pelo menos um campo obrigatório vazio/errado:
    // a mensagem NÃO é enviada. Rola a tela até o primeiro erro.
    const primeiroErro = form.querySelector('.form-field.invalid');
    if (primeiroErro) {
      primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const campoComErro = primeiroErro.querySelector('input, select, textarea');
      if (campoComErro) campoComErro.focus();
    }
    return;
  }

  // Tudo certo — aqui é o ponto para, no futuro, enviar os dados
  // para a API real do backend (routes/crasRoutes.js), por exemplo:
  //
  // fetch('/api/ouvidoria', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     nome: campoNome.value.trim(),
  //     email: campoEmail.value.trim(),
  //     tipo: campoTipo.value,
  //     mensagem: campoMensagem.value.trim(),
  //   }),
  // });
  //
  // Por enquanto, como ainda não há back-end conectado nesta tela,
  // só mostramos a confirmação visual de que o formulário é válido.
  submitBtn.disabled = true;
  form.querySelectorAll('.form-field').forEach(f => f.style.display = 'none');
  formSuccess.hidden = false;
  submitBtn.hidden = true;
  form.querySelector('.form-footnote').hidden = true;
});