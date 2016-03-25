var PayloadAudit = require('../models/payloadAudit').model;
var logPlugin = require('posable-logging-plugin');

var mapPayloadAudit = function(msg) {
    logPlugin.debug('Starting PayloadAudit Property Mapping');

    try {
        var payloadAudit = new PayloadAudit();
        payloadAudit.payload = msg.body;
        });

        logPlugin.debug('PayloadAudit mapping successful');
        return payloadAudit;

    } catch (err) {
        logPlugin.error(err);
        throw new Error('Failed payloadAudit mapping'); // <-- Throws error to handler
    }
};

module.exports = mapPayloadAudit;