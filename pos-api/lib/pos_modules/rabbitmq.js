var amqp = require('amqplib/callback_api')


    function bail(err) {
        console.error(err);
        process.exit(1);
    }
module.exports = {

    // Publisher
    rabbitmqPublish: function (q, urlPort) {
        amqp.connect('amqp://' + urlPort, function(err, conn) {
            if (err != null) bail(err);
            conn.createChannel(on_open);
            function on_open(err, ch) {
                if (err != null) bail(err);
                ch.assertQueue(q);
                ch.sendToQueue(q, new Buffer('something to do'));
                console.log("publishing", "something to do");
            }
        });
    },

    //Consumer
    rabbitmqConsume: function (q, urlPort) {
        amqp.connect('amqp://' + urlPort, function(err, conn) {
            if (err != null) bail(err);
            conn.createChannel(on_open);
            function on_open(err, ch) {
                if (err != null) bail(err);
                ch.assertQueue(q);
                ch.consume(q, function(msg) {
                    if (msg !== null) {
                        console.log("consuming message content", msg.content.toString());
                        ch.ack(msg);
                    } else {
                        console.log("null dude!!")
                    }
                });
            }
        });
    }

}