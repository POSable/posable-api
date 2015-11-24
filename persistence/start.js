var wascallyRabbit = require('posable-wascally-wrapper');
var env = require('./common').config();
var createPaymentPersistence = require('./handlers/createPaymentPersistence');
var createTransactionPersistence = require('./handlers/createTransactionPersistence');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/paymentData');

wascallyRabbit.setEnvConnectionValues(env['wascally_connection_parameters']);
wascallyRabbit.setQSubscription('service.persistence');
wascallyRabbit.setHandler('posapi.event.receivedCreatePaymentRequest', createPaymentPersistence);
wascallyRabbit.setHandler('posapi.event.receivedCreateTransactionRequest', createTransactionPersistence);

wascallyRabbit.setup();

var sum = require('./lib/paymentQuery');
