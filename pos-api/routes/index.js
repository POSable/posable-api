var express = require('express');
var router = express.Router();

var currentdate = new Date();
var datetime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { datetime: datetime });
});

var q = 'tasks';

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
    console.log("sending something to do");
    setTimeout(consumer(conn), 1000); // remove - used for simple test - infinite loop with consumer function!!!
  }
}

// Consumer
function consumer(conn) {
  var ok = conn.createChannel(on_open);
  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(q);
    ch.consume(q, function(msg) {
      if (msg !== null) {
        console.log("message content is", msg.content.toString());
        ch.ack(msg);
        publisher(conn); // remove - used for simple test
      }
    });
  }
}

require('amqplib/callback_api')
    .connect('amqp://52.89.7.38:5672', function(err, conn) {
      if (err != null) bail(err);
      consumer(conn);
    });

module.exports = router;