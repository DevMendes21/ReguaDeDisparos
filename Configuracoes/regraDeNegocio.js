const arrayRegrasDisparo = [
    { diaDaSemana: "domingo", quantidadeDeDiasProativa: [], quantidadeDeDiasReativa: [] },
    { diaDaSemana: "segunda", quantidadeDeDiasProativa: [4], quantidadeDeDiasReativa: [-1, -2] }, //Segunda avisa que vai vencer na sexta, e que venceu sabado e domingo. OK
    { diaDaSemana: "terca", quantidadeDeDiasProativa: [4], quantidadeDeDiasReativa: [-1] }, //Terça avisa que vai vencer no sabado, e que venceu na segunda.
    { diaDaSemana: "quarta", quantidadeDeDiasProativa: [4], quantidadeDeDiasReativa: [-1] }, //Quarta avisa que vai vencer no domingo, e que venceu na terça.
    { diaDaSemana: "quinta", quantidadeDeDiasProativa: [4, 6], quantidadeDeDiasReativa: [-1] }, //Quinta avisa que vai vencer segunda e quarta, e que venceu quarta.
    { diaDaSemana: "sexta", quantidadeDeDiasProativa: [4, 6], quantidadeDeDiasReativa: [-1] }, //Sexta avisa que vai vencer na terça e na quinta, e avisa que venceu quinta
    { diaDaSemana: "sabado", quantidadeDeDiasProativa: [], quantidadeDeDiasReativa: [-1] }, //Sabado avisa que venceu sexta.
];

module.exports = {
    arrayRegrasDisparo
}

//Boletos com vencimento no final de semana e feriado
// Enviar aviso toda sexta se o boleto for referente ao final de semana.
// Envio da mensagem 2 dias antes do vencimento
// Vencimento SEGUNDA dispara SEXTA (PARA NÃO CAIR NO SABADO -2 DIAS)
// vencimento TERÇA dispara SEGUNDA (PARA NÃO CAIR NO DOMINGO -2 DIAS)
// Envio de mensagem 1 dia após vencimento (Boleto não pago)
// SE O BOLETO VENCE SEXTA, PODE MENSAGEM SABADO FALANDO QUE O BOLETO VENCEU NA SEXTA