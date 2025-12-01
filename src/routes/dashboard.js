var express = require("express");
var router = express.Router();

var dashboardControlller = require("../controllers/dashboardController");

router.get("/listar/:idEmpresa", function (req, res) {
  dashboardControlller.listar(req, res);
});

router.get("/listarModelos", function (req, res) {
  dashboardControlller.listarModelos(req, res);
});

router.get("/buscarLoteparaEditar/:idLote", function (req, res) {
  dashboardControlller.buscarLoteparaEditar(req, res);
});

router.put("/editarLote/:idLote", function (req, res) {
  dashboardControlller.editarLote(req, res);
});

router.get("/buscarLote/:idLote", function (req, res) {
  dashboardControlller.buscarLote(req, res);
});

router.get("/filtroModelo/:idModelo", function (req, res) {
  dashboardControlller.filtroModelo(req, res);
});

router.get("/limites", function (req, res) {
  dashboardControlller.buscarParametro(req, res); 
});

module.exports = router;
