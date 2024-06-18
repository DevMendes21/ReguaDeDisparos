require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Importando rotas
const associadosRotas = require("./Rotas/associadosRotas");
const configurarTarefas = require("./Automacoes/agendamentoTarefa");

// Configuração de middleware
app.use(express.json());

// Usando as rotas importadas
app.use("/associado", associadosRotas);

// Iniciando o servidor e tarefas cron
app.listen(port, () => {
  console.log(`O servidor está rodando na porta ${port}`);
  configurarTarefas();
});