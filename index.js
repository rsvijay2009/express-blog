const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const {errorHandler} = require('./middleware/errorHandler')
const sessions = require('express-session');

const connectDB = require('./config/db')
connectDB()

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: process.env.JWT_SECRET,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use('/api/v1/', require('./routes/auth'));
app.use('/api/v1/', require('./routes/post'));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
})