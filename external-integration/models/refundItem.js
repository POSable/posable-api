var mongoose = require('mongoose');

var RefundItem = new mongoose.Schema({
    transactionID: String,
    type: String,
    amount: Number
});

module.exports = {
    model : mongoose.model('RefundItem', RefundItem)
};