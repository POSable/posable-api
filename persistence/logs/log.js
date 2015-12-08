var bunyan = require('bunyan');
var common = require('../common');
var config = common.config();

var log = bunyan.createLogger({
    name: 'persistence',
    serializers: bunyan.stdSerializers,
    streams: [
        {
            type: config.logging_type,
            level: config.logging_level,
            path: config.logging_path,
            period: config.logging_period
        }
    ]
});

module.exports = log;