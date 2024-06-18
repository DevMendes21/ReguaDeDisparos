function formatarData(data, formato) {
  const ano = data.getUTCFullYear();
  const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
  const dia = String(data.getUTCDate()).padStart(2, "0");
  const horas = String(data.getUTCHours()).padStart(2, "0");
  const minutos = String(data.getUTCMinutes()).padStart(2, "0");
  const segundos = String(data.getUTCSeconds()).padStart(2, "0");

  const formatos = {
    "yyyy-mm-dd HH:mm:ss": `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`,
    "yyyy-mm-dd HH:mm": `${ano}-${mes}-${dia} ${horas}:${minutos}`,
    "yyyy-mm-dd": `${ano}-${mes}-${dia}`,
    "dd-mm-yyyy HH:mm:ss": `${dia}-${mes}-${ano} ${horas}:${minutos}:${segundos}`,
    "dd-mm-yyyy HH:mm": `${dia}-${mes}-${ano} ${horas}:${minutos}`,
    "dd-mm-yyyy": `${dia}-${mes}-${ano}`,
    "dd/mm/yyyy HH:mm:ss": `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`,
    "dd/mm/yyyy HH:mm": `${dia}/${mes}/${ano} ${horas}:${minutos}`,
    "dd/mm/yyyy": `${dia}/${mes}/${ano}`
  };

  return formatos[formato] || "Formato inválido";
}

function geradorDeDataHora(formato, subtrairDias = 0) {
  const dataAtual = new Date();
  dataAtual.setUTCHours(dataAtual.getUTCHours() - 3); // Ajustar fuso horário se necessário
  if (subtrairDias) {
    dataAtual.setUTCDate(dataAtual.getUTCDate() - subtrairDias);
  }
  return formatarData(dataAtual, formato);
}

function DataBanco(dataHora) {
  if (!(dataHora instanceof Date)) {
    dataHora = new Date();
  }
  dataHora.setUTCHours(dataHora.getUTCHours() - 3); // Ajustar fuso horário
  return formatarData(dataHora, "yyyy-mm-dd HH:mm:ss");
}

function hoje() {
  return formatarData(new Date(), "yyyy-mm-dd");
}

module.exports = {
  geradorDeDataHora,
  DataBanco,
  hoje,
};
