var mongoose = require('mongoose');

var Refund = new mongoose.Schema({
    processed: {type: Boolean, default: false},
    internalID: Number,
    refundItems: [mongoose.model('RefundItem').schema],
    refundPayments: [mongoose.model('RefundPayment').schema]
});

module.exports = {
    model : mongoose.model('Refund', Refund)
};