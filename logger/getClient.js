var wascally = require('wascally');
var curWascally;
var settings = require('./settings');
var createLogEntry = require('./handlers/createLogEntry');

function setHandlers(){
    console.log('set handlers');
    wascally.handle( 'logger.command.addLogEntry', createLogEntry) }

function loadWascallyConfig(){
    setHandlers();
    console.log('configure');
    wascally.configure(settings).done(function() {
        curWascally = wascally; }); }

function setSingleton(){
    console.log('in messageClient');
    if(!curWascally){
        console.log('no connect');
        loadWascallyConfig(); }
    return curWascally; }


module.exports.getClient = function(){
    return setSingleton();
};