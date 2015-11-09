//var loggerKey = require('../../../commonServiceLib/wascallyConfig').loggerKey;
var connection = require('./messageClient').getWascally;

var publishObject = function(exchange, type, payload, key) {
    console.log("in publish");
    connection.publish(exchange, type, payload, key);
};

var toServiceLogger = function(payload) {
    publishObject ('all-commands', 'logger.command.addLogEntry', payload, 'service.logging');
}

module.exports = {
    toServiceLogger: toServiceLogger
};




