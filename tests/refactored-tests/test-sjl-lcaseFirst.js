/**
 * Created by elydelacruz on 4/16/16.
 */
// ~~~ STRIP ~~~
// This part gets stripped out when
// generating browser version of test(s).
var chai = require('chai'),
    sjl = require('./../../src/sjl'),
    expect = chai.expect;
// ~~~ /STRIP ~~~
describe('#sjl.lcaseFirst', function () {
    var argsForTruthyTests = [
        ['HelloWorld', 'helloWorld'],
        [String.name, 'string'],
        ['world-wide-web', 'world-wide-web'],
        ['99-World-wide-web', '99-world-wide-web'],
        ['#$(*@&#(*$---WORLD', '#$(*@&#(*$---wORLD']
    ];

    it('should return a new string with the first alpha character lower cased.', function () {
        argsForTruthyTests.forEach(function (args) {
            expect(sjl.lcaseFirst(args[0])).to.equal(args[1]);
        });
    });

    it ('should throw a `TypeError` error when no params are passed in' +
        'or when param is not of type `String`.', function () {
        try {
            sjl.lcaseFirst();
        }
        catch (e) {
            expect(e).to.be.instanceof(TypeError);
        }

        try {
            sjl.lcaseFirst(99);
        }
        catch (e) {
            expect(e).to.be.instanceof(TypeError);
        }
    });

});