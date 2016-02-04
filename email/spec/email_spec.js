// Exported from handler
var sendMail = require('../email').sendMail;
var formatSNS_msg = require('../email').formatSNS_msg;
var setTestStubs = require('../email').testingStub;
// Test setup
var testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
var testDispose = {rabbitDispose: function (arg1, arg2) {return {msg: arg1, error: arg2 }}};
var testSNS = {publish: function (testMsg, callback) { callback(null, 'successful publish')} };
var goodTestMsg;
var badTestMsg;


describe("Email service", function(){
    beforeEach(function() {
        goodTestMsg = {
            body: {data: 'raw transaction', error: 'test error', internalID: 'merchantID'},
            properties: {correlationId: 'requestID'} };
        badTestMsg = {};
        setTestStubs(testDispose, testLogPlugin, testSNS, true);
        spyOn(testLogPlugin, 'debug');
        spyOn(testDispose, 'rabbitDispose');
    });

    describe("formats incoming messages for SNS publishing and", function () {
        it("should return an SNS object when passed a GOOD message", function (){
            var testFormat = formatSNS_msg(goodTestMsg);
            expect(testFormat.Message).toBeDefined();
            expect(testFormat.Subject).toBeDefined();
            expect(testFormat.TopicArn).toBeDefined();
        });

        it("should throw an error when passed a BAD message", function() {
            expect(function(){formatSNS_msg(badTestMsg)}).toThrow();
        });
    });

    describe("handles GOOD messages and", function () {
        beforeEach(function(){
            spyOn(testSNS, 'publish').and.callThrough();
            sendMail(goodTestMsg);
        });

        it("should call sns.publish", function () {
            expect(testSNS.publish).toHaveBeenCalled();
        });

        it("should log the returned data of a successful publish", function () {
            expect(testLogPlugin.debug).toHaveBeenCalled();
            expect(testLogPlugin.debug).toHaveBeenCalledWith('successful publish');
        });

        it("should dispose of the message after successful publish", function () {
            expect(testDispose.rabbitDispose).toHaveBeenCalled();
        });
    });

    describe("handles BAD messages and", function() {
        beforeEach(function() {
            spyOn(testLogPlugin, 'error');
            sendMail(badTestMsg);
        });

        it("should throw an error that is caught and logged by the handler", function() {
            expect(testLogPlugin.error).toHaveBeenCalled();
        });

        it("should dispose of the message", function() {
            expect(testDispose.rabbitDispose).toHaveBeenCalled();
        });
    });

    describe("is NOT enabled when env['sendSNS'] === false and", function() {
        beforeEach(function() {
            setTestStubs(testDispose, testLogPlugin, testSNS, false);
            spyOn(testSNS, 'publish');
            sendMail(goodTestMsg);
        });

        it("should log and dispose of the message", function (){
            expect(testLogPlugin.debug).toHaveBeenCalled();
            expect(testDispose.rabbitDispose).toHaveBeenCalledWith(goodTestMsg, null);
        });

        it("should NOT call sns.publish", function() {
            expect(testSNS.publish).not.toHaveBeenCalled();
        });
    });
});

