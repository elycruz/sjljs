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
describe('#sjl.ucaseFirst', function () {
    var argsForTruthyTests = [
        ['helloWorld', 'HelloWorld'],
        [String.name, 'String'],
        ['world-wide-web', 'World-wide-web'],
        ['99-world-wide-web', '99-World-wide-web'],
        ['#$(*@&#(*$---wORLD', '#$(*@&#(*$---WORLD']
    ];

    it('should return a new string with the first alpha character upper cased.', function () {
        argsForTruthyTests.forEach(function (args) {
            expect(sjl.ucaseFirst(args[0])).to.equal(args[1]);
        });
    });

    it ('should throw a `TypeError` error when no params are passed in' +
        'or when param is not of type `String`.', function () {
        var caughtError;
        try {
            sjl.ucaseFirst();
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
        caughtError = undefined;

        try {
            sjl.ucaseFirst(99);
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

});