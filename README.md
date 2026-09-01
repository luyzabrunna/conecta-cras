# Conecta CRAS

Sistema web responsivo para facilitar o acesso da população às informações dos CRAS (Centros de Referência de Assistência Social) do município.

## Sobre o projeto

Trabalho da disciplina de Atividade de Extensão 3 (ADS). O objetivo é reduzir a dificuldade que a população enfrenta para encontrar informações da assistência social, sem precisar ir presencialmente ao CRAS ou depender de terceiros.

Projeto piloto: um CRAS parceiro terá informações completas (horários, serviços, avisos, campanhas, última atualização), enquanto os demais CRAS terão informações básicas (nome, bairro, endereço, telefone, horário). Estrutura pensada para expansão futura a todos os CRAS do município.

## Funcionalidades

- Site público responsivo com informações dos CRAS da cidade
- Página detalhada do CRAS parceiro (horários, serviços, avisos, campanhas)
- Listagem básica dos demais CRAS
- Painel administrativo simples para servidores atualizarem horários, contatos e avisos

## Stack

- **Frontend:** HTML, CSS e JavaScript
- **Backend:** Node.js + Express, em arquitetura de camadas (routes, controllers, models)
- **Banco de dados:** MySQL, gerenciado via phpMyAdmin
- **Ambiente:** Docker (sobe o MySQL e o phpMyAdmin, sem precisar instalar nada localmente)

## Equipe

- Brunna Luyza — backend e API
- Maria — documentação, relacionamento com o CRAS e banco de dados
- Andressa — prototipagem das telas
- Ana Carla — frontend 
## Como rodar o projeto

Pré-requisitos: [Node.js](https://nodejs.org) e [Docker Desktop](https://www.docker.com/products/docker-desktop) instalados.

```bash
# subir o banco de dados
docker compose up -d

# configurar variáveis de ambiente (só na primeira vez)
cd backend
cp .env.example .env

# instalar dependências e rodar o servidor
npm install
npm start
```

O site sobe em `http://localhost:3000`, o painel administrativo em `http://localhost:3000/admin`, e o phpMyAdmin em `http://localhost:8080` (usuário `root`, senha `root`).

Guia completo com passo a passo detalhado e checklist de erros comuns em [`COMO-COLABORAR.md`](./COMO-COLABORAR.md).

## Estrutura de pastas

```
conecta-cras/
├── backend/
│   ├── config/       # conexão com o banco de dados
│   ├── models/        # queries no banco de dados
│   ├── controllers/   # lógica das requisições
│   ├── routes/        # caminhos da API
│   └── server.js
├── frontend/
│   ├── public/         # site público (com pasta assets: css, js, img)
│   └── admin/          # painel administrativo
├── docs/                # documentação do projeto
└── docker-compose.yml   # MySQL + phpMyAdmin
```