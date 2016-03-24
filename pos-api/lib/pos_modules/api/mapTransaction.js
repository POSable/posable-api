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
            transaction.subtotal = dto.transaction.subtotal;
            transaction.total = dto.transaction.total;
            transaction.customer = dto.transaction.customer;
            transaction.inventoryItems = dto.transaction.inventoryitems;
            transaction.discounts = [];
            transaction.taxes = [];
            transaction.transactionPayments = [];
            dto.transaction.discounts.forEach(function(discount) {
                    transaction.discounts.push({
                    discountDescription: discount.discountdescription,
                    discountAmount : discount.discountamount
                })
            });
            dto.transaction.taxes.forEach(function(tax) {
                transaction.taxes.push({
                    taxDescription: tax.taxdescription,
                    taxAmount : tax.taxamount
                })
            });
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