var wascallyRabbit = require('posable-wascally-wrapper');
var env = require('../pos-api/lib/pos_modules/common').config();
var createPaymentPersistence = require('./handlers/createPaymentPersistence');
var createTransactionPersistence = require('./handlers/createPaymentPersistence');

wascallyRabbit.setEnvConnectionValues(env['wascally_connection_parameters']);
wascallyRabbit.setQSubscription('service.persistence');
wascallyRabbit.setHandler('posapi.event.receivedCreatePaymentRequest', createPaymentPersistence);
wascallyRabbit.setHandler('posapi.event.receivedCreateTransactionRequest', createTransactionPersistence);

wascallyRabbit.setup();
