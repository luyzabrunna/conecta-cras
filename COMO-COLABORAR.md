# Como acessar e rodar o Conecta CRAS

Esse guia é pra quem entrou no repositório e nunca mexeu nele. Segue o passo a passo direitinho que dá pra rodar o projeto na sua máquina.

## 1. Aceitando o convite

Você vai receber um convite por e-mail (ou notificação no GitHub) pra ser colaboradora do repositório `conecta-cras`. Aceita o convite clicando no link, e pronto — você já pode ver o repositório e, com permissão de "Write", dar push nas suas alterações.

## 2. Clonando o repositório

Com o Git instalado no seu computador, abra o terminal (ou o terminal do VS Code) numa pasta de sua preferência e rode:

```bash
git clone https://github.com/usuario/conecta-cras.git
cd conecta-cras
```

Isso baixa uma cópia completa do projeto pra sua máquina.

## 3. Como o repositório é organizado

```
conecta-cras/
├── backend/
│   ├── config/        → conexão com o banco de dados (db.js)
│   ├── models/         → queries no banco de dados
│   ├── controllers/    → lógica das requisições
│   ├── routes/         → caminhos da API
│   ├── server.js        → arquivo principal do servidor
│   └── .env             → configurações locais (cada uma cria a sua, não vem do GitHub)
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   │       ├── css/
│   │       ├── js/
│   │       └── img/
│   └── admin/           → painel administrativo
├── docs/                 → documentação do projeto
├── docker-compose.yml     → sobe o MySQL e o phpMyAdmin
└── README.md
```

O backend segue uma arquitetura em camadas: as `routes` recebem a requisição e chamam o `controller` certo, o `controller` cuida da lógica e chama o `model`, e o `model` é quem de fato conversa com o banco através da conexão configurada em `config/db.js`.

## 4. Tecnologias usadas

HTML, CSS e JavaScript puro no frontend (sem framework). Node.js com Express no backend. MySQL como banco de dados, gerenciado através do phpMyAdmin, os dois rodando via Docker.

## 5. Rodando o projeto

Você só precisa instalar o Node.js e o Docker localmente — não precisa instalar MySQL na máquina, ele sobe dentro de um container.

### 5.1 Pré-requisitos

1. Instale o [Node.js](https://nodejs.org) (versão LTS).
2. Instale o [Docker Desktop](https://www.docker.com/products/docker-desktop) e deixe ele aberto/rodando.

### 5.2 Sempre que for começar a trabalhar, siga essa ordem

Essa ordem importa — pular um passo é a causa mais comum de o projeto não abrir.

1. **Puxe as últimas alterações do repositório:**
   ```bash
   git pull
   ```

2. **Configure o `.env`** (só na primeira vez, ou se o `.env.example` tiver mudado): dentro da pasta `backend`, copie o arquivo `.env.example` pra `.env`:
   ```bash
   cp .env.example .env
   ```
   Se o comando não funcionar no seu terminal, duplique o arquivo `.env.example` pelo próprio VS Code e renomeie a cópia pra `.env`. O conteúdo já vem certo, não precisa mudar nada.

3. **Instale/atualize as dependências.** Sempre que o `git pull` trouxer mudança no `package.json` (por exemplo, um pacote novo foi adicionado), rode de novo dentro da pasta `backend`:
   ```bash
   npm install
   ```

4. **Suba o banco de dados via Docker.** Na raiz do projeto (onde tá o `docker-compose.yml`):
   ```bash
   docker compose up -d
   ```
   Confirme que os dois containers subiram com `docker ps`. Pra acessar o phpMyAdmin pelo navegador: `http://localhost:8080` (usuário `root`, senha `root`).

5. **Suba o servidor.** Dentro da pasta `backend`:
   ```bash
   npm start
   ```
   Acesse `http://localhost:3000` no navegador pra ver o site, e `http://localhost:3000/admin` pra ver o painel administrativo.

### 5.3 Deu erro? Checklist rápido

- **"Cannot GET /..." ou a página não abre:** confirme que apareceu no terminal a mensagem "Servidor rodando em http://localhost:3000". Se não apareceu, o servidor não subiu — olhe o erro em vermelho no terminal.
- **Erro de conexão com o banco (tipo "ECONNREFUSED"):** o Docker não tá rodando. Confirme que o Docker Desktop tá aberto e rode `docker compose up -d`.
- **"Cannot find module..." (mysql2, dotenv, etc):** faltou instalar dependências. Rode `npm install` de novo dentro do `backend`.
- **Ainda não funciona:** confirme que o arquivo `.env` existe dentro do `backend` (não só o `.env.example`).

## 6. Fluxo de trabalho no dia a dia

Depois de mexer no projeto, suba suas alterações com:

```bash
git add .
git commit -m "tipo: descrição curta da mudança"
git push
```

Usamos prefixos nos commits pra organizar o histórico: `feat` pra funcionalidade nova, `fix` pra correção de bug, `docs` pra documentação, `chore` pra manutenção/organização (tipo ajustar `.gitignore` ou trocar dependência), `style` pra ajuste visual, e `refactor` pra reorganização de código sem mudar o comportamento.

Qualquer dúvida, chama no grupo!