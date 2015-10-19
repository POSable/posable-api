/**
 * Created by stevenspohr on 10/19/15.
 */
var env = require('../../env.json');

exports.config = function() {
    var node_env = process.env.NODE_ENV || 'development';
    return env[node_env];
};
