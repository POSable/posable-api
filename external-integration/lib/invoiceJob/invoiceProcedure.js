var finishInvoiceProcedure = require('./finishInvoiceProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');
var invoiceMap = require('./invoiceMap');
var invoiceMerchantSearch = require('../common/merchantSearch');
var updateExtPostID = require('./updateInvoiceCloudElemID');


var invoiceProcedure = function (invoiceToBePosted) {
    try {
        var internalID = invoiceToBePosted.internalID;
        var internalInvoiceID = invoiceToBePosted._id;

        invoiceMerchantSearch(internalID, function(err, merchConfig){
            if (err) {
                // Error connecting to database
                logPlugin.error(err);
            } else {
                var invoice = invoiceMap(invoiceToBePosted, merchConfig);

                finishInvoiceProcedure(merchConfig, invoice, function(err, extPostID) {
                    if (err) {
                        logPlugin.error(err);
                    } else {
                        logPlugin.debug('ExternalPost of Invoice saved successfully with ID : ' + extPostID );

                        //Mark Invoice as complete and saved to Ext Post
                        updateExtPostID(internalInvoiceID, extPostID);

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