var express = require('express');
var env = require('node-env-file');
var app = express();

env(__dirname + '/.env');
const port = process.env.PORT || 3000;



app.get('/', (req, res) => {
    console.log(process.env.PORT);
    res.send('Hello, world');
});

app.listen(port, (err) => {
    if (err) {
        console.log('err');
    } else {
        console.log('Server started on port ' + port);
    }
});