// Load required packages
var mongoose = require('mongoose');

// Define our transaction schema
var TransactionSchema = new mongoose.Schema({
  cardType: String,
  amount: Number,
  last4OfCard: Number,
  authorizationCode: String,
  tax: Number,
  terminalID: String,
  merchantID: String,
  transactionType: String,
  netEPaySN: String,
  userId: String
});

// Export the Mongoose model
module.exports = mongoose.model('Transaction', TransactionSchema);
