var Payment = require('../models/payment').model;
var Transaction = require('../models/transaction').model;
var logPlugin = require('posable-logging-plugin');
var env = require('../common').config();
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);

var paymentQuery = function(internalID, callback) {
    try {

        var batchObject = {
            visa: 0,
            mastercard: 0,
            amex: 0,
            discover: 0,
            total: 0
        };

        var paymentCallback = function (err, docs) {

            docs.forEach(function(payment){

                if(payment.cardType === 'visa') {
                    batchObject.visa += payment.amount;
                    batchObject.total +=payment.amount;
                } if(payment.cardType === 'mastercard') {
                    batchObject.mastercard += payment.amount;
                    batchObject.total +=payment.amount;
                } if(payment.cardType === 'amex') {
                    batchObject.amex += payment.amount;
                    batchObject.total +=payment.amount;
                } if(payment.cardType === 'discover') {
                    batchObject.discover += payment.amount;
                    batchObject.total +=payment.amount;
                }
            });
            callback(err, batchObject);
        };

        //var startDate = function(){
        //    '2015/01/24 22:14:44'
        //    //new Date(2015, 1, 24)
        //};
        //
        //var endDate = function() {
        //    '2016/01/25 22:14:44'
        //    //new Date(2015, 1, 26)
        //};

        Payment.find({"dateTime": {"$gte": '1995-11-17T03:24:00', "$lt": '1995-13-17T03:24:00'}})
            .where({internalID: internalID}).exec(paymentCallback);

    } catch (err) {
       logPlugin.error(err);
        return callback(err, undefined);
    }
};

module.exports = paymentQuery;


