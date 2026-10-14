-- Schema do Conecta CRAS
-- Como rodar: phpMyAdmin (localhost:8080), banco conecta_cras, aba SQL, colar tudo e executar.
-- Pode rodar de novo quando quiser: ele apaga e recria as tabelas com os dados de exemplo.

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

-- Dados de exemplo (os mesmos do painel e do protótipo)
INSERT INTO eventos (nome, `data`, status, descricao) VALUES
('Mutirão de Cadastro Único', '2026-09-05', 'Ativo', 'Atendimento especial para atualização e inclusão no Cadastro Único.'),
('Oficina de Empreendedorismo Feminino', '2026-09-10', 'Ativo', 'Curso gratuito de empreendedorismo para mulheres.'),
('Vacinação e Orientação de Saúde', '2026-09-18', 'Ativo', 'Mutirão de vacinação em parceria com a UBS.'),
('Semana da Criança', '2026-10-07', 'Rascunho', '');

INSERT INTO avisos (titulo, mensagem, `data`) VALUES
('Sistema CadÚnico em Manutenção', 'O sistema estará em manutenção entre 01 e 05 de setembro. Agendamentos nesse período serão remarcados. Ligue: (63) 99961-8630.', '2026-09-01'),
('Novas Vagas no SCFV para Idosos', 'Inscrições abertas para o grupo de convivência de idosos. Atividades às terças e quintas, 14h às 16h. Vagas limitadas.', '2026-08-28');

-- Administrador de demonstração: admin@cras.gov.br / cras2026 (senha guardada com hash bcrypt)
INSERT INTO usuarios (nome, email, senha_hash) VALUES
('Administrador', 'admin@cras.gov.br', '$2a$10$6AwAx8iFlB9nhK7SuqumIui3Bea98njz8QANTaEtCWKECwVhOUxL.');
