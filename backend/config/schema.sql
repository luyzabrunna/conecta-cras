-- Schema do Conecta CRAS
--
-- Roda sozinho na primeira vez que o banco sobe no Docker (volume vazio).
-- Também dá para colar na aba SQL do phpMyAdmin (banco conecta_cras).
-- ATENÇÃO: este arquivo APAGA e recria as tabelas. Não rode em um banco com dados que você quer manter.

SET NAMES utf8mb4;

DROP TABLE IF EXISTS eventos;
DROP TABLE IF EXISTS avisos;
DROP TABLE IF EXISTS mensagens_ouvidoria;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  `data` DATE NOT NULL,
  status ENUM('Ativo', 'Rascunho', 'Encerrado') NOT NULL DEFAULT 'Ativo',
  descricao TEXT,
  categoria VARCHAR(100) NULL,
  horario VARCHAR(100) NULL,
  local VARCHAR(255) NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE avisos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  mensagem TEXT NOT NULL,
  `data` DATE NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE mensagens_ouvidoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NULL,
  tipo ENUM('sugestao', 'reclamacao', 'elogio', 'duvida', 'outro') NOT NULL,
  mensagem TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(100) NOT NULL
) DEFAULT CHARSET = utf8mb4;

-- Dados de exemplo. As datas são calculadas a partir de hoje, então os eventos
-- sempre aparecem como "próximos", seja qual for o dia em que o banco for criado.
-- As categorias seguem as cores dos cards do site: Atendimento, Oficina, Saúde e Evento.
INSERT INTO eventos (nome, `data`, status, descricao, categoria, horario, local) VALUES
('Mutirão de Cadastro Único', CURDATE() + INTERVAL 7 DAY, 'Ativo', 'Atendimento especial para atualização e inclusão no Cadastro Único. Traga os documentos originais da família.', 'Atendimento', '08h00 às 12h00', 'CRAS Vila São João'),
('Oficina de Empreendedorismo Feminino', CURDATE() + INTERVAL 14 DAY, 'Ativo', 'Curso gratuito de empreendedorismo para mulheres em situação de vulnerabilidade social.', 'Oficina', '14h00 às 16h00', 'Salão Comunitário, Rua Araguaia'),
('Vacinação e Orientação de Saúde', CURDATE() + INTERVAL 21 DAY, 'Ativo', 'Mutirão de vacinação em parceria com a UBS.', 'Saúde', '09h00 às 11h00', 'CRAS Vila São João'),
('Semana da Criança', CURDATE() + INTERVAL 30 DAY, 'Rascunho', 'Atividades recreativas para crianças e adolescentes.', 'Evento', '13h00 às 17h00', 'CRAS Vila São João');

INSERT INTO avisos (titulo, mensagem, `data`) VALUES
('Atualização do Cadastro Único', 'Famílias com o cadastro desatualizado há mais de dois anos devem procurar o CRAS para atualizar. Ligue: (63) 99961-8630.', CURDATE()),
('Novas Vagas no SCFV para Idosos', 'Inscrições abertas para o grupo de convivência de idosos. Atividades às terças e quintas, das 14h às 16h. Vagas limitadas.', CURDATE() - INTERVAL 5 DAY);

-- Administrador de demonstração (a senha fica guardada com hash bcrypt, nunca em texto).
-- Para trocar a senha: docker compose exec backend node scripts/gerar-hash-senha.js "NovaSenha"
INSERT INTO usuarios (nome, email, senha_hash) VALUES
('Administrador', 'admin@cras.gov.br', '$2a$10$6AwAx8iFlB9nhK7SuqumIui3Bea98njz8QANTaEtCWKECwVhOUxL.');
