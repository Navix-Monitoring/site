var express = require("express");
var router = express.Router();

var dashGController = require("../controllers/dashGController");

router.get("/diario/:ano/:mes/:semana/:dia", (req, res) => {
    dashGController.diario(req, res);
});

router.get("/semanal/:nomeArquivo", (req, res) => {
    dashGController.semanal(req, res);
});

router.get("/mensal/:nomeArquivo", (req, res) => {
    dashGController.mensal(req, res);
});

module.exports = router;