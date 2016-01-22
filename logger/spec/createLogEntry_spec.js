describe('Logging service,', function() {

    describe('when handling a proper message from rabbit ', function() {

        var createLogEntry = require('../handlers/createLogEntry').createLogEntry;
        var newLogCreatedCount = 0;
        var Log = function () {newLogCreatedCount += 1};
        Log.prototype.save = function (callback) {callback()};
        var testMsg = {body: {}};
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testDispose = {rabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};


        beforeEach (function () {
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'rabbitDispose');
            spyOn(testLogPlugin, 'error');
            var setTestStubs = require('../handlers/createLogEntry').testingStub;
            setTestStubs(testLogPlugin, Log, testDispose);
        });

        it('creates a new Log model', function() {
            createLogEntry(testMsg);
            expect(newLogCreatedCount).not.toBe(0);
        });

        it('calls save and logs "Log saved successfully" ', function() {
            createLogEntry(testMsg);
            expect(testLogPlugin.debug).toHaveBeenCalledWith('Log saved successfully')
        });

        it('disposes the message without an error', function() {
            createLogEntry(testMsg);
            expect(testDispose.rabbitDispose).toHaveBeenCalledWith(testMsg, undefined);
        });

    });

    describe('a system error occurs,', function() {

        var createLogEntry = require('../handlers/createLogEntry').createLogEntry;
        var testMsg = {body: []};
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testDispose = {rabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
        var Log = function () {throw new Error('Test Log Model Constructor is Throwing this Error')};

        beforeEach(function () {
            spyOn(testLogPlugin, 'error');
            spyOn(testDispose, 'rabbitDispose');
            spyOn(testLogPlugin, 'debug');
            var setTestStubs = require('../handlers/createLogEntry').testingStub;
            setTestStubs(testLogPlugin, Log, testDispose);
        });

        it('catches errors when creating a new Log', function() {
            try {
                createLogEntry(testMsg);
            } catch (err) {
                expect(err.message).toBe('Test Log Model Constructor is Throwing this Error')
                expect(testLogPlugin.error).toHaveBeenCalledWith(err);
                expect(testDispose.rabbitDispose).toHaveBeenCalledWith(testMsg, err);
            }
        });

    });

    describe('model does not call save successfully', function(){
        var createLogEntry = require('../handlers/createLogEntry').createLogEntry;
        var testMsg = {body: {}};
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testDispose = {rabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
        var error = new Error('from the save function')
        var Log = function () {};
        Log.prototype.save = function (callback) {callback(error)};

        beforeEach(function () {
            spyOn(testLogPlugin, 'error');
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'rabbitDispose');

            var setTestStubs = require('../handlers/createLogEntry').testingStub;
            setTestStubs(testLogPlugin, Log, testDispose);
        });

        it('does not throw a system error if save fails', function() {
            createLogEntry(testMsg);
            expect(testLogPlugin.error).toHaveBeenCalledWith(error);
            expect(testDispose.rabbitDispose).toHaveBeenCalledWith(testMsg, error);
        });

        describe('error,', function() {
            var createLogEntry = require('../handlers/createLogEntry').createLogEntry;
            var testMsg = {};
            var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
            var testDispose = {rabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
            var error = new Error('from the save function')
            var Log = function () {
            };
            Log.prototype.save = function (callback) {
                callback(error)
            };

            beforeEach(function () {
                spyOn(testLogPlugin, 'error');
                spyOn(testLogPlugin, 'debug');
                spyOn(testDispose, 'rabbitDispose');

                var setTestStubs = require('../handlers/createLogEntry').testingStub;
                setTestStubs(testLogPlugin, Log, testDispose);
            });

            it('catches error when a bad message is passed from Rabbit', function () {
                try {
                    createLogEntry(testMsg);
                } catch (err) {
                    expect(err instanceof Error).toBe(true);
                    expect(testDispose.rabbitDispose).toHaveBeenCalledWith(testMsg, err);
                }
            });
        });
    });

});