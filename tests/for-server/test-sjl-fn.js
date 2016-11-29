/**
 * Created by elyde on 11/20/2016.
 */
describe('sjl.fn', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        assert = chai.assert,
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var sjlFn = sjl.isNodeEnv ? sjl.ns.fn : sjl.fn;

    describe ('#id', function () {
        it ('should be a function.', function () {
            expect(sjlFn.id).to.be.instanceOf(Function);
        });
        [
            [[], '[]'],
            [{}, '{}'],
            ['', '""'],
            [-1, '-1'],
            [0, '0'],
            [1, '1'],
            [false, 'false'],
            [true, 'true'],
            [null, 'null'],
            [undefined, 'undefined'],
            [['hello'], '["hello"]'],
            ['hello-world', 'hello-world'],
            [{someProp: 'some-prop-value'}, '{someProp: "some-prop-value"}'],
            [function () {}, 'function () {}']
        ].forEach(function (pair) {
            it ('should return value `' + pair[1] + '` when passed in.', function () {
                expect(sjlFn.id(pair[0])).to.equal(pair[0]);
            });
        });
    });

});
