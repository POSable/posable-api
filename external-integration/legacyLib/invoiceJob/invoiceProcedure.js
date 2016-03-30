var postInvoiceProcedure = require('./../cloudElem/postInvoiceProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');
var invoiceMap = require('./invoiceMap');
var invoiceMerchantSearch = require('../common/merchantSearch');
var updateInvoiceCloudElemID = require('./updateInvoiceCloudElemID');


var invoiceProcedure = function (invoiceToBePosted) {
    try {
        var id = invoiceToBePosted.internalID;
        var internalInvoiceID = invoiceToBePosted._id;

        invoiceMerchantSearch(id, function(err, merchConfig){
            if (err) {
                // Error connecting to database
                logPlugin.error(err);
            } else {
                var invoice = invoiceMap(invoiceToBePosted, merchConfig);

                 postInvoiceProcedure(merchConfig, invoice, function(err, qbInvoiceID) {
                     if (err) {
                         logPlugin.error(err);
                     } else {
                         logPlugin.debug('ExternalPost of Invoice : ' + qbInvoiceID + ' Posted and updated successfully');

                         //Mark Invoice as complete
                         updateInvoiceCloudElemID(internalInvoiceID, qbInvoiceID);

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