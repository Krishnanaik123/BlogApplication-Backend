const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const postRoutes = require('./src/Routes/postRoutes');

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/blogPosts', postRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Blog API Running' });
});

module.exports = app;