 var authenticatePost = function (req, statusObject, callback) {
     try {
         process.nextTick(function () {
             var err = {};
             var token = "m8l0isN6m1ZK3NPX"; //go get this from DB
             if (req.headers.token === token) {
                 statusObject.success.push("authenticatePost");
             } else {
                 statusObject[error] = {
                     module: authenticatePost,
                     error: {message: "Unauthorized, incorrect or missing token"}
                 };
             }
             return callback(err, statusObject);
         })
     } catch (err) {
         return callback(err, statusObject);
     }
 };

module.exports = authenticatePost;