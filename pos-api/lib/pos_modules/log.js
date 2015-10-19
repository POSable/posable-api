var bunyan = require('bunyan');
var common = require('./common');
var config = common.config();

var log = bunyan.createLogger({
    name: 'test log',
    serializers: bunyan.stdSerializers,
    streams: [
        {
            type: config.logging_info_type,
            level: 'info',
            path: config.logging_info_path,
            period: config.logging_info_period
        },
        {
            type: config.logging_err_type,
            level: 'error',
            path: config.logging_err_path,
            period: config.logging_err_period
        }
    ]
});

module.exports = log;
