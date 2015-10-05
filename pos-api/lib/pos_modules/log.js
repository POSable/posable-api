var bunyan = require('bunyan');

var log = bunyan.createLogger({
    name: 'timecheck',
    serializers: {
        req: bunyan.stdSerializers.req,
        res: bunyan.stdSerializers.res
    },
    streams: [
        {
            path: './logs/info.log'
        }
    ]
});

module.exports = log;
