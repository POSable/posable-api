// Load required packages
var mongoose = require('mongoose');

// Define our transaction schema
var TransactionSchema   = new mongoose.Schema({
  'amount': Number,
});

// Export the Mongoose model
module.exports = mongoose.model('Transaction', TransactionSchema);
