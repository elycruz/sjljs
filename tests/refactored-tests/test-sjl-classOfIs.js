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
describe('#sjl.classOfIs', function () {

    describe('truthy checks', function () {
        // Test generic-types/primitives
        [
            [[], Array.name, '[]'],
            [true, Boolean.name, 'true'],
            [false, Boolean.name, 'false'],
            [function () {
            }, Function.name, 'function () {}'],
            [99, Number.name, '99'],
            [{}, Object.name, '{}'],
            [null, 'Null', 'null'],
            [undefined, 'Undefined', 'undefined']
        ]
            .forEach(function (args) {
                it('should return `true` for value args [' + args[2] + ', ' + args[1] + '] .', function () {
                    expect(sjl.classOfIs(args[0], args[1])).to.equal(true);
                });
            });
    });

    describe('falsy checks', function () {
        // Test generic-types/primitives for non-matching type checks
        [
            [[], Boolean.name, '[]'],
            [true, Array.name, 'true'],
            [false, Array.name, 'false'],
            [function () {
            }, Number.name, 'function () {}'],
            [99, Function.name, '99'],
            [{}, 'Null', '{}'],
            [null, Object.name, 'null'],
            [undefined, Array.name, 'undefined']
        ]
            .forEach(function (args) {
                it('should return `false` for value args [' + args[2] + ', ' + args[1] + '] .', function () {
                    expect(sjl.classOfIs(args[0], args[1])).to.equal(false);
                });
            });

    });

    it('should return `false` when no value is passed.', function () {
        expect(sjl.classOfIs()).to.equal(false);
    });

});
