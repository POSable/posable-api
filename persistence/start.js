//LogPlugin Setup
console.log('Configuring Logs');
var bunyanLogger = require('./logs/log');
bunyanLogger.info('Started Logging');

var logPlugin = require('posable-logging-plugin');
logPlugin.setFileLogger(bunyanLogger);
console.log('logPlugin Initialized');

var wascallyRabbit = require('posable-wascally-wrapper');
logPlugin.setMsgLogger(wascallyRabbit, logPlugin.logLevels.error);
console.log('Logging Setup Complete');

//Require Handlers
var createPaymentPersistence = require('./handlers/createPaymentPersistence');
var createTransactionPersistence = require('./handlers/createTransactionPersistence');
var createErrorPersist = require('./handlers/createErrorPersist');

//Setup Database Connection
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('connected');
});
mongoose.connect('mongodb://localhost/paymentData');

//Setup RabbitMQ
console.log('Starting Connection to RabbitMQ');
var env = require('./common').config();
wascallyRabbit.setEnvConnectionValues(env['wascally_connection_parameters']);
wascallyRabbit.setQSubscription('service.persistence');
wascallyRabbit.setHandler('posapi.event.receivedCreatePaymentRequest', createPaymentPersistence);
wascallyRabbit.setHandler('posapi.event.receivedCreateTransactionRequest', createTransactionPersistence);
wascallyRabbit.setHandler('posapi.event.receivedBadApiRequest', createErrorPersist);
wascallyRabbit.setup('persistence');

//require('./lib/paymentQuery');
//require('./lib/typeSum');
require('./lib/timedService');



