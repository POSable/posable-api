var mongoose = require('mongoose');

var Invoice = new mongoose.Schema({
    finalizeAt: Date,
    extPostID: String,
    paymentsSent: {type: Boolean, default: false},
    internalID: Number,
    invoiceItems: [mongoose.model('InvoiceItem').schema]
});

module.exports = {
    model : mongoose.model('Invoice', Invoice)
};