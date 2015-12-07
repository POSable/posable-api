var wascallyRabbit = require('posable-wascally-wrapper');
var env = require('./common').config();
var handlePayment = require('./handlers/sendPaymentEvent').handlePayment;
var handleTransaction = require('./handlers/sendTransactionEvent').handleTransaction;

wascallyRabbit.setEnvConnectionValues(env['wascally_connection_parameters']);
wascallyRabbit.setQSubscription('service.externalIntegration');
wascallyRabbit.setHandler('posapi.event.receivedCreatePaymentRequest', handlePayment);
wascallyRabbit.setHandler('posapi.event.receivedCreateTransactionRequest', handleTransaction);
wascallyRabbit.setup();


var request = require('request');

var options = {
    url: 'https://qa.cloud-elements.com:443/elements/api-v2/hubs/finance/sales-receipts',
    headers: {
        'User-Agent': 'request',
        'Authorization': 'User jui2aVPk3A3usYuKNwbfgVx905i3hA/hQZU6OH0mR0c=, Organization 421ce6cc2d25b88f268dd1ee7c49cea8, Element UTyJ/2y61Pi4rnE7ahTGXnT5MUayiTNhliSuY6zFhOI='
    }
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info);

    } else {
        console.log(body)
    }
}

request(options, callback);

