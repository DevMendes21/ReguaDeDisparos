const { execute_query_mysql } = require("../BancoDeDados/conexaoBanco");
const { statusEnvioMensagem } = require('../Blip/fazerTesteConfirmacao');
const { DataBanco } = require('../Utilitarios/data');

// Atualiza o status de um disparo específico na tabela alinhamentoDisparos
async function atualizarStatusDisparo(pkAlinhamentoDisparo) {
    const queryUpdate = `
        UPDATE alinhamentoDisparos
        SET checagem = 'Enviado'
        WHERE pkAlinhamentoDisparo = ?;
    `;
    try {
        await execute_query_mysql(queryUpdate, [pkAlinhamentoDisparo]);
        console.log(`Status do disparo ID: ${pkAlinhamentoDisparo} atualizado para 'Enviado'.`);
    } catch (erro) {
        console.error(`Erro ao atualizar o status do disparo ID: ${pkAlinhamentoDisparo}:`, erro);
    }
}

async function marcarComoFalha(pkAlinhamentoDisparo) {
    const queryUpdateFalha = `
        UPDATE alinhamentoDisparos
        SET checagem = 'Falha'
        WHERE pkAlinhamentoDisparo = ?;
    `;
    try {
        await execute_query_mysql(queryUpdateFalha, [pkAlinhamentoDisparo]);
        console.log(`Status do disparo ID: ${pkAlinhamentoDisparo} atualizado para 'Falha'.`);
    } catch (erro) {
        console.error(`Erro ao marcar o status do disparo ID: ${pkAlinhamentoDisparo} como falha:`, erro);
    }
}

async function marcarComoFalhaTotal(pkAlinhamentoDisparo) {
    const queryUpdateFalhaTotal = `
        UPDATE alinhamentoDisparos
        SET checagem = 'Falha Total'
        WHERE pkAlinhamentoDisparo = ?;
    `;
    try {
        await execute_query_mysql(queryUpdateFalhaTotal, [pkAlinhamentoDisparo]);
        console.log(`Status do disparo ID: ${pkAlinhamentoDisparo} atualizado para 'Falha Total'.`);
    } catch (erro) {
        console.error(`Erro ao marcar o status do disparo ID: ${pkAlinhamentoDisparo} como 'Falha Total':`, erro);
    }
}

// Checa o status dos disparos enviados e atualiza conforme necessário
async function checagemDisparo() {
    console.log('Iniciando a operação de checagem dos disparos enviados...');
    try {
        const queryFalhas = `
            SELECT pkAlinhamentoDisparo, fkAssociado
            FROM alinhamentoDisparos
            WHERE checagem = 'Falha';
        `;
        const disparosFalhos = await execute_query_mysql(queryFalhas);

        for (const disparo of disparosFalhos) {
            const resultado = await statusEnvioMensagem(disparo.fkAssociado);
            if (resultado === "Enviado") {
                await atualizarStatusDisparo(disparo.pkAlinhamentoDisparo);
                console.log(`Reenvio bem-sucedido e status do disparo ID: ${disparo.pkAlinhamentoDisparo} atualizado para 'Enviado'.`);
            } else {
                console.log(`Reenvio falhou para o disparo ID: ${disparo.pkAlinhamentoDisparo}`);
                await marcarComoFalhaTotal(disparo.pkAlinhamentoDisparo);
            }
        }
        const queryDisparos = `
            SELECT pkAlinhamentoDisparo, fkAssociado
            FROM alinhamentoDisparos
            WHERE checagem = 'Concluído' AND DATE(dataInsercao) = CURDATE();
        `;
        const disparosEnviados = await execute_query_mysql(queryDisparos);

        if (disparosEnviados.length === 0 && disparosFalhos.length === 0) {
            console.log('Nenhum disparo para checar hoje.');
            return;
        }

        let totalEnviado = 0;
        for (const disparo of disparosEnviados) {
            const resultado = await statusEnvioMensagem(disparo.fkAssociado);
            if (resultado === "Enviado") {
                await atualizarStatusDisparo(disparo.pkAlinhamentoDisparo);
                totalEnviado++;
            } else {
                console.log(`Falha ao receber o status do disparo ID: ${disparo.pkAlinhamentoDisparo}`);
                await marcarComoFalha(disparo.pkAlinhamentoDisparo);
            }
        }
        
        const totalDisparosHoje = disparosEnviados.length + disparosFalhos.length;
        const dataAtualizacao = DataBanco();
        const queryAcompanhamento = `
            INSERT INTO acompanhamento (dataInsercao, tipoDisparo, totalAssociadosApi, totalRecebidos)
            VALUES (?, 'Checagem', ?, ?);
        `;
        await execute_query_mysql(queryAcompanhamento, [dataAtualizacao, totalDisparosHoje, totalEnviado]);

    } catch (erro) {
        console.error('Erro durante a checagem dos disparos:', erro);
    }
}

module.exports = checagemDisparo;