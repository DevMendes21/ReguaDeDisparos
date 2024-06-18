## Readme para o projeto ReguaDeDisparos

**Objetivo:**

Este projeto visa automatizar o envio de notificações via WhatsApp para associados da locadora de veículos, informando-os sobre vencimentos de boletos próximos e boletos vencidos recentemente. O sistema também atualiza o banco de dados com as informações de envio e status das mensagens.

**Funcionalidades:**

* **Disparo de notificações:**
    * Envia mensagens personalizadas via WhatsApp para associados com boletos a vencer em 5 dias.
    * Reenvia mensagens para associados que não receberam a notificação inicial do boleto a vencer.
    * Envia mensagens para associados com boletos vencidos há 1 dia.
* **Atualização do banco de dados:**
    * Registra as informações de envio e status das mensagens no banco de dados.
    * Atualiza os dados dos associados no banco de dados.
* **Gerenciamento de tarefas:**
    * Utiliza cron jobs para agendar a execução das tarefas de disparo e atualização de dados.
* **Configuração:**
    * Permite configurar os dias da semana e horários para o envio das notificações.
    * Permite configurar os parâmetros de conexão com o banco de dados e com o serviço de envio de mensagens.

**Tecnologias:**

* **Linguagem de programação:** Node.js
* **Bibliotecas:**
    * mysql2: para conexão com o banco de dados MySQL
    * node-cron: para agendamento de tarefas
    * fetch: para realizar requisições HTTP
* **Serviços:**
    * Blip: para envio de mensagens via WhatsApp
    * Hinova: para consulta de dados dos associados e boletos

**Estrutura do projeto:**

* **Banco de dados:**
    * Tabelas:
        * `associados`: armazena os dados dos associados.
        * `alinhamentoDisparos`: armazena as informações de envio e status das mensagens.
        * `acompanhamento`: armazena dados estatísticos sobre os disparos de notificações.
* **Código:**
    * `conexaoBanco.js`: módulo para conexão com o banco de dados.
    * `associados.js`: módulo para gerenciamento dos dados dos associados.
    * `disparo.js`: módulo para gerenciamento do envio de notificações.
    * `blip.js`: módulo para integração com o serviço Blip de envio de mensagens.
    * `hinova.js`: módulo para integração com o serviço Hinova de consulta de dados.
    * `cron.js`: módulo para agendamento de tarefas.
    * `app.js`: arquivo principal que inicia o projeto.
* **Configurações:**
    * `regraDeNegocio.js`: define as regras de negócio para o disparo de notificações.
    * `.env`: arquivo de variáveis de ambiente para configurações de conexão com o banco de dados e com o serviço de envio de mensagens.

**Para executar o projeto:**

1. Clone o repositório do projeto.
2. Instale as dependências do projeto: `npm install`.
3. Configure as variáveis de ambiente no arquivo `.env`.
4. Execute o comando: `node app.js`.

**Observações:**

* Este projeto é um exemplo e pode ser adaptado às necessidades específicas da sua empresa.
* É importante configurar as variáveis de ambiente com as informações de conexão com o banco de dados e com o serviço de envio de mensagens antes de executar o projeto.
* O projeto utiliza cron jobs para agendar a execução das tarefas de disparo e atualização de dados. Você precisará configurar o cron em seu servidor para que as tarefas sejam executadas automaticamente nos horários desejados.

**Exemplos de uso:**

* Para disparar as notificações de boletos a vencer em 5 dias, execute o comando: `node disparo.js proativa`.
* Para disparar as notificações de boletos vencidos há 1 dia, execute o comando: `node disparo.js reativa`.
* Para atualizar os dados dos associados no banco de dados, execute o comando: `node associados.js atualizar`.

**Links úteis:**

* Documentação do mysql2: [https://www.npmjs.com/package/mysql2](https://www.npmjs.com/package/mysql2)
* Documentação do node-cron: [https://www.npmjs.com/package/node-cron](https://www.npmjs.com/package/node-cron)
* Documentação do fetch: [https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
* Documentação do Blip: [https://www.blip.ai/en/](https://www.blip.ai/en/)
* Documentação do Hinova: [https://hinova.com.br/](https://hinova.com.br/)

**Contribuições:**

- **Desenvolvimento de Software:** Especializado em HTML, CSS, JavaScript, TypeScript, Node.js e Express.js. Conhecimento em Python, Java, SQL e MySQL.
  
- **Experiência Profissional:**  Haaify (Junior Software Developer, foco em melhorias de sistema, APIs, CRUD, chatbots e relatórios).

- **Educação e Certificações:** Bacharelado em Ciência da Computação na UNA, certificações em Fundamentos da Computação e Desenvolvimento Web.

- **Projetos Destacados:** Desenvolvimento do sistema "ReguaDeDisparos" para automatizar notificações via WhatsApp para associados de uma locadora de veículos, com integração de APIs e gerenciamento de banco de dados.

- **Links:** [GitHub](https://github.com/DevMendes21), [LinkedIn](https://www.linkedin.com/in/yago-mendes-328b5923b)