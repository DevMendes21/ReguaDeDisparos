const cron = require("node-cron");
const rotinaDisparo = require("./rotinaDisparo");
const checagemDisparo = require("./checagemDisparo");
const { listarAssociados } = require("../Servicos/Hinova/apis");
const { atualizacao } = require("../BancoDeDados/associados");

// Configurações gerais para todas as tarefas cron
const CRON_CONFIG = {
    scheduled: true,
    timezone: "America/Sao_Paulo"
};

function agendarTarefa(horario, tarefaFunc, descricao) {
    let [minuto, hora] = horario.split(" ");
    if (!hora || !minuto) {
        console.error(`Erro no formato do horário: ${horario}`);
        return;
    }
    console.log(`Agendando: ${descricao} para o Horário ${hora}:${minuto}`);

    cron.schedule(horario, async () => {
        console.log(`Iniciando execução: ${descricao}`);
        try {
            await tarefaFunc();
            console.log(`Execução concluída: ${descricao}`);
        } catch (error) {
            console.error(`Erro durante a execução de ${descricao}: ${error}`);
        }
    }, CRON_CONFIG);
}

async function tarefaAtualizacao() {
    try {
        const associados = await listarAssociados();
        await atualizacao(associados);
        console.log("Associados inseridos com sucesso!");
    } catch (error) {
        console.error("Erro ao processar associados:", error);
    }
}

function configurarTarefas() {
    agendarTarefa('30 5 * * *', tarefaAtualizacao, 'Atualização de Associados');
    agendarTarefa('30 9 * * *', () => rotinaDisparo('proativa'), 'Rotina de disparo Proativa');
    agendarTarefa('30 10 * * *', () => rotinaDisparo('reativa'), 'Rotina de disparo Reativa');
    agendarTarefa('00 20 * * *', checagemDisparo, 'Rotina de checagem dos disparos');
}

module.exports = configurarTarefas;

// Para funcionar, apenas descomente o cron.schedule