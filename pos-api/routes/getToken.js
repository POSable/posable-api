/**
 * Created by davidabramowitz on 3/14/16.
 */
// 3rd Party Plugins
var express = require('express');
var uuid = require('node-uuid');
var o2x = require('object-to-xml');
// POSable Plugins
var logPlugin = require('posable-logging-plugin');
var configPlugin = require('posable-customer-config-plugin')();
// Modules
var sendResponse = require('../lib/pos_modules/sendResponse');
var checkErrorAltResponsePath = require('../lib/pos_modules/checkErrorAltResponsePath').checkErrorAltResponsePath;
var checkPostToken = require ('../lib/pos_modules/api/authenticatePost').authenticatePost;
var reqHeaderTokenProvider = require ('../lib/pos_modules/api/reqHeaderTokenProvider');
// Var Extraction
var router = express.Router();

var postGetToken = function(req, res) {
    var requestID = uuid.v4();
    logPlugin.debug(requestID + " - get Token received with content type of" + " " + req.headers['content-type']);
    var statusObject = {isOK: true, success: []};

    var jwtokenRequest = reqHeaderTokenProvider(req, statusObject, logPlugin);

    if (statusObject.isOK) {
        checkPostToken(jwtokenRequest, statusObject, checkPostTokenCallback);
    } else {
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
        configPlugin.getToken(req.body.gettoken, configPluginCallback);
    }
    function configPluginCallback(err, token) {
        if (err) {
            logPlugin.error(err);
            logPlugin.debug('getToken finished and did not return a token ');
            res.set('Content-Type', 'application/xml');
            res.status(400);
            return  res.send(o2x({
                '?xml version="1.0" encoding="utf-8"?': null,
                status: 400,
                token: "N/A",
                message: "Internal Error - Token was not generated."
            }));
        } else {
            logPlugin.debug('getToken finished and returned a token ');
            statusObject.token = token;
            res.set('Content-Type', 'application/xml');
            return  res.send(o2x({
                '?xml version="1.0" encoding="utf-8"?': null,
                token: token,
            }));
        }
    }
};

router.post('/', postGetToken);

var testingStub = function (testLogPlugin, testConfigPlugin, testSendResponse, testCheckPostToken, testReqHeaderTokenProvider) {
    logPlugin = testLogPlugin;
    configPlugin = testConfigPlugin;
    sendResponse = testSendResponse;
    checkPostToken = testCheckPostToken;
    reqHeaderTokenProvider = testReqHeaderTokenProvider;
};

module.exports = {
    router: router,
    postGetToken : postGetToken,
    testingStub: testingStub
}