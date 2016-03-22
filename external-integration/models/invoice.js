var mongoose = require('mongoose');

var Invoice = new mongoose.Schema({
    finalizeAt: Date,
    cloudElemID: String,
    internalID: Number,
    invoiceItems: [mongoose.model('InvoiceItem').schema]
});

module.exports = {
    model : mongoose.model('Invoice', Invoice)
};