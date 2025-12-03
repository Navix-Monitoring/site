const dashGModel = require("../models/dashGModel");

async function diario(req, res) {
    try {
        const { ano, mes, semana, dia } = req.params;

        const url = `https://bucket-client-navix.s3.amazonaws.com/dashAlertas/${ano}/${mes}/Semana${semana}/Relatorio-Final-${dia}-${mes}-${ano}.json`;

        const dados = await dashGModel.jsonDiario(url);

        if (!dados) return res.status(404).send("Arquivo não encontrado no S3");

        return res.status(200).json(dados);

    } catch (erro) {
        console.log("ERRO AO BUSCAR DIÁRIO:", erro);
        return res.status(500).json("Falha ao buscar diário");
    }
}

async function semanal(req, res) {
    try {
        const { nomeArquivo } = req.params;

        const url = `https://bucket-client-navix.s3.amazonaws.com/dashAlertas/Ultimos7Dias/${nomeArquivo}.json`;

        const dados = await dashGModel.jsonSemanal(url);

        if (!dados) return res.status(404).send("Arquivo não encontrado no S3");

        return res.status(200).json(dados);

    } catch (erro) {
        console.log("ERRO AO BUSCAR SEMANAL:", erro);
        return res.status(500).json("Falha ao buscar semanal");
    }
}

async function mensal(req, res) {
    try {
        const { nomeArquivo } = req.params;

        const url = `https://bucket-client-navix.s3.amazonaws.com/dashAlertas/UltimasSemanas/${nomeArquivo}.json`;

        const dados = await dashGModel.jsonMensal(url);

        if (!dados) return res.status(404).send("Arquivo não encontrado no S3");

        return res.status(200).json(dados);

    } catch (erro) {
        console.log("ERRO AO BUSCAR SEMANAL:", erro);
        return res.status(500).json("Falha ao buscar mensal");
    }
}


module.exports = { diario, semanal, mensal };
