 var authenticatePost = function (req, statusObject, callback) {
     process.nextTick(function () {
         var internalErr = null;
         try {
             var token = "m8l0isN6m1ZK3NPX"; //go get this from DB
             if (req.headers.token === token) {
                 statusObject.success.push("authenticatePost");
             } else {
                 statusObject.isOK = false;
                 statusObject['error'] = {
                     module: 'authenticatePost',
                     error: {code: 400, message: "Unauthorized, incorrect or missing token"}
                 };
             }
        } catch(err) {
             internalErr = err;
        }
         return callback(internalErr, statusObject);
     })
 };

module.exports = authenticatePost;