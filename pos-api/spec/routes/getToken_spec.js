/**
 * Created by davidabramowitz on 3/16/16.
 */

describe("Test 'getToken' route ", function() {
    var testingStub = require('../../routes/getToken').testingStub;
    var postGetToken = require('../../routes/getToken').postGetToken;
    var req = {headers: {'content-type': 'application/xml'}, body: {GetToken: {}}};
    var res = {};
    var token = '123.123.123';
    var testObject;

    describe("Using a correct Integrator token", function() {
        var testLogPlugin;
        var testConfigPlugin;
        var testSendResponse;

        beforeEach(function () {
            testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
            testConfigPlugin = {getToken: function(reqbodyGetToken, configPluginCallback) {configPluginCallback(undefined, token)}};
            testSendResponse = function (){};
            testObject = {testReqHeaderTokenProvider: function(req, statusObject, logPlugin) {}, testCheckPostToken: function(jwtokenRequest, statusObject, checkPostTokenCallback) {checkPostTokenCallback(undefined, statusObject)}};
            res = {send: function() {}, set: function() {}, status: function() {}};

            spyOn(testObject, 'testReqHeaderTokenProvider').and.returnValue({});
            spyOn(testObject, 'testCheckPostToken').and.callThrough();
            spyOn(testConfigPlugin, 'getToken').and.callThrough();
            spyOn(res, 'send');

            testingStub(testLogPlugin, testConfigPlugin, testSendResponse, testObject.testCheckPostToken, testObject.testReqHeaderTokenProvider);
        });

        it("Should call reqHeaderTokenProvider, checkPostToken, configPlugin.getToken and res.send", function () {
            postGetToken(req, res);
            expect(testObject.testReqHeaderTokenProvider).toHaveBeenCalled();
            expect(testObject.testCheckPostToken).toHaveBeenCalled();
            expect(testConfigPlugin.getToken).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalled();
        });

        describe("Using a correct Integrator token", function() {
            var testLogPlugin;
            var testConfigPlugin;
            var testSendResponse;

            beforeEach(function () {
                testLogPlugin = {error: function (text) {console.log(text)}, debug: function (text) {console.log(text)}};
                testConfigPlugin = {getToken: function(reqbodyGetToken, configPluginCallback) {configPluginCallback(undefined, token)}};
                testSendResponse = function (){};
                testObject = {testReqHeaderTokenProvider: function(req, statusObject, logPlugin) {}, testCheckPostToken: function(jwtokenRequest, statusObject, checkPostTokenCallback) {checkPostTokenCallback(undefined, statusObject)}};
                res = {send: function() {}, set: function() {}, status: function() {}};

                spyOn(testObject, 'testReqHeaderTokenProvider').and.returnValue({});
                spyOn(testObject, 'testCheckPostToken').and.callThrough();
                spyOn(testConfigPlugin, 'getToken').and.callThrough();
                spyOn(res, 'send');

                testingStub(testLogPlugin, testConfigPlugin, testSendResponse, testObject.testCheckPostToken, testObject.testReqHeaderTokenProvider);
            });

            it("Should call reqHeaderTokenProvider, checkPostToken, configPlugin.getToken and res.send", function () {
                postGetToken(req, res);
                expect(testObject.testReqHeaderTokenProvider).toHaveBeenCalled();
                expect(testObject.testCheckPostToken).toHaveBeenCalled();
                expect(testConfigPlugin.getToken).toHaveBeenCalled();
                expect(res.send).toHaveBeenCalled();
            });

    })
});
