var handleSummary = function(msg) {

    console.log(msg);

    //map to CE Client

    msg.ack();
};


module.exports = {

    handleSummary: handleSummary

};