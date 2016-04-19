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

describe('#sjl.defineSubClass', function () {
    
    'use strict';

    /**
     * Returns one array of all keys of objects passed in
     * @returns {Array<String>}
     */
    function concatKeys(/** ...objects **/) {
        return sjl.argsToArray(arguments).map(function (obj) {
                return Object.keys(obj);
            })
            .reduce(function (value1, value2) {
                return value1.concat(value2);
            });
    }

    var methods1 = {
            someMethod: function () {
                console.log('some method');
            }
        },
        statics1 = {
            someStaticProperty: 'some static property'
        },
        methods2 = {
            someOtherMethod: function () {
                console.log('some other method');
            }
        },
        statics2 = {
            someOtherStaticProperty: 'some other static property'
        },
        methods3 = {
            someOtherOtherMethod: function () {
                console.log('some other other method');
            }
        },
        statics3 = {
            someOtherOtherStaticProperty: 'some other other static property'
        };

    var Extendable = sjl.defineSubClass(Function, function Extendable() {}, methods1, statics1),
        SomeConstructor = sjl.defineSubClass(Extendable, function SomeConstructor() {}, methods2, statics2);

    it('should return a Constructor with all `statics` properties from parent.', function () {
        Object.keys(statics1).forEach(function (key) {
            expect(sjl.classOfIs(SomeConstructor[key], sjl.classOf(statics1[key]))).to.equal(true);
            expect(SomeConstructor[key]).to.equal(Extendable[key]);
        });
    });

    it('should return a Constructor with all `statics` passed in to inherit.', function () {
        Object.keys(statics2).forEach(function (key) {
            expect(sjl.classOfIs(SomeConstructor[key], sjl.classOf(statics2[key]))).to.equal(true);
            expect(SomeConstructor[key]).to.equal(statics2[key]);
        });
    });

    it('should return a Constructor with all `methods` from parent.', function () {
        Object.keys(methods1).forEach(function (key) {
            expect(SomeConstructor.prototype[key]).to.equal(Extendable.prototype[key]);
        });
    });

    it('should return a Constructor with all `methods` passed in to inherit.', function () {
        Object.keys(methods2).forEach(function (key) {
            expect(SomeConstructor.prototype[key]).to.equal(methods2[key]);
        });
    });

    it('should return a Constructor with a static `extend` method.', function () {
        expect(sjl.classOf(SomeConstructor.extend)).to.equal(Function.name);
    });

    describe('returned subclass via parent\'s static `extend` method', function () {

        // Subclass from extend method
        var SubClass = SomeConstructor.extend(function SubClass() {}, methods3, statics3);

        it('should have return subclass with statics of parent and those passed in to inherit', function () {
            var mergedProps = sjl.extend({}, statics1, statics2, statics3);
            concatKeys(statics1, statics2, statics3).forEach(function (key) {
                expect(sjl.classOfIs(SubClass[key], sjl.classOf(mergedProps[key]))).to.equal(true);
                expect(SubClass[key]).to.equal(mergedProps[key]);
            });
        });

        it('should return a subclass with methods of parent and those passed in to inherit.', function () {
            var mergedProps = sjl.extend({}, methods1, methods2, methods3);
            concatKeys(methods1, methods2, methods3).forEach(function (key) {
                expect(sjl.classOfIs(SubClass.prototype[key], Function)).to.equal(true);
                expect(SubClass.prototype[key]).to.equal(mergedProps[key]);
            });
        });

        it('should return a subclass with a static `extend` method.', function () {
            expect(sjl.classOf(SubClass.extend)).to.equal(Function.name);
        });
    });

    describe ('returned subclass via parent\'s `extend` method with constructor via `constructor` key', function () {

        // Subclass from extend method via with constructor via constructor key
        var SubClass = SomeConstructor.extend(sjl.extend({
                constructor: function SubClass() {}
            }, methods3), statics3);

        it('should have return subclass with statics of parent and those passed in to inherit', function () {
            var mergedProps = sjl.extend({}, statics1, statics2, statics3);
            concatKeys(statics1, statics2, statics3).forEach(function (key) {
                expect(sjl.classOfIs(SubClass[key], sjl.classOf(mergedProps[key]))).to.equal(true);
                expect(SubClass[key]).to.equal(mergedProps[key]);
            });
        });

        it('should return a subclass with methods of parent and those passed in to inherit.', function () {
            var mergedProps = sjl.extend({}, methods1, methods2, methods3);
            concatKeys(methods1, methods2, methods3).forEach(function (key) {
                expect(sjl.classOfIs(SubClass.prototype[key], Function)).to.equal(true);
                expect(SubClass.prototype[key]).to.equal(mergedProps[key]);
            });
        });

        it('should return a subclass with a static `extend` method.', function () {
            expect(sjl.classOf(SubClass.extend)).to.equal(Function.name);
        });
    });

});

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

describe('Sjl Utils', function () {

    'use strict';

    // @note We use IIFE strings cause we parse these through
    // eval and eval will only return a value if a value is returned to it
    var objForIssetAndEmptyChecks = {
            nullValue: 'null',
            undefinedValue: 'undefined',
            nonEmptyStringValue: '"hello"',
            emptyStringValue: '""',
            nonEmptyNumberValue: '1',
            emptyNumberValue: '0',
            nonEmptyBooleanValue: 'true',
            emptyBooleanValue: 'false',
            functionValue:       '(function () { return function HelloWorld () {} }())',
            emptyObjectValue:    '(function () { return {} }())',
            nonEmptyObjectValue: '(function () { return {all:{your:{base:{are:{belong:{to:{us:{}}}}}}}} }())',
            emptyArrayValue:     '(function () { return [] }())',
            nonEmptyArrayValue:  '(function () { return [1] }())'
        },
        keyTypesForIssetAndEmptyChecks = {
            nullValue:              'Null',
            undefinedValue:         'Undefined',
            nonEmptyStringValue:    'String',
            emptyStringValue:       'String',
            nonEmptyNumberValue:    'Number',
            emptyNumberValue:       'Number',
            nonEmptyBooleanValue:   'Boolean',
            emptyBooleanValue:      'Boolean',
            functionValue:          'Function',
            emptyObjectValue:       'Object',
            nonEmptyObjectValue:    'Object',
            emptyArrayValue:        'Array',
            nonEmptyArrayValue:     'Array'
        },
        truthyKeysForTypes = {
            nullValue:              'Null',
            undefinedValue:         'Undefined',
            nonEmptyStringValue:    'String',
            emptyStringValue:       'String',
            nonEmptyNumberValue:    'Number',
            emptyNumberValue:       'Number',
            nonEmptyBooleanValue:   'Boolean',
            emptyBooleanValue:      'Boolean',
            functionValue:          'Function',
            emptyObjectValue:       'Object',
            nonEmptyObjectValue:    'Object',
            emptyArrayValue:        'Array',
            nonEmptyArrayValue:     'Array'
        },
        falsyKeysForTypes = {
            nullValue:              'Function',
            undefinedValue:         'String',
            nonEmptyStringValue:    'Number',
            emptyStringValue:       'Object',
            nonEmptyNumberValue:    'Function',
            emptyNumberValue:       'String',
            nonEmptyBooleanValue:   'Number',
            emptyBooleanValue:      'Function',
            functionValue:          'Boolean',
            emptyObjectValue:       'String',
            nonEmptyObjectValue:    'Function',
            emptyArrayValue:        'Number',
            nonEmptyArrayValue:     'Object'
        };

    function returnedObjWithEvaledValues (obj) {
        var newObj = {};
        Object.keys(obj).forEach(function (key) {
            newObj[key] = eval(obj[key]);
        });
        return newObj;
    }

    

    describe('#`isset`', function () {
        it('should return false for null value.', function () {
            expect(sjl.isset(null)).to.equal(false);
        });
        it('should return false for undefined value.', function () {
            expect(sjl.isset(undefined)).to.equal(false);
        });
        it('should return true for a defiend value (1).', function () {
            expect(sjl.isset(1)).to.equal(true);
        });
    });

    describe('#`issetMulti`', function () {
        var falsyArgSets = [
            [null, undefined],
            [null, 'hello', undefined, {}, []],
            [undefined, 'hello', (function () {})],
        ],
            truthyArgSets = [
                ['hello', {hello: 'ola'}, (function () {})]
            ];

        falsyArgSets.forEach(function (args) {
            expect(sjl.issetMulti.apply(sjl, args)).to.equal(false);
        });
        truthyArgSets.forEach(function (args) {
            expect(sjl.issetMulti.apply(sjl, args)).to.equal(true);
        });
    });

    describe('#`issetAndOfType`', function () {
        var refObj = objForIssetAndEmptyChecks,
            evaledObj = returnedObjWithEvaledValues(refObj),
            types = keyTypesForIssetAndEmptyChecks,
            keys = Object.keys(evaledObj),

        // Remove not set values for truthy tests
            truthyKeys = keys.filter(function (key) {
                return evaledObj[key] !== null && evaledObj[key] !== undefined;
            }),

        // Falsy keys to test
            falsyKeys = ['nullValue', 'undefinedValue'];


        // -------------------------------------------------------------------------------------------------------
        // Tests for key values when passing in one type value to check against
        // -------------------------------------------------------------------------------------------------------

        // Perform truthy tests
        truthyKeys.forEach(function (key) {
            it('should return true for value "' + refObj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when value is set and passed in type is "' + types[key] + '".', function () {
                expect(sjl.issetAndOfType(evaledObj[key], types[key])).to.equal(true);
            });
        });

        // Perform falsy tests
        falsyKeys.forEach(function (key) {
            it('should return false for value "' + refObj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when value is not set or passed in type is "' + types[key] + '".', function () {
                expect(sjl.issetAndOfType(evaledObj[key], types[key])).to.equal(false);
            });
        });

        // -------------------------------------------------------------------------------------------------------
        // Tests for key values when passing in an array of types
        // -------------------------------------------------------------------------------------------------------

        // Perform truthy tests with array of types
        truthyKeys.forEach(function (key) {
            it('should return true for value "' + refObj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when value is set and comparison type is "' + truthyKeysForTypes[key] + '" .', function () {
                expect(sjl.issetAndOfType.call(sjl, evaledObj[key], truthyKeysForTypes[key])).to.equal(true);
            });
        });

        // Perform falsy tests for array of types
        keys.forEach(function (key) {
            it('should return false for value "' + refObj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when value is not set or comparison type is "[' + falsyKeysForTypes[key] + ']" .', function () {
                expect(sjl.issetAndOfType.call(sjl, evaledObj[key], falsyKeysForTypes[key])).to.equal(false);
            });
        });

        // -------------------------------------------------------------------------------------------------------
        // Tests for key values when passing in an array of types
        // -------------------------------------------------------------------------------------------------------

        // Perform truthy tests when passing in one or more types
        truthyKeys.forEach(function (key) {
            it('should return true for value "' + refObj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when value is set and of given comparison type "' + truthyKeysForTypes[key] + '" and passed in as separate params.', function () {
                expect(sjl.issetAndOfType(evaledObj[key], truthyKeysForTypes[key])).to.equal(true);
            });
        });

        // Perform falsy tests when passing in one or more types
        keys.forEach(function (key) {
            it('should return false for value "' + refObj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when value is not set or value is not of given comparison type "[' + falsyKeysForTypes[key] + ']" and passed in as separate params.', function () {
                expect(sjl.issetAndOfType(evaledObj[key], falsyKeysForTypes[key])).to.equal(false);
            });
        });

    });

    describe('#`isEmptyOrNotOfType`', function () {
        var obj = objForIssetAndEmptyChecks,
            evaledObj = returnedObjWithEvaledValues(objForIssetAndEmptyChecks);

        // Truthy values
        ['nullValue', 'undefinedValue', 'emptyNumberValue', 'emptyObjectValue', 'emptyBooleanValue', 'emptyArrayValue']
        .forEach(function (key) {
            it('should return true for value "' + obj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when no `type` param is passed in.', function () {
                expect(sjl.isEmptyOrNotOfType(evaledObj[key])).to.equal(true);
            });
        });

        // Falsy values
        ['nonEmptyNumberValue', 'nonEmptyBooleanValue', 'nonEmptyStringValue', 'nonEmptyArrayValue', 'nonEmptyObjectValue']
        .forEach(function (key) {
            it('should return `false` for value "' + obj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when no `type` param is passed in.', function () {
                expect(sjl.isEmptyOrNotOfType(evaledObj[key])).to.equal(false);
            });
        });

        // Truthy values
        ['nullValue', 'undefinedValue', 'emptyNumberValue', 'emptyObjectValue', 'emptyBooleanValue', 'emptyArrayValue']
        .forEach(function (key) {
            it('should return true for value "' + obj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when `type` params are passed in.  Passed in type params: [' + falsyKeysForTypes[key] + ']', function () {
                expect(sjl.isEmptyOrNotOfType(evaledObj[key], falsyKeysForTypes[key])).to.equal(true);
            });
        });

        // Falsy values
        ['nonEmptyNumberValue', 'nonEmptyBooleanValue', 'nonEmptyStringValue', 'nonEmptyArrayValue', 'nonEmptyObjectValue']
        .forEach(function (key) {
            it('should return `false` for value "' + obj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when  `type` params are passed in.  Passed in type params: [' + truthyKeysForTypes[key] + ']', function () {
                expect(sjl.isEmptyOrNotOfType(evaledObj[key], truthyKeysForTypes[key])).to.equal(false);
            });
        });

    });

    describe('#`empty`', function () {

        function makeEmptyTestsForValueMap(valMap, retValString) {
            Object.keys(valMap).forEach(function (key) {
                it('should return ' + retValString + ' for `' + key + '`', function () {
                    expect(sjl.empty(valMap[key])).to.equal(eval(retValString));
                });
            });
        }

        var emptyValueMap = {
                '0 value': 0,
                'null value': null,
                'undefined value': undefined,
                'empty string': '',
                'empty object': {},
                'empty array': []
            },

            nonEmptyValueMap = {
                'number other than zero': 1,
                'negative number': -1,
                'true value': true,
                'non-empty object': {a: 'b'},
                'non-empty array': [1],
                'non-empty string': '0'
            };

        // empty Should return true for empty values; I.e., 0, null, undefined, "", {}, []
        it('should return true for all ' +
            'empty values (0, null, undefined, "", {}, [])', function () {
            expect(sjl.empty(0, null, undefined, '', {}, [])).to.equal(true);
        });

        // Should return false for each in empty values
        makeEmptyTestsForValueMap(emptyValueMap, 'true');

        // empty Should return false for all non-empty values
        it('should return false for all passed in non-empty ' +
            'values: [1], {hello: "world"}, "0", -1, true, 1', function () {
            expect(sjl.empty([1], {hello: 'world'}, '0', -1, true, 1)).to.equal(false);
        });

        // Should return false for each in non-empty values
        makeEmptyTestsForValueMap(nonEmptyValueMap, 'false');

    });

    describe('#`emptyMulti`', function () {
        var truthyArgSets = [
                [null, undefined],
                [null, 'hello', undefined, {}, []],
                [undefined, 'hello', (function () {})],
            ],
            falsyArgSets = [
                ['hello', {hello: 'ola'}, (function () {})]
            ];

        falsyArgSets.forEach(function (args) {
            expect(sjl.emptyMulti.apply(sjl, args)).to.equal(false);
        });
        truthyArgSets.forEach(function (args) {
            expect(sjl.emptyMulti.apply(sjl, args)).to.equal(true);
        });
    });

});

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

describe('Sjl#`namespace`', function () {

    'use strict';

    // Sample obj
    var sampleObj = {},
        sampleObjWithMaps = {},
        values = [
            'function () {}',
            'null', 'false', 'true', '0', '-1', '1', '{}',
            '[]', '{all: {your: {base: {are: {belong: {to: {us: {}}}}}}}}'
        ],
        evaluatedValues = [];

    // Adorn sampleObj
    values.forEach(function (val, i) {
        var evaluated = eval('(' + val + ')');
        sampleObj['value' + i] = evaluated;
        sampleObjWithMaps['value' + i] = evaluated;
        evaluatedValues.push(evaluated);
    });

    // When fetching one level deep within `sampleObj`
    describe('When fetching values with `namespace` from `sampleObj`', function () {
        evaluatedValues.forEach(function (val, i) {
            it('should return `' + values[i]
                + '` for `sampleObj.value`' + i, function () {
                expect(sjl.namespace('value' + i, sampleObj))
                    .to.equal(evaluatedValues[i]);
            });
        });
    });

    // When fetching and setting one level deep within `sampleObj`
    describe('When fetching and setting values `namespace` from `sampleObj`', function () {
        evaluatedValues.forEach(function (val, i) {
            it('should have set and returned `' + values[values.length - (i + 1)]
                + '` for key `value' + i + '`', function () {
                var valueToSet = evaluatedValues[evaluatedValues.length - (i + 1)],
                    retVal = sjl.namespace('value' + i, sampleObj, valueToSet);
                expect(retVal).to.equal(valueToSet);
            });
        });
    });

    // When fetching one level deep from `sampleObjWithMaps`
    describe('When fetching values with `namespace` from `sampleObjWithMaps`', function () {
        evaluatedValues.forEach(function (val, i) {
            it('should return `' + values[i]
                + '` for `sampleObjWithMaps.value`' + i, function () {
                expect(sjl.namespace('value' + i, sampleObjWithMaps))
                    .to.equal(evaluatedValues[i]);
            });
        });
    });

    // When fetching one level deep within `sampleObjWithMaps`
    describe('When fetching values with `namespace` from `sampleObjWithMaps`', function () {

        // Add some map objects to `sampleObjWithMaps`
        sampleObjWithMaps.machineSpeak =
        {all: {your: {base: {are: {belong: {to: {us: {}}}}}}}}; //);

        // Add a map with a nested map to `sampleObjWithMaps`
        sampleObjWithMaps.machineSpeak2 =
        {all: {your: {base: {are: {belong: {to: {us: {}}}}}}}}; //, true);

        // The all your base map key
        var machine = sampleObjWithMaps.machineSpeak;
        it('`sampleObjWithMaps.machineSpeak', function () {
            expect(sjl.namespace('machineSpeak.all.your.base.are.belong.to.us', sampleObjWithMaps))
                .to.equal(machine.all.your.base.are.belong.to.us);
        });

        var machine2 = sampleObjWithMaps.machineSpeak2;
        it('`sampleObjWithMaps.machineSpeak2', function () {
            expect(sjl.namespace('machineSpeak2.all.your.base.are.belong.to.us', sampleObjWithMaps))
                .to.equal(machine2.all.your.base.are.belong.to.us);
        });

    });

});

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

describe('Sjl Reflection', function () {

    'use strict';

    describe('#`classOf`', function () {
        var valueMap = {
            'Array': [[], new Array()],
            'Boolean': [true, false],
            'Function': [function () {}, new Function()],
            'Null': null,
            'Number': [1, 0, -1, 12e+3],
            'Object': [{}, new Object()],
            'String': [new String('ola'), 'hello'],
            'Undefined': undefined
        };

        Object.keys(valueMap).forEach(function (x) {
            it('should return "' + x + '"', function () {
                var val = valueMap[x];

                // Loop through array of values and test each one with value
                // from value map
                if (Array.isArray(val)) {
                    val.forEach(function (y) {
                        expect(sjl.classOf(y)).to.equal(x);
                    });
                }
                else {
                    expect(sjl.classOf(val)).to.equal(x);
                }
            });
        });
    });

    describe('#`classOfIs`', function () {

        // Eval keys and pass them in for tests
        var dataTypeClassStrings = {
            '([])':         sjl.classOf( []        ),
            '(true)':       sjl.classOf( true      ),
            '(1)':          sjl.classOf( 1         ),
            '({})':         sjl.classOf( {}        ),
            '("")':         sjl.classOf( ''        ),
            '(null)':       sjl.classOf( null      ),
            '(undefined)':  sjl.classOf( undefined ),
            '(function hello () {})':   sjl.classOf( function hello() {} )
        },
            failForClassStrings = {
                '([])':         'String',
                '(true)':       'Undefined',
                '(1)':          'Null',
                '({})':         'Number',
                '("")':         'Array',
                '(null)':       'Set',
                '(undefined)':  'Map',
                '(function hello () {})':   'Array'
            };

        Object.keys(dataTypeClassStrings).forEach(function (x) {
            it('should return true for alias "' + dataTypeClassStrings[x] + '" when checking ' + x, function () {
                expect(sjl.classOfIs(eval(x), dataTypeClassStrings[x])).to.equal(true);
            });
        });

        Object.keys(dataTypeClassStrings).forEach(function (x) {
            it('should find the matching class in list and return false for "' +
                failForClassStrings[x] +
                '" when checking "' + x +'"', function () {
                expect(sjl.classOfIs( eval(x), failForClassStrings[x] )).to.equal(false);
            });
        });

    });

});

/**
 * Created by Ely on 5/24/2014.
 */

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

describe ('Sjl String', function () {

    'use strict';

    var funcToCaseAndResultMap = {
            lcaseFirst: {
                'LOWER-CASE-FIRST-':        'lOWER-CASE-FIRST-',
                '-LOWER-CASE-FIRST-':       '-lOWER-CASE-FIRST-',
                '->%^&*LOWER-CASE-FIRST':   '->%^&*lOWER-CASE-FIRST'
            },
            ucaseFirst: {
                'upper-case-first': 'Upper-case-first',
                '-upper-case-first': '-Upper-case-first',
                '-!@#$%^upper-case-first': '-!@#$%^Upper-case-first'
            },
            camelCase: {
                'to-camel-case1': 'toCamelCase1',
                '-to-camel-case-2': 'toCamelCase2',
                '-!@#$%^to-^&*camel)(*|}{-case$3#@!': 'toCamelCase3',
                'to-class-case1': 'ToClassCase1',
                '-to-class-case-2': 'ToClassCase2',
                '-!@#$%^to-^&*class)(*|}{-case$3#@!': 'ToClassCase3'
            }
    };

    describe('#`lcaseFirst`', function () {
        var map = funcToCaseAndResultMap.lcaseFirst;
        Object.keys(map).forEach(function (key) {
            it('should convert "' + key + '" ~~ to ~~ "' + map[key] + '"', function () {
                expect(sjl.lcaseFirst(key)).to.equal(map[key]);
            });
        });
    });

    describe('#`ucaseFirst`', function () {
        var map = funcToCaseAndResultMap.ucaseFirst;
        Object.keys(map).forEach(function (key) {
            it('should convert "' + key + '" ~~ to ~~ "' + map[key] + '"', function () {
                expect(sjl.ucaseFirst(key)).to.equal(map[key]);
            });
        });
    });

    describe('#`camelCase`', function () {
        var map = funcToCaseAndResultMap.camelCase;
        Object.keys(map).forEach(function (key) {
            it('should convert "' + key + '" ~~ to ~~ "' + map[key] + '"', function () {
                if (key.toLowerCase().indexOf('class') !== -1) {
                    expect(sjl.camelCase(key, true)).to.equal(map[key]);
                }
                else {
                    expect(sjl.camelCase(key)).to.equal(map[key]);
                }
            });
        });
    });

});
