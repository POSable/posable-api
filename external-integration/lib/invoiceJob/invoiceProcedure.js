var postProcedure = require('./../cloudElem/postProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');
var invoiceMap = require('./invoiceMap');
var invoiceMerchantSearch = require('../common/merchantSearch');


var invoiceProcedure = function (invoiceToBePosted) {
    try {
        var id = invoiceToBePosted.internalID;

        invoiceMerchantSearch(id, function(err, merchantArray){
            if (err) {
                // Error connecting to database
                logPlugin.error(err);
            } else {

                var invoice = invoiceMap();

                 merchantArray.forEach(function(merchant){
                     postProcedure(merchant, invoice, function(err, externalPost) {
                         if (err) {
                             logPlugin.error(err);
                         } else {
                             logPlugin.debug('ExternalPost: ' + externalPost.externalPostID + 'Posted and updated successfully');
                             //Prob need to update the Invoice as being posted here
                         }
                     });
                 });

            }
        });


    } catch (err) {
        logPlugin.error(err);
        throw err;
    }
};

module.exports = invoiceProcedure;