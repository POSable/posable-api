var wascally = require('wascally');

function createLogEntry(msg) {
    console.log( 'Received from rabbit:', JSON.stringify(msg.body) );
    msg.ack(); }

module.exports = createLogEntry;

