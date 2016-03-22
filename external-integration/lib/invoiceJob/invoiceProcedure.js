var postInvoiceProcedure = require('./../cloudElem/postInvoiceProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');
var invoiceMap = require('./invoiceMap');
var invoiceMerchantSearch = require('../common/merchantSearch');
var updateInvoiceCloudElemID = require('./../invoiceJob/updateInvoiceCloudElemID');
var paymentReceiptProcedure = require('./../paymentJob/paymentReceiptProcedure');


var invoiceProcedure = function (invoiceToBePosted) {
    try {
        var id = invoiceToBePosted.internalID;
        var invoiceID = invoiceToBePosted._id;

        invoiceMerchantSearch(id, function(err, merchantArray){
            if (err) {
                // Error connecting to database
                logPlugin.error(err);
            } else {
                var merchConfig = merchantArray[0];  //fix this shit so it's not in an array
                var invoice = invoiceMap(merchConfig);

                 postInvoiceProcedure(merchConfig, invoice, function(err, cloudElemID) {
                     if (err) {
                         logPlugin.error(err);
                     } else {
                         logPlugin.debug('ExternalPost: ' + cloudElemID + ' Posted and updated successfully');

                         //Mark Invoice as sent
                         updateInvoiceCloudElemID(invoiceID, cloudElemID);

                         //Send response to paymentReceiptProcedure
                         //paymentReceiptProcedure(merchConfig, externalPost.externalPostID);
                     }
                 });
            }
        });


    } catch (err) {
        logPlugin.error(err);
        throw err;
    }
};

module.exports = invoiceProcedure;