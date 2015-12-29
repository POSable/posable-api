describe('Logging service', function() {

    var createLogEntry = require('../handlers/createLogEntry').createLogEntry;
    var mapLogEntry = require('../handlers/createLogEntry').mapLogEntry;
    var testSetup = require('../handlers/createLogEntry').testSetup;
    var logPlugin;


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

    describe('catches errors', function(){
        var testLogPlugin, testMsg;

        beforeEach(function(){
            logPlugin = {error: function(){}};
            spyOn(logPlugin, 'error');
            testLogPlugin = testSetup(logPlugin);
        });

        it('when mapLogEntry is passed a bad message', function(){
            testMsg = null;
            mapLogEntry(testMsg);
            expect(testLogPlugin.error).toHaveBeenCalled();
        });

        it('when createLogEntry is passed a bad message', function(){
            testMsg = {};
            createLogEntry(testMsg);
            expect(testLogPlugin.error).toHaveBeenCalled();
        });
    });

});