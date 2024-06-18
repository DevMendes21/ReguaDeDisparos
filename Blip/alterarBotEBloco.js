const { pegarDataComHora } = require('../utilidades/datas.js');
const { gerarRequisicao } = require('./gerarRequisicao.js')
const fetch = require('node-fetch');


async function alterarBotEBloco(diaEnvio, dadosColaborador) {

    console.log(`${pegarDataComHora()} - Iniciando alterarBotEBloco para ${dadosColaborador.Matricula}.`);

    let resposta = '';
    let tipo = '';

    if (diaEnvio === 1 || diaEnvio === 3) {

        tipo = 'alterarBot';
        let requisicao = await gerarRequisicao(tipo, diaEnvio, dadosColaborador);
        let retornoFetch = await fetch (requisicao.url, requisicao.options);
        
        if (retornoFetch.ok) {

            tipo = 'alterarBloco';
            requisicao = await gerarRequisicao(tipo, diaEnvio, dadosColaborador);
            retornoFetch = await fetch (requisicao.url, requisicao.options);

            if (retornoFetch.ok) {
                resposta = 'Bot e bloco alterados com sucesso.'

            } else {
                resposta = `Erro ao alterar bloco. Status: ${retornoFetch.status}`;
            }
        } else {
            resposta = `Erro ao alterar bot. Status: ${retornoFetch.status}`;
        }

    } else {
        resposta = `Erro com valor do diaEnvio, valor atual ${diaEnvio}`;
    }

    console.log(`${pegarDataComHora()} - alterarBotEBloco finalizado para ${dadosColaborador.Matricula}.`);
    return resposta;
}


module.exports = {
    alterarBotEBloco
}