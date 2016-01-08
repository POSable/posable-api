var jwt = require('jsonwebtoken');
var env = require('../common').config();
var logPlugin = require('posable-logging-plugin');
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);

//var jwtPayload = {name: 'Posable', internalID: 4};

//var makejwToken = jwt.sign(jwtPayload, "posable"); // used to generate the json web token
//console.log(makejwToken);
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiRGF0YSBDYXAiLCJ1aWQiOjEwMDAwMDAxLCJpYXQiOjE0NDc3MDcyMjN9.oD-VK8gh4nvkEF2V8jigm_FzIIZ4BcW-vpKKgPlKCSg

var authenticatePost = function (req, statusObject, callback) {
     var internalErr = null;

     try {
         var jwtoken = req.headers.jwtoken;
     } catch(err) {
         logPlugin.error(err);
         statusObject.isOK = false;
         statusObject['error'] = {
             module: 'authenticatePost',
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
                     module: 'authenticatePost',
                     error: {code: 400, message: "System Error when decrypting json web token"}
                 };
                 internalErr = err;
                 return callback(internalErr);
             } else {
                 configPlugin.merchantLookup(decoded.internalID, logPlugin, function(err, merchant) {
                     try {
                         if (err) {
                             statusObject.isOK = false;
                             statusObject['error'] = {
                                 module: 'authenticatePost',
                                 error: {code: 400, message: 'Unable to find merchant record'}
                             };
                             internalErr = err;
                         } else {
                             statusObject.merchant = merchant || "no ID";
                             statusObject.success.push("authenticatePost");
                         }
                     } catch (err) {
                         logPlugin.error(err);
                         statusObject.isOK = false;
                         statusObject['error'] = {
                             module: 'authenticatePost',
                             error: {code: 400, message: "System Error when checking json web token secret"}
                         };
                         internalErr = err;
                         return callback(internalErr);
                     }

                     return callback(internalErr, statusObject);
                 });
             }
         } catch (err) {
             logPlugin.error(err);
             statusObject.isOK = false;
             statusObject['error'] = {
                module: 'authenticatePost',
                error: {code: 400, message: "System Error when checking json web token secret"}
            };
             internalErr = err;
             return callback(internalErr, statusObject);
         }
     });
 };

module.exports = authenticatePost;
