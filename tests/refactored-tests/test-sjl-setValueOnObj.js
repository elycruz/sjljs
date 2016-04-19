// ~~~ STRIP ~~~
// This part gets stripped out when
// generating browser version of test(s).
'use strict';
var chai = require('chai'),
    sjl = require('./../../src/sjl'),
    expect = chai.expect;
// ~~~ /STRIP ~~~

describe('#`setValueOnObj`', function () {

    var objToTest = {
            numberValue: 1,
            arrayValue: ['hello-world', 1, 2, 3],
            stringValue: 'hello world',
            objectValue: {all: {your: {base: '...'}},
                someFunction: function () { console.log('some-function'); },
                fib: function (end) {
                    var a = 0,
                        b = 1,
                        out = [a, b];
                    while (a < end) {
                        a = a + b;
                        if (a >= end) {
                            break;
                        }
                        out.push(a);
                        b = a + b;
                        if (b < end) {
                            out.push(b);
                        }
                    }
                    return out;
                }
            },
            booleanValue: true,
            _overloadedFunctionValue: function () {},
            overloadedFunctionValue: function (value) {
                if (typeof value === 'undefined') {
                    return objToTest._overloadedFunctionValue;
                }
                else {
                    objToTest._overloadedFunctionValue = value;
                    return this;
                }
            },
            _overloadedProp: {somePropProp: 'value'},
            _otherFunctionProp: function () {console.log('hello world'); },
            overloadedProp: function (value) {
                if (typeof value === 'undefined') {
                    return objToTest._overloadedProp;
                }
                else {
                    objToTest._overloadedProp = value;
                    return this;
                }
            },
            getOtherFunctionProp: function () {
                return objToTest._otherFunctionProp;
            },
            setOtherFunctionProp: function (value) {
                this._otherFunctionProp = value;
                return this;
            },
            getBooleanValue: function () {
                return objToTest.booleanValue;
            },
            setBooleanValue: function (value) {
                this.booleanValue = value;
                return this;
            }
        },
        newObjValuesToUse = {
            numberValue: 1,
            arrayValue: ['hello-world', 1, 2, 3],
            stringValue: 'hello world',
            objectValue: {all: {your: {base: 'are belong to us'}},
                someFunction: function () {console.log('new function value.')},
                fib: function (end) {
                    var a = 0,
                        b = 1,
                        out = [a, b];
                    while (a < end) {
                        a = a + b;
                        if (a >= end) {
                            break;
                        }
                        out.push(a);
                        b = a + b;
                        if (b < end) {
                            out.push(b);
                        }
                    }
                    return out;
                }
            },
            booleanValue: true,
            _overloadedFunctionValue: function () {},
            _overloadedProp: {somePropProp: 'value'},
            _otherFunctionProp: function () {console.log('hello world'); },
        },

        objKeys = Object.keys(objToTest);

    it('should be able to set a value from an object by key.', function () {
        var subject = sjl.jsonClone(objToTest);
        objKeys.forEach(function (key) {
            // Re-set function value keys since json takes them away via json clone
            if (sjl.isFunction(objToTest[key])) {
                subject[key] = objToTest[key];
                newObjValuesToUse[key] = objToTest[key];
            }
            // Re-set function keys since we did a json clone on subject
            var result = sjl.setValueOnObj(key, newObjValuesToUse[key], subject);
            expect(result[key]).to.equal(newObjValuesToUse[key]);
        });
    });

});
