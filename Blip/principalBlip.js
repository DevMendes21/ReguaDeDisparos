const { pegarDataComHora } = require('../utilidades/datas.js');
const { trazerColaboradoresParaDisparo } = require('../bancoDeDados/trazerColaboradoresParaDisparo.js');
const { enviarMensagens } = require('./enviarMensagens.js');
const { atualizarContato } = require('./atualizarContato.js');
const { alterarBotEBloco } = require('./alterarBotEBloco.js');
const { salvarRegistro } = require('../bancoDeDados/salvarRegistro.js');

const mysql = require('mysql2/promise');
const { dbConfig } = require('../bancoDeDados/dbConfig.js');


async function enviarMensagemAtivaD1(tipo) {
    
    console.log(`${pegarDataComHora()} - Iniciando enviarMensagemAtivaD1.`);

    const diaEnvio = 1;
    const totalColaboradoresParaEnvio = await trazerColaboradoresParaDisparo(diaEnvio);
    let statusEnvio = '';

    if (totalColaboradoresParaEnvio.length === 0) {
        statusEnvio = 'D1 Finalizado, sem disparos.';
    } else {

        const conexao = await mysql.createConnection(dbConfig);

        for (let i = 0; i < totalColaboradoresParaEnvio.length; i++) {
            const dadosColaborador = totalColaboradoresParaEnvio[i];

            let retornoEnviarMensagem = '';

            try {
                retornoEnviarMensagem = await enviarMensagens(diaEnvio, dadosColaborador);
                if (retornoEnviarMensagem.resposta !== 'Mensagem enviada com sucesso.') {
                    throw new Error('Erro ao enviar mensagem.');
                }

                const retornoAtualizarContato = await atualizarContato(diaEnvio, dadosColaborador);
                if (retornoAtualizarContato !== 'Contato atualizado com sucesso.') {
                    throw new Error('Erro ao atualizar contato.');
                }

                const retornoAlterarBotEBloco = await alterarBotEBloco(diaEnvio, dadosColaborador);
                if (retornoAlterarBotEBloco !== 'Bot e bloco alterados com sucesso.') {
                    throw new Error('Erro ao alterar bot e bloco.');
                }
                statusEnvio = 'Sucesso'

            } catch (error) {
                statusEnvio = `Erro: ${error.message}`
            }
            await salvarRegistro(diaEnvio, dadosColaborador, statusEnvio, conexao, retornoEnviarMensagem.uuid4, tipo);
        }

        conexao.end();
    }

    console.log(`${pegarDataComHora()} - enviarMensagemAtivaD1 finalizada!`);
    return totalColaboradoresParaEnvio.length === 0 ? statusEnvio : `Sucesso, total enviado: ${totalColaboradoresParaEnvio.length}`;
}

async function enviarMensagemAtivaD3(tipo) {

    console.log(`${pegarDataComHora()} - Iniciando enviarMensagemAtivaD3.`);

    const diaEnvio = 3;
    const totalColaboradoresParaEnvio = await trazerColaboradoresParaDisparo(diaEnvio);
    let statusEnvio = '';

    if (totalColaboradoresParaEnvio.length === 0) {
        statusEnvio = 'D3 Finalizado, sem disparos.';
    } else {

        const conexao = await mysql.createConnection(dbConfig);

        for (let i = 0; i < totalColaboradoresParaEnvio.length; i++) {
            const dadosColaborador = totalColaboradoresParaEnvio[i];

            let retornoEnviarMensagem = '';

            try {
                retornoEnviarMensagem = await enviarMensagens(diaEnvio, dadosColaborador);
                if (retornoEnviarMensagem.resposta !== 'Mensagem enviada com sucesso.') {
                    throw new Error('Erro ao enviar mensagem.');
                }

                const retornoAtualizarContato = await atualizarContato(diaEnvio, dadosColaborador);
                if (retornoAtualizarContato !== 'Contato atualizado com sucesso.') {
                    throw new Error('Erro ao atualizar contato.');
                }

                const retornoAlterarBotEBloco = await alterarBotEBloco(diaEnvio, dadosColaborador);
                if (retornoAlterarBotEBloco !== 'Bot e bloco alterados com sucesso.') {
                    throw new Error('Erro ao alterar bot e bloco.');
                }
                statusEnvio = 'Sucesso'

            } catch (error) {
                statusEnvio = `Erro: ${error.message}`
            }
            await salvarRegistro(diaEnvio, dadosColaborador, statusEnvio, conexao, retornoEnviarMensagem.uuid4, tipo)
        }

        conexao.end();
    }

    console.log(`${pegarDataComHora()} - enviarMensagemAtivaD3 finalizada!`);
    return totalColaboradoresParaEnvio.length === 0 ? statusEnvio : `Sucesso, total enviado: ${totalColaboradoresParaEnvio.length}`;
}


module.exports = {
    enviarMensagemAtivaD1,
    enviarMensagemAtivaD3
}