var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');
var token = require ('../lib/pos_modules/Oauth');

router.get('/', function(req, res) {
    res.json({message: 'You are here', code: res.statusCode});
});

router.post('/', function(req, res) {

    if (req.headers.token === null || req.headers.token === undefined ){
        var errAuth1 = new Error();
        errAuth1.message = "Unauthorized, token is missing";
        res.json({error: errAuth1.message, file: errAuth1.fileName, line: errAuth1.lineNumber, code: 401});
    } else if (req.headers.token === token) {
        res.json({message: 'You are here & token matched', code: res.statusCode});
    } else {
        var errAuth2 = new Error('Unauthorized, incorrect token');
        res.json({error: errAuth2, code: 401});
    }
});

module.exports = router;
