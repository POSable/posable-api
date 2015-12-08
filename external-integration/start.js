var wascallyRabbit = require('posable-wascally-wrapper');
var env = require('./common').config();
var handleSummary = require('./handlers/consumeSummaryEvent').handleSummary;

wascallyRabbit.setEnvConnectionValues(env['wascally_connection_parameters']);
wascallyRabbit.setQSubscription('service.externalIntegration');
wascallyRabbit.setHandler('persistence.event.receivedCreateDailySumRequest', handleSummary);
wascallyRabbit.setup('external-integration');

require('./lib/cloudElementsClient');
