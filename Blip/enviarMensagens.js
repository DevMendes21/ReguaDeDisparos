const { pegarDataComHora } = require('../utilidades/datas.js');
const { gerarRequisicao } = require('./gerarRequisicao.js')
const fetch = require('node-fetch');


async function enviarMensagens(diaEnvio, dadosColaborador) {

    console.log(`${pegarDataComHora()} - Iniciando enviarMensagens para ${dadosColaborador.Matricula}.`);

    let resposta = '';
    const tipo = 'enviarMensagem';

    if (diaEnvio === 1 || diaEnvio === 3) {
        
        const requisicao = await gerarRequisicao(tipo, diaEnvio, dadosColaborador);
        const retornoFetch = await fetch (requisicao.url, requisicao.options);
        const uuid4Envio = JSON.parse(requisicao.options.body).id;


        if (retornoFetch.ok) {
            resposta = { resposta: 'Mensagem enviada com sucesso.', uuid4: uuid4Envio };
        } else {
            resposta = { resposta: `Erro ao enviar mensagem. Status: ${response.status}`, uuid4: uuid4Envio };
        }

    } else {
        resposta = { resposta: `Erro com valor do diaEnvio, valor atual ${diaEnvio}`, uuid4: uuid4Envio };
    }

    console.log(`${pegarDataComHora()} - enviarMensagens finalizado para ${dadosColaborador.Matricula}.`);
    return resposta;
}


module.exports = {
    enviarMensagens
}