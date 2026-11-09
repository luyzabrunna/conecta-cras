// Gera o comando SQL para trocar a senha do administrador.
//
// Uso, com o sistema no ar:
//   docker compose exec backend node scripts/gerar-hash-senha.js "SuaNovaSenha"
//
// Evite $ e aspas dentro da senha, porque o terminal pode interpretar esses caracteres.
// A senha nunca é guardada: o banco recebe só o hash.

const bcrypt = require('bcryptjs');

const senha = process.argv[2];

if (!senha || senha.length < 8) {
  console.error('Uso: node scripts/gerar-hash-senha.js "SuaNovaSenha"');
  console.error('A senha precisa ter pelo menos 8 caracteres.');
  process.exit(1);
}

const hash = bcrypt.hashSync(senha, 10);

console.log('\nCole este comando na aba SQL do phpMyAdmin, com o banco conecta_cras selecionado:\n');
console.log(`UPDATE usuarios SET senha_hash = '${hash}' WHERE email = 'admin@cras.gov.br';\n`);
console.log('Depois disso, só a senha nova entra no painel. Quem estiver logado continua logado até sair.');
console.log('Para quem clonar o projeto também usar a nova senha, troque o hash no INSERT de usuarios do backend/config/schema.sql.');
