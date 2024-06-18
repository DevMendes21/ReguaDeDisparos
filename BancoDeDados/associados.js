const { execute_query_mysql } = require("../BancoDeDados/conexaoBanco");
const { hoje, DataBanco } = require("../Utilitarios/data");
const { gerarUUIDv4 } = require("../Utilitarios/gerarUUIDv4");
const { buscarDadosBoleto } = require("../Servicos/Hinova/apis");
const fetch = require("node-fetch");
require("dotenv").config();

const TOKEN_API = process.env.API_TOKEN;
const URL_BASE = process.env.BASE_URL;

async function buscarAPI(endpoint, metodo, corpo = null) {
  const url = `${URL_BASE}/${endpoint}`;
  const cabecalhos = {
    Authorization: `Bearer ${TOKEN_API}`,
    "Content-Type": "application/json",
  };

  const opcoes = {
    method: metodo,
    headers: cabecalhos,
    body: corpo ? JSON.stringify(corpo) : undefined,
  };

  try {
    const resposta = await fetch(url, opcoes);
    if (!resposta.ok) {
      throw new Error(`Erro HTTP! Status: ${resposta.status}`);
    }
    return await resposta.json();
  } catch (erro) {
    console.error(`Erro durante a requisição para ${url}: ${erro.message}`);
    throw erro;
  }
}

// Função para listar associados ativos
async function listarAssociados() {
  const tiposAssociados = ["1", "2"];
  let todosAssociados = [];

  for (let i = 0; i < tiposAssociados.length; i++) {
    let pagina_corrente = 1;
    let numero_paginas = 0;
    let inicio_paginacao = 0;

    do {
      let corpo = {
        codigo_situacao: tiposAssociados[i],
        inicio_paginacao: inicio_paginacao,
      };

      try {
        const respostaJson = await buscarAPI("listar/associado", "POST", corpo);
        const { associados } = respostaJson;

        if (Array.isArray(associados)) {
          todosAssociados.push(
            ...associados.map((associado) => ({
              nome: associado.nome,
              cpf: associado.cpf,
              codigo: associado.codigo_associado,
              telefone: `${associado.ddd_celular}${associado.telefone_celular}`,
            }))
          );
        } else {
          console.warn(
            "Resposta da API não é um array, verifique os dados recebidos."
          );
        }

        inicio_paginacao = respostaJson.mostrando;
        pagina_corrente = respostaJson.pagina_corrente;
        numero_paginas = respostaJson.numero_paginas;

      } catch (erro) {
        console.error("Falha ao buscar associados ativos:", erro.message);
        break;
      }
    } while (pagina_corrente != numero_paginas);
  };

  return todosAssociados;
}

// Função para inserir associados na tabela 'atualizacao'
async function atualizacao(associados) {
  let atualizados = 0;
  let naoAtualizados = 0;
  
  try {
    for (const associado of associados) {
      let retryCount = 0;
      let success = false;

      while (!success && retryCount < 3) {
        try {
          const querySelect = `
            SELECT nomeAssociado, cpfAssociado, telefone 
            FROM atualizacao WHERE codigo_associado = ?;
          `;
          const paramsSelect = [associado.codigo];

          const result = await execute_query_mysql(querySelect, paramsSelect);
          
          if (result.length > 0) {
            const existingAssociado = result[0];
            const needsUpdate = 
              existingAssociado.nomeAssociado !== associado.nome ||
              existingAssociado.cpfAssociado !== associado.cpf ||
              existingAssociado.telefone !== associado.telefone;

            if (needsUpdate) {
              const queryUpdate = `
                UPDATE atualizacao 
                SET nomeAssociado = ?, cpfAssociado = ?, telefone = ? 
                WHERE codigo_associado = ?;
              `;
              const paramsUpdate = [
                associado.nome,
                associado.cpf,
                associado.telefone,
                associado.codigo
              ];
              await execute_query_mysql(queryUpdate, paramsUpdate);
              atualizados++;
            } else {
              naoAtualizados++;
            }
          } else {
            const queryInsert = `
              INSERT INTO atualizacao (nomeAssociado, cpfAssociado, codigo_associado, telefone) 
              VALUES (?, ?, ?, ?);
            `;
            const paramsInsert = [
              associado.nome,
              associado.cpf,
              associado.codigo,
              associado.telefone
            ];
            await execute_query_mysql(queryInsert, paramsInsert);
            atualizados++;
          }

          success = true;
        } catch (error) {
          retryCount++;
          console.error(`Erro na tentativa ${retryCount}:`, error);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (!success) {
        console.error(`Falha ao processar associado ${associado.nome} após 3 tentativas.`);
        continue;
      }
    }

    const totalProcessados = atualizados + naoAtualizados;
    console.log(`Total de associados processados: ${totalProcessados}`);
    console.log(`Total de associados atualizados: ${atualizados}`);
    console.log(`Total de associados já atualizados no Banco: ${naoAtualizados}`);
    
  } catch (error) {
    console.error("Erro ao processar associados:", error);
    throw error;
  }
}

async function buscarDadosAssociado(codigo_associado) {
  const query = 'SELECT * FROM atualizacao WHERE codigo_associado = ?';
  const responseDadosAssociado = await execute_query_mysql(query, [codigo_associado]);
  return responseDadosAssociado;
};

async function leituraAssociados(dadosAssociado = null) {
    const query = dadosAssociado ? "SELECT * FROM associados WHERE id = ?" : "SELECT * FROM associados";
    const params = dadosAssociado ? [dadosAssociado] : [];
    const resultado = await execute_query_mysql(query, params);
    return resultado.map(associado => ({
        ...associado,
        dataInsercao: new Date(associado.dataInsercao).toISOString().split("T")[0]
    }));
}

async function buscarAssociadosValidos(tipoDisparo, data, situacaoAssociado, situacaoBoleto) {
    const query = `
        SELECT * FROM associados
        WHERE DATE(dataInsercao) = ?
        AND tipoDisparo = ?
        AND codigoSituacaoAssociado = ?
        AND codigoSituacaoBoleto = ?
        AND codigoRegionalAssociado NOT IN (41, 37, 38);
    `;
    const params = [data, tipoDisparo, situacaoAssociado, situacaoBoleto];
    return await execute_query_mysql(query, params);
}

async function salvarAssociado(associado, tipoDisparo) {
    const dataVencimento = new Date(associado.data_vencimento).toISOString().split("T")[0];
    const cpfAssociado = associado.cpf_associado.replace(/\D/g, "");
    const dataInsercao = DataBanco();
    const query = `
        INSERT INTO associados (
            tipoDisparo, codigoAssociado, nomeAssociado, cpfAssociado, 
            codigoSituacaoAssociado, codigoRegionalAssociado, nomeRegionalAssociado, 
            codigoBoleto, nossoNumero, codigoSituacaoBoleto, codigoRegional, 
            mesReferente, dataVencimento, dataInsercao
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        );
    `;
    const params = [
        tipoDisparo, associado.codigo_associado, associado.nome_associado, cpfAssociado,
        associado.codigo_situacao_associado, associado.codigo_regional_associado, associado.nome_regional_associado,
        associado.codigo_boleto, associado.nosso_numero, associado.codigo_situacao_boleto,
        associado.codigo_regional, associado.mes_referente, dataVencimento, dataInsercao
    ];
    try {
        await execute_query_mysql(query, params);
    } catch (error) {
        console.error("Erro ao salvar associado:", error);
        throw error;
    }
}

async function processarDisparos(tipoDisparo) {
    const associados = await buscarAssociadosValidos(tipoDisparo, hoje(), 1, 2);
    for (const associado of associados) {
        const dadosBoleto = await buscarDadosBoleto(associado.nossoNumero);
        const dadosAssociado = await buscarDadosAssociado(associado.cpfAssociado);
        if (!dadosBoleto || !dadosAssociado) {
            console.error('Erro ao buscar dados do associado ou do boleto. Pulando para o próximo associado.');
            continue;
        }

        const numeroCelularValido = dadosAssociado.telefone_celular.replace(/[^0-9]/g, "");
        const dadosParaSalvar = {
            codigoAssociado: associado.codigoAssociado,
            fkAssociado: associado.pkAssociado,
            nome: dadosAssociado.nome || associado.nomeAssociado,
            cpf: dadosAssociado.cpf || associado.cpfAssociado,
            celular: numeroCelularValido,
            valorBoleto: dadosBoleto.valor_boleto,
            linkBoleto: dadosBoleto.link_boleto,
            linhaDigitavel: dadosBoleto.linha_digitavel,
            dataVencimento: dadosBoleto.data_vencimento,
            dataInsercao: new Date(),
            uuidv4: gerarUUIDv4(),
            checagem: 'ok',
            jsonErro: null
        };
        await salvarAlinhamentoDisparo(dadosParaSalvar);
    }
}

async function salvarAlinhamentoDisparo(dados) {
    const dataInsercao = DataBanco();
    const query = `
        INSERT INTO alinhamentoDisparos (
            codigoAssociado, fkAssociado, nome, cpf, celular, 
            valorBoleto, linkBoleto, linhaDigitavel, dataVencimento, 
            dataInsercao, uuidv4, checagem, jsonErro, errorMessage
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        );
    `;
    const params = [
        dados.codigoAssociado, dados.fkAssociado, dados.nome, dados.cpf,
        dados.celular, dados.valorBoleto, dados.linkBoleto, dados.linhaDigitavel,
        dados.dataVencimento, dataInsercao, dados.uuidv4, dados.checagem,
        dados.jsonErro, dados.errorMessage
    ];
    try {
        await execute_query_mysql(query, params);
    } catch (error) {
        console.error("Erro ao salvar alinhamento de disparo:", error);
        throw error;
    }
}

module.exports = {
    buscarAssociadosValidos,
    buscarDadosAssociado,
    leituraAssociados,
    salvarAssociado,
    processarDisparos,
    salvarAlinhamentoDisparo,
    listarAssociados,
    atualizacao
};