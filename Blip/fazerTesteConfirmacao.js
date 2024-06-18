const { blipConfig } = require('../Configuracoes/blipConfig.js');
const fetch = require('node-fetch');
const { execute_query_mysql } = require('../BancoDeDados/conexaoBanco.js');
const { response } = require('express');

async function fetchUuidv4(fkAssociado) {
    const query = `SELECT uuidv4 FROM alinhamentoDisparos WHERE fkAssociado = ?`;
    try {
        const results = await execute_query_mysql(query, [fkAssociado]);
        if (results.length > 0) {
            return results[0].uuidv4;
        } else {
            throw new Error('Nenhuma entrada correspondente encontrada');
        }
    } catch (error) {
        console.error('Error ao encontrar uuidv4:', error);
        throw error;
    }
}

async function statusEnvioMensagem(fkAssociado) {
    let uuidv4;
    try {
        uuidv4 = await fetchUuidv4(fkAssociado);
    } catch (error) {
        return "Erro ao obter UUID: " + error.message;
    }

    const url = blipConfig.urlRealizarComando;
    const options = {
        method: 'POST',
        headers: {
            'Authorization': blipConfig.keyRouter,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'id': uuidv4,
            'to': 'postmaster@msging.net',
            'method': 'get',
            'uri': `/notifications?id=${uuidv4}`
        })
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            return "Falha na conexão com o servidor";
        }

        const data = await response.json();

        let found = false;
        for (const item of data.resource.items || []) {
            if ('event' in item && (item.event === 'consumed' || item.event === 'received')) {
                return "Enviado";
            } else {
                found = true;
            }
        }
        if (!found) {
            return "Falha";
        } else {
            return "Mensagem não encontrada";
        }
    } catch (error) {
        return "Erro durante a requisição: " + error.message;
    }
}

module.exports = {
    statusEnvioMensagem
};