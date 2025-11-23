var express = require("express");
var router = express.Router();

var dashGController = require("../controllers/dashGController");

router.get("/diario/:ano/:mes/:semana/:dia", (req, res) => {
    dashGController.diario(req, res);
});

module.exports = router;