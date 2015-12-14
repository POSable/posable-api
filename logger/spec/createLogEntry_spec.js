describe('Logging service', function() {

    var createLogEntry = require('../handlers/createLogEntry').createLogEntry;
    var mapLogEntry = require('../handlers/createLogEntry').mapLogEntry;


    describe('calls mapLogEntry and assigns log.stack', function() {

        it('to msg.stack when passed an error message', function() {
            var testMsg = { body: { stack: 'testErrorStack'} };
            var testLogMap = mapLogEntry(testMsg.body);
            expect(testLogMap.stack).toEqual(testMsg.body.stack);
        });

        it('to "No Error Trace" when passed a string message', function() {
            var testMsg = { body: 'testMessage' };
            var testLogMap = mapLogEntry(testMsg.body);
            expect(testLogMap.stack).toEqual('No Error Trace');
        });
    });

});