 var authenticatePost = function (req, statusObject, callback) {
     process.nextTick(function () {
         try {
             var token = "m8l0isN6m1ZK3NPX"; //go get this from DB
             if (req.headers.token === token) {
                 statusObject.success.push("authenticatePost");
             } else {
                 statusObject.isOK = false;
                 statusObject['error'] = {
                     module: authenticatePost,
                     error: {message: "Unauthorized, incorrect or missing token"}
                 };
             }
             return callback(undefined, statusObject);
        } catch(err) {
            return callback(err, statusObject);
        }
     })
 };

module.exports = authenticatePost;