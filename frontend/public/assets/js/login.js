// ============================================================
// SCRIPT DA TELA DE LOGIN (Área Administrativa) — arquivo próprio
// e independente. Contém: acessibilidade (fonte e alto contraste),
// mostrar/esconder senha e a validação do formulário de login.
//
// IMPORTANTE: ainda não existe uma rota de login no back-end, então
// a autenticação aqui é só uma SIMULAÇÃO no front-end, usando as
// credenciais de demonstração. Quando a rota real existir, troque o
// bloco marcado abaixo por uma chamada fetch('/api/login', ...).
// ============================================================

// ---------- Acessibilidade: tamanho da fonte (14px a 24px, de 2 em 2, padrão 18px) ----------
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

// ---------- Mostrar / esconder senha ----------
const senhaInput = document.getElementById('senha');
const toggleBtn = document.getElementById('togglePassword');
const eyeOpen = document.getElementById('eyeOpen');
const eyeClosed = document.getElementById('eyeClosed');

toggleBtn.addEventListener('click', () => {
  const mostrando = senhaInput.type === 'text';
  senhaInput.type = mostrando ? 'password' : 'text';
  toggleBtn.setAttribute('aria-pressed', String(!mostrando));
  toggleBtn.setAttribute('aria-label', mostrando ? 'Mostrar senha' : 'Esconder senha');
  eyeOpen.style.display = mostrando ? '' : 'none';
  eyeClosed.style.display = mostrando ? 'none' : '';
});

// ---------- Validação e login (simulado) ----------
const form = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const campoEmail = document.getElementById('email');
const campoSenha = document.getElementById('senha');

// Credenciais de demonstração (front-end apenas, sem segurança real)
const DEMO_EMAIL = 'admin@cras.gov.br';
const DEMO_SENHA = 'cras2026';

function marcarValidade(campo, valido){
  const wrapper = campo.closest('.form-field');
  wrapper.classList.toggle('invalid', !valido);
  return valido;
}

function validarCampos(){
  const emailOk = marcarValidade(campoEmail, campoEmail.value.trim() !== '');
  const senhaOk = marcarValidade(campoSenha, campoSenha.value.trim() !== '');
  return emailOk && senhaOk;
}

[campoEmail, campoSenha].forEach(campo => {
  campo.addEventListener('input', () => {
    const wrapper = campo.closest('.form-field');
    if (!wrapper.classList.contains('invalid')) return;
    marcarValidade(campo, campo.value.trim() !== '');
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  loginError.hidden = true;

  // 1) Primeiro confere se os campos foram preenchidos
  if (!validarCampos()) {
    const primeiroErro = form.querySelector('.form-field.invalid');
    if (primeiroErro) primeiroErro.querySelector('input').focus();
    return;
  }

  // 2) Depois confere as credenciais
  //    >>> TROCAR por uma chamada real à API quando o back-end tiver a rota de login <<<
  const emailDigitado = campoEmail.value.trim().toLowerCase();
  const senhaDigitada = campoSenha.value;

  if (emailDigitado === DEMO_EMAIL && senhaDigitada === DEMO_SENHA) {
    // Login "válido": guarda uma flag simples pra outras telas do admin
    // saberem que a pessoa passou pela tela de login (ainda sem token real).
    sessionStorage.setItem('cras_admin_logado', 'true');
    // Quando o painel administrativo existir, o redirecionamento é para ele:
    window.location.href = 'dashboard.html';
  } else {
    loginError.hidden = false;
    campoSenha.value = '';
    campoSenha.focus();
  }
});