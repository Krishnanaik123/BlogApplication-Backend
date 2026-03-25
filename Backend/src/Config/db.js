const mysql = require("mysql2");
require('dotenv').confiq();

const pool = mysql2.createPool({
    host:process.env.DB_Host,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    waitForConnections:true,
    connectionLimit:4,
    queryLimit:0
});
    const db = pool.promise();

    db.getConnection()
    .then(() =>
        console.log("MySql Connected Successfully!")
    .catch((err) => console.log("MySqlConnection Failed:",err.message))
    )

    module.exports = db;