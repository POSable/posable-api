describe('Logging service', function() {


    var TestLogConstructor = function(){

    };

    var createLogEntry = require('../handlers/createLogEntry').createLogEntry;
    var testMsg = {body: {}};
    var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
    var testDispose = {testRabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
    var testLog = TestLogConstructor;

    describe('when handling a proper message from rabbit ', function() {

        beforeEach(function () {
            spyOn(testMsg, 'body');
            spyOn(testLogPlugin, 'error');
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'testRabbitDispose');

            var setTestStubs = require('../handlers/createLogEntry').testingStub;
            setTestStubs(testLogPlugin, testLog, testRabbitDispose);
        });


        it('creates a new Log model', function() {
            createLogEntry(testMsg);


        });

        it('to "No Error Trace" when passed a string message', function() {

            var testMsg = { body: 'testMessage' };
            var testLogMap = mapLogEntry(testMsg.body);
            expect(testLogMap.stack).toEqual('No Error Trace');

        });
    });

    describe('catches errors', function(){
        var logPlugin, testMsg;

        beforeEach(function(){
            logPlugin = {error: function(){}};
            spyOn(logPlugin, 'error');
            testSetup(logPlugin);
        });

        it('when mapLogEntry is passed a bad message', function(){
            testMsg = {body: null};
            try {
                createLogEntry(testMsg)
            } catch (err) {
                expect(logPlugin.error).toHaveBeenCalled();
            }

        });

        it('when createLogEntry is passed a bad message', function(){
            testMsg = {};
            try {
                createLogEntry(testMsg);
            } catch (err) {
                expect(logPlugin.error).toHaveBeenCalled();
            }
        });
    });

});