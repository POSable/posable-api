var wascallyRabbit = require('posable-wascally-wrapper');
var env = require('./common').config();
var createPaymentPersistence = require('./handlers/createPaymentPersistence');
var createTransactionPersistence = require('./handlers/createTransactionPersistence');
var createErrorPersist = require('./handlers/createErrorPersist');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/paymentData');

console.log('wascally rabbit setup');
wascallyRabbit.setEnvConnectionValues(env['wascally_connection_parameters']);
wascallyRabbit.setQSubscription('service.persistence');
wascallyRabbit.setHandler('posapi.event.receivedCreatePaymentRequest', createPaymentPersistence);
wascallyRabbit.setHandler('posapi.event.receivedCreateTransactionRequest', createTransactionPersistence);
wascallyRabbit.setHandler('posapi.event.errorResponseSendEmailAndPersist', createErrorPersist);

wascallyRabbit.setup('persistence');

console.log('Configuring Logs');
var logPlugin = require('posable-logging-plugin');
var bunyanLogger = require('./logs/log');

logPlugin.setFileLogger(bunyanLogger);
logPlugin.setMsgLogger(wascallyRabbit, logPlugin.logLevels.error);
console.log('Logging Setup Complete');
//require('./lib/paymentQuery');
//require('./lib/typeSum');
//require('./lib/timedService');
