var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');
var getBatchResults = require('./mongoAgg');
var finalizeBatch = require('./finalizeBatch');
var uuid = require('node-uuid');

var paymentQuery = function(internalID, batchID, callback) {
    try {

         var batch = {
             visa: 0,
             mastercard: 0,
             amex: 0,
             discover: 0,
             cash: 0,
             total: 0,
             batchID: 0
         };

        var paymentCallback = function (err, result) {


            if (err) {
                logPlugin.error(err);
            } else {

                batch.batchID = batchID;
                var requestID = uuid.v4();

                if(result.length > 0) {

                    result.forEach(function (sum) {

                        if (sum._id.cardType === 'visa') {
                            batch.visa += sum.amount;
                            batch.total += sum.amount;
                        }
                        if (sum._id.cardType === 'mastercard') {
                            batch.mastercard += sum.amount;
                            batch.total += sum.amount;
                        }
                        if (sum._id.cardType === 'amex') {
                            batch.amex += sum.amount;
                            batch.total += sum.amount;
                        }
                        if (sum._id.cardType === 'discover') {
                            batch.discover += sum.amount;
                            batch.total += sum.amount;
                        }
                        if (sum._id.cardType === 'cash') {
                            batch.cash += sum.amount;
                            batch.total += sum.amount;
                        }

                    });

                    wascallyRabbit.raiseNewDailySumEvent(internalID, requestID, batch)
                        .then(console.log('Summation sent to RabbitMQ'));

                }

                finalizeBatch(internalID, requestID, batch);

            }
            callback(err, batchID, batch);
        };
        logPlugin.debug('Starting mongo update and Query for :' + internalID);
        getBatchResults(internalID, batchID, paymentCallback);

    } catch (err) {
        logPlugin.error(err);
        return callback(err, undefined);
    }
};

module.exports = paymentQuery;


