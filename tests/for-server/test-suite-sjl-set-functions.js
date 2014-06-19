/**
 * Created by Ely on 5/24/2014.
 */

// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    require('./../../sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl Set Functions', function () {

    "use strict";

    var funcNames = ['extend', 'intersection', 'merge',
        'restrict', 'subtract', 'union'];

    // Check that the set functions are defined
    funcNames.forEach(function (funcName) {
        it('should have `' + funcName + '` function.', function () {
            expect((sjl.hasOwnProperty(funcName)
                && typeof sjl[funcName] === 'function')).to.equal(true);
        });
    });

    describe('#`union`', function () {
        it('should be able to unite two hash maps', function () {
            var unitee1 = {
                    func: function func() {
                    },
                    nil: null,
                    num: 123,
                    bln: false,
                    obj: {a: 'A', b: 'B'},
                    str: "unitee1"
                },

                unitee2 = {
                    func: function otherFunc() {
                    },
                    num: 456,
                    bln: true,
                    obj: {c: 'C', d: 'D'},
                    str: "unitee2"
                },

                expectedKeyTypeMap = {
                    'func': 'Function',
                    'nil': 'Null',
                    'num': 'Number',
                    'bln': 'Boolean',
                    'obj': 'Object',
                    'str': 'String'
                },

                rslt = sjl.union(unitee1, unitee2);

            // Check that all keys in result return the expected types
            rslt = Object.keys(rslt).filter(function (key) {
                return sjl.classOfIs(rslt[key], expectedKeyTypeMap[key]);
            });

            // If rslt length is the same as the expected length we have a naive success (more extensive tests follow..)
            expect(rslt.length).to.equal(6);

            var unitee3 = {
                    all: {
                        name: 'all',
                        your: {
                            name: 'your',
                            base: {
                                name: 'base'
                            }
                        }
                    }
                },
                unitee4 = {
                    all: {
                        your: {
                            base: {
                                are: {
                                    name: 'are',
                                    belong: {
                                        name: 'belong',
                                        to: {
                                            name: 'to',
                                            us: {
                                                name: 'us'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                allYourBaseKeys = [
                    'all', 'your', 'base', 'are', 'belong', 'to', 'us'
                ],
                expectedRsltLength,
                lastRslt;

            rslt = sjl.union(unitee3, unitee4, true);

            expectedRsltLength = (allYourBaseKeys.filter(function (key) {

                // Get first rslt[key] value
                if (!sjl.isset(lastRslt)) {
                    lastRslt = rslt[key];
                    return sjl.isset(lastRslt);
                }

                return (function () {
                    var retVal = sjl.isset(lastRslt[key]);
                    lastRslt = lastRslt[key];
                    return retVal;
                })();

            })).length;

            expect(expectedRsltLength).to.equal(allYourBaseKeys.length);

            console.log(rslt);

        });
    });

});