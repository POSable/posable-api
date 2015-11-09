var connection = require('./messageClient').getWascally;

var publishObject = function(exchange, type, payload, key) {
    try {
        console.log("in publish");
        connection.publish(exchange, type, payload, key);
    } catch (err) {
        if (err) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "publishObject",
                error: {code: 500, message: "System Error with publishing object to Rabbit"}
            }
        }
    }
};

var addLogEntry = function(payload, statusObject) {
    try {
        buildRabbitPayload(payload);
        console.log("setting arguments for logging entry")
        publishObject ('all-commands', 'logger.command.addLogEntry', payload, 'service.logging');
    } catch (err) {
        if (err) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "publishObject",
                error: {code: 500, message: "System Error with setting arguments for publishObject function"}
            }
        }
    }
}

var addDataBaseEntry = function(payload, statusObject) {
    try {
        buildRabbitPayload(payload);
        console.log("setting arguments for publishObject")
        publishObject ('all-commands', 'logger.command.addLogEntry', payload, 'service.logging');
    } catch (err) {
        if (err) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "publishObject",
                error: {code: 500, message: "System Error with setting arguments for publishObject function"}
            }
        }
    }
}

var buildRabbitPayload = function () {

    var BuildPayload = function (){

    }

}

module.exports = {
    addLogEntry: addLogEntry,
    addDataBaseEntry: addDataBaseEntry
};




