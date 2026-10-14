// Segredo usado para assinar o token de login do painel administrativo.
// Em produção, defina JWT_SECRET no ambiente. Para demonstração local,
// o valor padrão abaixo funciona.
module.exports = {
  SEGREDO: process.env.JWT_SECRET || 'conecta-cras-segredo-de-desenvolvimento',
  EXPIRA_EM: '8h',
};
