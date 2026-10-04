// ============================================================
// SCRIPT DO DASHBOARD (Área Administrativa) 
// Contém: trava de login, acessibilidade, e o CRUD (criar, editar,
// apagar) de Eventos e Avisos.
//
// IMPORTANTE: como ainda não existe back-end/API para essas telas,
// os dados são guardados no localStorage do navegador (ou seja,
// só existem NESTE computador/navegador, não em um banco de dados
// de verdade). Quando a API existir, troque as funções marcadas
// com ">>> API <<<" por chamadas fetch().
// ============================================================

// ---------- Trava de login ----------
// Se a pessoa não passou pela tela de login nesta aba/sessão,
// manda ela de volta pro login em vez de mostrar o painel.
if (sessionStorage.getItem('cras_admin_logado') !== 'true') {
  window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('cras_admin_logado');
  window.location.href = 'login.html';
});

// ---------- Acessibilidade: tamanho da fonte ----------
const root = document.documentElement;
let fontSize = 18;
const MIN_FONT = 14, MAX_FONT = 24, STEP = 2;
function applyFontSize(){ root.style.fontSize = fontSize + 'px'; }
document.getElementById('fontInc').addEventListener('click', () => { fontSize = Math.min(MAX_FONT, fontSize + STEP); applyFontSize(); });
document.getElementById('fontDec').addEventListener('click', () => { fontSize = Math.max(MIN_FONT, fontSize - STEP); applyFontSize(); });
document.getElementById('fontReset').addEventListener('click', () => { fontSize = 18; applyFontSize(); });

// ---------- Acessibilidade: alto contraste ----------
const contrastBtn = document.getElementById('contrastToggle');
contrastBtn.addEventListener('click', () => {
  const on = document.body.classList.toggle('contrast');
  contrastBtn.setAttribute('aria-pressed', String(on));
});

// ============================================================
// DADOS (guardados no localStorage; dados de exemplo na primeira vez)
// ============================================================
const EVENTOS_KEY = 'cras_admin_eventos';
const AVISOS_KEY = 'cras_admin_avisos';

const eventosExemplo = [
  { id: 1, nome: 'Mutirão de Cadastro Único', data: '2026-09-05', status: 'Ativo', descricao: '' },
  { id: 2, nome: 'Oficina de Empreendedorismo Feminino', data: '2026-09-10', status: 'Ativo', descricao: '' },
  { id: 3, nome: 'Vacinação e Orientação de Saúde', data: '2026-09-18', status: 'Ativo', descricao: '' },
  { id: 4, nome: 'Semana da Criança', data: '2026-10-07', status: 'Rascunho', descricao: '' },
];

const avisosExemplo = [
  {
    id: 1,
    titulo: 'Sistema CadÚnico em Manutenção',
    mensagem: 'O sistema estará em manutenção entre 01 e 05 de setembro. Agendamentos nesse período serão remarcados. Ligue: (63) 99961-8630.',
    data: '2026-09-01',
  },
  {
    id: 2,
    titulo: 'Novas Vagas no SCFV para Idosos',
    mensagem: 'Inscrições abertas para o grupo de convivência de idosos. Atividades às terças e quintas, 14h às 16h. Vagas limitadas.',
    data: '2026-08-28',
  },
];

// >>> API <<<: por enquanto lê/escreve no localStorage. No futuro,
// troque getEventos()/salvarEventos() (e os de aviso) por chamadas
// fetch('/api/eventos') / fetch('/api/avisos').
function getEventos(){
  const salvo = localStorage.getItem(EVENTOS_KEY);
  return salvo ? JSON.parse(salvo) : eventosExemplo;
}
function salvarEventos(lista){
  localStorage.setItem(EVENTOS_KEY, JSON.stringify(lista));
}
function getAvisos(){
  const salvo = localStorage.getItem(AVISOS_KEY);
  return salvo ? JSON.parse(salvo) : avisosExemplo;
}
function salvarAvisos(lista){
  localStorage.setItem(AVISOS_KEY, JSON.stringify(lista));
}

// ---------- Formatação de data (yyyy-mm-dd -> dd/mm/aaaa) ----------
function formatarData(isoDate){
  if (!isoDate) return '';
  const [ano, mes, dia] = isoDate.split('-');
  return `${dia}/${mes}/${ano}`;
}

// ============================================================
// RENDERIZAÇÃO
// ============================================================
function statusClasse(status){
  if (status === 'Ativo') return 'status-ativo';
  if (status === 'Rascunho') return 'status-rascunho';
  return 'status-encerrado';
}

function renderEventos(){
  const eventos = getEventos();
  const tbody = document.getElementById('eventosTableBody');
  const vazio = document.getElementById('eventosVazio');

  tbody.innerHTML = '';
  vazio.hidden = eventos.length > 0;

  eventos.forEach(ev => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(ev.nome)}</td>
      <td>${formatarData(ev.data)}</td>
      <td><span class="status-badge ${statusClasse(ev.status)}">${escapeHtml(ev.status)}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" data-editar-evento="${ev.id}" aria-label="Editar evento">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
          </button>
          <button class="icon-btn danger" data-apagar-evento="${ev.id}" aria-label="Apagar evento">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('statEventos').textContent = eventos.filter(e => e.status === 'Ativo').length;
}

function renderAvisos(){
  const avisos = getAvisos();
  const list = document.getElementById('avisosList');
  const vazio = document.getElementById('avisosVazio');

  list.innerHTML = '';
  vazio.hidden = avisos.length > 0;

  avisos.forEach(av => {
    const div = document.createElement('div');
    div.className = 'aviso-item';
    div.innerHTML = `
      <span class="aviso-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>
      </span>
      <div class="aviso-body">
        <h3>${escapeHtml(av.titulo)}</h3>
        <p>${escapeHtml(av.mensagem)}</p>
        <span class="aviso-date">${formatarData(av.data)}</span>
      </div>
      <div class="aviso-actions">
        <button class="icon-btn" data-editar-aviso="${av.id}" aria-label="Editar aviso">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
        </button>
        <button class="icon-btn danger" data-apagar-aviso="${av.id}" aria-label="Apagar aviso">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
        </button>
      </div>
    `;
    list.appendChild(div);
  });

  document.getElementById('statAvisos').textContent = avisos.length;
}

// Evita que texto digitado pelo usuário vire HTML sem querer (segurança básica)
function escapeHtml(texto){
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// ============================================================
// MODAL: Novo/Editar Evento
// ============================================================
const eventoModalOverlay = document.getElementById('eventoModalOverlay');
const eventoForm = document.getElementById('eventoForm');
const eventoModalTitle = document.getElementById('eventoModalTitle');

function abrirModalEvento(evento){
  eventoForm.reset();
  eventoForm.querySelectorAll('.form-field').forEach(f => f.classList.remove('invalid'));
  if (evento) {
    eventoModalTitle.textContent = 'Editar Evento';
    document.getElementById('eventoId').value = evento.id;
    document.getElementById('eventoNome').value = evento.nome;
    document.getElementById('eventoData').value = evento.data;
    document.getElementById('eventoStatus').value = evento.status;
    document.getElementById('eventoDescricao').value = evento.descricao || '';
  } else {
    eventoModalTitle.textContent = 'Novo Evento';
    document.getElementById('eventoId').value = '';
  }
  eventoModalOverlay.hidden = false;
  document.getElementById('eventoNome').focus();
}
function fecharModalEvento(){ eventoModalOverlay.hidden = true; }

document.getElementById('novoEventoBtn').addEventListener('click', () => abrirModalEvento(null));
document.getElementById('eventoModalClose').addEventListener('click', fecharModalEvento);
document.getElementById('eventoCancelar').addEventListener('click', fecharModalEvento);
eventoModalOverlay.addEventListener('click', (e) => { if (e.target === eventoModalOverlay) fecharModalEvento(); });

eventoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nomeField = document.getElementById('eventoNome');
  const dataField = document.getElementById('eventoData');
  const nomeOk = nomeField.value.trim() !== '';
  const dataOk = dataField.value !== '';
  nomeField.closest('.form-field').classList.toggle('invalid', !nomeOk);
  dataField.closest('.form-field').classList.toggle('invalid', !dataOk);
  if (!nomeOk || !dataOk) return;

  const id = document.getElementById('eventoId').value;
  const eventos = getEventos();
  const dadosEvento = {
    nome: nomeField.value.trim(),
    data: dataField.value,
    status: document.getElementById('eventoStatus').value,
    descricao: document.getElementById('eventoDescricao').value.trim(),
  };

  if (id) {
    const idx = eventos.findIndex(ev => String(ev.id) === String(id));
    if (idx > -1) eventos[idx] = { ...eventos[idx], ...dadosEvento };
  } else {
    const novoId = eventos.length ? Math.max(...eventos.map(e => e.id)) + 1 : 1;
    eventos.push({ id: novoId, ...dadosEvento });
  }

  salvarEventos(eventos);
  renderEventos();
  fecharModalEvento();
});

document.getElementById('eventosTableBody').addEventListener('click', (e) => {
  const editarBtn = e.target.closest('[data-editar-evento]');
  const apagarBtn = e.target.closest('[data-apagar-evento]');
  if (editarBtn) {
    const id = editarBtn.getAttribute('data-editar-evento');
    const evento = getEventos().find(ev => String(ev.id) === String(id));
    if (evento) abrirModalEvento(evento);
  }
  if (apagarBtn) {
    const id = apagarBtn.getAttribute('data-apagar-evento');
    if (confirm('Tem certeza que deseja apagar este evento?')) {
      const eventos = getEventos().filter(ev => String(ev.id) !== String(id));
      salvarEventos(eventos);
      renderEventos();
    }
  }
});

// ============================================================
// MODAL: Criar/Editar Aviso
// ============================================================
const avisoModalOverlay = document.getElementById('avisoModalOverlay');
const avisoForm = document.getElementById('avisoForm');
const avisoModalTitle = document.getElementById('avisoModalTitle');

function hojeISO(){
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function abrirModalAviso(aviso){
  avisoForm.reset();
  avisoForm.querySelectorAll('.form-field').forEach(f => f.classList.remove('invalid'));
  if (aviso) {
    avisoModalTitle.textContent = 'Editar Aviso';
    document.getElementById('avisoId').value = aviso.id;
    document.getElementById('avisoTitulo').value = aviso.titulo;
    document.getElementById('avisoMensagem').value = aviso.mensagem;
  } else {
    avisoModalTitle.textContent = 'Criar Aviso';
    document.getElementById('avisoId').value = '';
  }
  avisoModalOverlay.hidden = false;
  document.getElementById('avisoTitulo').focus();
}
function fecharModalAviso(){ avisoModalOverlay.hidden = true; }

document.getElementById('criarAvisoBtn').addEventListener('click', () => abrirModalAviso(null));
document.getElementById('avisoModalClose').addEventListener('click', fecharModalAviso);
document.getElementById('avisoCancelar').addEventListener('click', fecharModalAviso);
avisoModalOverlay.addEventListener('click', (e) => { if (e.target === avisoModalOverlay) fecharModalAviso(); });

avisoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const tituloField = document.getElementById('avisoTitulo');
  const mensagemField = document.getElementById('avisoMensagem');
  const tituloOk = tituloField.value.trim() !== '';
  const mensagemOk = mensagemField.value.trim() !== '';
  tituloField.closest('.form-field').classList.toggle('invalid', !tituloOk);
  mensagemField.closest('.form-field').classList.toggle('invalid', !mensagemOk);
  if (!tituloOk || !mensagemOk) return;

  const id = document.getElementById('avisoId').value;
  const avisos = getAvisos();

  if (id) {
    const idx = avisos.findIndex(av => String(av.id) === String(id));
    if (idx > -1) {
      avisos[idx].titulo = tituloField.value.trim();
      avisos[idx].mensagem = mensagemField.value.trim();
    }
  } else {
    const novoId = avisos.length ? Math.max(...avisos.map(a => a.id)) + 1 : 1;
    avisos.unshift({ id: novoId, titulo: tituloField.value.trim(), mensagem: mensagemField.value.trim(), data: hojeISO() });
  }

  salvarAvisos(avisos);
  renderAvisos();
  fecharModalAviso();
});

document.getElementById('avisosList').addEventListener('click', (e) => {
  const editarBtn = e.target.closest('[data-editar-aviso]');
  const apagarBtn = e.target.closest('[data-apagar-aviso]');
  if (editarBtn) {
    const id = editarBtn.getAttribute('data-editar-aviso');
    const aviso = getAvisos().find(av => String(av.id) === String(id));
    if (aviso) abrirModalAviso(aviso);
  }
  if (apagarBtn) {
    const id = apagarBtn.getAttribute('data-apagar-aviso');
    if (confirm('Tem certeza que deseja apagar este aviso?')) {
      const avisos = getAvisos().filter(av => String(av.id) !== String(id));
      salvarAvisos(avisos);
      renderAvisos();
    }
  }
});

// Fecha qualquer modal aberto com a tecla Esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    fecharModalEvento();
    fecharModalAviso();
  }
});

// ---------- Primeira renderização ----------
renderEventos();
renderAvisos();