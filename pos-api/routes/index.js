var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');
var RabbitMQ = require('../lib/pos_modules/rabbitmq');
var amqp = require('amqplib/callback_api');
var Oauth = require ('../lib/pos_modules/Oauth');
var rabbitmq0 = new RabbitMQ ('Aint', '52.89.7.38:5672', 'testQue', amqp);
var rabbitmq1 = new RabbitMQ ('no','52.89.7.38:5672', 'testQue1', amqp);
var rabbitmq2 = new RabbitMQ ('thang', '52.89.7.38:5672', 'testQue2', amqp);
var rabbitmq3 = new RabbitMQ ('but', '52.89.7.38:5672', 'testQue3', amqp);

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/paymentData');




/* GET home page. */
router.get('/', function(req, res, next) {

    var currentdate = new Date();
    var datetime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    var token = new Oauth().getToken();
    res.render('index', {datetime: datetime, token: token});
    log.info('User requested time: ' + datetime);
    log.info('Random Token', token);

    console.log(rabbitmq0.stringObject);
    console.log(rabbitmq1.stringObject);
    console.log(rabbitmq2.stringObject);
    console.log(rabbitmq3.stringObject);


    rabbitmq0.publish();
    rabbitmq0.consume();
    rabbitmq1.publish();
    rabbitmq1.consume();
    rabbitmq2.publish();
    rabbitmq2.consume();
    rabbitmq3.publish();
    rabbitmq3.consume();

});

module.exports = router;
