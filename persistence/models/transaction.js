var mongoose = require('mongoose');
require('../models/payment');
require('../models/discount');
require('../models/tax');

var TransactionSchema = new mongoose.Schema({
    requestID: String,
    dateTime: Date,
    transactionID: String,
    internalID: String,
    isVoid: Boolean,
    isRefund: Boolean,
    merchantID: String,
    registerID: String,
    cashierID: String,
    discounts: [mongoose.model('Discount').schema],
    subtotal: Number,
    taxes: [mongoose.model('Tax').schema],
    total: Number,
    customer: Object,
    inventoryItems: Object,
    batchID: String,
    customField: Object,
    transactionPayments: [mongoose.model('Payment').schema]
});

module.exports = {
    model : mongoose.model('Transaction', TransactionSchema)
};
