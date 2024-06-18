-- Criação da database
CREATE DATABASE IF NOT EXISTS `DisparoRealVale`;

-- Seleciona a database criada
USE `DisparoRealVale`;

-- Tabela: acompanhamento
CREATE TABLE IF NOT EXISTS `acompanhamento` (
    `pkAcompanhamento` int AUTO_INCREMENT PRIMARY KEY,
    `dataInsercao` datetime,
    `tipoDisparo` varchar(20),
    `totalAssociadosApi` int,
    `totalRecebidos` int
);

-- Tabela: alinhamentoDisparos
CREATE TABLE IF NOT EXISTS `alinhamentoDisparos` (
    `pkAlinhamentoDisparo` int AUTO_INCREMENT PRIMARY KEY,
    `codigoAssociado` int,
    `fkAssociado` int,
    `nome` varchar(255),
    `cpf` varchar(14),
    `celular` varchar(26),
    `valorBoleto` decimal(10,2),
    `linkBoleto` varchar(255),
    `linhaDigitavel` varchar(255),
    `dataVencimento` date,
    `dataInsercao` datetime,
    `uuidv4` varchar(100),
    `checagem` varchar(50),
    `jsonErro` json,
    `errorMessage` varchar(255)
);

-- Tabela: associado
CREATE TABLE IF NOT EXISTS `associado` (
    `pkAssociado` int AUTO_INCREMENT PRIMARY KEY,
    `tipoDisparo` varchar(10),
    `codigoAssociado` int,
    `nomeAssociado` varchar(255),
    `cpfAssociado` varchar(14),
    `codigoSituacaoAssociado` int,
    `codigoRegionalAssociado` int,
    `nomeRegionalAssociado` varchar(255),
    `codigoBoleto` int,
    `nossoNumero` int,
    `codigoSituacaoBoleto` int,
    `codigoRegional` int,
    `mesReferente` varchar(7),
    `dataVencimento` date,
    `dataInsercao` datetime
);

-- Tabela: atualizacao
CREATE TABLE IF NOT EXISTS `atualizacao` (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `nomeAssociado` varchar(255),
    `cpfAssociado` varchar(14),
    `codigo_associado` varchar(70),
    `telefone` varchar(25)
);




-- Seleciona a database criada
USE `DisparoRealVale`;

-- Inserção de valores fictícios na tabela 'acompanhamento'
INSERT INTO acompanhamento (dataInsercao, tipoDisparo, totalAssociadosApi, totalRecebidos)
VALUES
    ('2024-06-15 08:30:00', 'SMS', 100, 95),
    ('2024-06-15 10:45:00', 'Email', 150, 140),
    ('2024-06-16 09:15:00', 'WhatsApp', 200, 180);

-- Inserção de valores fictícios na tabela 'alinhamentoDisparos'
INSERT INTO alinhamentoDisparos (codigoAssociado, fkAssociado, nome, cpf, celular, valorBoleto, linkBoleto, linhaDigitavel, dataVencimento, dataInsercao, uuidv4, checagem, jsonErro, errorMessage)
VALUES
    (1001, 1, 'João Silva', '123.456.789-00', '(11) 99999-8888', 150.50, 'http://example.com/boleto1', '12345678901234567890123456789012345678901234567890', '2024-07-10', '2024-06-15 08:30:00', 'abc123xyz456', 'OK', '{"error": "none"}', NULL),
    (1002, 2, 'Maria Souza', '987.654.321-00', '(21) 77777-6666', 200.75, 'http://example.com/boleto2', '09876543210987654321098765432109876543210987654321', '2024-07-05', '2024-06-15 10:45:00', 'def456uvw789', 'Erro', '{"error": "invalid cpf"}', 'CPF inválido'),
    (1003, 3, 'Pedro Oliveira', '111.222.333-00', '(31) 33333-1111', 180.00, 'http://example.com/boleto3', '98765432109876543210987654321098765432109876543210', '2024-07-15', '2024-06-16 09:15:00', 'ghi789rst012', 'OK', NULL, NULL);

-- Inserção de valores fictícios na tabela 'associado'
INSERT INTO associado (tipoDisparo, codigoAssociado, nomeAssociado, cpfAssociado, codigoSituacaoAssociado, codigoRegionalAssociado, nomeRegionalAssociado, codigoBoleto, nossoNumero, codigoSituacaoBoleto, codigoRegional, mesReferente, dataVencimento, dataInsercao)
VALUES
    ('SMS', 1001, 'João Silva', '123.456.789-00', 1, 1, 'Regional Norte', 101, 12345, 1, 1, '2024-07', '2024-07-10', '2024-06-15 08:30:00'),
    ('Email', 1002, 'Maria Souza', '987.654.321-00', 2, 2, 'Regional Sul', 102, 54321, 2, 2, '2024-07', '2024-07-05', '2024-06-15 10:45:00'),
    ('WhatsApp', 1003, 'Pedro Oliveira', '111.222.333-00', 3, 3, 'Regional Sudeste', 103, 67890, 3, 3, '2024-07', '2024-07-15', '2024-06-16 09:15:00');

-- Inserção de valores fictícios na tabela 'atualizacao'
INSERT INTO atualizacao (nomeAssociado, cpfAssociado, codigo_associado, telefone)
VALUES
    ('João Silva', '123.456.789-00', 'abc123xyz456', '(11) 99999-8888'),
    ('Maria Souza', '987.654.321-00', 'def456uvw789', '(21) 77777-6666'),
    ('Pedro Oliveira', '111.222.333-00', 'ghi789rst012', '(31) 33333-1111');
