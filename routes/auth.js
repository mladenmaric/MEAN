var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var User = require('../models/User');
var app = require('../app');

var router = express.Router();

router.post('/login', (req, res) => {
    var user = {
        email: req.body.email,
        password: req.body.password
    };

    User.find(user, (err, result) => {
        if (err) {
            res.json({ success: false, status: "error", msg: "Error while connectiong" });
        } else if (result.length > 0) {
            res.json({ success: true, status: "OK", msg: "Successfully logged" });
        } else {
            res.json({ success: false, status: "no user", msg: "Email or Password are incorrect" });
        }
    });
});

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

module.exports = router;