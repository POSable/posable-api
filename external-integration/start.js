var wascallyRabbit = require('posable-wascally-wrapper');
var env = require('./common').config();
var handlePayment = require('./handlers/sendPaymentEvent').handlePayment;
var handleTransaction = require('./handlers/sendTransactionEvent').handleTransaction;

wascallyRabbit.setEnvConnectionValues(env['wascally_connection_parameters']);
wascallyRabbit.setQSubscription('service.externalIntegration');
wascallyRabbit.setHandler('posapi.event.receivedCreatePaymentRequest', handlePayment);
wascallyRabbit.setHandler('posapi.event.receivedCreateTransactionRequest', handleTransaction);
wascallyRabbit.setup();

require('./lib/cloudElementsClient');
