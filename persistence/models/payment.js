var mongoose = require('mongoose');

var PaymentSchema = new mongoose.Schema({
    uid: String,
    dateTime: Date,
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
