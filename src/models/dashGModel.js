const database = require("../database/config");

async function jsonDiario(url) {
    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            console.log("Erro ao buscar:", resposta.status);
            return null;
        }
        return await resposta.json();
    } catch (erro) {
        console.log("Erro no fetch:", erro);
        return null;
    }
}

async function jsonSemanal(url) {
    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            console.log("Erro ao buscar:", resposta.status);
            return null;
        }
        return await resposta.json();
    } catch (erro) {
        console.log("Erro no fetch:", erro);
        return null;
    }
}


async function jsonMensal(url) {
    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            console.log("Erro ao buscar:", resposta.status);
            return null;
        }
        return await resposta.json();
    } catch (erro) {
        console.log("Erro no fetch:", erro);
        return null;
    }
}

function parametro() {
    console.log("Acessei o dashboard model - listando os parametros")
    const instrucaoSql = `
SELECT
    modelo.nome,
    fkHardware,
    unidadeMedida,
    parametroMinimo,
    parametroNeutro,
    parametroAtencao,
    parametroCritico
FROM
    parametroHardware
INNER JOIN
    modelo ON fkModelo = id
WHERE
    fkModelo = 1
    AND fkHardware != 4 -- Adicionado aqui para excluir globalmente
    AND (
        parametroHardware.unidadeMedida = 'TEMPERATURA'
        OR parametroHardware.unidadeMedida = 'USO'
        OR parametroHardware.unidadeMedida = 'GB'
    );    `
    console.log("Executando a instrução de listar modelos:\n" + instrucaoSql)
    return database.executar(instrucaoSql);
}

module.exports = {
    jsonDiario,
    jsonSemanal,
    jsonMensal,
    parametro
};