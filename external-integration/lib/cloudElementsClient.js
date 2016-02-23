var logPlugin = require('posable-logging-plugin');
var request = require('request');

var cloudElementsClient = function(salesReceipt, merchant, externalPost, callback) {
    console.log(salesReceipt);
    try {
        logPlugin.debug('Start Cloud Elements Client posting function');
        request({
            url: 'https://qa.cloud-elements.com:443/elements/api-v2/hubs/finance/sales-receipts',
            method: 'POST',
            headers: {
                'User-Agent': 'request',
                'Content-Type': 'application/json',
                'Authorization': merchant.cloudElemAPIKey
            },
            body: JSON.stringify(salesReceipt)

        }, function(err, response, salesReceipt){
            if (err) {
                logPlugin.error(err);
                callback(err, null, null, null);
            } else if (response.statusCode === 200) {
                logPlugin.debug('Successful post to CE');
                callback(null, response, externalPost, salesReceipt);
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

module.exports = cloudElementsClient;
