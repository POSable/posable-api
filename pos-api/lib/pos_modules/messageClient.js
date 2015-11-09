var wascally = require('wascally');
var settings = require('../../../commonServiceLib/wascallyConfig').settings;
var curWascally;


function loadWascallyConfig(){
    console.log('configure');
    wascally.configure(settings).done(function() {
        curWascally = wascally;
    });
    return curWascally
}

function setSingleton(){
    console.log('in messageClient');
    if(!curWascally){
        console.log('no connect');
        curWascally = loadWascallyConfig();
    }
    return wascally;
}

module.exports = {
    getClient: function(){return setSingleton()},
    getWascally: wascally
}
