var mongoose = require('mongoose');

var BatchSchema = new mongoose.Schema({
    visa: Number,
    mastercard: Number,
    amex: Number,
    discover: Number,
    total: Number
});

module.exports = {
    model : mongoose.model('batch', BatchSchema)
};