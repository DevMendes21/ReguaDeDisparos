const { arrayRegrasDisparo } = require("../Configuracoes/regraDeNegocio.js");
const { buscarAssociadosValidos, salvarAssociado, salvarAlinhamentoDisparo } = require("../BancoDeDados/associados.js");
const { pegarAssociadosGerais, buscarDadosBoleto } = require("../Servicos/Hinova/apis.js");
const { create_pool_mysql, end_pool_mysql } = require("../BancoDeDados/conexaoBanco.js");
const { hoje } = require("../Utilitarios/data");
const processamentoBlip = require("../Servicos/Blip/processamentoBlip.js");
const { buscarDadosAssociado } = require("../BancoDeDados/associados.js")

function formatarNumeroWhatsApp(codigoPais, numeroTelefone) {
  if (!numeroTelefone) return "";
  let numeroLimpo = numeroTelefone.replace(/\D/g, '');
  numeroLimpo = numeroLimpo.startsWith(codigoPais) ? numeroLimpo : codigoPais + numeroLimpo;
  return numeroLimpo.substring(Math.max(numeroLimpo.length - 13, 0));
}

async function obterDadosDisparo(tipoDisparo, diaDaSemana) {
  return tipoDisparo === "proativa" ?
    arrayRegrasDisparo[diaDaSemana].quantidadeDeDiasProativa :
    arrayRegrasDisparo[diaDaSemana].quantidadeDeDiasReativa;
}

async function processarAssociados(associados, tipoDisparo, conexao) {
  const codigoPais = '55';
  console.log(`Processando ${associados.length} associados para o tipo de disparo: ${tipoDisparo}`);

  for (const associado of associados) {
    const dadosBoleto = await buscarDadosBoleto(associado.nossoNumero);
    const arrayDadosAssociado = await buscarDadosAssociado(associado.codigoAssociado, conexao);
    const dadosAssociado = arrayDadosAssociado[0];

    if (!dadosBoleto || !dadosAssociado) {
      console.error("Erro ao buscar dados do associado ou do boleto. Pulando para o próximo associado.");
      continue;
    }

    const numeroCelularValido = formatarNumeroWhatsApp(codigoPais, dadosAssociado.telefone || "");
    const dadosParaSalvar = {
      codigoAssociado: dadosAssociado.codigo_associado || associado.codigoAssociado,
      fkAssociado: associado.pkAssociado,
      nome: dadosAssociado.nomeAssociado || associado.nomeAssociado,
      cpf: dadosAssociado.cpfAssociado || associado.cpfAssociado,
      celular: numeroCelularValido,
      valorBoleto: dadosBoleto.valor_boleto,
      linkBoleto: dadosBoleto.link_boleto,
      linhaDigitavel: dadosBoleto.linha_digitavel,
      dataVencimento: dadosBoleto.data_vencimento,
      dataInsercao: new Date(),
      uuidv4: null,
      checagem: tipoDisparo === 'proativa' ? 'Concluído' : 'Revisão Pendente',
      erroJSON: null,
      errorMessage: "",
    };

    console.log(dadosParaSalvar.celular);

    const resultadoProcessamentoBlip = await processamentoBlip(tipoDisparo, dadosParaSalvar);

    if (resultadoProcessamentoBlip.status === "erro") {
      dadosParaSalvar.checagem = "Não enviado";
      dadosParaSalvar.jsonErro = '{"error": "teste"}';
      dadosParaSalvar.errorMessage = '{"error": "teste"}';
    } else if (resultadoProcessamentoBlip.status === "Concluído") {
      dadosParaSalvar.checagem = "Concluído";
      dadosParaSalvar.uuidv4 = resultadoProcessamentoBlip.uuidv4;
    }

    await salvarAlinhamentoDisparo(dadosParaSalvar, conexao);
  }
}

async function rotinaDisparo(tipoDisparo) {
  let conexao;
  try {
    conexao = await create_pool_mysql();
    const diaDaSemana = new Date().getDay();
    const arrayRegra = await obterDadosDisparo(tipoDisparo, diaDaSemana);

    if (arrayRegra.length === 0) {
      console.log("Nenhum disparo agendado para hoje.");
      return;
    }

    const associadosGerais = await pegarAssociadosGerais(arrayRegra, tipoDisparo);
    await Promise.all(associadosGerais.map(associado => salvarAssociado(associado, tipoDisparo, conexao)));

    const associados = await buscarAssociadosValidos(tipoDisparo, hoje(), 1, 2, conexao);
    await processarAssociados(associados, tipoDisparo, conexao);
  } catch (error) {
    console.error("Erro na execução da rotina de disparo:", error);
  } finally {
    if (conexao) {
      await end_pool_mysql(conexao);
    }
  }
}

module.exports = rotinaDisparo;

// Exemplo de chamada da função
// rotinaDisparo('proativa');