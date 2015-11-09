var wascally = require('wascally');

function createPersistence(msg) {
    console.log( 'Received from rabbit:', JSON.stringify(msg.body) );
    msg.ack(); }

module.exports = createPersistence;


