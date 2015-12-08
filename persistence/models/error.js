var mongoose = require('mongoose');

var ErrorSchema = new mongoose.Schema({
    server: String,
    application: String,
    data: String
});

module.exports = {
    model : mongoose.model('Error', ErrorSchema)
};