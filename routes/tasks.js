var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://mladen:mladen77@ds129402.mlab.com:29402/chat_db');

var Task = require('../models/Task');

router.get('/add', (req, res) => {
    var task = new Task({
        name: "Task 1",
        description: "Description of task 1",
        done: false
    });

    task.save((err) => {
        if (err) throw err;
        res.send('Task successfully added');
    });
});

router.get('/', (req, res) => {
    Task.find({}, (err, data) => {
        if (err) throw err;
        res.json(data);
    });
});


module.exports = router;