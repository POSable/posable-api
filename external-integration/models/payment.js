var mongoose = require('mongoose');

var Payment = new mongoose.Schema({
    InvoiceID: String,
    transactionID: String,
    paymentType: String,
    amount: Number

});

module.exports = {
    model : mongoose.model('Payment', Payment)
};
