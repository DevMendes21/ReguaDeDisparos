const { blipConfig } = require('./blipConfig.js');
const { gerarUUIDv4 } = require('../utilidades/gerarUUIDv4.js');

async function gerarRequisicao(tipo, diaEnvio, dadosColaborador) {
    let url = '';
    let options = {};

    if (tipo === 'enviarMensagem') {
        url = blipConfig.urlEnvioMensagemAtiva;
        options = {
            method: 'POST',
            headers: {
                'Authorization': blipConfig.keyRouter,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'id': gerarUUIDv4(),
                'to': (dadosColaborador.Telefone_Usado === 'Primario' ? dadosColaborador.Telefone_Primario : dadosColaborador.Telefone_Opcional) + '@wa.gw.msging.net',
                'type': 'application/json',
                'content': {
                    'type': 'template',
                    'template': {
                        'namespace': blipConfig.namespace,
                        'name': diaEnvio === 1
                            ? blipConfig.mensagemD1
                            : (dadosColaborador.Nome_Social == null
                                ? blipConfig.mensagemD1
                                : blipConfig.mensagemD3),
                        'language': {
                            'code': 'pt_BR',
                            'policy': 'deterministic'
                        },
                        'components': diaEnvio === 3
                            ? (dadosColaborador.Nome_Social == null
                                ? []
                                : [{
                                'type': 'body',
                                'parameters': [{
                                    'type': 'text',
                                    'text': dadosColaborador.Nome_Social ? dadosColaborador.Nome_Social : dadosColaborador.Nome
                                }]
                            }])
                        : []
                    }
                }
            })
        };
    } else if (tipo === 'atualizarContato') {
        url = blipConfig.urlRealizarComando;
        options = {
            method: 'POST',
            headers: {
                'Authorization': blipConfig.keyRouter,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'id': gerarUUIDv4(),
                'method': 'merge',
                'uri': '/contacts',
                'type': 'application/vnd.lime.contact+json',
                'resource': {
                    'name': dadosColaborador.Nome,
                    'identity': (dadosColaborador.Telefone_Usado === 'Primario' ? dadosColaborador.Telefone_Primario : dadosColaborador.Telefone_Opcional) + '@wa.gw.msging.net',
                    'phoneNumber': (dadosColaborador.Telefone_Usado === 'Primario' ? dadosColaborador.Telefone_Primario : dadosColaborador.Telefone_Opcional),
                    'extras': {
                        'Matricula': dadosColaborador.Matricula,
                        'Mensagem': diaEnvio === 1 ? 'D1' : 'D3',
                        'id': dadosColaborador.id
                    },
                    'source': 'WhatsApp'
                }
            })
        };
    } else if (tipo === 'alterarBot') {
        url = blipConfig.urlRealizarComando;
        options = {
            method: 'POST',
            headers: {
                'Authorization': blipConfig.keyRouter,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'id': gerarUUIDv4(),
                'to': 'postmaster@msging.net',
                'method': 'set',
                'uri': '/contexts/' + (dadosColaborador.Telefone_Usado === 'Primario' ? dadosColaborador.Telefone_Primario : dadosColaborador.Telefone_Opcional) + '@wa.gw.msging.net/Master-State',
                'type': 'text/plain',
                'resource': blipConfig.idSubBot + '@msging.net'
            })
        };
    } else if (tipo === 'alterarBloco') {
        url = blipConfig.urlRealizarComando;
        options = {
            method: 'POST',
            headers: {
                'Authorization': blipConfig.keyRouter,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'id': gerarUUIDv4(),
                'to': 'postmaster@msging.net',
                'method': 'set',
                'uri': '/contexts/' + (dadosColaborador.Telefone_Usado === 'Primario' ? dadosColaborador.Telefone_Primario : dadosColaborador.Telefone_Opcional) + '@wa.gw.msging.net/stateid@' + blipConfig.identificadorDeFluxo,
                'type': 'text/plain',
                'resource': diaEnvio === 1 ? blipConfig.idBlocoMensagemD1
                    : (dadosColaborador.Nome_Social == null
                        ? blipConfig.idBlocoMensagemD1
                        : blipConfig.idBlocoMensagemD3)
            })
        };
    } else {
        // Tipo não definido
    }
    return { url, options };
}

module.exports = {
    gerarRequisicao
};