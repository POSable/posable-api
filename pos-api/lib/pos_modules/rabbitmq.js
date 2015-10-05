var amqp = require('amqplib/callback_api')

var rabbitmq = function (q, urlPort, action){

    function bail(err) {
        console.error(err);
        process.exit(1);
    }

    // Publisher
    function publisher(conn) {
        conn.createChannel(on_open);
        function on_open(err, ch) {
            if (err != null) bail(err);
            ch.assertQueue(q);
            ch.sendToQueue(q, new Buffer('something to do'));
            console.log("publishing", "something to do");
        }
    }

    //Consumer
    function consumer(conn) {
        conn.createChannel(on_open);
        function on_open(err, ch) {
            if (err != null) bail(err);
            ch.assertQueue(q);
            ch.consume(q, function(msg) {
                if (msg !== null) {
                    console.log("consuming message content", msg.content.toString());
                    ch.ack(msg);
                }
            });
        }
    }

    amqp.connect('amqp://' + urlPort, function(err, conn) {
        if (err != null) bail(err);
        if (action === 'publish') publisher(conn);
        if (action === 'consume') consumer(conn);
    });
};

module.exports = rabbitmq;