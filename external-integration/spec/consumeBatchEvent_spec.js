describe("Test 'consumeBatchEvent' module & 'handleBatch' function", function() {
    var handleBatchEvent = require('../handlers/consumeBatchEvent').handleBatch;
    describe("A valid message id", function() {
        var merchant = {batchType: 'batch'};
        var testMsg = {body: {internalID: 1}};
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testDispose = {rabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
        var testConfigPlugin = {merchantLookup: function (id, logPlugin, callback) {
            callback (undefined, merchant)}};
        var testCallback;
        var testObject = {post: function(cloudElem, merchant, callback) {
            testCallback = callback;
            callback();
        }}

        beforeEach (function () {
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'rabbitDispose');
            spyOn(testLogPlugin, 'error');
            spyOn(testConfigPlugin, 'merchantLookup').and.callThrough();
            spyOn(testObject, 'post').and.callThrough();;
            var setTestStubs = require('../handlers/consumeBatchEvent').testingStub;
            setTestStubs(testLogPlugin, testDispose, testConfigPlugin, testObject.post);
        });

        it('finds the id in the message and logs it', function() {
            handleBatchEvent(testMsg);
            expect(testLogPlugin.debug).toHaveBeenCalledWith("Found Internal ID : " + 1);
        });

        it('finds the id related merchant', function() {
            handleBatchEvent(testMsg);
            expect(testConfigPlugin.merchantLookup).toHaveBeenCalled();
        });

        it('logs that asych function merchantLookup finished and calls processBatch', function() {
            handleBatchEvent(testMsg);
            expect(testLogPlugin.debug).toHaveBeenCalledWith('Merchant lookup finished');
            expect(testLogPlugin.debug).toHaveBeenCalledWith('Batch merchant found');
        });

        it('logs that asych function merchantLookup finished and calls processBatch', function() {
            handleBatchEvent(testMsg);
            expect(testLogPlugin.debug).toHaveBeenCalledWith('Merchant lookup finished');
            expect(testLogPlugin.debug).toHaveBeenCalledWith('Batch merchant found');
        });

        it('logs that asych function merchantLookup finished and calls processBatch for a batch merchant', function() {
            handleBatchEvent(testMsg);
            expect(testLogPlugin.debug).toHaveBeenCalledWith('Merchant lookup finished');
            expect(testLogPlugin.debug).toHaveBeenCalledWith('Batch merchant found');
        });

        it('calls post with cloud elements and merchant object and callback function', function() {
            handleBatchEvent(testMsg);
            expect(testObject.post).toHaveBeenCalledWith({}, merchant, testCallback);
        });

        it('logs a successful post to Cloud Elements and disposes the message wth no errors (undefined)', function() {
            handleBatchEvent(testMsg);
            expect(testLogPlugin.debug).toHaveBeenCalledWith('Successful post to Cloud Elements');
            expect(testDispose.rabbitDispose).toHaveBeenCalledWith(testMsg, undefined);
        });

    });

    describe("An invalid message id", function() {
        var error = new Error('Test Error, Cloud Elements did not persist data')
        var merchant = {batchType: 'batch'};
        var testMsg = {body: {internalID: 1}};
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testDispose = {rabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
        var testConfigPlugin = {merchantLookup: function (id, logPlugin, callback) {
            callback (undefined, merchant)}};
        var testCallback;
        var testObject = {post: function(cloudElem, merchant, callback) {
            testCallback = callback;
            callback(error);
        }}

        beforeEach (function () {
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'rabbitDispose');
            spyOn(testLogPlugin, 'error');
            spyOn(testConfigPlugin, 'merchantLookup').and.callThrough();
            spyOn(testObject, 'post').and.callThrough();;
            var setTestStubs = require('../handlers/consumeBatchEvent').testingStub;
            setTestStubs(testLogPlugin, testDispose, testConfigPlugin, testObject.post);
        });

        it('logs and disposes the message', function() {
            handleBatchEvent(testMsg);
            expect(testLogPlugin.error).toHaveBeenCalledWith(error);
            expect(testDispose.rabbitDispose).toHaveBeenCalledWith(testMsg, error);
        });
    });

    describe("Post to Cloud Elements returns an error", function() {
        //var err = new Error('test error');
        var merchant = {};
        var testMsg = {body: {internalID: undefined}};
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testDispose = {rabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
        var testConfigPlugin = {merchantLookup: function (id, logPlugin, callback) {
            callback (new Error('No Merchant'), undefined)}};
        var testCallback;
        var testObject = {post: function(cloudElem, merchant, callback) {
            testCallback = callback;
            callback();
        }}
        var error = new Error('Msg internalID is undefined. Msg is rejected from Batch msg Handler')
        error.deadLetter = true;

        beforeEach (function () {
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'rabbitDispose');
            spyOn(testLogPlugin, 'error');
            spyOn(testConfigPlugin, 'merchantLookup').and.callThrough();
            spyOn(testObject, 'post').and.callThrough();;
            var setTestStubs = require('../handlers/consumeBatchEvent').testingStub;
            setTestStubs(testLogPlugin, testDispose, testConfigPlugin, testObject.post);
        });

        it('does not find a related merchant', function() {
            handleBatchEvent(testMsg);
            expect(testConfigPlugin.merchantLookup).not.toHaveBeenCalled();
        });

        it('logs that message id was undefined', function() {
            handleBatchEvent(testMsg);
            expect(testLogPlugin.error).toHaveBeenCalledWith(error);
        });
    });

    describe("System error", function() {
        var merchant = {batchType: 'batch'};
        var testMsg = {body: {internalID: 1}};
        var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
        var testDispose = {rabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2}}};
        var testConfigPlugin = {merchantLookup: function (id, logPlugin, callback) {
            throw new Error('test system error, catch me');
            }};
        var testCallback;
        var testObject = {post: function(cloudElem, merchant, callback) {
            testCallback = callback;
            callback();
        }}

        beforeEach (function () {
            spyOn(testLogPlugin, 'debug');
            spyOn(testDispose, 'rabbitDispose');
            spyOn(testLogPlugin, 'error');
            spyOn(testConfigPlugin, 'merchantLookup').and.callThrough();
            spyOn(testObject, 'post').and.callThrough();;
            var setTestStubs = require('../handlers/consumeBatchEvent').testingStub;
            setTestStubs(testLogPlugin, testDispose, testConfigPlugin, testObject.post);
        });

        it('it catches and logs them and dead letters the message, then throws an error to the calling code', function() {
            try {
                handleBatchEvent(testMsg);
            } catch (err) {
                expect(testLogPlugin.error).toHaveBeenCalledWith(err);
                expect(err.deadLetter).toBe(true);
                expect(testDispose.rabbitDispose).toHaveBeenCalledWith(testMsg, err);
            }
        });
    });
});

