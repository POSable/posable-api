var mongoose = require('mongoose');

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

module.exports = {
    model : mongoose.model('Payment', PaymentSchema)
};