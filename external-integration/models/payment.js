var mongoose = require('mongoose');

var Payment = new mongoose.Schema({
    invoiceID: String,
    transactionID: String,
    paymentType: String,
    cardType: String,
    amount: Number,
    CloudElemPaymentID: String

});

module.exports = {
    model : mongoose.model('Payment', Payment)
};
