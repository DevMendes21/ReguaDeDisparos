const mysql = require("mysql2/promise");

const dbconfig = {
  host: '',
  port: '',
  user: '',
  password: '',
  database: ''
};

let pool;

  async function create_pool_mysql() {
    if (!pool) {
      try {
        pool = mysql.createPool(dbconfig);
        console.log("Conexão Estabelecida");
      } catch (error) {
        console.error("Falha ao estabelecer conexão:", error);
        throw error;
      }
    }
    return pool;
  }

  async function execute_query_mysql(query, params) {
    const conn = await create_pool_mysql();
    const [rows] = await conn.query(query, params);
    return rows;
  }

  async function end_pool_mysql() {
    if (pool) {
      try {
        await pool.end();
        console.log("Conexão Encerrada");
        pool = null;
      } catch (error) {
        console.error("Erro ao encerrar conexão:", error);
        throw error;
      }
    }
  }

  module.exports = {
    create_pool_mysql,
    end_pool_mysql,
    execute_query_mysql
  };