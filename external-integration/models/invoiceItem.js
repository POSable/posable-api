var mongoose = require('mongoose');

var InvoiceItem = new mongoose.Schema({
    transactionID: String,
    type: String,
    amount: Number
});

module.exports = {
    model : mongoose.model('InvoiceItem', InvoiceItem)
};
