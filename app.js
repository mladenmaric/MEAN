var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var cors = require('cors');
var env = require('node-env-file');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');

var app = module.exports = express();

var config = require('./config/config');

var port = process.env.PORT || 3000;

// mongo db
mongoose.connect(config.database);

// jwt token secret
app.set('superSecret', config.secret);

// use morgan to log requests to the console
app.use(morgan('dev'));

// env file
env(path.join(__dirname, '.env'));

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cors
app.use(cors());

// static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/auth'));

app.listen(port, (err) => {
    if (err) throw err;
    console.log('Server started on port ' + port);
});