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



module.exports = {
    jsonDiario,
    jsonSemanal,
    jsonMensal
};