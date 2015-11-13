var wascallyRabbit = require('posable-wascally-wrapper');
var env = require('../pos-api/lib/pos_modules/common').config();
var createPersistence = require('./handlers/createPersistence');

wascallyRabbit.setEnvConnectionValues(env['wascally_connection_parameters']);
wascallyRabbit.setQSubscription('service.persistence');
wascallyRabbit.setHandler('posapi.event.receivedCreatePaymentRequest', createPersistence);
wascallyRabbit.setHandler('posapi.event.receivedCreateTransactionRequest', createPersistence);

wascallyRabbit.setup();
