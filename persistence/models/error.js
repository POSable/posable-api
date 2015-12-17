var mongoose = require('mongoose');

var ErrorSchema = new mongoose.Schema({
    server: String,
    application: String,
    data: Object
});

module.exports = {
    model : mongoose.model('Error', ErrorSchema)
};