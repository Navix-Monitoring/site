var express = require("express");
var router = express.Router();

var processosController = require("../controllers/processosController");

router.get("/listaProcessos/:ano/:mes/:semana/:dia", (req,res) => {
    processosController.listaProcessos(req,res);
});

module.exports = router;