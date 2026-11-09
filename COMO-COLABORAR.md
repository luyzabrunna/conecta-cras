# Como rodar e colaborar no Conecta CRAS

Este guia é para quem entrou no projeto e quer rodar o sistema no próprio computador. Siga na ordem.

## 1. O que instalar

- **Git**
- **Docker Desktop**: https://www.docker.com/products/docker-desktop

Não precisa instalar Node.js, MySQL nem XAMPP. Tudo roda dentro do Docker.

## 2. Aceitar o convite e clonar

Você recebe um convite por e-mail para colaborar no repositório. Aceite, abra um terminal em uma pasta de sua escolha e rode:

```bash
git clone https://github.com/luyzabrunna/conecta-cras.git
cd conecta-cras
```

## 3. Criar o arquivo de variáveis

O arquivo `backend/.env` guarda os segredos e **não vem no GitHub**, então cada pessoa cria o seu a partir do modelo.

```bash
# PowerShell ou CMD (Windows)
copy backend\.env.example backend\.env

# Mac, Linux ou Git Bash
cp backend/.env.example backend/.env
```

Depois abra o `backend/.env` no VS Code e preencha:

- `JWT_SECRET`: qualquer texto longo e aleatório, só seu
- `MAIL_PASS`: a senha de aplicativo do e-mail da Ouvidoria. Peça para a Brunna. Se você deixar vazio, o sistema funciona normalmente e só o e-mail da Ouvidoria não é enviado

Sem o arquivo `backend/.env`, o Docker mostra um erro dizendo que ele não foi encontrado.

## 4. Subir o sistema

Abra o Docker Desktop e espere ele terminar de iniciar. Na pasta do projeto, onde está o `docker-compose.yml`, rode:

```bash
docker compose up -d --build
```

A primeira vez demora alguns minutos. O banco é criado sozinho, com as tabelas e dados de exemplo.

## 5. Conferir se funcionou

```bash
docker ps
```

Devem aparecer três containers: `conecta-cras-mysql`, `conecta-cras-phpmyadmin` e `conecta-cras-backend`.

| Endereço | O que é |
|---|---|
| http://localhost:3000 | Site público |
| http://localhost:3000/api/status | Tem que mostrar `status: ok` e `banco: conectado` |
| http://localhost:3000/admin/login.html | Painel administrativo. Peça o usuário e a senha para a Brunna |
| http://localhost:8080 | phpMyAdmin, usuário `root` e senha `root` |

## 6. Comandos do dia a dia

```bash
docker compose up -d                       # sobe tudo
docker compose down                        # para tudo, sem apagar os dados
docker compose logs -f backend             # mostra o que o servidor está fazendo e os erros
docker compose restart backend             # reinicia o servidor depois de mudar código do backend
docker compose up -d --build -V backend    # use depois de mudar o package.json
```

Mudou só HTML, CSS ou JavaScript da pasta `frontend`? Não precisa reiniciar nada, basta recarregar a página com Ctrl+F5.

**Nunca rode `docker compose down -v`.** O `-v` apaga o volume do banco, e com ele todos os eventos, avisos e mensagens.

## 7. Trabalhando com Git

Antes de começar, sempre puxe as novidades:

```bash
git pull
```

Depois de mexer, envie:

```bash
git add .
git commit -m "tipo: descrição curta do que mudou"
git push
```

Prefixos do commit: `feat` para algo novo, `fix` para correção, `docs` para documentação, `style` para ajuste visual, `refactor` para reorganizar sem mudar o comportamento e `chore` para manutenção.

**Nunca envie ao GitHub:** o `backend/.env`, que tem senhas, e arquivos de backup do banco, como `backup.sql`, que têm dados de cidadãos.

## 8. Quando algo dá errado

**O Docker diz que não conecta ao servidor.** O Docker Desktop não está aberto. Abra, espere iniciar e rode o comando de novo.

**A porta 3000 já está em uso.** Algo mais está ocupando a porta. Feche programas que rodam um servidor, como um `npm start` antigo, e rode `docker compose up -d` de novo.

**`localhost:3000` recusou a conexão.** Rode `docker compose logs backend` e leia as últimas linhas. A mensagem `Servidor rodando em http://localhost:3000` indica que está tudo certo.

**O backend fica reiniciando sozinho.** Quase sempre é falta do `backend/.env` ou uma variável errada. Veja o erro em `docker compose logs backend`.

**`/api/status` mostra o banco sem conexão.** O MySQL ainda estava iniciando. Espere um minuto e atualize a página.

**O site abre, mas eventos e avisos não aparecem.** Abra `http://localhost:3000/api/eventos`. Se aparecer uma lista, aperte Ctrl+F5 na página. Se aparecer um erro, veja `docker compose logs backend`.

**Mudei o backend e nada mudou.** Rode `docker compose restart backend`.

**O e-mail da Ouvidoria não chega.** Rode `docker compose exec backend node scripts/testar-email.js`. O resultado diz o que está faltando e o que fazer.

## 9. Para refazer o banco do zero

Isso **apaga todos os dados**. Só use se quiser voltar aos dados de exemplo.

```bash
docker compose down -v
docker compose up -d --build
```
