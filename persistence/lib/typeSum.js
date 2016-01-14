var paymentQuery = require('./paymentQuery');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');

var internalID;


var typeSum = function(batchMerchantsArray) {
    try {

        batchMerchantsArray.forEach(function(merchant){
            paymentQuery(merchant.internalID, callback);
            internalID = merchant.internalID;
        });




    //    var result = 0;
    //    var callback = function(err, payments) {
    //    if (err) return err;
    //        payments.forEach(function(payment) {
    //
    //            result += payment.transactionPayments.reduce(function (prev, curr) {
    //                return prev + curr.amount;
    //            }, 0)
    //        });
    //    logPlugin.debug("this is the result of the typeSum: " + result);
    //    //inside callback block return result will need push to timed service
    //    //Publish msg to Rabbit using the wascally wrapper
    //    // Also need to handle error returned from wascally. If one.
    //    wascallyRabbit.raiseNewDailySumEvent(internalID, result).then(console.log('Summation sent to RabbitMQ'))
    //    };
    //paymentQuery(callback);

    } catch (err) {
        //logPlugin.error(err);
        return err;
    }
};

var visaResult = 0;

var callback = function(err, batchArray) {
    //console.log(batchArray);
    var visaArray = batchArray.visa;
    //console.log(visaArray);
    //visaArray.forEach(function(visaTransaction){
    //    visaResult += visaTransaction.transactionPayments.reduce(function (prev, curr) {
    //        return prev + curr.amount;
    //    }, 0)
    //});

    //logPlugin.debug("this is the result of the typeSum: " + batchObj);

    //wascallyRabbit.raiseNewDailySumEvent(internalID, batchObj).then(console.log('Summation sent to RabbitMQ'));



};

var batchObj = {
    visa: visaResult
};

module.exports = typeSum;