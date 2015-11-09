var settings = {
    connection: {
        user: 'tristanrubadeau',
        pass: 'guest',
        server: ['52.89.7.38'],
        port: 5672,
        vhost: 'tristan_dev'
    },

    exchanges: [
        {
            name: 'all-commands',
            type: 'direct',
            autoDelete: false
        },
        {
            name: 'posapi.event.receivedCreatePaymentRequest',
            type: 'fanout',
            autoDelete: false
        },
        {
            name: 'posapi.event.receivedCreateTransactionRequest',
            type: 'fanout',
            autoDelete: false
        }
    ],

    queues: [
        {
            name: 'service.posapi',
            autoDelete: false,
            subscribe: false //subscribeTo === 'posapi'
        },
        {
            name: 'service.logging',
            autoDelete: false,
            subscribe: true //subscribeTo === 'logging'
        },
        {
            name: 'service.persistence',
            autoDelete: false,
            subscribe: false //subscribeTo === 'persistence'
        },
        {
            name: 'service.externalIntegration',
            autoDelete: false,
            subscribe: false //subscribeTo === 'externalIntegration'
        }
    ],

    bindings: [
        {
            exchange: 'all-commands',
            target: 'service.posapi',
            keys: [ 'service.posapi' ]
        },
        {
            exchange: 'all-commands',
            target: 'service.logging',
            keys: [ 'service.logging' ]
        },
        {
            exchange: 'all-commands',
            target: 'service.persistence',
            keys: [ 'service.persistence' ]
        },
        {
            exchange: 'all-commands',
            target: 'service.externalIntegration',
            keys: [ 'service.externalIntegration' ]
        },
        {
            exchange: 'posapi.event.receivedCreatePaymentRequest',
            target: 'service.persistence',
            keys: []
        },
        {
            exchange: 'posapi.event.receivedCreatePaymentRequest',
            target: 'service.externalIntegration',
            keys: []
        },
        {
            exchange: 'posapi.event.receivedCreateTransactionRequest',
            target: 'service.persistence',
            keys: []
        },
        {
            exchange: 'posapi.event.receivedCreateTransactionRequest',
            target: 'service.externalIntegration',
            keys: []
        }
    ]
};

module.exports = settings;
