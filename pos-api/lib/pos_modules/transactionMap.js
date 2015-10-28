var mapPayment = require('./paymentMap');
var Payment = require('../../models/payment');

var mapTransaction = function(dto, transaction, statusObject) {
        try {
            var payment = new Payment();
            transaction.transactionID = dto.transaction.transactionID;
            transaction.merchantID = dto.transaction.merchantID;
            transaction.terminalID = dto.transaction.terminalID;
            transaction.cashierID = dto.transaction.cashierID;
            dto.transaction.payments.forEach(function(paymentdto) {
                transaction.transactionPayments.push({
                    uid : paymentdto.uid,
                    transactionID : paymentdto.transactionID,
                    merchantID : paymentdto.merchantID,
                    terminalID : paymentdto.terminalID,
                    cashierID : paymentdto.cashierID,
                    dateTime : paymentdto.dateTime,
                    paymentType : paymentdto.paymentType,
                    amount : paymentdto.amount,
                    tax : paymentdto.tax,
                    cardType : paymentdto.creditCard.cardType,
                    last4 : paymentdto.creditCard.last4,
                    authCode : paymentdto.creditCard.authCode

                });
            })



                //transactionID : "SampleID",
                //merchantID : "SampleID",
                //terminalID : "SampleID",
                //cashierID : "SampleID",
                //dateTime :  "Wed Oct 14 2015 11:30:50 GMT-0600 (MDT)",
                //paymentType : "credit",
                //amount : 100.00,
                //tax : 15.45,
                //cardType : "visa",
                //last4 : 1234,
                //authCode : 123



            //var count = 0;
            //dto.transaction.payments.forEach(function(paymentdto) {
            //
            //    count++;
            //    var payment = new Payment();
            //    mapPayment(paymentdto, payment, statusObject);
            //    transaction.transactionPayment.push(payment);
            //
            //    statusObject.success.push(count + " payment of " + dto.transaction.payments.length);
            //})


        } catch (err) {
            console.log(err);
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "transactionMap",
                error: {code: 400, message: "Transaction DB Map was not successfully completed from Post Body"}
            }
        }
        return transaction;
    };

module.exports = mapTransaction;