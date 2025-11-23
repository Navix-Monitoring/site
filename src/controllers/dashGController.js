async function diario(req, res) {
    try {
        const { ano, mes, semana, dia } = req.params;

        const url = `https://bucket-client-gnavix.s3.amazonaws.com/${ano}/${mes}/Semana${semana}/Relatorio-Final-${dia}-${mes}-${ano}.json`;

        const response = await fetch(url);

        if (!response.ok) {
            console.log("ERRO NO S3:", response.status);
            return res.status(404).send("Arquivo não encontrado no S3");
        }

        const dados = await response.json();
        return res.status(200).json(dados);

    } catch (erro) {
        console.log("ERRO AO BUSCAR DIÁRIO:", erro);
        return res.status(500).json("Falha ao buscar diário");
    }
}

module.exports = { diario };