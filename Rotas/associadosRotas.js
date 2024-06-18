const express = require("express");
const router = express.Router();
const cron = require("node-cron");
const { leituraAssociados, processarDisparos } = require("../BancoDeDados/associados");
const { rotinaDisparo } = require("../Automacoes/rotinaDisparo");

const TIMEZONE = "America/Sao_Paulo";

// Função para agendar tarefas com cron
function agendarTarefa(cronTime, nomeDisparo, tipoDisparo) {
    cron.schedule(cronTime, async () => {
        console.log(`Tentando executar disparo ${tipoDisparo} (${nomeDisparo})...`);
        try {
            console.log(`Iniciando disparo ${tipoDisparo} (${nomeDisparo})...`);
            await rotinaDisparo(nomeDisparo);
            console.log(`Disparo ${tipoDisparo} (${nomeDisparo}) executado com sucesso.`);
        } catch (error) {
            console.error(`Erro ao executar disparo ${tipoDisparo} (${nomeDisparo}): ${error}`);
        }
    }, { scheduled: true, timezone: TIMEZONE });
}

// Rota para consultar associados por nome ou ID
router.get("/consulta/associado", async (req, res) => {
    try {
        const { nome, id } = req.query;
        const filtro = nome ? { nome } : id ? { id } : null;

        const associados = await leituraAssociados(filtro);
        if (associados.length) {
            res.json(associados);
        } else {
            res.status(404).json({ mensagem: "Associado não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao recuperar Associados:", error);
        res.status(500).json({ mensagem: "Erro ao processar a solicitação" });
    }
});

module.exports = router;