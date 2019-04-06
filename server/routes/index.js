const express = require('express');
const app = express();

app.use('/user',require('./user'));
app.use(require('./login'));
app.use('/category', require('./category'));
app.use('/product', require('./product'));
app.use(require('./image'));

module.exports = app;