var mongoose = require('mongoose');

var PaymentSchema = new mongoose.Schema({
    uid: String,
    dateTime: String,
    paymentType: String,
    amount: Number,
    tax: Number,
    cardType: String,
    last4: String,
    authCode: String
});

module.exports = {
    model : mongoose.model('Payment', PaymentSchema)
};
