var mongoose = require('mongoose');

var PaymentSchema = new mongoose.Schema({
    paymentID: String,
    paymentType: String,
    amount: Number,
    cardType: String,
    last4: String,
    authCode: String,
    customField: Object
});

module.exports = {
    model : mongoose.model('Payment', PaymentSchema)
};
