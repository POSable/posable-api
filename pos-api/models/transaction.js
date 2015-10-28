// Load required packages
var mongoose = require('mongoose');

//require...

var PaymentSchema = new mongoose.Schema({
    uid: String,
    transactionID: String,
    merchantID: String,
    terminalID: String,
    cashierID: String,
    dateTime: { type: Date, default: Date.now },
    paymentType: String,
    amount: Number,
    tax: Number,
    cardType: String,
    last4: Number,
    authCode: String
});

// Define our transaction schema
var TransactionSchema = new mongoose.Schema({
    transactionID: String,
    cashierID: String,
    terminalID: String,
    merchantID: String,
    transactionPayments: [PaymentSchema]
});

// Export the Mongoose model
module.exports = mongoose.model('Transaction', TransactionSchema);


