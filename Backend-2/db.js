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