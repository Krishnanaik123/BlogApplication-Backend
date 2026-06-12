// ///localhost mysql connectionoriginal
//  const mysql2 = require('mysql2');
//  require('dotenv').config();

//  const pool = mysql2.createPool({
  
//    host: process.env.DB_HOST,
//    user: process.env.DB_USER,
//    password: process.env.DB_PASSWORD,
//    database: process.env.DB_NAME,
//    port: process.env.DB_PORT,
//    ssl: {
//      rejectUnauthorized: false
//    },
//    waitForConnections: true,
//    connectionLimit: 10,
//    queueLimit: 0,
//   connectTimeout: 10000
//  });

//  console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_NAME:", process.env.DB_NAME);
// console.log("DB_PORT:", process.env.DB_PORT);

//  const db = pool.promise();

//  db.getConnection()
//   .then(() => console.log('MySQL Connected Successfully!'))
//    .catch((err) => console.error('MySQL Connection Failed:', err));

//  module.exports = db;

// localhost mysql upside is correct database


//Mysql railway server connection
const mysql2 = require('mysql2');

const pool = mysql2.createPool(process.env.DATABASE_URL || "mysql://root:dBEawYxFiMSiEvHsZmnvNKsEsRHnkrQq@trolley.proxy.rlwy.net:49619/railway");

const db = pool.promise();

db.getConnection()
  .then((connection) => {
    console.log("MySQL Connected Successfully!");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ MySQL Connection Failed:");
    console.error(err);
  });

module.exports = db;