// ============================================================
// SCRIPT DA TELA DE LOGIN (Área Administrativa) — arquivo próprio
// e independente. Contém: acessibilidade (fonte e alto contraste),
// mostrar/esconder senha e a validação do formulário de login.
// com a API (POST /api/login) e guarda o token da sessão.
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
const loginBtn = document.getElementById('loginBtn');
const campoEmail = document.getElementById('email');
const campoSenha = document.getElementById('senha');

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

function mostrarErro(texto){
  loginError.querySelector('span').textContent = texto;
  loginError.hidden = false;
}

[campoEmail, campoSenha].forEach(campo => {
  campo.addEventListener('input', () => {
    const wrapper = campo.closest('.form-field');
    if (!wrapper.classList.contains('invalid')) return;
    marcarValidade(campo, campo.value.trim() !== '');
  });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginError.hidden = true;

  // 1) Primeiro confere se os campos foram preenchidos
  if (!validarCampos()) {
    const primeiroErro = form.querySelector('.form-field.invalid');
    if (primeiroErro) primeiroErro.querySelector('input').focus();
    return;
  }

  // 2) Depois confere as credenciais
  loginBtn.disabled = true;
  try {
    const resposta = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: campoEmail.value.trim(),
        senha: campoSenha.value,
      }),
    });
    const dados = await resposta.json().catch(() => ({}));

    if (resposta.ok && dados.token) {
      // Guarda o token da sessão: o dashboard envia ele em cada pedido à API
      sessionStorage.setItem('cras_admin_token', dados.token);
      window.location.href = 'dashboard.html';
      return;
    }

    mostrarErro(dados.erro || 'E-mail ou senha incorretos.');
    campoSenha.value = '';
    campoSenha.focus();
  } catch (erro) {
    mostrarErro('Não foi possível conectar ao servidor. Tente novamente.');
  } finally {
    loginBtn.disabled = false;
  }
});