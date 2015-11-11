require('./messageClient').messageClient();

var wascallyRabbit = require('posable-wascally-wrapper');
var env = require('../pos-api/lib/pos_modules/common').config();
var func = function (msg) {console.log(msg)};
var messageType = 'service.persistence';


wascallyRabbit.setEnvConnectionValues(env['wascally_connection_parameters']);
wascallyRabbit.setQSubscription('service.persistence');
wascallyRabbit.setHandler(messageType, func);
wascallyRabbit.setup();

