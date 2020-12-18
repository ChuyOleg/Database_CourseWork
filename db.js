const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  password: 'postgreSQL',
  host: 'localhost',
  port: '5432',
  database: 'study', 
});


module.exports = pool ;