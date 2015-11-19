var mongoose = require('mongoose');

var LogSchema = new mongoose.Schema({
    server: String,
    application: String,
    level: String,
    message: String,
    stack: String
});

module.exports = {
    model : mongoose.model('Log', LogSchema)
};