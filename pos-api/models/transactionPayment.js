// Load required packages
var mongoose = require('mongoose');


var TransactionPaymentSchema = new mongoose.Schema({
    cardType: String,
    amount: Number,
    last4OfCard: Number,
    authorizationCode: String,
    tax: Number,
    terminalID: String,
    merchantID: String,
    transactionType: String,
    netEPaySN: String,
    userId: String
});

module.exports = mongoose.model('TransactionPayment', TransactionPaymentSchema);