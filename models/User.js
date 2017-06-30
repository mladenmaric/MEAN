var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, trim: true },
    password: { type: String, trim: true }
});

var User = mongoose.model('users', userSchema);
module.exports = User;