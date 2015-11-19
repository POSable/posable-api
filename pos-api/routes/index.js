var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');

/* GET home page. */
router.get('/', function(req, res, next) {

    var currentdate = new Date();
    var datetime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    res.render('index', {datetime: datetime});
    log.info('User requested time: ' + datetime);

});

module.exports = router;