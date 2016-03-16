var mongoose = require('mongoose');

var TaxSchema = new mongoose.Schema({
    taxDescription: String,
    taxAmount: Number
});

module.exports = {
    model : mongoose.model('Tax', TaxSchema)
};