var express = require('express');
var router = express.Router();

var routerTestWrapper = function () {

    router.get('/', function (req, res) {
        res.status(200).send('status: 200');
    });

}

var testStub = function (testRouter) {
    router = testRouter;
}

module.exports = {
    router: router,
    routerTestWrapper: routerTestWrapper,
    testStub: testStub
};