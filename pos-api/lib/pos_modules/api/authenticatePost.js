var jwt = require('jsonwebtoken');
var logPlugin = require('posable-logging-plugin');
//var configPlugin = require('posable-config-plugin');

//var jwtPayload = {name: 'Data Cap', uid: 10000001};
//
//var makejwToken = jwt.sign(jwtPayload, "posable"); // used to generate the json web token
//console.log(makejwToken);
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiRGF0YSBDYXAiLCJ1aWQiOjEwMDAwMDAxLCJpYXQiOjE0NDc3MDcyMjN9.oD-VK8gh4nvkEF2V8jigm_FzIIZ4BcW-vpKKgPlKCSg

var authenticatePost = function (req, statusObject, callback) {
     var internalErr = null;
    statusObject.responseType = "http";
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
             var merchant = configPlugin.merchantLookup(decoded.internalID);

             if (err) {
                 logPlugin.error(err);
                 statusObject.isOK = false;
                 statusObject['error'] = {
                     module: 'authenticatePost',
                     error: {code: 400, message: "System Error when decrypting json web token with 'verify' method"}
                 };
                 internalErr = err;
             } else if (merchant) {
                 statusObject.merchant = merchant;
                 statusObject.success.push("authenticatePost");
             } else {
                 statusObject.isOK = false;
                 statusObject['error'] = {
                     module: 'authenticatePost',
                     error: {code: 400, message: "Incorrect json web token secret"}
                 }
             }
         } catch (err) {
             logPlugin.error(err);
             statusObject.isOK = false;
             statusObject['error'] = {
                module: 'authenticatePost',
                error: {code: 400, message: "System Error when checking json web token secret"}
            };
            internalErr = err;
         }
         return callback(internalErr, statusObject);
     });
 };

module.exports = authenticatePost;