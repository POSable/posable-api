describe("test healthcheck", function() {

    var healthcheck = require('../routes/healthcheck').routerTestWrapper;

    var res = {status: function (code) {return {send: function() {}}}}
    var testRouter = {get: function (route, callback) {
        return callback({},res);
    }};

    beforeEach(function () {
        spyOn(res, 'status').and.callThrough();

        var setTestStubs = require('../routes/healthcheck').testStub;
        setTestStubs(testRouter);
    });

    it(" checks healthcheck res status is call with a 200", function () {
        healthcheck();
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
