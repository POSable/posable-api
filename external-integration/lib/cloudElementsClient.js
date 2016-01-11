var logPlugin = require('posable-logging-plugin');
var request = require('request');

var cloudElementsClient = function(salesReceipt, merchant, callback) {
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
        }, function(error, response, salesReceipt){
            logPlugin.debug("CloudElem response code: " + response.statusCode);
            if(error) {
                logPlugin.debug(error);
                callback(error);
            } if(response.statusCode == 200) {
                logPlugin.debug('Finish Cloud Elements Client posting function');
                callback(null, salesReceipt);
            } else {
                logPlugin.debug("CloudElem response code: " + response.statusCode);
                //console.log(salesReceipt);
                var newError = new Error("Cloud Elements has rejected the POST");
                callback(newError);
            }
        });

    } catch (err) {
        logPlugin.debug(err);
        callback(err);
    }
};

module.exports = cloudElementsClient;
