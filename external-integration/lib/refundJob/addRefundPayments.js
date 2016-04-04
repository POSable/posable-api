var logPlugin = require('posable-logging-plugin');
var RefundPayment = require('../../models/refundPayment').model;


var addRefundPayments = function(msg, refund) {
    var transPayments = msg.body.data.transactionPayments;

    transPayments.forEach(function(transPayment){
        var newPayType = getType(transPayment);

        // ignore gift payments, consolidates all other payment types
        if (newPayType !== 'gift') {

            if (refund.refundPayments.length > 0) {
                refund.refundPayments.forEach(function (refundPayment) {
                    if (refundPayment.paymentType === newPayType) {   // <-- type already exists, add amount to existing payment with same type
                        var newAmount = parseFloat(transPayment.amount);
                        refundPayment.amount += newAmount;
                    } else {
                        createNewRefundPayment();  // <-- type does NOT exist, add new refund payment
                    }
                });
            } else {
                createNewRefundPayment();  // <-- creates initial refund payment
            }
        } // end of addRefundPayments


        function createNewRefundPayment() {
            var newRefundPayment = new RefundPayment();
            var initialAmount = parseFloat(transPayment.amount);
            newRefundPayment.transactionID = msg.body.data.transactionID;
            newRefundPayment.paymentType = newPayType;
            newRefundPayment.amount = initialAmount;
            refund.refundPayments.push(newRefundPayment);
        }

        function getType(payment) {
            var type;
            if (payment.paymentType.toLowerCase() === 'credit') {
                type = payment.cardType.toLowerCase();
            } else {
                type = payment.paymentType.toLowerCase();
            }
            return type; // <-- Lower cased for string comparisons
        }
    });
};


module.exports = addRefundPayments;