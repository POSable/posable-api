var jwt = require('jsonwebtoken');
var env = require('../common').config();
var logPlugin = require('posable-logging-plugin');
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);


var authenticatePost = function (req, statusObject, callback) {
     var internalErr = null;

     try {
         var jwtoken = req.headers.jwtoken;
     } catch(err) {
         logPlugin.error(err);
         statusObject.isOK = false;
         statusObject['error'] = {
             error: {code: 400, message: "Missing json web token"}
         };
         internalErr = err;
         return callback(internalErr, statusObject);
     }

     jwt.verify(jwtoken, 'posable', function(err, decoded) {
         try {
             if (err) {
                 logPlugin.error(err);
                 statusObject.isOK = false;
                 statusObject['error'] = {
                     error: {code: 400, message: "System error decrypting json web token"}
                 };
                 internalErr = err;
                 return callback(internalErr, statusObject);
             } else {
                 configPlugin.merchantLookup(decoded.internalID, logPlugin, function(err, merchant) {
                     try {
                         if (err) {
                             statusObject.isOK = false;
                             statusObject['error'] = {
                                 error: {code: 500, message: 'System error searching merchant records'}
                             };
                             internalErr = err;
                         } else if (merchant === null) {
                             statusObject.isOK = false;
                             statusObject['error'] = {
                                 error: {code: 400, message: 'No merchant record found'}
                             };
                         } else {
                             statusObject.merchant = merchant;
                             statusObject.success.push("authenticatePost");
                         }
                     } catch (err) {
                         logPlugin.error(err);
                         statusObject.isOK = false;
                         statusObject['error'] = {
                             error: {code: 400, message: "System Error when checking json web token secret"}
                         };
                         internalErr = err;
                         return callback(internalErr, statusObject);
                     }

                     return callback(internalErr, statusObject);
                 });
             }
         } catch (err) {
             logPlugin.error(err);
             statusObject.isOK = false;
             statusObject['error'] = {
                error: {code: 400, message: "System Error when checking json web token secret"}
            };
             internalErr = err;
             return callback(internalErr, statusObject);
         }
     });
 };

module.exports = authenticatePost;
