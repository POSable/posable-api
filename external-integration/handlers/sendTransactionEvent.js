var handleTransaction = function(msg) {

    console.log(msg);

    msg.ack();
};


module.exports = {

    handleTransaction: handleTransaction

};