/**
 * Created by Ely on 5/24/2014.
 */

// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    var sjl = require('./../../src/sjl/sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl Set Functions', function () {

    'use strict';

    describe ('It should have It\'s set functions set', function () {
        var funcNames = ['extend', 'hasMethod']; // 'intersection', 'merge', 'restrict', 'subtract', 'union'];

        // Check that the set functions are defined
        funcNames.forEach(function (funcName) {
            it('should have `' + funcName + '` function.', function () {
                expect((sjl.hasOwnProperty(funcName)
                    && typeof sjl[funcName] === 'function')).to.equal(true);
            });
        });
    });

    // #`extend` uses #`extend` so these tests pretty much take care of both
    describe ('#`extend` and #`extend` tests', function () {

        it ('should be able to unite two hash maps without the `deep` option', function () {
            var unitee1 = {
                    func: function func() { }, nil: null, num: 123, bln: false,
                    obj: {a: 'A', b: 'B'}, str: 'unitee1'
                },
                unitee2 = {
                    func: function otherFunc() { }, num: 456, bln: true,
                    obj: {c: 'C', d: 'D'}, str: 'unitee2'
                },
                expectedKeyTypeMap = { 'func': 'Function', 'nil': 'Null', 'num': 'Number',
                    'bln': 'Boolean',
                    'obj': 'Object', 'str': 'String'
                },

                rslt = sjl.extend(unitee1, unitee2);

            // Check that all keys in result return the expected types
            rslt = Object.keys(rslt).filter(function (key) {
                return sjl.classOfIs(rslt[key], expectedKeyTypeMap[key]);
            });

            // If rslt length is the same as the expected length we have a naive success (more extensive tests follow..)
            expect(rslt.length).to.equal(Object.keys(expectedKeyTypeMap).length);
        });

        it ('should be able to unite to hash maps with the `deep` option set to `true`', function () {
            var unitee3 = {
                    all: { name: 'all', your: { name: 'your',
                        base: { name: 'base' } } }
                },
                unitee4 = { all: { your: { base: {
                    are: { name: 'are', belong: { name: 'belong',
                        to: { name: 'to', us: { name: 'us' } } } } } } }
                },
                allYourBaseKeys = [
                    'all', 'your', 'base', 'are', 'belong', 'to', 'us'
                ],
                expectedRsltLength,
                lastRslt,
                // Get result of extend
                rslt = sjl.extend(unitee3, unitee4, true);

            // Get expected length of `allYourBaseKeys` matches
            expectedRsltLength = (allYourBaseKeys.filter(function (key) {

                // Get first rslt[key] value
                if (!sjl.isset(lastRslt)) {
                    lastRslt = rslt[key];
                    return sjl.isset(lastRslt);
                }

                var retVal = sjl.isset(lastRslt[key]);
                lastRslt = lastRslt[key];
                return retVal;

            })).length;

            // Match the lengths of united keys to result-of-extend object
            expect(expectedRsltLength).to.equal(allYourBaseKeys.length);

        });

    });

    describe ('#`hasMethod`', function () {
        it ('should detect when an object has a method defined on it.', function () {
            expect(sjl.hasMethod({hello: function () {return 'hello';}}, 'hello' )).to.equal(true);
            expect(sjl.hasMethod({}, 'hello')).to.equal(false);
        });
    });

//    describe ('#`merge` tests', function () {
//        it ('should be able to `merge` two objects together with out overwritting the original object\'s ' +
//            'properties (should just merge missing properties into object 1)');
//    });
//
//    describe ('#`intersection` tests', function () {
//        it ('should return an object with the shared properties of object 1 and object 2.');
//    });
//
//    describe ('#`subtract` tests', function () {
//        it ('should return a new object with the properties that are not shared by the objects passed in');
//    });
//
//    describe ('#`restrict` tests', function () {
//        it ('should remove the properties from object 1 that are not present in object 2');
//    });

});
