var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');

router.get('/', function(req, res) {
    res.json({message: 'You are here', code: res.statusCode});
});

router.post('/', function(req, res) {
    res.json({message: 'You are here', code: res.statusCode});
});

module.exports = router;
