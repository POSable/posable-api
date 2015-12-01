var jwt = require('jsonwebtoken');

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
                 statusObject.isOK = false;
                 statusObject['error'] = {
                     module: 'authenticatePost',
                     error: {code: 400, message: "System Error when decrypting json web token with 'verify' method"}
                 };
                 internalErr = err;
             } else if (decoded.uid%2 === 1)  { // even number uids have a response type 'email' - errors are persisted and email sent.
                 statusObject.success.push("authenticatePost");
             } else {
                 statusObject.responseType = "alt"; // even number uids have a response type 'email' - errors are persisted and email sent.
                 statusObject.isOK = false;
                 statusObject['error'] = {
                     module: 'authenticatePost',
                     error: {code: 400, message: "Incorrect json web token secret"}
                 }
             }
         } catch (err) {
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