var logPlugin = require('posable-logging-plugin');
var request = require('request');

var cloudElementsClient = function(salesReceipt) {
    try {
        request({
            url: 'https://qa.cloud-elements.com:443/elements/api-v2/hubs/finance/sales-receipts',
            headers: {
                'User-Agent': 'request',
                'Authorization': 'User jui2aVPk3A3usYuKNwbfgVx905i3hA/hQZU6OH0mR0c=, Organization 421ce6cc2d25b88f268dd1ee7c49cea8, Element UTyJ/2y61Pi4rnE7ahTGXnT5MUayiTNhliSuY6zFhOI='
            },
            body: JSON.stringify(salesReceipt)
        }, function(error, response, salesReceipt){
            if(error) {
                logPlugin.debug(error);
            } else {
                logPlugin.debug(response.statusCode, salesReceipt);
            }
        });

    } catch (err) {
        logPlugin.debug(err);
    }
};

module.exports = cloudElementsClient;
