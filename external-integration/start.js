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
var handleSummary = require('./handlers/consumeSummaryEvent').handleSummary;

//Setup RabbitMQ
console.log('Starting Connection to RabbitMQ');
var env = require('./common').config();
wascallyRabbit.setEnvConnectionValues(env['wascally_connection_parameters']);
wascallyRabbit.setQSubscription('service.externalIntegration');
wascallyRabbit.setHandler('persistence.event.receivedCreateDailySumRequest', handleSummary);
wascallyRabbit.setup('external-integration');

require('./lib/cloudElementsClient');
