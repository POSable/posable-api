var wascallyRabbit = require('posable-wascally-wrapper');
var env = require('./common').config();
console.log ("before sendMail");
var sendMail = require('./email').sendMail;
console.log('after sendMail')

wascallyRabbit.setEnvConnectionValues(env['wascally_connection_parameters']);
wascallyRabbit.setQSubscription('service.email');
wascallyRabbit.setHandler('posapi.event.receivedBadApiRequest', sendMail);
wascallyRabbit.setup('email');
