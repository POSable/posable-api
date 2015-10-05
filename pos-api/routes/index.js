var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');
var rabbitmq = require('../lib/pos_modules/rabbitmq');

/* GET home page. */
router.get('/', function(req, res, next) {
    var currentdate = new Date();
    var datetime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    res.render('index', {datetime: datetime});
    log.info('User requested time: ' + datetime);

    rabbitmq.rabbitmqPublish('testQue', '52.89.7.38:5672');
    rabbitmq.rabbitmqConsume('testQue', '52.89.7.38:5672');

});

module.exports = router;
