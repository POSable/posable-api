var wascally = require('wascally');
var curWascally;
var settings = require('./settings');
var createPersistence = require('./handlers/createPersistence');

function setHandlers(){
    console.log('set handlers');
    wascally.handle( 'service.persistence', createPersistence) }

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


module.exports.messageClient = function(){
    return setSingleton();
};
