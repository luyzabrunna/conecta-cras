// ============================================================
// SERVIÇO — SCRIPT COMPLETO 
// Contém: menu mobile, acessibilidade (tamanho da fonte e
// alto contraste) e o conteúdo de cada serviço (?id=...).
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

// ---------- Página de serviço: lê ?id= da URL e monta o conteúdo ----------
// Ids aceitos (os mesmos dos botões "Saiba mais" do Index):
// cadastro, paif, scfv, crianca

// Ícones (os mesmos dos cards da página principal)
const ICONS = {
  cadastro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-3"/><path d="M9 11h6M9 15h6M9 19h4"/></svg>',
  paif: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.5-4.35-9.5-8.5C.5 9 2 5.5 5.5 5.5c2 0 3.5 1.2 4.5 2.7 1-1.5 2.5-2.7 4.5-2.7 3.5 0 5 3.5 3 7-3 4.15-9.5 8.5-9.5 8.5z"/></svg>',
  scfv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  crianca: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01M15 12h.01"/><path d="M8 15.5c1.2 1 2.6 1.5 4 1.5s2.8-.5 4-1.5"/><path d="M12 3a3 3 0 013 3c1.7 0 3 1.3 3 3v3a6 6 0 01-12 0V9c0-1.7 1.3-3 3-3a3 3 0 013-3z"/></svg>'
};
const CHECK_CIRCLE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.4L6.4 12l1.4-1.4 2.9 2.9 6-6L18.1 9l-7.3 7.4z"/></svg>';
const CHECK_BOX = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 12 10 17 19 7"/></svg>';

// Conteúdo de cada serviço (edite os textos aqui)
const SERVICES = {
  cadastro: {
    name: 'Cadastro Único',
    color: '#1B3A6B',
    tag: 'Benefício Federal',
    subtitle: 'CadÚnico / Programa Federal',
    about: [
      'O Cadastro Único para Programas Sociais (CadÚnico) é o instrumento do Governo Federal para identificar famílias de baixa renda e permitir seu acesso a dezenas de programas sociais.',
      'Para se cadastrar, a família deve ter renda mensal de até meio salário-mínimo por pessoa, ou renda total de até 3 salários-mínimos. O cadastro deve ser atualizado sempre que houver mudança na família.',
      'Com o CadÚnico atualizado, sua família pode ter acesso ao Bolsa Família, BPC, Tarifa Social de Energia e muitos outros benefícios gratuitos.'
    ],
    offers: ['Bolsa Família', 'BPC / LOAS', 'Tarifa Social de Energia', 'Carteira do Idoso'],
    docs: [
      'Certidão de nascimento de todos os membros da família',
      'RG, CPF, Título de Eleitor e Carteira de Trabalho do responsável',
      'Comprovante de endereço atualizado (conta de água, luz ou gás)',
      'Declaração escolar dos filhos',
      'Caderneta de vacinação das crianças',
      'Comprovante de renda de todos os membros adultos'
    ]
  },
  paif: {
    name: 'PAIF',
    color: '#E8600A',
    tag: 'Serviço SUAS',
    subtitle: 'Proteção e Atenção Integral à Família',
    about: [
      'O Serviço de Proteção e Atendimento Integral à Família (PAIF) é o principal serviço ofertado pelo CRAS. Oferece apoio personalizado para famílias em situação de vulnerabilidade ou risco social.',
      'O objetivo é fortalecer a função protetiva das famílias, prevenir a ruptura dos vínculos familiares e comunitários, e promover o acesso a direitos e serviços da rede socioassistencial.',
      'O atendimento inclui visitas domiciliares, grupos socioeducativos, orientações jurídicas e encaminhamentos à rede de serviços do município.'
    ],
    offers: ['Visitas domiciliares', 'Grupos socioeducativos', 'Encaminhamentos à rede', 'Acompanhamento familiar'],
    docs: [
      'Certidão de nascimento de todos os membros da família',
      'RG, CPF e Título de Eleitor do responsável',
      'Comprovante de endereço atualizado',
      'Número do NIS (NISS) — se já possuir'
    ]
  },
  scfv: {
    name: 'SCFV',
    color: '#2A7D4F',
    tag: 'Serviço SUAS',
    subtitle: 'Convivência e Fortalecimento de Vínculos',
    about: [
      'O Serviço de Convivência e Fortalecimento de Vínculos (SCFV) oferece atividades em grupo que promovem a convivência social e o desenvolvimento de habilidades de vida.',
      'As atividades são organizadas por faixa etária: crianças de 6 a 15 anos, adolescentes de 15 a 17 anos, e idosos com 60 anos ou mais. Cada grupo tem programação específica e adequada.',
      'As oficinas incluem artesanato, dança, música, esportes, informática e atividades culturais, sempre com foco no fortalecimento dos laços comunitários.'
    ],
    offers: ['Crianças de 6 a 15 anos', 'Jovens de 15 a 17 anos', 'Idosos com 60+ anos', 'Oficinas e atividades lúdicas'],
    docs: [
      'Comprovante de endereço atualizado',
      'Identidade (RG ou certidão de nascimento)'
    ]
  },
  crianca: {
    name: 'Criança Feliz',
    color: '#7B3FA0',
    tag: 'Programa Federal',
    subtitle: 'Programa Nacional Criança Feliz',
    about: [
      'O Programa Criança Feliz realiza visitas domiciliares a famílias com crianças de 0 a 3 anos que são beneficiárias do Bolsa Família, para apoiar o desenvolvimento infantil integral.',
      'Durante as visitas, os profissionais orientam as famílias sobre práticas de cuidado, estimulação cognitiva, emocional e motora das crianças, além de auxiliar no acesso à saúde e educação.',
      'O programa também atende gestantes beneficiárias do Bolsa Família, preparando-as para os cuidados com o recém-nascido e o acompanhamento do desenvolvimento nos primeiros anos de vida.'
    ],
    offers: ['Crianças de 0 a 3 anos', 'Gestantes beneficiárias', 'Visitas domiciliares', 'Estímulo ao desenvolvimento'],
    docs: [
      'CPF da criança',
      'Comprovante de inscrição no Cadastro Único (NIS)'
    ]
  }
};

// Descobre qual serviço mostrar (se o id for inválido, mostra o Cadastro Único)
let serviceId = new URLSearchParams(window.location.search).get('id');
if (!SERVICES[serviceId]) serviceId = 'cadastro';
const svc = SERVICES[serviceId];

// Cor do serviço (as variáveis --c e --c-soft são usadas no CSS)
const servicePage = document.getElementById('servicePage');
servicePage.style.setProperty('--c', svc.color);
servicePage.style.setProperty('--c-soft', svc.color + '14');
servicePage.style.setProperty('--c-border', svc.color + '33');
document.title = svc.name + ' — CRAS Vila São João';

// Banner
document.getElementById('svcIcon').innerHTML = ICONS[serviceId];
document.getElementById('svcTag').textContent = svc.tag;
document.getElementById('svcTitle').textContent = svc.name;
document.getElementById('svcSubtitle').textContent = svc.subtitle;

// Sobre o serviço (um parágrafo para cada texto)
const aboutBox = document.getElementById('svcAbout');
svc.about.forEach(text => {
  const p = document.createElement('p');
  p.textContent = text;
  aboutBox.appendChild(p);
});

// O que esse serviço oferece
const offersList = document.getElementById('svcOffers');
svc.offers.forEach(text => {
  const li = document.createElement('li');
  li.innerHTML = CHECK_CIRCLE;
  const span = document.createElement('span');
  span.textContent = text;
  li.appendChild(span);
  offersList.appendChild(li);
});

// Documentos necessários
const docsList = document.getElementById('svcDocs');
svc.docs.forEach(text => {
  const li = document.createElement('li');
  const box = document.createElement('span');
  box.className = 'doc-check';
  box.innerHTML = CHECK_BOX;
  const span = document.createElement('span');
  span.textContent = text;
  li.appendChild(box);
  li.appendChild(span);
  docsList.appendChild(li);
});

// Outros serviços (todos, menos o que está aberto)
const othersBox = document.getElementById('svcOthers');
Object.keys(SERVICES).filter(id => id !== serviceId).forEach(id => {
  const s = SERVICES[id];
  const a = document.createElement('a');
  a.className = 'other-card';
  a.href = 'servico.html?id=' + id;
  a.style.setProperty('--sc', s.color);
  a.style.setProperty('--sc-soft', s.color + '14');
  a.innerHTML = '<span class="other-icon" aria-hidden="true">' + ICONS[id] + '</span>' +
    '<span><span class="other-name"></span><span class="other-sub"></span></span>';
  a.querySelector('.other-name').textContent = s.name;
  a.querySelector('.other-sub').textContent = s.subtitle;
  othersBox.appendChild(a);
});
