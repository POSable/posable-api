/**
 * Created by davidabramowitz on 3/14/16.
 */

// 3rd Party Plugins
var express = require('express');
var uuid = require('node-uuid');
var jwt = require('jsonwebtoken');
// POSable Plugins
var logPlugin = require('posable-logging-plugin');
// Modules
var sendResponse = require('../lib/pos_modules/sendResponse');
var checkErrorAltResponsePath = require('../lib/pos_modules/checkErrorAltResponsePath').checkErrorAltResponsePath;
var checkPostToken = require ('../lib/pos_modules/api/authenticatePost').authenticatePost;
var reqHeaderTokenProvider = require ('../lib/pos_modules/api/reqHeaderTokenProvider');
// Var Extraction
var router = express.Router();

router.post('/', function(req, res) {
    var requestID = uuid.v4();
    logPlugin.debug(requestID + " - get Token received with content type of" + " " + req.headers['content-type']);
    var statusObject = {isOK: true, success: []};

    var jwtokenRequest = reqHeaderTokenProvider(req, statusObject, logPlugin);

    if (statusObject.isOK) {
        checkPostToken(jwtokenRequest, statusObject, checkPostTokenCallback);
    } else {
        checkErrorAltResponsePath(req, statusObject);
        sendResponse(res, statusObject, requestID);
    }

    function checkPostTokenCallback(err, statusObject) {
        if (err) {
            statusObject.isOK = false;
            // ensure there is an error message with the status object - but dont overight it if it already exists.
            if (!statusObject.error) statusObject['error'] = {
                error: {code: 500, message: "System Error with Token Authentication"}
            };
        }
      
    }

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var name = firstName + lastName


    var options =  {}
    var payload = {
        "name": name,
        "internalID": internalID,
    }

});

module.exports = router;