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
    cardType: { type: String, default: null },
    last4: { type: Number, default: null },
    authCode: { type: String, default: null }
});

module.exports = {
    model : mongoose.model('Payment', PaymentSchema)
};
