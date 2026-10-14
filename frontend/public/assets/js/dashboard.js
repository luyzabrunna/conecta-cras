// ============================================================
// SCRIPT DO DASHBOARD (Área Administrativa)
// Contém: trava de login, acessibilidade, e o CRUD (criar, editar,
// apagar) de Eventos e Avisos.
//
// Os dados agora vêm da API e ficam no banco de dados MySQL
// (antes ficavam no localStorage do navegador). Cada pedido à API
// leva o token de login no cabeçalho Authorization.
// ============================================================

const TOKEN_KEY = 'cras_admin_token';

function sair(){
  sessionStorage.removeItem(TOKEN_KEY);
  window.location.href = 'login.html';
}

// ---------- Trava de login ----------
// Sem token de sessão, manda a pessoa de volta pro login.
const logado = !!sessionStorage.getItem(TOKEN_KEY);
if (!logado) sair();

document.getElementById('logoutBtn').addEventListener('click', sair);

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
// COMUNICAÇÃO COM A API
// ============================================================

// Faz o pedido à API já com o token. Se o token venceu (401), volta pro login.
async function api(caminho, opcoes = {}){
  const resposta = await fetch(caminho, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem(TOKEN_KEY),
    },
  });
  if (resposta.status === 401) {
    sair();
    throw new Error('Sessão expirada. Entre novamente.');
  }
  const dados = resposta.status === 204 ? null : await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new Error((dados && dados.erro) || 'Erro ao falar com o servidor.');
  }
  return dados;
}

// Listas em memória, recarregadas da API depois de cada alteração
let eventos = [];
let avisos = [];

async function carregarEventos(){
  eventos = await api('/api/eventos/admin'); // todos: ativos, rascunhos e encerrados
  renderEventos();
}
async function carregarAvisos(){
  avisos = await api('/api/avisos');
  renderAvisos();
}

// ---------- Formatação de data (yyyy-mm-dd -> dd/mm/aaaa) ----------
function formatarData(isoDate){
  if (!isoDate) return '';
  const [ano, mes, dia] = isoDate.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Evita que texto digitado pelo usuário vire HTML sem querer (segurança básica)
function escapeHtml(texto){
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
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
    document.getElementById('eventoCategoria').value = evento.categoria || '';
    document.getElementById('eventoHorario').value = evento.horario || '';
    document.getElementById('eventoLocal').value = evento.local || '';
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

eventoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nomeField = document.getElementById('eventoNome');
  const dataField = document.getElementById('eventoData');
  const nomeOk = nomeField.value.trim() !== '';
  const dataOk = dataField.value !== '';
  nomeField.closest('.form-field').classList.toggle('invalid', !nomeOk);
  dataField.closest('.form-field').classList.toggle('invalid', !dataOk);
  if (!nomeOk || !dataOk) return;

  const id = document.getElementById('eventoId').value;
  const corpo = JSON.stringify({
    nome: nomeField.value.trim(),
    data: dataField.value,
    status: document.getElementById('eventoStatus').value,
    descricao: document.getElementById('eventoDescricao').value.trim(),
    categoria: document.getElementById('eventoCategoria').value,
    horario: document.getElementById('eventoHorario').value.trim(),
    local: document.getElementById('eventoLocal').value.trim(),
});


  try {
    if (id) await api('/api/eventos/' + id, { method: 'PUT', body: corpo });
    else await api('/api/eventos', { method: 'POST', body: corpo });
    await carregarEventos();
    fecharModalEvento();
  } catch (erro) {
    alert(erro.message);
  }
});

document.getElementById('eventosTableBody').addEventListener('click', async (e) => {
  const editarBtn = e.target.closest('[data-editar-evento]');
  const apagarBtn = e.target.closest('[data-apagar-evento]');
  if (editarBtn) {
    const id = editarBtn.getAttribute('data-editar-evento');
    const evento = eventos.find(ev => String(ev.id) === String(id));
    if (evento) abrirModalEvento(evento);
  }
  if (apagarBtn) {
    const id = apagarBtn.getAttribute('data-apagar-evento');
    if (confirm('Tem certeza que deseja apagar este evento?')) {
      try {
        await api('/api/eventos/' + id, { method: 'DELETE' });
        await carregarEventos();
      } catch (erro) {
        alert(erro.message);
      }
    }
  }
});

// ============================================================
// MODAL: Criar/Editar Aviso
// ============================================================
const avisoModalOverlay = document.getElementById('avisoModalOverlay');
const avisoForm = document.getElementById('avisoForm');
const avisoModalTitle = document.getElementById('avisoModalTitle');

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

avisoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const tituloField = document.getElementById('avisoTitulo');
  const mensagemField = document.getElementById('avisoMensagem');
  const tituloOk = tituloField.value.trim() !== '';
  const mensagemOk = mensagemField.value.trim() !== '';
  tituloField.closest('.form-field').classList.toggle('invalid', !tituloOk);
  mensagemField.closest('.form-field').classList.toggle('invalid', !mensagemOk);
  if (!tituloOk || !mensagemOk) return;

  const id = document.getElementById('avisoId').value;
  const corpo = JSON.stringify({
    titulo: tituloField.value.trim(),
    mensagem: mensagemField.value.trim(),
  });

  try {
    if (id) await api('/api/avisos/' + id, { method: 'PUT', body: corpo });
    else await api('/api/avisos', { method: 'POST', body: corpo });
    await carregarAvisos();
    fecharModalAviso();
  } catch (erro) {
    alert(erro.message);
  }
});

document.getElementById('avisosList').addEventListener('click', async (e) => {
  const editarBtn = e.target.closest('[data-editar-aviso]');
  const apagarBtn = e.target.closest('[data-apagar-aviso]');
  if (editarBtn) {
    const id = editarBtn.getAttribute('data-editar-aviso');
    const aviso = avisos.find(av => String(av.id) === String(id));
    if (aviso) abrirModalAviso(aviso);
  }
  if (apagarBtn) {
    const id = apagarBtn.getAttribute('data-apagar-aviso');
    if (confirm('Tem certeza que deseja apagar este aviso?')) {
      try {
        await api('/api/avisos/' + id, { method: 'DELETE' });
        await carregarAvisos();
      } catch (erro) {
        alert(erro.message);
      }
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

// ---------- Primeira carga: busca eventos e avisos na API ----------
if (logado) {
  Promise.all([carregarEventos(), carregarAvisos()]).catch(erro => alert(erro.message));
}