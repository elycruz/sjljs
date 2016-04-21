describe('#sjl.setValueOnObj', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

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
            _booleanValue: false,
            _overloadedFunctionValue: null,
            overloadedFunctionValue: function (value) {
                if (typeof value === 'undefined') {
                    return this._overloadedFunctionValue;
                }
                else {
                    this._overloadedFunctionValue = value;
                    return this;
                }
            },
            _overloadedProp: null,
            _otherFunctionProp: function () {},
            overloadedProp: function (value) {
                if (typeof value === 'undefined') {
                    return this._overloadedProp;
                }
                else {
                    this._overloadedProp = value;
                    return this;
                }
            },
            getOtherFunctionProp: function () {
                return this._otherFunctionProp;
            },
            setOtherFunctionProp: function (value) {
                this._otherFunctionProp = value;
                return this;
            },
            getBooleanValue: function () {
                return this._booleanValue;
            },
            setBooleanValue: function (value) {
                this._booleanValue = value;
                return this;
            }
        },
        newObjValuesToUse = {
            numberValue: 1,
            arrayValue: ['hello-world', 1, 2, 3],
            stringValue: 'hello world',
            objectValue: {all: {your: {base: 'are belong to us'}},
                someFunction: function () {console.log('new function value.');},
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
            _booleanValue: true,
            _overloadedFunctionValue: function () {},
            _overloadedProp: {somePropProp: 'value'},
            _otherFunctionProp: function () {console.log('hello world'); },
        },

        objKeys = Object.keys(objToTest);

    it ('should be able to set a value on an object via key.', function () {
        var subject = sjl.jsonClone(objToTest),
            newObjToTest = sjl.jsonClone(newObjValuesToUse);

        // Re-set function value keys since json takes them away via json clone
        objKeys.forEach(function (key) {
            if (sjl.isFunction(objToTest[key])) {
                subject[key] = objToTest[key];
                if (typeof objToTest[key] === 'function' && key.indexOf('_') !== 0) {
                    newObjToTest[key] = objToTest[key];
                }
            }
        });

        // Run tests
        Object.keys(newObjToTest).forEach(function (key) {
            // Ensure subject's '_...' keys are not equal to the `newObjToTest`'s values
            if (key.indexOf('_') === 0) {
                expect(subject[key] === newObjToTest[key]).to.be.false();
            }
            // Run operation
            var result = sjl.setValueOnObj(key, newObjToTest[key], subject);

            // Test result
            expect(result[key]).to.equal(newObjToTest[key]);
        });
    });

    it ('should be able to set a value on an object via namespace string.', function () {
        var subject = sjl.jsonClone(objToTest);
        expect(sjl.setValueOnObj('objectValue.all', newObjValuesToUse.objectValue.all, subject)).to.equal(newObjValuesToUse.objectValue.all);
        expect(sjl.setValueOnObj('objectValue.all.your', newObjValuesToUse.objectValue.all.your, subject)).to.equal(newObjValuesToUse.objectValue.all.your);
        expect(sjl.setValueOnObj('objectValue.all.your.base', newObjValuesToUse.objectValue.all.your.base, subject)).to.equal(newObjValuesToUse.objectValue.all.your.base);
    });

    it ('should be able to set a value via legacy setters.', function () {
        var subject = sjl.jsonClone(objToTest),
            newObjToTest = sjl.jsonClone(newObjValuesToUse);

        // Re-set function value keys since json takes them away via json clone
        objKeys.forEach(function (key) {
            if (key.indexOf('set') === 0 || key.indexOf('overloaded') === 0) {
                newObjToTest[key] = objToTest[key];
            }
            if (sjl.isFunction(newObjValuesToUse[key])) {
                newObjToTest[key] = newObjValuesToUse[key];
            }
            if (sjl.isFunction(objToTest[key])) {
                subject[key] = objToTest[key];
            }
        });

        objKeys.filter(function (key) {
            return key.indexOf('_') === 0;
        })
        .map(function (key) {
            return key.substring(1);
        })
        .forEach(function (key) {
            var result = sjl.setValueOnObj(key, newObjToTest['_' + key], subject, true);
            //console.log('_' + key, objToTest['_' + key]);
            //console.log('_' + key, result['_' + key]);
            //console.log('_' + key, newObjToTest['_' + key]);
            expect(result['_' + key]).to.equal(newObjToTest['_' + key]);
        });
    });

    it ('should throw a type error when no values are passed in.', function () {
        var caughtError;
        try {
            sjl.setValueOnObj();
        }
        catch(e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

});
