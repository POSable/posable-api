var Transaction = require('../models/transaction').model;
var logPlugin = require('posable-logging-plugin');
var env = require('../common').config();
var wascallyRabbit = require('posable-wascally-wrapper');
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);
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
             total: 0,
             batchID: 0
         };

        var paymentCallback = function (err, result) {

            //console.log(result);

            if (err) {
                logPlugin.error(err);
            } else {
                result.forEach(function(sum){

                    batch.batchID = batchID;

                    if(sum._id.cardType === 'visa') {
                        batch.visa += sum.amount;
                        batch.total += sum.amount;
                    } if(sum._id.cardType === 'mastercard') {
                        batch.mastercard += sum.amount;
                        batch.total += sum.amount;
                    } if(sum._id.cardType === 'amex') {
                        batch.amex += sum.amount;
                        batch.total += sum.amount;
                    } if(sum._id.cardType === 'discover') {
                        batch.discover += sum.amount;
                        batch.total += sum.amount;
                    }

                });
                //console.log("Batch for ID: ",internalID," : ", batch);

                var requestID = uuid.v4();

                //wascallyRabbit.raiseNewDailySumEvent(internalID, requestID, batch)
                //    .then(console.log('Summation sent to RabbitMQ'));

                finalizeBatch(internalID, requestID, batch);


            }
            callback(err, batchID, batch);
        };

        getBatchResults(internalID, batchID, paymentCallback);

    } catch (err) {
        logPlugin.error(err);
        return callback(err, undefined);
    }
};

module.exports = paymentQuery;


