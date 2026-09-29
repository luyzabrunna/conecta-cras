// ---------- Menu mobile (aparece abaixo do cabeçalho em telas pequenas) ----------
const menuToggle = document.getElementById('menuToggle');   // botão "hambúrguer"
const mobileNav = document.getElementById('mobileNav');     // painel do menu mobile
const menuIconOpen = document.getElementById('iconMenu');   // ícone de "abrir" (3 linhas)
const menuIconClose = document.getElementById('iconClose'); // ícone de "fechar" (X)

// Fecha o menu mobile e volta o ícone para "hambúrguer"
function closeMobileMenu(){
  mobileNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuIconOpen.style.display = '';
  menuIconClose.style.display = 'none';
}

// Abre/fecha o menu mobile ao clicar no botão do cabeçalho
function toggleMobileMenu(){
  const isOpen = mobileNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuIconOpen.style.display = isOpen ? 'none' : '';
  menuIconClose.style.display = isOpen ? '' : 'none';
}

menuToggle.addEventListener('click', toggleMobileMenu);

// Fecha o menu automaticamente ao clicar em qualquer link dele
document.querySelectorAll('.mobile-nav a').forEach(a => {
  a.addEventListener('click', closeMobileMenu);
});

// Se a tela virar tamanho de desktop (>1023px) com o menu aberto, fecha ele
window.addEventListener('resize', () => {
  if (window.innerWidth > 1023) closeMobileMenu();
});

// ---------- Acessibilidade: tamanho da fonte (14px a 24px, de 2 em 2, padrão 18px) ----------
// Todo o site usa "rem", relativo ao font-size do <html>. Por isso
// alteramos o <html> aqui: o texto da página inteira escala junto.
const root = document.documentElement;
let fontSize = 18;
const MIN_FONT = 14, MAX_FONT = 24, STEP = 2;

function applyFontSize(){
  root.style.fontSize = fontSize + 'px';
}

// Botão "A+": aumenta a fonte (máximo 24px)
document.getElementById('fontInc').addEventListener('click', () => {
  fontSize = Math.min(MAX_FONT, fontSize + STEP);
  applyFontSize();
});

// Botão "A-": diminui a fonte (mínimo 14px)
document.getElementById('fontDec').addEventListener('click', () => {
  fontSize = Math.max(MIN_FONT, fontSize - STEP);
  applyFontSize();
});

// Botão "A": volta ao tamanho padrão (18px)
document.getElementById('fontReset').addEventListener('click', () => {
  fontSize = 18;
  applyFontSize();
});

// ---------- Acessibilidade: alto contraste ----------
// Adiciona/remove a classe "contrast" no <body>; o visual fica no
// CSS, nos seletores "body.contrast { ... }".
const contrastBtn = document.getElementById('contrastToggle');
contrastBtn.addEventListener('click', () => {
  const on = document.body.classList.toggle('contrast');
  contrastBtn.setAttribute('aria-pressed', String(on));
});

// ---------- FAQ: acordeão (só uma pergunta aberta por vez) ----------
const faqItems = document.querySelectorAll('.faq-item');

// Abre ou fecha um item: classe .open, aria-expanded e o atributo hidden da resposta
function setFaqOpen(item, open){
  item.classList.toggle('open', open);
  item.querySelector('.faq-q').setAttribute('aria-expanded', String(open));
  item.querySelector('.faq-a').hidden = !open;
}

faqItems.forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const willOpen = !item.classList.contains('open');
    faqItems.forEach(i => setFaqOpen(i, false)); // fecha todas
    setFaqOpen(item, willOpen);                  // abre a clicada (ou deixa fechada)
  });
});
