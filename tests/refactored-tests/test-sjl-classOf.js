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
describe ('#sjl.classOf', function () {
    // Test generic-types/primitives
    [
        [[],                Array.name,     '[]'],
        [true,              Boolean.name,   'true'],
        [false,             Boolean.name,   'false'],
        [function () {},    Function.name,  'function () {}'],
        [{},                Object.name,    '{}'],
        [99,                Number.name,    'new Map()'],
        [null,              'Null',         'null'],
        [undefined,         'Undefined',    'undefined']
    ]
    .forEach(function (args) {
        it ('should return "' + args[1] + '" for value `' + args[2] + '`.', function () {
            expect(sjl.classOf(args[0])).to.equal(args[1]);
        });
    });

    it ('should return "Undefined" when no value is passed.', function () {
        expect(sjl.classOf()).to.equal('Undefined');
    });

});
