var express = require('express');
var router = express.Router();
var token = require ('../lib/pos_modules/Oauth');

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log(req.headers.token, token) ;
    if (req.headers.token === token) {
        res.send('token matched');
    } else {
        res.send('doh!');
    }

});

module.exports = router;
