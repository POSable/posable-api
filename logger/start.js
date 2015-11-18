console.log('Create Connection to Rabbit Server');
var wascallyRabbit = require('posable-wascally-wrapper');
var env = require('./common').config();
var createLogEntry = require('./handlers/createLogEntry');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/logData');

wascallyRabbit.setEnvConnectionValues(env["wascally_connection_parameters"]);
wascallyRabbit.setQSubscription('service.logging');
wascallyRabbit.setHandler('logger.command.addLogEntry', createLogEntry);
wascallyRabbit.setup();

console.log('Configuring Logs');
var logPlugin = require('posable-logging-plugin');
var bunyanLogger = require('./logs/log');

logPlugin.setFileLogger(bunyanLogger);
logPlugin.setMsgLogger(wascallyRabbit, 'error');
console.log('Logging Setup Complete');



