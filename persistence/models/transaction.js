var mongoose = require('mongoose');
require('../models/payment');

var TransactionSchema = new mongoose.Schema({
    transactionID: String,
    cashierID: String,
    terminalID: String,
    merchantID: String,
    transactionPayments: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Payment'}
    ]
    //transactionPayments: [mongoose.model('Payment').schema]
});

module.exports = {
    model : mongoose.model('Transaction', TransactionSchema)
};
