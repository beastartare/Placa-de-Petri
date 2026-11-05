const express = require("express");
const router = express.Router();
const { evoluirGrade } = require("../services/jogoService");

router.post("/evoluir", (req, res) => {
    const { grade } = req.body;
    if (!Array.isArray(grade) || grade.length === 0 ||
        !grade.every((linha) => Array.isArray(linha) &&
        linha.length == grade.length &&
        linha.every((celula) => typeof celula === "boolean"))) {
            return res.status(400).json({
                erro: "A grade enviada é inválida!",
            });
        }

    const proximaGrade = evoluirGrade(grade);

    res.json({
        grade: proximaGrade,
    });
});

module.exports = router;