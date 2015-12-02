var wascallyRabbit = require('posable-wascally-wrapper');
var env = require('./common').config();
var sendMail = require('./email').sendMail;

wascallyRabbit.setEnvConnectionValues(env['wascally_connection_parameters']);
wascallyRabbit.setQSubscription('service.email');
wascallyRabbit.setHandler('posapi.event.errorResponseSendEmailAndPersist', sendMail);
wascallyRabbit.setup();
