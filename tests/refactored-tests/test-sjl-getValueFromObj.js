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

describe('#`getValueFromObj`', function () {

    var objToTest = {
            'NumberValue': -1,
            'NumberValue2': 0,
            'NumberValue3': 1,
            'NumberValue4': 99,
            'StringValue': 'hello world',
            'FunctionValue': function () {console.log('some function call here.')},
            'ArrayValue': [1, 2, 3],
            'ObjectValue': {all: {your: {base: '...'}}},
            'BooleanValue': true,
            'BooleanValue2': false,
            'getFunctionValue': function () { objToTest.FunctionValue.__hello = 'hello'; return objToTest.FunctionValue; },
            'getBooleanValue2': function () { return objToTest.BooleanValue2; },
            '_overloadedProp': {somePropProp: 'value'},
            'overloadedProp': function (value) {
                if (typeof value === 'undefined') {
                    console.log('returning _overloadedProp');
                    return objToTest._overloadedProp;
                }
                else {
                    objToTest._overloadedProp = value;
                    return this;
                }
            }
        },

        objKeys = Object.keys(objToTest),
        objValues = objKeys.map(function (key) {
            return objToTest[key];
        });

    // @todo separate these tests into separate `it` statements so that is more opaque in tests list.
    it('Should be able to get a any value from an object.', function () {

        // Loop through object keys and validate proper functionality for function
        objKeys.forEach(function (key, index) {
            var retVal;

            // Ensure preliminary values used for test match those of test subject
            expect(objToTest[key] === objValues[index]).to.equal(true);

            // Ensure we can get all values from test subject
            expect(sjl.getValueFromObj(key, objToTest)).to.equal(objValues[index]);

            // Ensure functions are called when `raw` is false
            if (typeof objToTest[key] === 'function') {
                expect(sjl.getValueFromObj(key, objToTest, null, false)).to.equal(objValues[index]());
            }

            // Check result of getting value via legacy getter if available
            retVal = sjl.getValueFromObj(key, objToTest, null, null, true);

            // Ensure getters are called when `useLegacyGetters` is true
            if (typeof retVal === 'function') {
                expect(retVal.__hello).to.equal('hello');
            }
            // Else ensure that other props/objects do not have the '__hello' property
            else {
                expect(retVal.hasOwnProperty('__hello')).to.equal(false);
            }

        });
    });

});
