# Conecta CRAS

Sistema web que aproxima a população dos CRAS (Centros de Referência de Assistência Social), reunindo em um só lugar horários, serviços, eventos e avisos, com um painel para os servidores manterem tudo atualizado.

Projeto da disciplina de Atividade de Extensão, curso de Análise e Desenvolvimento de Sistemas, IFTO Campus Colinas do Tocantins. O piloto é o CRAS Vila São João. A estrutura está pronta para receber outros CRAS no futuro.

## O que o sistema faz

**Site público**

- Página inicial com o aviso importante e os próximos eventos, que vêm do painel administrativo
- Agenda de eventos com filtro por mês. Só aparecem os próximos eventos, e os meses sem evento não têm botão
- Página de cada serviço: Cadastro Único, PAIF, SCFV e Criança Feliz
- Perguntas frequentes
- Contato e Ouvidoria: a manifestação é gravada no banco e uma notificação é enviada por e-mail para a equipe do CRAS
- Acessibilidade: aumento e redução da fonte e modo de alto contraste

**Painel administrativo** (acesso restrito, com login)

- Cadastrar, editar e apagar eventos, com categoria, horário, local e status (Ativo, Rascunho ou Encerrado)
- Criar, editar e apagar avisos

## Tecnologias

- Frontend: HTML, CSS e JavaScript
- Backend: Node.js com Express
- Banco de dados: MySQL, gerenciado pelo phpMyAdmin
- Ambiente: Docker e Docker Compose
- E-mail: Nodemailer com SMTP do Gmail
- Segurança: login com senha criptografada (bcrypt) e sessão por cookie (JWT)

## Como rodar

Você só precisa do **Git** e do **Docker Desktop**. Não é preciso instalar Node.js nem MySQL.

```bash
git clone https://github.com/luyzabrunna/conecta-cras.git
cd conecta-cras
```

Crie o arquivo de variáveis a partir do modelo:

```bash
# PowerShell ou CMD (Windows)
copy backend\.env.example backend\.env

# Mac, Linux ou Git Bash
cp backend/.env.example backend/.env
```

Abra o Docker Desktop, espere ele iniciar e suba tudo:

```bash
docker compose up -d --build
```

Na primeira vez, o banco é criado sozinho, com as tabelas e dados de exemplo.

| Endereço | O que é |
|---|---|
| http://localhost:3000 | Site público |
| http://localhost:3000/admin/login.html | Painel administrativo |
| http://localhost:3000/api/status | Mostra se a API e o banco estão no ar |
| http://localhost:8080 | phpMyAdmin (usuário root, senha root) |

O usuário e a senha do painel são combinados com a equipe e não ficam neste repositório. O guia [COMO-COLABORAR.md](./COMO-COLABORAR.md) tem o passo a passo completo, os comandos do dia a dia e as soluções para os problemas mais comuns.

## Arquitetura do backend

O backend segue uma arquitetura em camadas. Cada pedido passa por quatro etapas, e cada uma só conversa com a seguinte.

```
Requisição -> routes -> controllers -> models -> banco de dados
                |
                +-> middleware (login, limite de envios)
                +-> services (envio de e-mail)
```

- **routes**: define os endereços da API e qual controller atende cada um
- **controllers**: validam os dados e decidem a resposta
- **models**: as consultas ao banco, e só elas
- **middleware**: confere o login das rotas restritas e limita os envios da ouvidoria
- **services**: o envio de e-mail
- **config**: conexão com o banco, e-mail, sessão e o `schema.sql`

## API

| Método | Rota | Acesso | O que faz |
|---|---|---|---|
| GET | `/api/status` | Público | Confere a API e o banco |
| GET | `/api/eventos` | Público | Lista os eventos ativos |
| GET | `/api/eventos/admin` | Admin | Lista todos os eventos |
| POST | `/api/eventos` | Admin | Cria um evento |
| PUT | `/api/eventos/:id` | Admin | Edita um evento |
| DELETE | `/api/eventos/:id` | Admin | Apaga um evento |
| GET | `/api/avisos` | Público | Lista os avisos, do mais novo ao mais antigo |
| POST | `/api/avisos` | Admin | Cria um aviso |
| PUT | `/api/avisos/:id` | Admin | Edita um aviso |
| DELETE | `/api/avisos/:id` | Admin | Apaga um aviso |
| POST | `/api/ouvidoria` | Público, com limite | Registra uma manifestação e avisa a equipe por e-mail |
| GET | `/api/ouvidoria` | Admin | Lista as manifestações recebidas |
| POST | `/api/login` | Público | Entra no painel e cria a sessão |
| GET ou POST | `/api/logout` | Sessão | Sai do painel e apaga a sessão |

Rotas marcadas como Admin respondem 401 para quem não está logado.

## Ouvidoria por e-mail

Cada manifestação enviada pelo formulário é gravada na tabela `mensagens_ouvidoria` e, em seguida, uma notificação é enviada para o e-mail da Ouvidoria. A gravação acontece antes, então uma falha no envio do e-mail nunca faz a manifestação se perder.

Para responder ao cidadão, a equipe usa o botão **Responder** do próprio e-mail recebido, sem mudar o assunto. O endereço do cidadão já vem preenchido, quando ele informou um válido.

Para o e-mail funcionar, o `backend/.env` precisa ter a senha de aplicativo do Gmail em `MAIL_PASS`. Sem ela, tudo continua funcionando e a manifestação só fica no banco. Para conferir a configuração:

```bash
docker compose exec backend node scripts/testar-email.js
```

## Variáveis de ambiente

Ficam em `backend/.env`, que **nunca** deve ser enviado ao GitHub. O modelo, sem segredos, é o `backend/.env.example`.

| Variável | Para que serve |
|---|---|
| `JWT_SECRET` | Texto longo e secreto que protege a sessão do painel |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_SECURE` | Servidor de e-mail (Gmail: `smtp.gmail.com`, `587`, `false`) |
| `MAIL_USER` | Conta que envia as notificações |
| `MAIL_PASS` | Senha de aplicativo do Gmail |
| `MAIL_TO` | Conta que recebe as manifestações |
| `OUVIDORIA_LIMITE_POR_IP` | Envios permitidos por IP na janela (padrão 5) |
| `OUVIDORIA_JANELA_MINUTOS` | Tamanho da janela em minutos (padrão 15) |

## Segurança

- Senhas guardadas com hash bcrypt, nunca em texto
- Sessão em cookie `HttpOnly` e `SameSite=Strict`, que o JavaScript da página não consegue ler. Dura até fechar o navegador, no máximo 8 horas
- O servidor só entrega as páginas do painel para quem está logado, e o navegador não guarda cópia delas. Depois de sair, as setas voltar e avançar não reabrem o painel
- Limite de 5 envios a cada 15 minutos por IP no formulário da Ouvidoria
- Nome, e-mail e texto do cidadão não aparecem nos logs do servidor
- As credenciais do banco neste projeto, `root` e `root`, servem só para uso local. Em um ambiente real, troque por senhas fortes e não exponha as portas 3306 e 8080

## Estrutura de pastas

```
conecta-cras/
├── backend/
│   ├── config/          conexão com o banco, e-mail, sessão e schema.sql
│   ├── controllers/     validação e respostas
│   ├── middleware/      login e limite de envios
│   ├── models/          consultas ao banco
│   ├── routes/          endereços da API
│   ├── scripts/         testar-email.js e gerar-hash-senha.js
│   ├── services/        envio de e-mail
│   ├── utils/           validações
│   ├── Dockerfile
│   └── server.js
├── frontend/
│   ├── public/          site público (index.html, pages/ e assets/)
│   └── admin/           login e painel administrativo
├── docs/                documentação do projeto
├── docker-compose.yml
├── COMO-COLABORAR.md
└── README.md
```

## Equipe

- Brunna Luyza: backend, banco de dados, API e Docker
- Ana Carla: frontend
- Andressa: prototipagem das telas
- Maria Eduarda: documentação e contato com o CRAS
