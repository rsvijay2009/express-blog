const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const {errorHandler} = require('./middleware/errorHandler')

const connectDB = require('./config/db')
connectDB()

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use('/api/v1/', require('./routes/auth'));
app.use(errorHandler);



app.get('/api/v1/test', (req, res) => {
    res.send('Test route')
});



app.listen(port, () => {
    console.log(`Server is running at ${port}`);
})