var post = require('../lib/cloudElementsClient');

var handleSummary = function(msg) {

    console.log(msg);

    //map to CE Client
    post();
    msg.ack();
};

module.exports = {

    handleSummary: handleSummary

};