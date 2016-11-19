/**
 * Created by edlc on 11/14/16.
 */
describe('sjl.curry', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    let chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    let Identity = sjl.ns.fn.Identity;

    it ('should have the appropriate (mondaic) interface.', function () {
        let identity = Identity();
        ['map', 'flatten', 'unwrap', 'fnBind', 'fnApply'].forEach(function (key) {
            expect(identity[key]).to.be.instanceOf(Function);
        });
    });

    it ('should have a `of` static method.', function () {
        expect(Identity.of).to.be.instanceOf(Function);
    });

    describe ('#map', function () {
        let identity = Identity(2),
            pow = sjl.curry2(Math.pow),
            result = identity.map(pow(8));
        it ('should pass `Identity`\'s contained value to passed in function.', function () {
            expect(result.unwrap()).to.equal(64);
        });
        it ('should return a new instance of `Identity`.', function () {
            expect(result).to.be.instanceOf(Identity);
        });
    });

    describe ('#flatten', function () {
        it ('should flatten direct descendant `Identity` objects into one `Identity` object' +
            ' and if no direct descendants should return a new instance.', function () {
            [Identity(Identity(Identity(5))), Identity(Identity()), Identity()].forEach(function (id) {
                let result = id.flatten();
                expect(result).to.be.instanceOf(Identity);
                expect(result.value instanceof Identity).to.equal(false);
                if (sjl.isUndefined(result.value)) {
                    expect(result === id).to.equal(false);
                }
            });
        });
    });

    describe ('#unwrap', function () {
        it ('should return it\'s contained value.', function () {
            let id1= Identity(1),
                id2 = Identity(),
                id3 = Identity(3),
                id4 = Identity(id3);
            expect(id1.unwrap()).to.equal(1);
            expect(id2.unwrap()).to.equal(undefined);
            expect(id4.unwrap()).to.equal(id3.unwrap());
        });
    });

    describe ('#fnApply', function () {

        it ('should contain more tests.');
    });

    describe ('#fnBind', function () {
        it ('should contain more tests.');
    });

});
