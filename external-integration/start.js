var express = require('express');
var path = require('path');

var healthcheck = require('./routes/healthcheck');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/healthcheck', healthcheck);

var debug = require('debug')('externalIntegration:server');
var http = require('http');


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3003');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

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


//Setup Database Connection
var env = require('./common').config();
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('connected');
});
mongoose.connect(env['mongoose_connection']);

var configPlugin = require('posable-customer-config-plugin')(env['mongoose_config_connection'], env['redis_connection'], logPlugin);

//Require Handlers

var consumeVoidExtInt = require('./handlers/consumeVoidExtInt').consumeVoidExtInt;
var consumeRefundExtInt = require('./handlers/consumeRefundExtInt').consumeRefundExtInt;
var handleRealTimeTransaction = require('./handlers/consumeTransaction').handleTransaction;

//Setup RabbitMQ
console.log('Starting Connection to RabbitMQ');
wascallyRabbit.setEnvConnectionValues(env['wascally_connection_parameters']);
wascallyRabbit.setQSubscription('service.externalIntegration');
wascallyRabbit.setHandler('posapi.event.receivedCreateTransactionRequest', handleRealTimeTransaction);
wascallyRabbit.setHandler('posapi.event.receivedCreateVoidRequest', consumeVoidExtInt);
wascallyRabbit.setHandler('posapi.event.receivedCreateRefundRequest', consumeRefundExtInt);
wascallyRabbit.setup('external-integration', rabbitCallback);

function rabbitCallback(err, res) {
    if (err) {
        logPlugin.error(err);
        throw err;
    } else {
        logPlugin.debug(res);
    }
}

//Timers Kickoff
require('./lib/invoiceJob/invoiceTimer');
require('./lib/paymentJob/paymentTimer');
require('./lib/cloudElements/cloudElemTimer');
require('./lib/refundJob/refundTimer');


