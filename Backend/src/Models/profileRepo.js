const db = require('../Config/db');

const findUserById = async (userId) => {
    try {
        const [rows] = await db.execute(
            'SELECT username FROM clients WHERE id = ?', 
            [userId]
        );
        
        console.log("Database Result:", rows[0]); // Debugging kosam
        return rows[0];
    } catch (error) {
        console.error("Database Error Details:", error.message);
        throw new Error('Database Query Failed');
    }
};

module.exports = { findUserById };