// Load required packages
var mongoose = require('mongoose');

// Define our payment schema
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

// Export the Mongoose model
module.exports = mongoose.model('Payment', PaymentSchema);
