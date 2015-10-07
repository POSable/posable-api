var bunyan = require('bunyan');

var log = bunyan.createLogger({
    name: 'test log',
    serializers: bunyan.stdSerializers,
    streams: [
        {
            level: 'info',
            path: './logs/info.log'
        },
        {
            level: 'error',
            path: './logs/error.log'
        }
    ]
});

module.exports = log;
