var postProcedure = require('./../cloudElem/postProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');
var invoiceMap = require('./invoiceMap');
var invoiceMerchantSearch = require('../lib/common/merchantSearch');


var invoiceProcedure = function (invoiceToBeBatched) {
    try {
        var id = invoiceToBeBatched.internalID;

        invoiceMerchantSearch(id, function(err, merchant){
            if (err) {
                // Error connecting to database
                logPlugin.error(err);
            } else {
                var invoice = invoiceMap();

                postProcedure(merchant, invoice, function(err, externalPost) {
                    if (err) {
                        logPlugin.error(err);
                    } else {
                        logPlugin.debug('ExternalPost: ' + externalPost.externalPostID + 'Posted and updated successfully');
                        //Prob need to update the Invoice as being posted here
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