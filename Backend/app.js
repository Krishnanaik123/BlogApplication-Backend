const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const postRoutes = require('./src/Routes/postRoutes');
const getPostRoutes = require('./src/Routes/getPostRoutes');
const categoryRoutes = require('./src/Routes/categoryRoutes');
const updatePostRoutes = require('./src/Routes/updatePostRoutes');


app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/blogPosts', postRoutes);
app.use('/api/getPosts', getPostRoutes);
app.use('/api/getCategories', categoryRoutes);
app.use('/api/updatePost', updatePostRoutes);

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.json({ message: 'Blog API Running' });
});

module.exports = app;