-- DDL (Data Definition Language)
-- Criação do Banco de Dados e Tabelas

DROP DATABASE IF EXISTS navix;

CREATE DATABASE IF NOT EXISTS navix;

USE navix;

-- Tabela: cargo (Ajustado o 'id' para ser AUTO_INCREMENT para facilitar a FK)
CREATE TABLE cargo(
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(30)
);

-- Tabela: empresa
CREATE TABLE empresa(
    id INT PRIMARY KEY AUTO_INCREMENT,
    razaoSocial VARCHAR(50),
    cnpj VARCHAR(14),
    codigo_ativacao VARCHAR(20)
);

-- Tabela: endereco
CREATE TABLE endereco(
    id INT PRIMARY KEY AUTO_INCREMENT,
    rua VARCHAR(50),
    numero INT,
    cep CHAR(8),
    bairro VARCHAR(30),
    cidade VARCHAR(30),
    estado VARCHAR(20),
    pais VARCHAR(20),
    fkEmpresa INT NOT NULL,
    CONSTRAINT fkEnderecoEmpresa FOREIGN KEY(fkEmpresa) REFERENCES empresa(id)
);

-- Tabela: funcionario
CREATE TABLE funcionario(
    id INT PRIMARY KEY AUTO_INCREMENT,
    fkEmpresa INT NOT NULL,
    nome VARCHAR(50),
    sobrenome VARCHAR(50),
    telefone VARCHAR(11),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(250),
    statusPerfil ENUM("Inativo", "Ativo") NOT NULL DEFAULT("Ativo"),
    fkCargo INT NOT NULL,
    caminhoImagem VARCHAR(500) DEFAULT("../assets/img/foto-usuario.png"),
    CONSTRAINT fkEmpresaFuncionario FOREIGN KEY(fkEmpresa) REFERENCES empresa(id),
    CONSTRAINT fkCargoFuncionario FOREIGN KEY(fkCargo) REFERENCES cargo(id)
);

-- Tabela: lote
CREATE TABLE lote(
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo_lote VARCHAR(50) UNIQUE,
    data_fabricacao DATE,
    fkEmpresa INT,
    status ENUM('Ativo','Manutenção','Inativo'),
    CONSTRAINT fkEmpresaLote FOREIGN KEY(fkEmpresa) REFERENCES empresa(id),
    UNIQUE KEY uk_lote_empresa (codigo_lote, fkEmpresa)
);

-- Tabela: modelo
CREATE TABLE modelo(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50),
    mac_address VARCHAR(20) UNIQUE NULL,
    status ENUM('Ativo','Descontinuado'),
    versaoPilotoAutomatico VARCHAR(45),
    fkEmpresa int,
    CONSTRAINT fkEmpresaModelo FOREIGN KEY(fkEmpresa) REFERENCES empresa(id),
    UNIQUE KEY uk_modelo_empresa (nome, versaoPilotoAutomatico, fkEmpresa)
);

-- Tabela: veiculo
CREATE TABLE veiculo(
    id INT PRIMARY KEY AUTO_INCREMENT,
    fkModelo INT NOT NULL,
    fkLote INT NOT NULL,
    data_ativacao DATE,
    quantidade_modelo INT,
    CONSTRAINT fkModeloVeiculo FOREIGN KEY(fkModelo) REFERENCES modelo(id),
    CONSTRAINT fkLoteVeiculo FOREIGN KEY(fkLote) REFERENCES lote(id)
);

-- Tabela: hardware (Ajustado o 'id' para ser AUTO_INCREMENT para facilitar as FKs)
CREATE TABLE hardware(
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo ENUM('CPU','RAM','DISCO', 'CPUPROCESSOS', 'RAMPROCESSOS','DISCOPROCESSOS')
);

-- Tabela Associativa: parametroHardware (N:N)
CREATE TABLE parametroHardware(
    fkHardware INT,
    fkModelo INT,
    unidadeMedida VARCHAR(15),
    parametroMinimo INT,
    parametroNeutro INT,
    parametroAtencao INT,
    parametroCritico INT,
    CONSTRAINT fkHardwareParametro FOREIGN KEY(fkHardware) REFERENCES hardware(id),
    CONSTRAINT fkModeloParametro FOREIGN KEY(fkModelo) REFERENCES modelo(id),
    PRIMARY KEY(fkHardware, fkModelo, unidadeMedida)
);


-- Inserir cargos
INSERT INTO cargo (titulo) VALUES
('Administrador'), 
('Engenheiro automotivo'),   
('Engenheiro de qualidade');

-- Inserir empresas (CORRIGIDO)
INSERT INTO empresa (razaoSocial, cnpj, codigo_ativacao) VALUES
('SPTechMotors', '12345678000195', 'ABC123'),
('Auto Veículos S.A.', '98765432000189', 'XYZ987');

-- Inserir endereços
INSERT INTO endereco (rua, numero, cep, bairro, cidade, estado, pais, fkEmpresa) VALUES 
('Rua das Flores', 123, '12345678', 'Centro', 'São Paulo', 'SP', 'Brasil', 1),
('Av. Paulista', 1000, '87654321', 'Bela Vista', 'São Paulo', 'SP', 'Brasil', 2);

-- Inserir funcionários
INSERT INTO funcionario (fkEmpresa, nome, sobrenome, telefone, statusPerfil, email, senha, fkCargo) VALUES 
(1, 'Carlos', 'Silva', '11987654321', 'Ativo', 'carlos.silva@tech.com', 'senha123', 1),
(2, 'Ana', 'Oliveira', '11987654322','Ativo', 'ana.oliveira@auto.com', 'senha456', 2),
(1, 'Gabriel', 'Santos', '11982654321','Ativo', 'gabriel.santos@tech.com', 'senha143', 3);

-- Inserir lotes
INSERT INTO lote (codigo_lote, data_fabricacao, fkEmpresa, status) VALUES
('LT-A93F', '2025-02-11', 1, 'ativo'),
('LT-B72K', '2024-12-28', 1, 'inativo'),
('LT-C19P', '2025-03-23', 1, 'ativo'),
('LT-D58X', '2025-05-09', 1, 'manutenção'),
('LT-E07L', '2025-07-02', 1, 'ativo'),
('LT-F34T', '2025-06-14', 1, 'ativo'),
('LT-G91R', '2025-09-26', 1, 'ativo'),
('LT-H56N', '2025-01-30', 1, 'manutenção'),
('LT-J83M', '2025-10-08', 1, 'ativo'),
('LT-K62Z', '2025-04-17', 1, 'inativo'),
('ENG-A93F', '2025-02-11', 2, 'ativo'),
('CAR-B72K', '2024-12-28', 2, 'ativo'),
('TRN-C19P', '2025-03-23', 2, 'manutenção'),
('BRK-D58X', '2025-05-09', 2, 'ativo'),
('SUS-E07L', '2025-07-02', 2, 'ativo'),
('ELE-F34T', '2025-06-14', 2, 'ativo'),
('INT-G91R', '2025-09-26', 2, 'inativo'),
('EXT-H56N', '2025-01-30', 2, 'manutenção'),
('TIR-J83M', '2025-10-08', 2, 'ativo'),
('OIL-K62Z', '2025-04-17', 2, 'ativo');

-- Inserir modelos
INSERT INTO modelo (nome, mac_address, status, versaoPilotoAutomatico, fkEmpresa) VALUES 
('NAV-M100', NULL, 'Ativo', '1.2.5', 1),
('NAV-M200', NULL, 'Descontinuado', '2.0.1', 2),
('E-Drive Alpha L3', NULL, 'ativo','1.2.5', 1),
('NeoMotion LX3', NULL, 'descontinuado','2.3.5', 2),
('Voltura Urban 300', NULL, 'ativo','6.4.2', 2),
('Autovance E3', NULL, 'descontinuado','2.4.6', 1),
('TerraEV Vision L3', NULL, 'ativo','1.5.3', 2),
('E-Drive Alpha L4', NULL, 'ativo','6.8.9', 1),
('NeoMotion LX4', NULL, 'ativo','2.2.5', 2),
('Voltura Urban 400', NULL, 'descontinuado','2.2.2', 1),
('Autovance E4', NULL, 'ativo','7.5.3', 1),
('TerraEV Vision L4', NULL, 'descontinuado','4.5.9', 2),
('SkyRide Autonomous', NULL, 'ativo','7.3.2', 2),
('ElectraOne L4+', NULL, 'descontinuado','2.3.4', 2);

INSERT INTO veiculo (fkModelo, fkLote, data_ativacao) VALUES 
(1, 1, '2025-01-01'),
(2, 2, '2025-02-15'),
(1, 1, '2025-01-01'),
(1, 2, '2025-02-15'),
(1, 3, '2025-03-10'),
(1, 4, '2025-04-18'),
(1, 5, '2025-05-22'),
(1, 6, '2025-06-30');

INSERT INTO hardware (tipo) VALUES 
('CPU'),
('RAM'),
('DISCO'),
('CPUPROCESSOS'),
('RAMPROCESSOS'),
('DISCOPROCESSOS');

INSERT INTO parametroHardware (fkHardware, fkModelo, unidadeMedida, parametroMinimo, parametroNeutro, parametroAtencao, parametroCritico) VALUES 
(1, 1, 'USO', 20, 50, 75, 90),
(1, 1, 'TEMPERATURA', 40, 60, 75, 90),
(1, 1, 'QTD', 120, 160, 210, 250),
(2, 1, 'GB', 15, 25, 60, 80),
(3, 1, 'GB', 10, 20, 60, 80),
(4, 1, 'USO', 0, 50, 70, 100),
(5, 1, 'MB', 0, 10, 20, 30),
(6, 1, 'MB', 0, 2, 5, 10);