


var Oauth = function () {

}


// Create a token generator with the default settings:
    var uid = require('rand-token').uid;

// Generate a 16 character alpha-numeric token:
    var token =  uid(16);


module.exports = token;