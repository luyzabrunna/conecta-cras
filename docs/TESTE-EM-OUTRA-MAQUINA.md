# Teste do Conecta CRAS no seu computador

Este guia é para testar o projeto do zero em um computador diferente do da Brunna. Se algo quebrar na sua máquina, ela corrige antes da apresentação. Por isso, **qualquer erro que aparecer é bem-vindo**: não tente resolver sozinha, só anote e mande.

Você não precisa saber programar. É só seguir os passos na ordem, copiando e colando os comandos.

**Quanto tempo leva:** de 40 minutos a 1 hora, a maior parte esperando instalação e download.

## Regras do teste

1. **Não altere nenhum arquivo do projeto.** Este é um teste de rodar, não de editar.
2. **Não faça commit nem push.** Se o Git ou o VS Code oferecerem para enviar alguma coisa, diga que não.
3. **Não mande para ninguém o conteúdo do arquivo `backend/.env`.** Ele guarda segredos.
4. **A senha do painel administrativo vem no privado.** Não escreva ela no grupo.
5. Se ficar travada em algum passo por mais de 10 minutos, pare e mande a mensagem do passo 9. Isso é um resultado útil para o teste.

## O que você precisa ter

- Computador com Windows 10 ou 11 de 64 bits, ou Mac
- Internet boa, porque o primeiro download é de uns 1,5 GB
- Uns 8 GB livres no disco
- Uma conta no GitHub que já aceitou o convite do repositório
- Se você usa **XAMPP, Laragon, WAMP ou MySQL instalado**, feche ou desligue antes. Eles usam as mesmas portas do projeto e causam erro.

---

## Passo 1: abrir o terminal

O terminal é a janelinha onde você digita comandos.

- **Windows:** clique no menu Iniciar, digite `PowerShell` e abra o **Windows PowerShell**.
- **Mac:** aperte Cmd + Espaço, digite `Terminal` e aperte Enter.

Deixe aberto. Você vai usar ele o tempo todo.

## Passo 2: instalar o Git e o Docker Desktop

### 2.1 Git

Veja se você já tem. No terminal, digite:

```
git --version
```

Se aparecer algo como `git version 2.45`, já está instalado, pule para o 2.2. Se aparecer erro, instale em https://git-scm.com/downloads, escolhendo a versão do seu sistema. Pode ir clicando em **Next** até o fim, sem mudar nada. Depois feche e abra o terminal de novo.

### 2.2 Docker Desktop

O Docker é o programa que roda o projeto inteiro, sem você instalar mais nada.

1. Baixe em https://www.docker.com/products/docker-desktop
   - **Windows:** botão do Windows. Escolha a versão AMD64, que serve para quase todos os computadores.
   - **Mac:** escolha **Apple chip** se seu Mac é de 2021 em diante, ou **Intel chip** se for mais antigo. Se não souber, clique na maçã no canto da tela e em "Sobre este Mac".
2. Abra o instalador. No Windows, deixe marcada a opção **Use WSL 2 instead of Hyper-V**.
3. Quando terminar, **reinicie o computador** se ele pedir.
4. Abra o **Docker Desktop**. Aceite os termos. Se pedir login, procure **Skip** ou **Continue without signing in**, não precisa de conta.
5. **Espere até ele ficar pronto.** No canto inferior esquerdo da janela do Docker aparece uma barrinha ou um texto. Só continue quando estiver escrito **Engine running** ou aparecer em verde. Isso pode levar alguns minutos na primeira vez.

Se o Windows perguntar sobre o **Firewall**, clique em **Permitir acesso**.

### 2.3 Conferir

No terminal, rode os três comandos, um de cada vez:

```
git --version
docker --version
docker compose version
```

Os três têm que responder com um número de versão. Se algum disser que o comando não existe, feche o terminal, abra de novo e tente. Se ainda falhar, vá para o passo 9.

---

## Passo 3: baixar o projeto

Vamos criar uma pasta nova só para o teste e baixar o projeto dentro dela.

**Windows:**

```
cd $HOME\Documents
git clone https://github.com/luyzabrunna/conecta-cras.git
cd conecta-cras
```

**Mac:**

```
cd ~/Documents
git clone https://github.com/luyzabrunna/conecta-cras.git
cd conecta-cras
```

O Git pode abrir uma janela do navegador pedindo para você entrar no GitHub. Entre com a conta que aceitou o convite e autorize.

Para conferir, liste os arquivos da pasta:

- **Windows:** `dir`
- **Mac:** `ls`

Tem que aparecer, entre outros, **backend**, **frontend**, **docker-compose.yml** e **README.md**.

Se der erro dizendo que o repositório não foi encontrado, é porque você não aceitou o convite ou entrou com a conta errada. Avise a Brunna.

## Passo 4: criar o arquivo de configuração

O projeto precisa de um arquivo chamado `.env`, que não vem do GitHub de propósito, porque guarda senhas. Você cria o seu a partir de um modelo.

**Windows:**

```
copy backend\.env.example backend\.env
notepad backend\.env
```

**Mac:**

```
cp backend/.env.example backend/.env
open -e backend/.env
```

O arquivo abre em um editor de texto. Procure a linha:

```
JWT_SECRET=
```

Escreva depois do `=` qualquer texto comprido, **sem espaços e sem aspas**. Por exemplo:

```
JWT_SECRET=chave-de-teste-da-minha-maquina-12345
```

**Não mexa em mais nada.** A linha `MAIL_PASS=` fica vazia mesmo. Isso significa que o sistema não envia e-mail no seu teste, e tudo o resto funciona normalmente.

Salve com Ctrl+S (Cmd+S no Mac) e feche o editor.

## Passo 5: subir o sistema

1. Confirme que o **Docker Desktop está aberto e com Engine running**.
2. No terminal, dentro da pasta `conecta-cras`, rode:

```
docker compose up -d --build
```

3. **Espere.** Na primeira vez ele baixa programas e monta o sistema, e isso leva de 3 a 10 minutos. Vão aparecer muitas linhas passando. É normal. Termina quando o terminal volta a aceitar comandos e aparecem linhas com `Started` ou `Healthy`.

Agora espere mais **1 ou 2 minutos**, porque o banco de dados ainda está se criando por dentro. Depois rode:

```
docker compose ps
```

Tem que aparecer **três** linhas: `conecta-cras-mysql`, `conecta-cras-phpmyadmin` e `conecta-cras-backend`, todas com `Up` na coluna de status. O mysql deve dizer `healthy`.

Para ver se o servidor subiu direito, rode:

```
docker compose logs backend
```

Tem que aparecer a linha **`Servidor rodando em http://localhost:3000`**.

## Passo 6: conferir que funcionou

Abra o navegador e entre nestes endereços:

| Endereço | O que tem que aparecer |
|---|---|
| http://localhost:3000/api/status | `{"status":"ok","banco":"conectado"}` |
| http://localhost:3000 | O site do CRAS, **já com um aviso e 3 eventos**, sem você ter feito nada |
| http://localhost:8080 | O phpMyAdmin. Se pedir login, usuário `root` e senha `root` |

Se a home abriu com o aviso e os eventos, **o projeto subiu do zero na sua máquina**. Isso já é a parte mais importante do teste. Mande uma mensagem avisando a Brunna.

---

## Passo 7: roteiro de testes

Faça cada item e marque o resultado. Se algo não for como o esperado, anote **qual item** e tire um **print**.

### A. Site público

| Item | O que fazer | O que tem que acontecer |
|---|---|---|
| A1 | Abrir http://localhost:3000 e apertar Ctrl+F5 | Caixa amarela com o aviso **Atualização do Cadastro Único** e a seção **Próximos Eventos** com 3 eventos: Mutirão de Cadastro Único, Oficina de Empreendedorismo Feminino e Vacinação e Orientação de Saúde |
| A2 | Rolar a página e clicar em **Saiba mais** em cada um dos 4 serviços | Abre a página de cada serviço, com sobre, documentos e os outros serviços |
| A3 | Clicar em **Eventos** no menu | Aparecem os 3 eventos. Os botões de filtro mostram **só os meses desses eventos**, mais o "Todos os Meses" |
| A4 | Clicar em um botão de mês, depois em "Todos os Meses" | O filtro mostra só os eventos daquele mês e depois volta a mostrar todos |
| A5 | Clicar em **FAQ** e abrir várias perguntas | Só uma resposta fica aberta por vez |
| A6 | Clicar no logo, no menu e nos links do rodapé | Todos levam a páginas que existem, sem erro |

### B. Ouvidoria (página Contato)

| Item | O que fazer | O que tem que acontecer |
|---|---|---|
| B1 | Clicar em **Enviar Mensagem** com tudo vazio | Aparecem avisos em vermelho embaixo dos campos, e nada é enviado |
| B2 | Digitar `abc` no campo de e-mail e enviar | Aviso de e-mail inválido |
| B3 | Preencher tudo corretamente e enviar | Aparece **Mensagem enviada!** |
| B4 | No phpMyAdmin, abrir o banco `conecta_cras`, depois a tabela `mensagens_ouvidoria` | A mensagem que você mandou está lá |
| B5 | Enviar a mesma mensagem 6 vezes seguidas | Na 6ª aparece um alerta dizendo que você enviou muitas mensagens em pouco tempo. É o limite anti-spam funcionando |

**Sobre o e-mail:** no seu teste a mensagem fica só no banco, porque você não tem a senha do e-mail da Ouvidoria. Isso é esperado. A Brunna testa a parte do e-mail.

Depois do B5, o limite só libera depois de 15 minutos. Para liberar na hora, rode `docker compose restart backend`.

### C. Painel administrativo

Peça a senha à Brunna no privado. O usuário é `admin@cras.gov.br`.

| Item | O que fazer | O que tem que acontecer |
|---|---|---|
| C1 | Abrir http://localhost:3000/admin/login.html e entrar com a senha **errada** | Mensagem de e-mail ou senha incorretos |
| C2 | Entrar com a senha certa | Abre o painel, com cartões de números, a tabela de eventos e a lista de avisos |
| C3 | Olhar a tabela de eventos | Aparecem **4 eventos**. O Semana da Criança está como **Rascunho** |
| C4 | Clicar em **Novo Evento** e preencher tudo: nome, uma data de daqui a 2 semanas, categoria, horário e local | O evento aparece na tabela |
| C5 | Voltar ao site, ir em **Eventos** e apertar Ctrl+F5 | O evento novo está lá, com categoria, horário e local |
| C6 | No painel, editar o evento e mudar o **local** | No site, depois de Ctrl+F5, o local mudou |
| C7 | No painel, mudar o status do evento para **Rascunho** | Ele some do site. Volte para **Ativo** e ele reaparece |
| C8 | Apagar o evento que você criou | Some do painel e do site. Se era o único daquele mês, o botão do mês some do filtro |
| C9 | Clicar em **Criar Aviso**, preencher e salvar | Na home, a caixa amarela passa a mostrar o aviso novo |
| C10 | Apagar o aviso que você criou | A home volta a mostrar o aviso anterior |
| C11 | Clicar em **Sair** e depois apertar a **seta de voltar** do navegador | **O painel NÃO pode abrir.** Tem que ir para o login ou para outra página |
| C12 | Digitar na barra de endereço http://localhost:3000/admin/dashboard.html sem estar logada | Tem que mandar direto para a tela de login |

### D. Os dados ficam guardados

1. Crie um evento no painel, como no C4.
2. No terminal, rode:

```
docker compose down
```

3. Depois rode de novo:

```
docker compose up -d
```

4. Espere 1 minuto, abra o painel, entre e confira: **o evento que você criou continua lá.**

**Nunca rode `docker compose down -v`** nesta etapa, porque o `-v` apaga os dados.

### E. Acessibilidade, celular e navegador

| Item | O que fazer | O que tem que acontecer |
|---|---|---|
| E1 | Na barra azul do topo, clicar em **A+**, **A** e **A-** | O tamanho do texto muda em toda a página. Teste em pelo menos 3 páginas |
| E2 | Clicar em **Alto Contraste** | A página fica preta, com letras brancas e amarelas, e tudo continua legível |
| E3 | Diminuir a largura da janela do navegador ou apertar F12 e depois Ctrl+Shift+M | O site se adapta e aparece o menu de três risquinhos |
| E4 | Clicar no menu de três risquinhos | O menu abre e fecha, e nada fica cortado nem aparece barra de rolagem para o lado |
| E5 | Abrir o site em **outro navegador** (Chrome, Edge ou Firefox) | Funciona igual |

---

## Passo 8: testes extras para cada pessoa

Todas fazem os itens A, B, C, D e E. Além disso, cada uma presta atenção em uma coisa.

**Ana Carla, o painel e a agenda.**
Tente quebrar o painel. Crie eventos em **meses diferentes** e veja os botões do filtro. Escreva um nome de evento bem grande. Use acentos e caracteres como `<b>teste</b>` no nome, que tem que aparecer escrito do jeito que você digitou, sem virar negrito. Deixe campos vazios e veja se os avisos fazem sentido.

**Andressa, o visual.**
Abra o protótipo no Figma ao lado e compare página por página: cores, fontes, espaçamentos, ícones e cards. Veja também as versões de celular. Anote cada diferença com um print do site e do protótipo. Veja o modo de alto contraste: dá para ler tudo?

**Maria Eduarda, o conteúdo.**
Leia como se fosse o CRAS: horários de atendimento, endereço, telefone, nome dos serviços, lista de documentos e perguntas do FAQ. Veja se há erro de informação ou de português. Depois, use o formulário de contato como um cidadão usaria: o texto está claro? Uma pessoa mais velha entenderia o que fazer?

---

## Passo 9: se algo der errado

Não precisa entender o erro. Só descubra qual é o seu caso na tabela, tente a solução e, se não resolver, mande as informações para a Brunna.

| O que aconteceu | O que fazer |
|---|---|
| `git` ou `docker` não é reconhecido | Feche o terminal, abra de novo. Se continuar, reinicie o computador |
| Erro falando de `docker daemon`, `pipe` ou `docker_engine` | O Docker Desktop não está aberto ou ainda está iniciando. Abra, espere o Engine running e tente de novo |
| Docker pede para atualizar o **WSL** | No PowerShell, rode `wsl --update`, reinicie o computador e abra o Docker de novo |
| Docker diz que a **virtualização** está desligada | Avise a Brunna. Precisa ligar uma opção na BIOS, com ajuda |
| `port is already allocated`, `address already in use` ou `Bind for ... failed` | Outro programa usa a porta. Feche XAMPP, Laragon, WAMP, MySQL ou qualquer servidor local, reinicie o computador e tente de novo |
| `env file ... not found` | Você pulou o passo 4. Faça o passo 4 e rode o comando do passo 5 de novo |
| `localhost:3000` diz que recusou a conexão | Rode `docker compose ps`. Se o backend não estiver `Up`, rode `docker compose logs backend` e mande o resultado |
| O backend fica reiniciando, ou aparece `Cannot find module` | Mande o resultado de `docker compose logs backend`. Esse erro é importante para a Brunna |
| `/api/status` mostra `sem conexão` | O banco ainda está iniciando. Espere 1 minuto e atualize |
| A home abre mas **sem aviso e sem eventos** | Abra http://localhost:3000/api/eventos. Se mostrar uma lista, aperte Ctrl+F5 na home. Se mostrar erro, mande o `docker compose logs backend` |
| O site abre, mas a página está sem cores ou sem estilo | Aperte Ctrl+F5. Se continuar, mande um print |
| O Git pede usuário e senha e dá erro | Use o login pelo navegador. A senha do GitHub não funciona no terminal, e o Git abre uma janela para entrar |

### Como juntar as informações para a Brunna

Mande **os três**:

1. **Print da tela** com o erro, mostrando o terminal inteiro ou a página.
2. O resultado deste comando, que salva as mensagens do sistema em um arquivo chamado `logs.txt` dentro da pasta do projeto:

```
docker compose logs > logs.txt
```

   Depois mande o arquivo `logs.txt`. Ele não tem senhas.
3. O resultado destes dois comandos, copiado e colado:

```
docker compose ps -a
docker --version
```

## Passo 10: mandar o relatório

Quando terminar, copie o modelo abaixo, preencha e mande no grupo. Use ✅ para o que funcionou, ❌ para o que falhou e ➖ para o que você não conseguiu testar.

```
RELATÓRIO DE TESTE - [seu nome]

Computador: [Windows 10 / Windows 11 / Mac] 
Navegador: [Chrome / Edge / Firefox]
Já tinha o Docker instalado? [sim / não]
Quanto tempo levou do começo até o site abrir? [__ minutos]

Subiu do zero sem ajuda? [sim / não]
Se não, em qual passo parou? [passo __]

A1 [ ]   A2 [ ]   A3 [ ]   A4 [ ]   A5 [ ]   A6 [ ]
B1 [ ]   B2 [ ]   B3 [ ]   B4 [ ]   B5 [ ]
C1 [ ]   C2 [ ]   C3 [ ]   C4 [ ]   C5 [ ]   C6 [ ]
C7 [ ]   C8 [ ]   C9 [ ]   C10 [ ]  C11 [ ]  C12 [ ]
D [ ]
E1 [ ]   E2 [ ]   E3 [ ]   E4 [ ]   E5 [ ]

Problemas encontrados (com o item e o print):
-

O que achei confuso ou poderia melhorar:
-
```

## Quando terminar

Para desligar o sistema e deixar o computador leve, rode na pasta do projeto:

```
docker compose down
```

Se você **não vai mais usar** o projeto e quer apagar tudo, inclusive os dados de teste, rode:

```
docker compose down -v
```

Pode fechar o Docker Desktop. Obrigada por testar!
