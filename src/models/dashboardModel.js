var database = require("../database/config");

function listar(id) {
    console.log("Acessei o dashboard model - listando os lotes...")

    const instrucaoSql = `SELECT 
    l.id as idLote,
    l.codigo_lote,
    l.data_fabricacao,
    l.status AS statusLote,
    m.nome AS nomeModelo,
    m.versaoPilotoAutomatico
FROM lote AS l
LEFT JOIN veiculo AS v ON v.fkLote = l.id
LEFT JOIN modelo AS m ON v.fkModelo = m.id
WHERE l.fkEmpresa = ${id};`

    console.log("Executando a instrução de listar lotes:\n" + instrucaoSql)
    return database.executar(instrucaoSql);
}

function listarModelos() {
    console.log("Acessei o dashboard model - listando os modelos...")
    const instrucaoSql = `
    SELECT * FROM modelo;
    `
    console.log("Executando a instrução de listar modelos:\n" + instrucaoSql)
    return database.executar(instrucaoSql);
}

function buscarLoteparaEditar(id) {
    console.log("Acessei o dashboard model - buscando o lote para poder editar...")

    const instrucaoSql =
        `
SELECT * FROM lote WHERE id = ${id};
`
    return database.executar(instrucaoSql)

}

function editarLote(codigolote, datafabricacao, qtd_veiculos, idLote) {
    console.log("Acessei o dashboard model - editando lote...")

    const instrucaoSql =
        `
     UPDATE lote 
        SET codigo_lote = '${codigolote}',
        data_fabricacao = '${datafabricacao}'
        WHERE id = ${idLote};
    `
    console.log("Executando a instrução SQL:\n" + instrucaoSql)
    return database.executar(instrucaoSql)
}

function buscarLote(id) {
    console.log("Acessei o  dashboard model - buscando o lote...")

    const instrucaoSql = `
    SELECT 
    l.id AS idLote,
    l.codigo_lote,
    l.data_fabricacao,
    l.fkEmpresa,
    l.status AS statusLote,
    SUM(v.quantidade_modelo) AS total_veiculos,
    GROUP_CONCAT(DISTINCT m.id) AS modelos_ids,
    GROUP_CONCAT(DISTINCT m.versaoPilotoAutomatico) AS versoes
    FROM lote l
    INNER JOIN veiculo v ON v.fkLote = l.id
    INNER JOIN modelo m ON v.fkModelo = m.id
    WHERE l.id = ${id}
    GROUP BY l.id, l.codigo_lote, l.data_fabricacao, l.fkEmpresa, l.status;
`
    return database.executar(instrucaoSql);

}

function filtroModelo(id) {
    console.log("")
    const instrucaoSql = `
    SELECT 
    l.id AS idLote,
    l.codigo_lote,
    l.data_fabricacao,
    l.status AS statusLote,
    m.id AS idModelo,
    m.nome AS nomeModelo,
    v.id AS idVeiculo
    FROM lote AS l
    INNER JOIN veiculo AS v ON v.fkLote = l.id
    INNER JOIN modelo AS m ON v.fkModelo = m.id
    WHERE m.id = ${id};
    `
    return database.executar(instrucaoSql);

}

function buscarParametro() {
    console.log("Acessei o dashboard model - buscando parametro...")

    const instrucaoSql =
        `
SELECT p.fkModelo, p.unidadeMedida, p.parametroMinimo, p.parametroNeutro, p.parametroAtencao, p.parametroCritico, h.tipo 
FROM parametroHardware p
INNER JOIN hardware h ON h.id = p.fkHardware
WHERE fkModelo = 1;
`
    return database.executar(instrucaoSql)

}

module.exports = {
    listar,
    listarModelos,
    buscarLote,
    filtroModelo,
    buscarLoteparaEditar,
    editarLote,
    buscarParametro
}