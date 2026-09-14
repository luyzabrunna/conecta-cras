// ============================================================
// SCRIPT DA PÁGINA DE EVENTOS — arquivo próprio e independente
//  Contém: menu mobile,
// acessibilidade (fonte e alto contraste) e o filtro de eventos
// por mês, que é exclusivo desta página.
// ============================================================

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

// Se a tela for redimensionada para o tamanho de desktop (>1023px)
// com o menu mobile aberto, fecha ele para não ficar "preso" aberto
window.addEventListener('resize', () => {
  if (window.innerWidth > 1023) closeMobileMenu();
});

// ---------- Acessibilidade: tamanho da fonte (14px a 24px, de 2 em 2, padrão 18px) ----------
// Importante: todo o site usa a unidade "rem", que é sempre relativa
// ao tamanho de fonte do elemento <html> (a raiz), e NÃO ao <body>.
// Por isso alteramos o font-size do <html> aqui — assim o texto do
// site inteiro aumenta/diminui de verdade quando a pessoa clica em A+/A-.
const root = document.documentElement;
let fontSize = 18;
const MIN_FONT = 14, MAX_FONT = 24, STEP = 2;

function applyFontSize(){
  root.style.fontSize = fontSize + 'px';
}

// Botão "A+": aumenta a fonte (sem passar do máximo de 24px)
document.getElementById('fontInc').addEventListener('click', () => {
  fontSize = Math.min(MAX_FONT, fontSize + STEP);
  applyFontSize();
});

// Botão "A-": diminui a fonte (sem passar do mínimo de 14px)
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
// Ao clicar, adiciona/remove a classe "contrast" no <body>.
// O visual do alto contraste (cores pretas/amarelas) é definido
// no CSS através dos seletores "body.contrast { ... }".
const contrastBtn = document.getElementById('contrastToggle');
contrastBtn.addEventListener('click', () => {
  const on = document.body.classList.toggle('contrast');
  contrastBtn.setAttribute('aria-pressed', String(on));
});

// ---------- Página de Eventos: filtro por mês ----------
// Pega todos os botões de filtro ("Todos os Meses", "Setembro", "Outubro")
// e todos os cards de evento da lista, além da mensagem de "lista vazia".
const monthFilters = document.querySelectorAll('.month-filter');
const eventCards = document.querySelectorAll('#eventsList .event-card');
const eventsEmpty = document.getElementById('eventsEmpty');

// Só ativa o filtro se os elementos realmente existirem na página
// (evita erro caso este script seja carregado em outra tela por engano)
if (monthFilters.length && eventCards.length) {
  monthFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove o estado "ativo" de todos os botões de filtro...
      monthFilters.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      // ...e marca como ativo só o botão que foi clicado
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Cada card de evento tem um atributo data-month (ex: "09" ou "10").
      // "todos" mostra tudo; qualquer outro valor mostra só os que baterem.
      const month = btn.getAttribute('data-month');
      let visibleCount = 0;
      eventCards.forEach(card => {
        const match = month === 'todos' || card.getAttribute('data-month') === month;
        card.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });

      // Se nenhum evento bateu com o filtro, mostra a mensagem de "vazio"
      if (eventsEmpty) eventsEmpty.hidden = visibleCount > 0;
    });
  });
}