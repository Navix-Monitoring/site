const processosModel = require("../models/processosModel");

async function listaProcessos(req,res){
    console.log("Entrei no controller listar")
    try{
        const{ano, mes, semana, dia} = req.params;

        const url = `https://celina-teste-csv.s3.amazonaws.com/Ano/${ano}/Mes/${mes}/Semana/${semana}/listaProcessos/listaProcessos_02-12-2025.csv`

        const dados = await processosModel.listaProcessos(url);

        if(!dados) return res.status(404).send("Arquivo não encontrado no S3");

        return res.status(200).json(dados);
    }catch(erro){
        console.log("Erro ao buscar a lista de processos:",erro);
        return res.status(500).json("Falha ao buscar lista de processos");
    }
}

module.exports = {
    listaProcessos
};