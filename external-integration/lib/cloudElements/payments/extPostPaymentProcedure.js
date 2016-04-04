var logPlugin = require('posable-logging-plugin');
var merchantSearch = require('../../common/merchantSearch');
var postExtPostPayment = require('./../cloudElementsClient');
var updateExtPost = require('./../updateExtPost');

var extPostPaymentProcedure = function(extPostPaymentToBePosted, callback) {
    var internalID = extPostPaymentToBePosted.internalID;
    var postString = 'https://qa.cloud-elements.com/elements/api-v2/hubs/finance/payments';

    merchantSearch(internalID, function(err, merchConfig){
        if (err) {
            // Error connecting to database
            logPlugin.error(err);
        } else {
            postExtPostPayment(extPostPaymentToBePosted, merchConfig, postString, function(err, response) {
                if (err) {
                    logPlugin.error(err);
                } else {
                    var statusCode = response.status;
                    var extObjID = JSON.parse(response.body).id;
                    extObjID = extObjID.slice(0,-2);

                    updateExtPost(extPostPaymentToBePosted, extObjID, statusCode);
                    callback(null, extObjID);
                }
            })
        }
    });



};

module.exports = extPostPaymentProcedure;
