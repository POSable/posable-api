//var wascally = require('../../pos-api/node_modules/wascally');
//var settings = require('./wascallyConfig').settings;
//var curWascally;
//var statusObject;
//
//var os = require('os');
//console.log(os.hostname());
//
//function loadWascallyConfig(){
//    try {
//        console.log('configure');
//        wascally.configure(settings).done(function() {
//        curWascally = wascally;
//        });
//    } catch (err) {
//        if (err) {
//            console.log(err);
//            statusObject.isOK = false;
//            statusObject['error'] = {
//                module: "messageClient",
//                error: {code: 500, message: "System Error with creating a connection to Rabbit"}
//            }
//        }
//        return curWascally
//    }
//    return curWascally
//}
//
//function setSingleton(){
//    try {
//        console.log('in messageClient');
//        if(!curWascally){
//            console.log('no connect');
//            curWascally = loadWascallyConfig();
//        }
//    } catch (err) {
//        if (err) {
//            console.log(err);
//            statusObject.isOK = false;
//            statusObject['error'] = {
//                module: "messageClient",
//                error: {code: 500, message: "System Error with returning a Rabbit connection object"}
//            }
//        }
//        return wascally;
//    }
//    return wascally;
//}
//
//module.exports = {
//    getClient: function(){return setSingleton()},
//    getWascally: wascally
//};
