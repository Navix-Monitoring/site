var dashboardModel = require("../models/dashboardModel");

function listar(req, res) {
    console.log("Acessei o controller listar lotes...")
    var id = req.params.idEmpresa;

    dashboardModel.listar(id).then(function (resposta) {
        res.status(200).json(resposta);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function listarModelos(req,res){
    console.log("Acessei o controller listar modelos...")

    dashboardModel.listarModelos().then(function(resposta){
        res.status(200).json(resposta);
    }).catch(function(erro){
        res.status(500).json(erro.sqlMessage);
    })
}

function buscarLoteparaEditar(req, res) {
    console.log("Acessei o controller buscar lote para editar...")
    var id = req.params.idLote;
    dashboardModel.buscarLoteparaEditar(id).then(function (resposta) {
        res.status(200).json(resposta);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}
function editarLote(req,res){
    console.log("Acessei o controller editar lote...")
    var id = req.params.idLote;
    var codigo_lote = req.body.codigoLote;
    var data_fabricacao = req.body.dataFabricacao;
    //var qtd_veiculos = req.body.qtdVeiculos;
    console.log(id)
    console.log(codigo_lote)
    dashboardModel.editarLote(codigo_lote,data_fabricacao,id).then(function(resposta){
        res.status(200).json(resposta);
    }).catch(function(erro){
        res.status(500).json(erro.sqlMessage);
    })
}
function buscarLote(req, res) {
    console.log("Acessei o controller buscar lote...")
    var id = req.params.idLote;
    dashboardModel.buscarLote(id).then(function (resposta) {
        res.status(200).json(resposta);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function filtroModelo(req,res){
var id = req.params.idModelo;
dashboardModel.filtroModelo(id).then(function(resposta){
    res.status(200).json(resposta);
}).catch(function(erro){
    res.status(500).json(erro.sqlMessage);
})
}

function buscarParametro(req, res) {
    dashboardModel.buscarParametro()
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum limite encontrado!");
            }
        }).catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar os limites: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
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