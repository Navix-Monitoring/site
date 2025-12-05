const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");

const s3 = new S3Client({ region: "us-east-1" });

async function listaProcessos(req, res) {
    console.log("Entrei no controller listar")
    const CSVs = [];

    try {
        const { ano, mes, semana, dia, modelo, id } = req.params;
        prefixo ="dashProcessos/listaProcessos/Modelo/NAV-M100/IDLote/3/Ano/2025/Mes/12/Semana/1/Dia/3"
        
        const parametros = {
            Bucket: "bucket-navix-client",
            Prefix: prefixo,
            Delimiter: "/",
        };

        const resultado = await s3.send(new ListObjectsV2Command(parametros));

        if (resultado.Contents) {

            for (const obj of resultado.Contents) {

                if (obj.Key.endsWith(".csv")) {

                    CSVs.push(obj.Key);

                }

            }

        }

        if (response.CommonPrefixes) {

            for (const pasta of response.CommonPrefixes) {
                const subprefix = pasta.Prefix;
                const subArquivos = await listarCSVsRecursivo(bucket, subprefix);
                resultado.push(...subArquivos);

            }

        }

        const dados = await processosModel.listaProcessos(url);

        if (!dados) return res.status(404).send("Arquivo não encontrado no S3");

        return CSVs;
    } catch (erro) {
        console.log("Erro ao buscar a lista de processos:", erro);
        return res.status(500).json("Falha ao buscar lista de processos");
    }
}

module.exports = {
    listaProcessos
};