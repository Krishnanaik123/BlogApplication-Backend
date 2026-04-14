const db = require('../Config/db');

const createAccount = async (username, password) => {
    try {
        const query = 'INSERT INTO clients (username, password) VALUES (?, ?)';
        const [result] = await db.execute(query, [username, password]);
        return {
            insertId: result.insertId,
            affectedRows: result.affectedRows
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const findByUsername = async (username) => {
    const query = 'SELECT * FROM clients WHERE username = ?';
    const [rows] = await db.execute(query, [username]);
    return rows[0];
};
module.exports = { createAccount, findByUsername };