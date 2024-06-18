const { blipConfig } = require("../../Configuracoes/blipConfig.js");
const gerarUUIDv4 = require("../../Utilitarios/gerarUUIDv4.js");
const fetch = require("node-fetch");

async function enviarMensagem(tipoDisparo, dadosAssociado, dadosBoleto) {
  const url = blipConfig.urlEnvioMensagemAtiva;
  const celularCompleto = `${dadosAssociado.celular}@wa.gw.msging.net`;
  const uuidv4 = gerarUUIDv4();
  const options = {
    method: "POST",
    headers: {
      Authorization: blipConfig.keyRouter,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: uuidv4,
      to: celularCompleto,
      type: "application/json",
      content: {
        type: "template",
        template: {
          namespace: blipConfig.namespace,
          name: tipoDisparo === "proativa" ? blipConfig.proativa : blipConfig.reativa,
          language: { code: "pt_BR", policy: "deterministic" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: dadosAssociado.nome },
                { type: "text", text: dadosAssociado.dataVencimento },
                { type: "text", text: dadosAssociado.valorBoleto },
                { type: "text", text: dadosAssociado.linhaDigitavel },
              ],
            },
            {
              type: "button",
              sub_type: "url",
              index: 0,
              parameters: [
                {
                  type: "text",
                  text: dadosAssociado.linkBoleto.replace("https://short.hinova.com.br/v2/", "")
                },
              ],
            },
          ],
        },
      },
    }),
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    console.error("Falha na comunicação com a API da BLIP:", await response.text());
    return { status: "erro", mensagem: "falha na comunicação com a api da BLIP" };
  }
  return { status: "Concluído", uuidv4: uuidv4 };
}

async function atualizarContato(dadosAssociado, dadosBoleto) {
  const url = blipConfig.urlRealizarComando;
  const celularCompleto = `${dadosAssociado.celular}@wa.gw.msging.net`;
  const options = {
    method: "POST",
    headers: {
      Authorization: blipConfig.keyRouter,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: gerarUUIDv4(),
      method: "merge",
      uri: "/contacts",
      type: "application/vnd.lime.contact+json",
      resource: {
        name: dadosAssociado.nome,
        identity: celularCompleto,
        phoneNumber: dadosAssociado.celular,
        extras: {
          codigoAssociado: dadosAssociado.codigoAssociado,
          fkAssociado: dadosAssociado.fkAssociado,
          nome: dadosAssociado.nome,
          cpf: dadosAssociado.cpf,
          celular: dadosAssociado.celular,
          valorBoleto: dadosAssociado.valorBoleto,
          linkBoleto: dadosAssociado.linkBoleto,
          linhaDigitavel: dadosAssociado.linhaDigitavel,
          dataVencimento: dadosAssociado.dataVencimento,
          dataInsercao: dadosAssociado.dataInsercao,
          idDisparo: dadosAssociado.pkAlinhamnetoDisparo,
        },
        source: "WhatsApp",
      },
    }),
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    console.error("Falha na comunicação com a API da BLIP:", await response.text());
    return { status: "erro", mensagem: "falha na comunicação com a api da BLIP" };
  }
  return { status: "Concluído" };
}

module.exports = {
  enviarMensagem,
  atualizarContato,
};