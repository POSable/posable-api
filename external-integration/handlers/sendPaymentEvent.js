var handlePayment = function(msg) {

    console.log(msg);

    msg.ack();
};


module.exports = {

    handlePayment: handlePayment

};


