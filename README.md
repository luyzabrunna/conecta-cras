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
- **Backend:** Node.js + Express
- **Banco de dados:** MySQL (gerenciado via phpMyAdmin)

## Equipe

-Andressa — prototipagem das telas
- Ana Carla — frontend 
- Brunna Luyza — backend, banco de dados e API
- Maria Eduarda — documentação e relacionamento com o CRAS


## Como rodar o projeto

```bash
cd backend
npm install
npm start
```

O servidor deve subir em `http://localhost:3000`.

## Estrutura de pastas

```
conecta-cras/
├── backend/        # API, servidor Express e banco de dados
├── frontend/
│   ├── public/     # Site público
│   └── admin/      # Painel administrativo
└── docs/           # Documentação do projeto
```
