const express = require('express')
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const user = require('./api/user');
const photo = require('./api/photo');

if(process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
} 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.use('/users', user);
app.use('/photo', photo);

module.exports = app;
