var mongoose = require('mongoose');

var Payment = new mongoose.Schema({
    invoiceID: String,
    transactionID: String,
    cloudElemID: String,
    paymentType: String,
    amount: Number,
    CloudElemPaymentID: String

});

module.exports = {
    model : mongoose.model('Payment', Payment)
};
