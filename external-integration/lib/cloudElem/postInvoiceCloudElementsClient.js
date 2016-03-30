var logPlugin = require('posable-logging-plugin');
var request = require('request');

var postInvoiceCloudElementsClient = function(payload, merchant, externalPost, callback) {
    try {
        logPlugin.debug('Start Cloud Elements Client Invoice posting function');
        request({
            url: 'https://qa.cloud-elements.com/elements/api-v2/hubs/finance/invoices',
            method: 'POST',
            headers: {
                'User-Agent': 'request',
                'Content-Type': 'application/json',
                'Authorization': merchant.cloudElemAPIKey
            },
            body: JSON.stringify(payload)

        }, function(err, response, payload){
            if (err) {
                logPlugin.error(err);
                callback(err, null, null, null);
            } else if (response.statusCode === 200) {
                logPlugin.debug('Successful post to Cloud Elements with Status Code of 200');
                callback(null, response, externalPost, payload);
            } else {
                logPlugin.debug("CloudElem response code: " + response.statusCode);
                logPlugin.debug("CloudElem response code: " + response.body);
                var newError = new Error("Failed post to CE");
                callback(newError, response, externalPost, null);
            }
        });

    } catch (err) {
        logPlugin.error(err);
        throw err;
    }
};

module.exports = postInvoiceCloudElementsClient;