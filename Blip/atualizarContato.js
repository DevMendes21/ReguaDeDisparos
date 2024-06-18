const { pegarDataComHora } = require('../utilidades/datas.js');
const { gerarRequisicao } = require('./gerarRequisicao.js')
const fetch = require('node-fetch');


async function atualizarContato(diaEnvio, dadosColaborador) {

    console.log(`${pegarDataComHora()} - Iniciando atualizarContato para ${dadosColaborador.Matricula}.`);

    let resposta = '';
    const tipo = 'atualizarContato';

    if (diaEnvio === 1 || diaEnvio === 3) {

        const requisicao = await gerarRequisicao(tipo, diaEnvio, dadosColaborador);
        const retornoFetch = await fetch (requisicao.url, requisicao.options);


        if (retornoFetch.ok) {
            resposta = 'Contato atualizado com sucesso.';
        } else {
            resposta = `Erro ao atualziar contato. Status: ${response.status}`;
        }

    } else {
        resposta = `Erro com valor do diaEnvio, valor atual ${diaEnvio}`;
    }

    console.log(`${pegarDataComHora()} - atualizarContato finalizado para ${dadosColaborador.Matricula}.`);
    return resposta;
}


module.exports = {
    atualizarContato
}