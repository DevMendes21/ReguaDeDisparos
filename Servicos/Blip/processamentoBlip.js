const { enviarMensagem, atualizarContato } = require("./apis.js");

const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

async function processamentoBlip(tipoDisparo, dadosAssociado) {
  console.log(`${YELLOW}Iniciando processamento Blip para o CPF: ${dadosAssociado.cpf}${RESET}(Inicio)`);

  try {
    const retornoEnviarMensagem = await enviarMensagem(tipoDisparo, dadosAssociado);
    console.log(`${YELLOW}Resposta da tentativa de enviar mensagem: ${JSON.stringify(retornoEnviarMensagem)}${RESET}(Etapa 1)`);

    if (retornoEnviarMensagem.status !== "Concluído") {
      throw new Error(`${RED}Falha ao enviar mensagem: ${retornoEnviarMensagem.mensagem}(Etapa 1 Erro)`);
    }

    const retornoAtualizarContato = await atualizarContato(tipoDisparo, dadosAssociado);
    console.log(`${YELLOW}Resposta da tentativa de atualizar contato: ${JSON.stringify(retornoAtualizarContato)}${RESET}(Etapa 2)`);

    if (retornoAtualizarContato.status !== "Concluído") {
      throw new Error(`${RED}Falha ao atualizar contato: ${retornoAtualizarContato.mensagem}(Etapa 2 Erro)`);
    }

    console.log(`${YELLOW}Processamento Blip concluído com sucesso para o CPF: ${dadosAssociado.cpf}${RESET}(Finalizado)`);
    return { status: "Concluído", uuidv4: retornoEnviarMensagem.uuidv4 };
  } catch (error) {
    console.error(`${RED}Erro durante o processamento Blip para o CPF: ${dadosAssociado.cpf}: ${error.message}${RESET}(Erro ao Finalizar)`);
    return { status: "Erro", mensagem: error.message };
  }
};

module.exports = processamentoBlip;
