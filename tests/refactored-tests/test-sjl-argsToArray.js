// ~~~ STRIP ~~~
// This part gets stripped out when
// generating browser version of test(s).
var chai = require('chai'),
sjl = require('./../../src/sjl'),
expect = chai.expect;
// ~~~ /STRIP ~~~
describe('#`sjl.argsToArray`', function () {

    'use strict';

    var helloFunc = function hello() {},
        helloArray = ['a', 'b', 'c'];

    it('should return an array for an arguments object.', function () {
        expect(Array.isArray(sjl.argsToArray(arguments))).to.equal(true);
    });

    describe('when passed in args are [1, 2, "3", '
        + helloFunc + ', [' + helloArray + ']]', function () {
        var valuesToTest,
            valuesToPassIn = [1, 2, '3', helloFunc, helloArray];

        // Get values to test
        (function () {
            valuesToTest = sjl.argsToArray(arguments);
        })(1, 2, '3', helloFunc, helloArray);

        valuesToTest.forEach(function (val, i) {
            it('Returned array should contain value "' + valuesToPassIn[i]
                + '" of type "' + sjl.classOf(valuesToPassIn[i]) + '".', function () {
                expect(val).to.equal(valuesToPassIn[i]);
            });
        });
    });

});
