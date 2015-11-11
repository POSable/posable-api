console.log('Create Connection to Rabbit Server');
var wascallyRabbit = require('posable-wascally-wrapper');
var env = require('./common').config();
var func = function(msg) {msg.ack(); console.log(msg.body);};
var messageType = 'logger.command.addLogEntry';

wascallyRabbit.setEnvConnectionValues(env["wascally_connection_parameters"]);
wascallyRabbit.setQSubscription('service.logging');
wascallyRabbit.setHandler(messageType, func);
wascallyRabbit.setup();