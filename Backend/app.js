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
const deletePostRoutes = require('./src/Routes/deletePostRoutes');
const authRoutes = require('./src/Routes/authRoutes');


app.use(cors());
app.use(helmet(
  {
    crossOriginResourcePolicy: false
  }
));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/blogPosts', postRoutes);
app.use('/api/getPosts', getPostRoutes);
app.use('/api/getCategories', categoryRoutes);
app.use('/api/updatePost', updatePostRoutes);
app.use('/api/deletePost', deletePostRoutes);
app.use('/api/signup', authRoutes);
app.use('/api/auth', authRoutes);

const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
  res.json({ message: 'Blog API Running' });
});

module.exports = app;