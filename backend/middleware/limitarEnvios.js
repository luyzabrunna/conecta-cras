// Limite de envios por IP para o formulário público da Ouvidoria.
// Cada manifestação grava no banco e manda um e-mail, então sem limite um robô
// poderia lotar a caixa de entrada e esgotar o limite diário de envios do Gmail.
//
// Fica em memória: reiniciar o container zera a contagem.
// Configurável pelo .env (valores padrão: 5 envios a cada 15 minutos por IP):
//   OUVIDORIA_LIMITE_POR_IP=5
//   OUVIDORIA_JANELA_MINUTOS=15

function numeroPositivo(valor, padrao) {
  const n = Number(valor);
  return Number.isFinite(n) && n > 0 ? n : padrao;
}

function criarLimitador({ limite, janelaMs }) {
  const registros = new Map(); // ip -> { inicio, contagem }

  // Limpa de tempos em tempos os IPs que já passaram da janela, para o mapa não crescer sem fim.
  // unref() faz o timer não segurar o processo aberto.
  setInterval(() => {
    const agora = Date.now();
    for (const [ip, r] of registros) {
      if (agora - r.inicio >= janelaMs) registros.delete(ip);
    }
  }, Math.max(janelaMs, 1000)).unref();

  return function limitarEnvios(req, res, next) {
    const agora = Date.now();
    const ip = req.ip || 'desconhecido';

    let r = registros.get(ip);
    if (!r || agora - r.inicio >= janelaMs) {
      r = { inicio: agora, contagem: 0 };
      registros.set(ip, r);
    }

    if (r.contagem >= limite) {
      const segundos = Math.ceil((r.inicio + janelaMs - agora) / 1000);
      const minutos = Math.max(1, Math.ceil(segundos / 60));
      res.set('Retry-After', String(segundos));
      return res.status(429).json({
        erro: `Você enviou muitas mensagens em pouco tempo. Tente novamente em cerca de ${minutos} minuto${minutos > 1 ? 's' : ''}.`,
      });
    }

    r.contagem += 1; // conta todo envio recebido, inclusive os que falham na validação
    next();
  };
}

const limitarEnvios = criarLimitador({
  limite: numeroPositivo(process.env.OUVIDORIA_LIMITE_POR_IP, 5),
  janelaMs: numeroPositivo(process.env.OUVIDORIA_JANELA_MINUTOS, 15) * 60 * 1000,
});

module.exports = { limitarEnvios, criarLimitador };
