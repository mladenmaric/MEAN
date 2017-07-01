var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var User = require('../models/User');
var Task = require('../models/Task');
var app = require('../app');

var router = express.Router();

// router.post('/login', (req, res) => {
//     var user = {
//         email: req.body.email,
//         password: req.body.password
//     };

//     User.find(user, (err, result) => {
//         if (err) {
//             res.json({ success: false, status: "error", msg: "Error while connectiong" });
//         } else if (result.length > 0) {
//             res.json({ success: true, status: "OK", msg: "Successfully logged" });
//         } else {
//             res.json({ success: false, status: "no user", msg: "Email or Password are incorrect" });
//         }
//     });
// });

router.post('/register', (req, res) => {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });

    user.save((err) => {
        if (err) {
            res.json({ success: false, status: "error" });
        } else {
            res.json({ success: true, status: "OK" });
        }
    });
});

router.post('/authenticate', function(req, res) {

    // find the user
    User.findOne({
        email: req.body.email
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: "1h"
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
});

router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

router.get('/user', (req, res) => {
    var user = {
        firstName: req.decoded._doc.firstName,
        lastName: req.decoded._doc.lastName,
        email: req.decoded._doc.email
    };
    res.json({ success: true, user: user });
});

router.post('/task/add', (req, res) => {
    var task = new Task({
        name: req.body.name,
        description: req.body.description,
        done: req.body.done,
        userId: req.decoded._doc._id
    });

    task.save((err) => {
        if (err) {
            res.json({ success: false, message: "Oops something went wrong." });
        } else {
            res.json({ success: true, task: task });
        }
    });
});

router.put('/task/:id', (req, res) => {
    var task = {
        done: req.body.done
    };

    Task.update({ _id: req.params.id }, task, (err, task) => {
        if (err) {
            res.json({ success: false, message: "Oops something went wrong." });
        } else {
            res.json({ success: true, task: task });
        }
    });
});

router.get('/tasks', (req, res) => {
    Task.find({ userId: req.decoded._doc._id }, (err, tasks) => {
        if (err) {
            res.json({ success: false, message: "Error occured" });
        } else {
            res.json({ success: true, tasks: tasks });
        }
    });
});

module.exports = router;