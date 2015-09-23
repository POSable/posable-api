var express = require('express');
var router = express.Router();

var currentdate = new Date();
var datetime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { datetime: datetime });
});

module.exports = router;