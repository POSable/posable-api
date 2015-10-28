// Load required packages
var mongoose = require('mongoose');

var Payment = require('./payment');



//var TransactionPaymentSchema = new mongoose.Schema({
//    cardType: String,
//    amount: Number,
//    last4OfCard: Number,
//    authorizationCode: String,
//    tax: Number,
//    terminalID: String,
//    merchantID: String,
//    transactionType: String,
//    uid: String,
//    userId: String
//});

// Define our transaction schema
var TransactionSchema = new mongoose.Schema({
    transactionID: String,
    cashierID: String,
    terminalID: String,
    merchantID: String,
    transactionPayments: [Payment]
});

// Export the Mongoose model
module.exports = mongoose.model('Transaction', TransactionSchema);


