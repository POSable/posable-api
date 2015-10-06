

    function bail(err) {
        console.error(err);
        process.exit(1);
    }

var RabbitMQ = function (stringObject, urlPort, q, amqp) {
    this.urlPort = urlPort;
    this.q = q;
    this.amqp = amqp;
    this.stringObject = stringObject;
};

RabbitMQ.prototype.publish = function () {
    var that = this;
    this.amqp.connect('amqp://' + this.urlPort, function (err, conn) {
        if (err != null) bail(err);
        conn.createChannel(on_open);
        function on_open(err, ch) {
            if (err != null) bail(err);
            ch.assertQueue(that.q);
            ch.sendToQueue(that.q, new Buffer(that.stringObject));
            console.log("publishing", that.stringObject);
        }
    });
}

RabbitMQ.prototype.consume = function () {
    var that = this;
    this.amqp.connect('amqp://' + this.urlPort, function (err, conn) {
        if (err != null) bail(err);
        conn.createChannel(on_open);
        function on_open(err, ch) {
            if (err != null) bail(err);
            ch.assertQueue(that.q);
            ch.consume(that.q, function (msg) {
                if (msg !== null) {
                    console.log("consuming message content", msg.content.toString());
                    ch.ack(msg);
                }
            });
        }
    });
}

module.exports = RabbitMQ;