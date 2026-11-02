// ============================================================
// SCRIPT DA HOME: busca na API o aviso importante e os próximos eventos.
// Fica separado do script.js (que é compartilhado) e só mexe nessas duas áreas.
// Se a API não responder, o conteúdo que já está escrito no HTML continua na tela.
// ============================================================

const MAX_EVENTOS_HOME = 3;
const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const CORES_CATEGORIAS = {
  Atendimento: '#1B3A6B',
  Oficina: '#2A7D4F',
  'Saúde': '#059669',
  Evento: '#E8600A',
};
const COR_PADRAO = '#1B3A6B';

const SVG_NS = 'http://www.w3.org/2000/svg';
const ICONE_RELOGIO = 'M12 2a10 10 0 100 20 10 10 0 000-20zm.75 5v5.4l4 2.3-.9 1.5-4.85-2.8V7h1.75z';
const ICONE_LOCAL = 'M12 2C7 2 4 5.6 4 9.6 4 15 12 22 12 22s8-7 8-12.4C20 5.6 17 2 12 2zm0 10a2.4 2.4 0 110-4.8 2.4 2.4 0 010 4.8z';

// Data de hoje no horário do computador, no formato AAAA-MM-DD
function hojeISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// AAAA-MM-DD -> DD/MM/AAAA, sem passar por Date (assim o fuso horário não muda o dia)
function formatarDataBR(iso) {
  const [ano, mes, dia] = String(iso).slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

async function buscarJSON(caminho) {
  const resposta = await fetch(caminho);
  if (!resposta.ok) throw new Error(`A API respondeu com status ${resposta.status}`);
  const dados = await resposta.json();
  if (!Array.isArray(dados)) throw new Error('A resposta da API não é uma lista.');
  return dados;
}

// ---------- Aviso importante ----------
// Mostra o aviso mais recente (a API já devolve do mais novo para o mais antigo).
// Sem nenhum aviso cadastrado, a faixa amarela inteira fica escondida.
async function atualizarAviso() {
  const faixa = document.querySelector('.aviso-wrap');
  const caixa = document.querySelector('.aviso-box');
  if (!faixa || !caixa) return;

  const avisos = await buscarJSON('/api/avisos');

  if (avisos.length === 0) {
    faixa.hidden = true;
    return;
  }

  const aviso = avisos[0];
  faixa.hidden = false;
  caixa.querySelector('.aviso-body h3').textContent = aviso.titulo;
  caixa.querySelector('.aviso-body p:not(.aviso-kicker)').textContent = aviso.mensagem;
  caixa.querySelector('.aviso-date').textContent = formatarDataBR(aviso.data);
}

// ---------- Próximos eventos ----------
function criarMeta(caminhoIcone, texto) {
  const span = document.createElement('span');
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', '#E8600A');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', caminhoIcone);
  svg.appendChild(path);
  span.append(svg, document.createTextNode(texto));
  return span;
}

function criarCartaoHome(evento) {
  const [, mes, dia] = String(evento.data).slice(0, 10).split('-');
  const categoria = String(evento.categoria || '').trim();
  const cor = CORES_CATEGORIAS[categoria] || COR_PADRAO;

  const cartao = document.createElement('div');
  cartao.className = 'event-card';

  const blocoData = document.createElement('div');
  blocoData.className = 'event-date';
  blocoData.style.background = cor;
  const spanDia = document.createElement('span');
  spanDia.className = 'day';
  spanDia.textContent = dia;
  const spanMes = document.createElement('span');
  spanMes.className = 'mon';
  spanMes.textContent = MESES_ABREV[Number(mes) - 1] || '';
  blocoData.append(spanDia, spanMes);

  const info = document.createElement('div');
  info.className = 'event-info';

  if (categoria) {
    const etiqueta = document.createElement('span');
    etiqueta.className = 'event-category';
    etiqueta.style.background = cor;
    etiqueta.textContent = categoria;
    info.appendChild(etiqueta);
  }

  const titulo = document.createElement('h3');
  titulo.textContent = evento.nome;
  info.appendChild(titulo);

  const meta = document.createElement('div');
  meta.className = 'event-meta';
  if (evento.horario) meta.appendChild(criarMeta(ICONE_RELOGIO, evento.horario));
  if (evento.local) meta.appendChild(criarMeta(ICONE_LOCAL, evento.local));
  if (meta.children.length) info.appendChild(meta);

  const descricao = document.createElement('p');
  descricao.className = 'event-desc';
  descricao.textContent = evento.descricao || 'Mais informações em breve.';
  info.appendChild(descricao);

  cartao.append(blocoData, info);
  return cartao;
}

// Mostra só os próximos eventos ativos (de hoje em diante), no máximo MAX_EVENTOS_HOME.
// A API já entrega só os ativos, então rascunho, encerrado e apagado somem sozinhos.
async function atualizarEventos() {
  const lista = document.querySelector('#eventos .events-list');
  if (!lista) return;

  const eventos = await buscarJSON('/api/eventos');
  const hoje = hojeISO();

  const proximos = eventos
    .filter((e) => String(e.data).slice(0, 10) >= hoje)
    .sort((a, b) => String(a.data).localeCompare(String(b.data)))
    .slice(0, MAX_EVENTOS_HOME);

  lista.replaceChildren();

  if (proximos.length === 0) {
    const vazio = document.createElement('p');
    vazio.className = 'events-empty';
    vazio.textContent = 'Nenhum evento programado no momento. Volte em breve!';
    lista.appendChild(vazio);
    return;
  }

  proximos.forEach((e) => lista.appendChild(criarCartaoHome(e)));
}

// ---------- Atualização ----------
function atualizarHome() {
  atualizarAviso().catch((erro) => console.error('Erro ao carregar o aviso:', erro));
  atualizarEventos().catch((erro) => console.error('Erro ao carregar os eventos:', erro));
}

atualizarHome();

// Quem deixa a home aberta enquanto mexe no painel vê a mudança ao voltar para a aba,
// e a página também se atualiza sozinha a cada minuto.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') atualizarHome();
});
setInterval(atualizarHome, 60000);
