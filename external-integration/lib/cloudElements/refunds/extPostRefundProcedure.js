var logPlugin = require('posable-logging-plugin');
var merchantSearch = require('../../common/merchantSearch');
var postExtPostRefund = require('./../cloudElementsClient');
var updateExtPost = require('./../updateExtPost');

var extPostRefundProcedure = function(extPostRefundToBePosted) {
    var internalID = extPostRefundToBePosted.internalID;
    var postString = 'https://qa.cloud-elements.com/elements/api-v2/hubs/finance/refund-receipts';

    merchantSearch(internalID, function(err, merchConfig){
        if (err) {
            // Error connecting to database
            logPlugin.error(err);
        } else {
            postExtPostRefund(extPostRefundToBePosted, merchConfig, postString, function(err, response) {
                if (err) {
                    logPlugin.error(err);
                } else {
                    var statusCode = response.status;
                    var extObjID = JSON.parse(response.body).id;
                    extObjID = extObjID.slice(0,-2);

                    updateExtPost(extPostRefundToBePosted, extObjID, statusCode);
                }
            })
        }
    });
};

module.exports = extPostRefundProcedure;