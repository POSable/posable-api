var finishPaymentProcedure = require('./finishPaymentProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');
var paymentReceiptMap = require('./paymentReceiptMap');
var merchantSearch = require('../common/merchantSearch');
var forEachAsync = require('forEachAsync').forEachAsync;
var Invoice = require('../../models/invoice').model;

var updateInvoicePaymentsSent = function(internalInvoiceID) {
    Invoice.findOneAndUpdate(
        {
            _id: internalInvoiceID
        },
        {
            $set:
            {
                paymentsSent: true
            }
        },
        function(err, doc) {
            if (err) {
                logPlugin.error("The invoice update response Error from mongo is : " + err);
            }else {
                //logPlugin.debug("The invoice has been successfully updated paymentsSent === true : " + JSON.stringify(doc));
            }
        }

    )
};


var paymentReceiptProcedure = function (summedPaymentTypeArray, internalID, cloudElemID, internalInvoiceID) {

    try {

        merchantSearch(internalID, function(err, merchConfig) {
            if (err) {
                // Error connecting to database
                logPlugin.error(err);
            } else {
                summedPaymentTypeArray.forEach(function(typeSum) {

                    var paymentReceipt = paymentReceiptMap(merchConfig, cloudElemID, typeSum);

                    finishPaymentProcedure(merchConfig, paymentReceipt, function (err, paymentExtPostID) {
                        if (err) {
                            logPlugin.error(err);
                        } else {
                            logPlugin.debug('ExternalPost of type Payment saved successfully with ID : ' + paymentExtPostID);

                            //Mark Invoice and paymentsSent === true
                            updateInvoicePaymentsSent(internalInvoiceID);

                        }
                    });
                })

            }
        })

    } catch (err) {
        logPlugin.error(err);
        throw err;
    }
};

module.exports = paymentReceiptProcedure;

