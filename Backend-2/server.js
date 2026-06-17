const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173' ,
    "https://blog-application-lyart-zeta.vercel.app"
]}));

app.get('/api/clients', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM clients');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3006;
app.listen(PORT, () => {
  console.log(`Backend-2 running on port ${PORT}`);
});