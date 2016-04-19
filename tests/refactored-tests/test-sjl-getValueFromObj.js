// ~~~ STRIP ~~~
// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    var sjl = require('./../../src/sjl');
}
// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}
// ~~~ /STRIP ~~~

describe('#sjl.getValueFromObj', function () {

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
            getBooleanValue: function () {
                return objToTest.booleanValue;
            }
        },

        objKeys = Object.keys(objToTest),
        objValues = objKeys.map(function (key) {
            return objToTest[key];
        }),
        objValueTypes = objKeys.map(function (key) {
            return sjl.classOf(objKeys[key]);
        });

    it('should be able to get a value from an object by key.', function () {
        objKeys.forEach(function (key) {
            expect(sjl.getValueFromObj(key, objToTest)).to.equal(objToTest[key]);
        });
    });

    it('should be able to get a value from an object by namespace string.', function () {
        expect(sjl.getValueFromObj('objectValue.all', objToTest)).to.equal(objToTest.objectValue.all);
        expect(sjl.getValueFromObj('objectValue.all.your', objToTest)).to.equal(objToTest.objectValue.all.your);
        expect(sjl.getValueFromObj('objectValue.all.your.base', objToTest)).to.equal(objToTest.objectValue.all.your.base);
        expect(sjl.getValueFromObj('objectValue.all.someFunction', objToTest)).to.equal(objToTest.objectValue.all.someFunction);
    });

    it('should be able to automatically call functions and get their ' +
        'return value when `raw` is `false`.', function () {
        expect(sjl.getValueFromObj('getBooleanValue', objToTest, false))
            .to.equal(objToTest.booleanValue);
    });

    it('should be able automatically call functions and get their return values.  ' +
        'when passing in `args` and setting `raw` to `false`.', function () {
        // Args for nested function call
        var args = [5],

            // Get value from obj
            result = sjl.getValueFromObj('objectValue.fib', objToTest, false, null, args);

        // Check that fibonacci series numbers got returned
        expect(result[0]).to.equal(0);
        expect(result[1]).to.equal(1);
        expect(result[2]).to.equal(1);
        expect(result[3]).to.equal(2);
        expect(result[4]).to.equal(3);

        // Check result length (should be five when asking for fib up to five)
        expect(result.length).to.equal(5);

        // Check that result is an array as we are expecting one from
        // the `fib` function being called.
        expect(Array.isArray(result)).to.be.true();
    });

    it('should be able to call legacy getters when ' +
        '`useLegacyGetters` is `true`.', function () {
        expect(sjl.getValueFromObj('otherFunctionProp', objToTest, null, true))
            .to.equal(objToTest._otherFunctionProp);
    });

});
