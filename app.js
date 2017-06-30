var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var cors = require('cors');
var env = require('node-env-file');
var app = express();

var port = process.env.PORT || 3000;


// env file
env(path.join(__dirname, '.env'));

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cors
app.use(cors());

// view engine
app.set('view engine', 'ejs');

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// routing
app.get('/', (req, res, next) => {
    res.send('Hello, world');
    // next();
});

app.use('/api/tasks', require('./routes/tasks'));

app.listen(port, (err) => {
    if (err) {
        console.log('err');
    } else {
        console.log('Server started on port ' + port);
    }
});