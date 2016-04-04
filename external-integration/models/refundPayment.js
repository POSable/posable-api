var mongoose = require('mongoose');

var RefundPayment = new mongoose.Schema({
    transactionID: String,
    paymentType: String,
    amount: Number
});

module.exports = {
    model : mongoose.model('RefundPayment', RefundPayment)
};