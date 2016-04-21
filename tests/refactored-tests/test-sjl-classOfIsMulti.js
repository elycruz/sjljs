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
describe('#sjl.classOfIsMulti', function () {

    describe('truthy checks', function () {
        // Test generic-types/primitives
        [
            [[], Function, Array, '[]'],
            [true, String, Boolean, 'true'],
            [false, Function, Boolean, 'false'],
            [function () {
            }, Boolean, Function, 'function () {}'],
            [99, Boolean, Number, '99'],
            [{}, Number, Object, '{}'],
            [null, String, 'Null', 'null'],
            [undefined, Array, 'Undefined', 'undefined']
        ]
            .forEach(function (args) {
                it('should return `true` for value args [' + args.pop() + ', ' + args[1] + '] .', function () {
                    var result = sjl.classOfIsMulti.apply(sjl, args);
                    expect(result).to.equal(true);
                });
            });
    });

    describe('falsy checks', function () {
        // Test generic-types/primitives for non-matching type checks
        [
            [[], Boolean, '[]'],
            [true, Array, 'true'],
            [false, Array, 'false'],
            [function () {
            }, Number, 'function () {}'],
            [99, Function, '99'],
            [{}, 'Null', '{}'],
            [null, Object, 'null'],
            [undefined, Array, 'undefined']
        ]
            .forEach(function (args) {
                it('should return `false` for value args [' + args.pop() + ', ' + args[1] + '] .', function () {
                    var result = sjl.classOfIsMulti.apply(sjl, args);
                    console.log(args, result);
                    expect(result).to.equal(false);
                });
            });
    });

    it('should throw a type error when no `type` parameter is passed in or when no types are passed in.', function () {
        expect(sjl.classOfIsMulti()).to.be.false();
    });

});
