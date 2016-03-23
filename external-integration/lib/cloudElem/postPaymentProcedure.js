var logPlugin = require('posable-logging-plugin');
var persistRequest = require('./persistRequest').persistRequest;
var updateRequest = require('./persistRequest').updateRequest;
var postPayment = require('./postPaymentCloudElementsClient');
var paymentReceiptProcedure = require('./../paymentJob/paymentReceiptProcedure');
var updateInvoiceCloudElemID = require('./../invoiceJob/updateInvoiceCloudElemID');


var postPaymentProcedure = function(merchant, payload, callback) {

    persistRequest(payload, merchant, postToExternal);

    function postToExternal(err, payload, merchant, externalPost) {
        if (err) {
            // Error saving request, exit with error
            logPlugin.error(err);
            return callback(err);
        } else {
            postPayment(payload, merchant, externalPost, updateRequestWithResponse);
        }
    }

    function updateRequestWithResponse(err, response, externalPost, payload) {
        if (err) {
            // Error posting request or updating externalPost, exit with error
            logPlugin.error(err);
            return callback(err, null);
        } else {

            // Request posted and externalPost updated
            updateRequest(externalPost, response, payload, callback);  // <- Passes to original callback
        }
    }
};

module.exports = postPaymentProcedure;