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

var env = require('./common').config();
console.log ("before sendMail");
var sendMail = require('./email').sendMail;
console.log('after sendMail');

wascallyRabbit.setEnvConnectionValues(env['wascally_connection_parameters']);
wascallyRabbit.setQSubscription('service.email');
wascallyRabbit.setHandler('posapi.event.receivedBadApiRequest', sendMail);
wascallyRabbit.setup('email');
