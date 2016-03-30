var logPlugin = require('posable-logging-plugin');
var postInvoice = require('./postInvoiceCloudElementsClient');
var invoiceMerchantSearch = require('../common/merchantSearch');
var postExtPostInvoice = require('./cloudElementsClient');
var updateExtPost = require('./updateExtPost');

var extPostInvoiceProcedure = function(extPostInvoiceToBePosted) {
    var internalID = extPostInvoiceToBePosted.internalID;
    var postString = 'https://qa.cloud-elements.com/elements/api-v2/hubs/finance/invoices';

    invoiceMerchantSearch(internalID, function(err, merchConfig){
        if (err) {
            // Error connecting to database
            logPlugin.error(err);
        } else {
            postExtPostInvoice(extPostInvoiceToBePosted, merchConfig, postString, function(err, response) {
                if (err) {
                    logPlugin.error(err);
                } else {
                    var qbInvoiceID = JSON.parse(response.body).id;
                    qbInvoiceID = qbInvoiceID.slice(0,-2);

                    updateExtPost(extPostInvoiceToBePosted, qbInvoiceID);
                }
            })
        }
    });



};

module.exports = extPostInvoiceProcedure;
