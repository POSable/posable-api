var logPlugin = require('posable-logging-plugin');

var mapTransaction = function(dto, statusObject) {
        // All dto keys need to be lowercase
        try {
            logPlugin.debug('Starting Transaction Property Mapping');
            var transaction = {};
            var dateTime;
            if (dto.transaction.transactiondatetime.combineddatetime) {
                dateTime = dto.transaction.transactiondatetime.combineddatetime;
            } else {
                dateTime = dto.transaction.transactiondatetime.date + ' ' + dto.transaction.transactiondatetime.time;
            }
            transaction.transactionID = dto.transaction.transactionid;
            transaction.internalID = statusObject.internalID;
            transaction.isVoid = dto.transaction.isvoid;
            transaction.isRefund = dto.transaction.isrefund;
            transaction.merchantID = dto.transaction.merchantid;
            transaction.registerID = dto.transaction.registeruid;
            transaction.cashierID = dto.transaction.cashierid;
            transaction.dateTime = dateTime;
            transaction.discounts = dto.transaction.discounts;
            transaction.subtotal = dto.transaction.subtotal;
            transaction.taxes = dto.transaction.taxes;
            transaction.total = dto.transaction.total;
            transaction.customer = dto.transaction.customer;
            transaction.inventoryItems = dto.transaction.inventoryitems;
            //transaction.customFields = dto.transaction.customfields;

            transaction.transactionPayments = [];
            dto.transaction.payments.forEach(function(paymentdto) {
                transaction.transactionPayments.push({
                    paymentID: paymentdto.paymentid,
                    paymentType : paymentdto.paymenttype,
                    amount : paymentdto.amount,
                    cardType : paymentdto.creditcard.cardtype,
                    last4 : paymentdto.creditcard.last4,
                    authCode : paymentdto.creditcard.authcode
                })
            });
            logPlugin.debug('Transaction Property Mapping was Successful');
        } catch (err) {
            logPlugin.error(err);
            statusObject.isOK = false;
            statusObject['error'] = {
                error: {code: 400, message: "Transaction Map was not successfully completed from Post Body"}
            }
        }
        return transaction;
    };

module.exports = mapTransaction;