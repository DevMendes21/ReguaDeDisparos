const fetch = require("node-fetch");
const { geradorDeDataHora } = require("../../Utilitarios/data.js");
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

  // console.log(todosAssociados);
  return todosAssociados;
}

async function pegarAssociadosGerais(arrayRegra, tipoDisparo) {
  let todosAssociados = [];

  for (let regra of arrayRegra) {
    const dataVencimento = geradorDeDataHora("dd/mm/yyyy", regra * -1);
    const endpoint = "listar/boleto";
    const corpo = {
      data_vencimento_inicial: dataVencimento,
      data_vencimento_final: dataVencimento,
    };

    try {
      const respostaJson = await buscarAPI(endpoint, "POST", corpo);
      if (Array.isArray(respostaJson)) {
        todosAssociados = [...todosAssociados, ...respostaJson];
      } else {
        console.warn(
          "Resposta da API não é um array, verifique os dados recebidos."
        );
      }
    } catch (erro) {
      console.error("Falha ao buscar associados gerais:", erro.message);
    }
  }

  return todosAssociados;
}

// async function buscarDadosAssociado(cpfCnpjValido) {
//   const endpoint = `associado/buscar/${cpfCnpjValido}`;
//   try {
//     return await buscarAPI(endpoint, "GET");
//   } catch (erro) {
//     console.error(
//       `Erro ao buscar dados do associado para CPF/CNPJ: ${cpfCnpjValido}`,
//       erro
//     );
//     return null;
//   }
// }

async function buscarDadosBoleto(nossoNumero) {
  const endpoint = `buscar/boleto/${nossoNumero}`;
  try {
    return await buscarAPI(endpoint, "GET");
  } catch (erro) {
    console.error(
      `Erro ao buscar dados do boleto para nosso número: ${nossoNumero}`,
      erro
    );
    return null;
  }
}

module.exports = {
  listarAssociados,
  pegarAssociadosGerais,
  buscarDadosBoleto,
};