var logPlugin = require('posable-logging-plugin');

var mapTransaction = function(dto, statusObject) {
        try {
            logPlugin.debug('Starting Transaction Property Mapping');
            var transaction = {};
            var dateTime;
            if (dto.Transaction.TransactionDateTime.CombinedDateTime) {
                dateTime = dto.Transaction.TransactionDateTime.CombinedDateTime;
            } else {
                dateTime = dto.Transaction.TransactionDateTime.Date + ' ' + dto.Transaction.TransactionDateTime.Time;
            }
            transaction.transactionID = dto.Transaction.TransactionID;
            transaction.internalID = statusObject.internalID;
            transaction.isVoid = dto.Transaction.IsVoid;
            transaction.isRefund = dto.Transaction.IsRefund;
            transaction.merchantID = dto.Transaction.MerchantID;
            transaction.registerID = dto.Transaction.RegisterID;
            transaction.cashierID = dto.Transaction.CashierID;
            transaction.dateTime = dateTime;
            transaction.discounts = dto.Transaction.Discounts;
            transaction.subtotal = dto.Transaction.Subtotal;
            transaction.taxes = dto.Transaction.Taxes;
            transaction.total = dto.Transaction.Total;
            transaction.customer = dto.Transaction.Customer;
            transaction.inventoryItems = dto.Transaction.InventoryItems;
            //transaction.customFields = dto.Transaction.CustomFields;

            transaction.transactionPayments = [];
            dto.Transaction.Payments.forEach(function(paymentdto) {
                transaction.transactionPayments.push({
                    paymentID: paymentdto.PaymentID,
                    paymentType : paymentdto.PaymentType,
                    amount : paymentdto.Amount,
                    cardType : paymentdto.CreditCard.CardType,
                    last4 : paymentdto.CreditCard.Last4,
                    authCode : paymentdto.CreditCard.AuthCode
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