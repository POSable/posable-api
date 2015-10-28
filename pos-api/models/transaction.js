// Load required packages
var mongoose = require('mongoose');
require('../models/payment');

// Define our transaction schema
var TransactionSchema = new mongoose.Schema({
    transactionID: String,
    cashierID: String,
    terminalID: String,
    merchantID: String,
    transactionPayments: [mongoose.model('Payment').schema]
});

// Export the Mongoose model
module.exports = mongoose.model('Transaction', TransactionSchema);


