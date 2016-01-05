var logPlugin = require('posable-logging-plugin');
var request = require('request');

var cloudElementsClient = function(salesReceipt, callback) {
    try {
        request({
            url: 'https://qa.cloud-elements.com:443/elements/api-v2/hubs/finance/sales-receipts',
            method: 'POST',
            headers: {
                'User-Agent': 'request',
                'Authorization': 'User jui2aVPk3A3usYuKNwbfgVx905i3hA/hQZU6OH0mR0c=, Organization 421ce6cc2d25b88f268dd1ee7c49cea8, Element UTyJ/2y61Pi4rnE7ahTGXnT5MUayiTNhliSuY6zFhOI='
            },
            body: JSON.stringify(salesReceipt)
        }, function(error, response, salesReceipt){
            //if()
            console.log(response.statusCode);
            if(error) {
                logPlugin.debug(error);
                callback(error);
            } else {
                //console.log(callback);
                logPlugin.debug(response.statusCode, salesReceipt);
                callback(null, salesReceipt);
            }
        });

    } catch (err) {
        logPlugin.debug(err);
        callback(err);
    }
};

module.exports = cloudElementsClient;
