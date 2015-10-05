var amqp = require('amqplib/callback_api')

    function bail(err) {
        console.error(err);
        process.exit(1);
    }

var RabbitMQ = function (urlPort, q) {
    this.urlPort = urlPort;
    this.q = q;

    return {}
};
        RabbitMQ.prototype.publish = function () {
            amqp.connect('amqp://' + this.urlPort, function (err, conn) {
                if (err != null) bail(err);
                conn.createChannel(on_open);
                function on_open(err, ch) {
                    if (err != null) bail(err);
                    ch.assertQueue(this.q);
                    ch.sendToQueue(this.q, new Buffer('something to do'));
                    console.log("publishing", "something to do");
                }
            });
        }

        RabbitMQ.prototype.consume = function () {
            amqp.connect('amqp://' + this.urlPort, function (err, conn) {
                if (err != null) bail(err);
                conn.createChannel(on_open);
                function on_open(err, ch) {
                    if (err != null) bail(err);
                    ch.assertQueue(this.q);
                    ch.consume(this.q, function (msg) {
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

module.exports = new RabbitMQ(urlPort, q);