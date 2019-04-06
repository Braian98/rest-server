require('./config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();

// Midleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(express.static(path.resolve(__dirname, '../public')));

// Routes
app.use(require('./routes'));

// DB connection
mongoose.connect(process.env.URLDB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err, res) => {
    if(err) throw err;

    console.log('DB is connected');
})

app.listen(process.env.PORT, () => {
    console.log('OK');
});