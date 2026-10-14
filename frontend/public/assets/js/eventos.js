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

/* ---------- Eventos públicos: integração com a API ---------- */

const eventsList = document.getElementById('eventsList');
const eventsEmpty = document.getElementById('eventsEmpty');
const monthFilterContainer = document.querySelector('.month-filter')?.parentElement;

let eventosCarregados = [];

const nomesMeses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Formata a data sem correr o risco de mudar o dia por causa do fuso horário.
function formatarData(data) {
  const partes = String(data).slice(0, 10).split('-');

  if (partes.length !== 3) return String(data);

  const [ano, mes, dia] = partes;
  return `${dia}/${mes}/${ano}`;
}


function criarCartao(evento) {
  const cartao = document.createElement('article');
  cartao.className = 'event-card';

  const dataTexto = String(evento.data || '').slice(0, 10);
  const [ano, mes, dia] = dataTexto.split('-');
  const numeroMes = Number(mes);

  cartao.dataset.month = mes || '';

  // Cores das categorias
  const coresCategorias = {
    Atendimento: '#1B3A6B',
    Oficina: '#2A7D4F',
    Saúde: '#059669',
    Evento: '#E8600A'
  };

  const categoria = String(evento.categoria || '').trim();
  const corCategoria = coresCategorias[categoria] || '#1B3A6B';

  // Bloco da data
  const blocoData = document.createElement('div');
  blocoData.className = 'event-date';
  blocoData.style.backgroundColor = corCategoria;

  const diaElemento = document.createElement('span');
  diaElemento.className = 'day';
  diaElemento.textContent = dia || '--';

  const mesElemento = document.createElement('span');
  mesElemento.className = 'mon';
  mesElemento.textContent =
    numeroMes >= 1 && numeroMes <= 12
      ? nomesMeses[numeroMes - 1].slice(0, 3)
      : '';

  blocoData.append(diaElemento, mesElemento);

  // Informações do evento
  const informacoes = document.createElement('div');
  informacoes.className = 'event-info';

  // Categoria e data completa
  const linhaEtiqueta = document.createElement('div');
  linhaEtiqueta.className = 'event-tag-row';

  if (categoria) {
    const etiqueta = document.createElement('span');
    etiqueta.className = 'event-category';
    etiqueta.textContent = categoria;
    etiqueta.style.backgroundColor = corCategoria;
    linhaEtiqueta.appendChild(etiqueta);
  }

  const dataCompleta = document.createElement('span');
  dataCompleta.className = 'event-fulldate';
  dataCompleta.textContent = dataTexto
    ? `${dia} de ${nomesMeses[numeroMes - 1] || ''} de ${ano}`
    : 'Data a confirmar';

  linhaEtiqueta.appendChild(dataCompleta);

  // Título
  const titulo = document.createElement('h3');
  titulo.textContent = evento.nome || 'Evento sem título';

  // Horário e local
  const meta = document.createElement('div');
  meta.className = 'event-meta';

  if (evento.horario) {
    const horario = document.createElement('span')

    const iconeRelogio = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconeRelogio.setAttribute('viewBox', '0 0 24 24');
    iconeRelogio.setAttribute('fill', '#E8600A');

    const desenhoRelogio = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    desenhoRelogio.setAttribute('d', 'M12 2a10 10 0 100 20 10 10 0 000-20zm.75 5v5.4l4 2.3-.9 1.5-4.85-2.8V7h1.75z');

    iconeRelogio.appendChild(desenhoRelogio);
    horario.append(iconeRelogio, document.createTextNode(evento.horario));
    meta.appendChild(horario);

  }

  if (evento.local) {
    const local = document.createElement('span');
    
    const iconeLocal = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconeLocal.setAttribute('viewBox', '0 0 24 24');
    iconeLocal.setAttribute('fill', '#E8600A');
    
    const desenhoLocal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    desenhoLocal.setAttribute('d', 'M12 2C7 2 4 5.6 4 9.6 4 15 12 22 12 22s8-7 8-12.4C20 5.6 17 2 12 2zm0 10a2.4 2.4 0 110-4.8 2.4 2.4 0 010 4.8z');
    
    iconeLocal.appendChild(desenhoLocal);
    local.append(iconeLocal, document.createTextNode(evento.local));
    meta.appendChild(local);

  }

  // Descrição
  const descricao = document.createElement('p');
  descricao.className = 'event-desc';
  descricao.textContent =
    evento.descricao || 'Mais informações em breve.';

  informacoes.append(linhaEtiqueta, titulo, meta, descricao);
  cartao.append(blocoData, informacoes);

  return cartao;
}

// Aplica o filtro selecionado.
function aplicarFiltro(mesSelecionado) {
  const cartoes = eventsList.querySelectorAll('.event-card');
  let quantidadeVisivel = 0;

  cartoes.forEach(cartao => {
    const corresponde =
      mesSelecionado === 'todos' ||
      cartao.dataset.month === mesSelecionado;

    cartao.hidden = !corresponde;

    if (corresponde) quantidadeVisivel++;
  });

  if (eventsEmpty) {
    eventsEmpty.hidden = quantidadeVisivel > 0;
    eventsEmpty.textContent =
      'Nenhum evento encontrado para este mês.';
  }
}

// Mantém os filtros existentes e adiciona os meses necessários.
function prepararFiltros(eventos) {
  if (!monthFilterContainer) return;

  const filtrosExistentes = [
    ...monthFilterContainer.querySelectorAll('.month-filter')
  ];

  const filtroTodos = filtrosExistentes.find(
    botao => botao.dataset.month === 'todos'
  );

  if (!filtroTodos) return;

  const meses = [...new Set(
    eventos
      .map(evento => String(evento.data).slice(0, 10).split('-')[1])
      .filter(mes => /^\d{2}$/.test(mes) &&
        Number(mes) >= 1 && Number(mes) <= 12)
  )].sort();

  meses.forEach(mes => {
    const jaExiste = monthFilterContainer.querySelector(
      `.month-filter[data-month="${mes}"]`
    );

    if (jaExiste) return;

    const botao = filtroTodos.cloneNode(true);
    botao.dataset.month = mes;
    botao.textContent = nomesMeses[Number(mes) - 1];
    botao.classList.remove('active');
    botao.setAttribute('aria-selected', 'false');

    monthFilterContainer.appendChild(botao);
  });
}

// Carrega os eventos cadastrados no banco por meio do backend.
async function carregarEventos() {
  if (!eventsList) return;

  try {
    const resposta = await fetch('/api/eventos');

    if (!resposta.ok) {
      throw new Error(`A API respondeu com status ${resposta.status}`);
    }

    const eventos = await resposta.json();

    if (!Array.isArray(eventos)) {
      throw new Error('A resposta da API não contém uma lista de eventos.');
    }

    eventosCarregados = eventos;

    // Remove os eventos de exemplo escritos diretamente no HTML.
    eventsList.querySelectorAll('.event-card').forEach(cartao => {
      cartao.remove();
    });

    // Cria os cartões com os dados vindos do banco.
    eventosCarregados.forEach(evento => {
      eventsList.insertBefore(
        criarCartao(evento),
        eventsEmpty || null
      );
    });

    prepararFiltros(eventosCarregados);
    aplicarFiltro('todos');
  } catch (erro) {
    console.error('Erro ao carregar eventos:', erro);

    if (eventsEmpty) {
      eventsEmpty.textContent =
        'Não foi possível carregar os eventos. Tente novamente mais tarde.';
      eventsEmpty.hidden = false;
    }
  }
}

// Delegação de eventos: funciona também com os filtros criados dinamicamente.
if (monthFilterContainer) {
  monthFilterContainer.addEventListener('click', evento => {
    const botao = evento.target.closest('.month-filter');

    if (!botao || !monthFilterContainer.contains(botao)) return;

    monthFilterContainer.querySelectorAll('.month-filter').forEach(filtro => {
      filtro.classList.remove('active');
      filtro.setAttribute('aria-selected', 'false');
    });

    botao.classList.add('active');
    botao.setAttribute('aria-selected', 'true');

    aplicarFiltro(botao.dataset.month);
  });
}

carregarEventos();
