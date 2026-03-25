const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require("morgan");
const dotenv = require('dotenv')

dotenv.confiq();
const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dotenv'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/posts',postRoutes);


//HealthCheck
app.get('/',(req,res) => {
    res.json({message:"Blog API Running"});
})

module.exports = app;