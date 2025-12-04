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
    SELECT * FROM parametroHardware WHERE fkModelo = 1;
    `
    console.log("Executando a instrução de listar modelos:\n" + instrucaoSql)
    return database.executar(instrucaoSql);
}




module.exports = {
    jsonDiario,
    jsonSemanal,
    jsonMensal,
    parametro
};