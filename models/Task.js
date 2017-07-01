var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    name: String,
    description: String,
    done: Boolean,
    userId: String
});

var Task = mongoose.model('Task', taskSchema);
module.exports = Task;