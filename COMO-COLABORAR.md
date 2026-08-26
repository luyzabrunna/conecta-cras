# Como acessar e rodar o Conecta CRAS

Esse guia é pra quem entrou no repositório e nunca mexeu nele. Segue o passo a passo direitinho que dá pra rodar o projeto na sua máquina.

## 1. Aceitando o convite

Você vai receber um convite por e-mail (ou notificação no GitHub) pra ser colaboradora do repositório `conecta-cras`. Aceita o convite clicando no link, e pronto — você já pode ver o repositório e, com permissão de "Write", dar push nas suas alterações.

## 2. Clonando o repositório

Com o Git instalado no seu computador, abra o terminal (ou o terminal do VS Code) numa pasta de sua preferência e rode:

```bash
git clone https://github.com/luyzabrunna/conecta-cras.git
cd conecta-cras
```

Isso baixa uma cópia completa do projeto pra sua máquina.

## 3. Como o repositório é organizado

- `backend/` — o servidor Node.js + Express, que cuida da API e da comunicação com o banco de dados
- `frontend/public/` — o site que a população vai acessar
- `frontend/admin/` — o painel administrativo, usado pelos servidores do CRAS
- `docs/` — documentação do projeto
- `README.md` — visão geral do projeto, sempre atualizado com o essencial

## 4. Tecnologias usadas

O projeto usa HTML, CSS e JavaScript puro no frontend (sem framework), Node.js com Express no backend, e MySQL como banco de dados, gerenciado através do phpMyAdmin.

## 5. Rodando o projeto

Você só precisa instalar o Node.js localmente — o MySQL e o phpMyAdmin sobem via Docker, então ninguém precisa instalar MySQL na máquina.

### 5.1 Pré-requisitos

1. Instale o [Node.js](https://nodejs.org) (versão LTS).
2. Instale o [Docker Desktop](https://www.docker.com/products/docker-desktop) e deixe ele aberto/rodando.

### 5.2 Subindo o banco de dados

Na raiz do projeto (onde tá o arquivo `docker-compose.yml`), rode:

```bash
docker compose up -d
```

Isso sobe dois containers: o MySQL (na porta 3306) e o phpMyAdmin (na porta 8080). Pra acessar o phpMyAdmin pelo navegador, entra em `http://localhost:8080` — usuário `root`, senha `root` (só localmente, não é senha de produção).

Pra parar os containers depois: `docker compose down`. Se quiser apagar os dados do banco também, use `docker compose down -v`.

### 5.3 Configurando o backend

Dentro da pasta `backend`, copie o arquivo `.env.example` pra `.env`:

```bash
cp .env.example .env
```

Esse arquivo já vem com os dados de conexão certinhos pra falar com o MySQL do Docker. Não precisa mudar nada, a menos que você tenha alterado algo no `docker-compose.yml`.

### 5.4 Instalando dependências e rodando o servidor

Ainda dentro da pasta `backend`:

```bash
npm install
npm start
```

Acesse `http://localhost:3000` no navegador pra ver o site, e `http://localhost:3000/admin` pra ver o painel administrativo.

## 6. Fluxo de trabalho no dia a dia

Sempre que for mexer no projeto, puxe as últimas alterações antes de começar (`git pull`), faça suas mudanças, e suba com:

```bash
git add .
git commit -m "tipo: descrição curta da mudança"
git push
```

Usamos prefixos nos commits pra organizar o histórico: `feat` pra funcionalidade nova, `fix` pra correção de bug, `docs` pra documentação, `style` pra ajuste visual, e `refactor` pra reorganização de código sem mudar o comportamento.

Qualquer dúvida, chama no grupo!
