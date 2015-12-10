/**
 * Created by edelacruz on 7/28/2014.
 */
/**
 * Created by edelacruz on 7/28/2014.
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

describe('Sjl Input', function () {

    "use strict";

    var Input = sjl.ns.input.Input;

    describe('Should have the appropriate interface', function () {
        var input = new Input(),
            propNames = [
                'allowEmpty',
                'breakOnFailure',
                'errorMessage',
                'filterChain',
                'name',
                'required',
                'validatorChain',
                'messages',
                'value'
            ],
            getAndSetMethodNames = [],
            otherMethodNames = [ 'isValid', 'merge' ],
            methodNames = [],
            method,
            prop;

        // Get prop setter and getter names
        for (prop in propNames) {
            prop = propNames[prop];
            getAndSetMethodNames.push('set' + sjl.ucaseFirst(prop));
            getAndSetMethodNames.push('get' + sjl.ucaseFirst(prop));
        }

        // Check methods exist
        methodNames = otherMethodNames.concat(getAndSetMethodNames);

        // Check methods exist
        for (method in methodNames) {
            method = methodNames[method];
            it('should have a `' + method + '` method.', function () {
                expect(typeof input[method]).to.equal('function');
            });
        }
    });

    describe('Should return a valid ValidatorChain via it\'s getter.', function () {

    });

});

/**
 * Created by edelacruz on 7/28/2014.
 */
/**
 * Created by edelacruz on 7/28/2014.
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

describe('Sjl InputFilter', function () {

    "use strict";

    var RegexValidator = sjl.package.validator.RegexValidator,
        InputFilter = sjl.package.input.InputFilter;

    describe ('Should have the appropriate interface', function () {
        var inputFilter = new InputFilter(),
            methods = [
                'add', 'get','has',
                'remove', 'setData', 'getData',
                'isValid', 'getInvalidInputs',
                'getValidInputs', 'getValue',
                'getValues', 'getRawValue',
                'getRawValues',
                'getMessages'
            ],
            method;

        for (method in methods) {
            method = methods[method];
            it ('it should a `' + method + '`.', function () {
                expect(typeof inputFilter[method]).to.equal('function');
            });
        }
    });

    it ('Should have a static method "factory"', function () {
        expect (typeof InputFilter.factory).to.equal('function');
    });

    describe ('Should create an auto-populated instance via it\'s static method "factory"', function () {
        var inputFilter;

        before(function (done) {
            inputFilter = InputFilter.factory({
                inputs: {
                    id: {
                        validators: [
                            new RegexValidator({pattern: /^\d{1,20}$/})
                        ]
                    },
                    // @todo fix the required attribute within the `InputFilter` class as it is overriding populated
                    // values and forcing validation to be skipped
                    alias: {
                        validators: [
                            new RegexValidator({pattern: /^[a-z\-_\d]{1,55}$/i})
                        ]
                    }
                }
            });

            done();
        });

        it ('should have 2 new created inputs', function () {
            console.log(inputFilter);
            //expect(Object.keys(inputFilter.getInputs()).length).to.equal(2);
        });

        it ('should validate to true on valid values', function () {
            // Set data
            inputFilter.setData({id: '999', alias: 'hello-world'});
            expect(inputFilter.isValid()).to.equal(true);
            expect(Object.keys(inputFilter.getMessages()).length).to.equal(0);
        });

        it ('should validate to false on invalid values and should have error messages for each input datum', function () {
            // Set data
            inputFilter.setData({id: '99abc', alias: 'hello -world'});
            expect(inputFilter.isValid()).to.equal(false);
            expect(Object.keys(inputFilter.getMessages()).length).to.equal(2);
        });

    });

});

// Make test suite directly interoperable with the browser
if (typeof window === 'undefined' && typeof chai === 'undefined') {
    var chai = require('chai');
    var sjl = require('./../../src/sjl/sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

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
            nullValue:              'null',
            undefinedValue:         'undefined',
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
            nullValue:              'null',
            undefinedValue:         'undefined',
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

    describe('#`argsToArray`', function () {

        var helloFunc = function hello () {},
            helloArray = ['a', 'b', 'c'];

        it ('should return an array for an arguments object.', function () {
            expect(Array.isArray(sjl.argsToArray(arguments))).to.equal(true);
        });

        describe ('when passed in args are [1, 2, "3", '
            + helloFunc + ', [' + helloArray + ']]', function () {
            var valuesToTest,
                valuesToPassIn = [1, 2, '3', helloFunc, helloArray];

            // Get values to test
            (function () {
                valuesToTest = sjl.argsToArray(arguments);
            })(1, 2, '3', helloFunc, helloArray);

            valuesToTest.forEach(function (val, i) {
                it ('Returned array should contain value "' + valuesToPassIn[i]
                    + '" of type "' + sjl.classOf(valuesToPassIn[i]) + '".', function () {
                    expect(val).to.equal(valuesToPassIn[i]);
                });
            });
        });

    });

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

});
// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    var sjl = require('./../../src/sjl/sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

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
// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    var sjl = require('./../../src/sjl/sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl Reflection', function () {

    'use strict';

    describe('#`classOf`', function () {
        var valueMap = {
            'Array': [[], new Array()],
            'Boolean': [true, false],
            'Function': [function () {}, new Function()],
            'null': null,
            'Number': [1, 0, -1, 12e+3],
            'Object': [{}, new Object()],
            'String': [new String('ola'), 'hello'],
            'undefined': undefined
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
                '(true)':       'undefined',
                '(1)':          'null',
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
                expectedKeyTypeMap = { 'func': 'Function', 'nil': 'null', 'num': 'Number',
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

// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    var sjl = require('./../../src/sjl/sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

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
/**
 * Created by Ely on 7/8/2015.
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

describe('Iterator', function () {

    'use strict';

    var interfaceKeys = [
        'current', 'next', 'rewind', 'pointer', 'values', 'valid'
        ],
        basicArray = 'abcdefghijklmnopqrstuvwxyz'.split(''),
        Iterator = sjl.package.stdlib.Iterator,
        iterator = Iterator(basicArray);

    it ('should be able to return an iterator whether called as a function or not.', function () {
        expect(iterator instanceof Iterator).to.equal(true);
        expect((new Iterator(basicArray, 3)) instanceof Iterator).to.equal(true);
    });

    it ('should have it\'s main properties (`values` and `pointer`) set on an `__internal` object', function () {
        expect(sjl.issetAndOfType(iterator.__internal.values, 'Array')).to.equal(true);
        expect(sjl.issetAndOfType(iterator.__internal.pointer, 'Number')).to.equal(true);
    });

    it ('should have the appropriate interface: [' + interfaceKeys.join(', ') + '] .', function () {
        expect(Object.keys(Iterator.prototype).filter(function (key) {
            return interfaceKeys.indexOf(key) > -1;
        }).length === interfaceKeys.length).to.equal(true);
    });

    it ('should be able to iterate through all values in `iterator`.', function () {
        var value;
        while (iterator.valid()) {
            value = iterator.next();
            expect(value.value).to.equal(basicArray[iterator.pointer() - 1]);
            expect(value.done).to.equal(false);
        }
    });

    it ('should be able to be rewound.', function () {
        expect(iterator.pointer()).to.equal(basicArray.length);
        expect(iterator.rewind().pointer()).to.equal(0);
    });

    it ('should be able to set the __internal `pointer` via the `pointer` method.', function () {
        expect(iterator.pointer(16).pointer()).to.equal(16);
    });

    it ('should be able to set the __internal `values` via the `values` method.', function () {
        expect(iterator.values(['a', 'b', 'c']).values().length).to.equal(3);
    });

    it ('should be able to get the value at the `current` pointer position via the `current` method.', function () {
        expect(iterator.pointer(1).current().value).to.equal('b');
    });

});

/**
 * Created by Ely on 12/17/2014.
 */

'use strict';

// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    var sjl = require('./../../src/sjl/sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl Optionable', function () {

    // Some test values
    var Optionable = sjl.package.stdlib.Optionable,
        engToSpaSalutations = {
            goodafternoon: 'buenas tardes',
            goodevening: 'buenas noches',
            goodnight: 'buenas noches'
        },

        jpaToEngSalutations = {
            konichiwa: 'good afternoon',
            konbanwa: 'good evening',
            oyasuminasai: 'good night'
        },

        spaToJpaSalutations = {
            buenastardes: 'konichiwa',
            buenasnoches: 'konbanwa|oyasuminasai'
        },
        mergedOptions = sjl.extend({}, engToSpaSalutations, spaToJpaSalutations, jpaToEngSalutations),
        mergedOptionsKeys = Object.keys(mergedOptions),
        originalValues = mergedOptions,
        newValues = (function () {
            var out = {};
            mergedOptionsKeys.forEach(function (key, i) {
                out[key] = 'new value ' + (i + 1);
            });
            return out;
        }()),
        otherValues = (function () {
            var out = {};
            mergedOptionsKeys.forEach(function (key, i) {
                out[key] = 'other value ' + (i + 1);
            });
            return out;
        }()),

        getOptionableObj = function (options) {
            if (options) {
                return new Optionable(options);
            }
            return new Optionable(
                engToSpaSalutations,
                jpaToEngSalutations,
                spaToJpaSalutations
            );
        },

        allYourBase = {all: {your: {base: {are: {belong: {to: {us: {someValue: 99}}}}}}}};

    // Test 1
    describe ('#`merge`', function () {

        // Test 1.1
        describe('It should merge all object arguments to the options property of the `Optionable` object being called.', function () {
            var obj = getOptionableObj();
            mergedOptionsKeys.forEach(function (key) {
                it('"' + key + '" key should equal value "' + mergedOptions[key] + '".', function () {
                    expect(obj.options[key]).to.equal(mergedOptions[key]);
                });
            });
        }); // end of Test 1.1

        // Test 1.2
        describe('It should overwrite any existing values on the options property with the ones passed into it.', function () {
            var obj = getOptionableObj();
            obj.merge(newValues);
            mergedOptionsKeys.forEach(function (key) {
                it ('should have a key "' + key + '" with a new value "' + newValues[key] + '"', function () {
                    expect(obj.options[key]).to.equal(newValues[key]);
                });
            });
        }); // end of Test 1.2

        // Test 1.3
        describe('It should overwrite all values with the latest values passed in in a set of values.', function () {
            var obj = getOptionableObj(newValues);
            obj.merge(newValues, originalValues, otherValues);
            mergedOptionsKeys.forEach(function (key) {
                it ('should have a key "' + key + '" with an other value "' + otherValues[key] + '"', function () {
                    expect(obj.options[key]).to.equal(otherValues[key]);
                });
            });
        });

    }); // end of Test 1.0

    // Test 2
    describe ('#`has`', function () {
        it ('Should find values by namespace string.', function () {
            var obj = new Optionable(mergedOptions, allYourBase);
            expect(obj.has('all.your.base.are.belong.to.us')).to.equal(true);
        });
    });

    // Test 3
    describe ('#`set`', function () {

        // Test 3.1
        it ('Should be able to set values using a namespace string.', function () {
            var obj = new Optionable(mergedOptions, allYourBase);
            obj.merge(allYourBase);
            obj.set('all.your.base.are.belong.to.us', {someNewValue: 100});
            expect(obj.has('all.your.base.are.belong.to.us')).to.equal(true);
            expect(obj.get('all.your.base.are.belong.to.us.someNewValue')).to.equal(100);
        });

        // Test 3.2
        it ('Should be able to create heirarchichal structures from namespace strings to set an end value.', function () {

            // Empty optionable object
            var obj = new Optionable();

            // Doesn't have namespaced value
            expect(obj.has('all.your.base.are.belong.to.us')).to.equal(false);

            // Add namespaced value and set end value
            obj.set('all.your.base.are.belong.to.us', {someOtherValue: 1000});

            // Should have namespaced value
            expect(obj.has('all.your.base.are.belong.to.us')).to.equal(true);

            // Should have end value
            expect(obj.get('all.your.base.are.belong.to.us.someOtherValue')).to.equal(1000);
        });

        // Tetst 3.3
        describe ('Should be able to set multiple values from an object.', function () {
            // Empty optionable object
            var obj = new Optionable();
            obj.set(mergedOptions);
            mergedOptionsKeys.forEach(function (key) {
                it('It should have a new key "' + key + '" with value "' + mergedOptions[key] + '".', function () {
                    expect(obj.options[key]).to.equal(mergedOptions[key]);
                });
            });

        });

    }); // end of Tetst 3

    // Test 4
    describe ('#`get`', function () {
        var obj = new Optionable(mergedOptions, allYourBase);

        // Test 4.1
        it ('Should be able to get values using a namespace string.', function () {
            expect(obj.get('all.your.base.are.belong.to.us')).to.equal(obj.options.all.your.base.are.belong.to.us);
        });

        it ('Should be able to get values using a regular string (not a namespaced string).', function () {
            expect(obj.get('all')).to.equal(obj.options.all);
        });

        it ('Should return `null` for non-existent keys.', function () {
            expect(obj.get('helloworld')).to.equal(null);
        });

    });

}); // end of Test Suite

/**
 * Created by Ely on 8/6/2015.
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

describe('SjlMap', function () {

    "use strict";

    var SjlMap = sjl.package.stdlib.SjlMap;

    describe('#`SjlMap Methods Existence`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
            ['v4', 4], ['v5', 5], ['v6', 6],
            ['v7', 5], ['v8', 4]],
            sjlMap = new SjlMap([]),
            methods = ['clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values', 'get', 'set', 'addFromArray', 'iterator'];
        it ('should have the following methods: [`' + methods.join('`, `') + '`]', function () {
            methods.forEach(function (method) {
                expect(typeof sjlMap[method]).to.equal('function');
            });
        });
    });

    describe('#`SjlMap#clear`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
            ['v4', 4], ['v5', 5], ['v6', 6],
            ['v7', 5], ['v8', 4]],
            sjlMap = new SjlMap(entries);

        it ('should return `self`.', function () {
            expect(sjlMap.size).to.equal(entries.length);
            // Ensure `clear` returns `self`
            expect(sjlMap.clear()).to.equal(sjlMap);
        });
        it ('should set `size` to `0` as a side effect.', function () {
            // Validate size of set
            expect(sjlMap.size).to.equal(0);
        });
    });

    describe('#`SjlMap#delete`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            keyEntryToDelete = 'b',
            keyEntryToDeleteValue = 1,
            mapFrom = [ ['a', 0], [keyEntryToDelete, keyEntryToDeleteValue], ['c', 3] ],
            sjlMap = new SjlMap(mapFrom);

        it ('should delete unique key and return `self`.', function () {
            // Ensure method returns `self`
            expect(sjlMap.delete(keyEntryToDelete)).to.equal(sjlMap);

            // Ensure method deleted key entry
            expect(sjlMap.has(keyEntryToDelete)).to.equal(false);
            expect(sjlMap._values.indexOf(keyEntryToDeleteValue)).to.equal(-1);
            expect(sjlMap._keys.indexOf(keyEntryToDelete)).to.equal(-1);
        });

        it ('should set `size` to `size - 1` as a side effect.', function () {
            // Validate size of set
            expect(sjlMap.size).to.equal(mapFrom.length - 1);
        });
    });

    describe('#`SjlMap#entries`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            sjlMap = new SjlMap(entries),
            iterator = sjlMap.entries(),
            value;

        // Validate
        it ('should work as an iterator with included extra functions (`valid`).', function () {
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.done).to.equal(false);
                expect(value.value[0]).to.equal(entries[iterator.pointer() - 1][0]);
                expect(value.value[1]).to.equal(entries[iterator.pointer() - 1][1]);
            }
        });
    });

    describe('#`SjlMap#forEach`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            sjlMap = new SjlMap(entries),
            exampleContext = {someProperty: 'someValue'},
            indexCount = 0;

        it ('should work as expected when no context is passed in.', function () {
            // Validate `forEach` method works as expected
            sjlMap.forEach(function (key, value) {
                expect(entries[indexCount][0]).to.equal(key);
                expect(entries[indexCount][1]).to.equal(value);
                expect(this).to.equal(undefined);
                indexCount += 1;
            });
        });

        it ('should work as expected when a context is passed in.', function () {
            // Reset index count
            indexCount = 0;

            // Validate `forEach` method works as expected
            sjlMap.forEach(function (key, value) {
                expect(entries[indexCount][0]).to.equal(key);
                expect(entries[indexCount][1]).to.equal(value);
                expect(this).to.equal(exampleContext);
                indexCount += 1;
            }, exampleContext);
        });
    });

    describe('#`SjlMap#has`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            keyInMap = 'v5',
            keyNotInMap = 'v9',
            sjlMap = new SjlMap(entries);
        it ('should return `false` for keys not in set.', function () {
            expect(sjlMap.has(keyNotInMap)).to.equal(false);
        });
        it ('should return `true` for keys in set.', function () {
            expect(sjlMap.has(keyInMap)).to.equal(true);
        });
    });

    describe('#`SjlMap#keys`', function () {
        it ('should return an iterable object.', function () {
            var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                    ['v4', 4], ['v5', 5], ['v6', 6],
                    ['v7', 5], ['v8', 4]],
                sjlMap = new SjlMap(entries),
                iterator = sjlMap.keys(),
                value,
                index = 0;
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value).to.equal(entries[index][0]);
                index += 1;
            }
        });
    });

    describe('#`SjlMap#values`', function () {
        it ('should return an iterable', function () {
            var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                    ['v4', 4], ['v5', 5], ['v6', 6],
                    ['v7', 5], ['v8', 4]],
                sjlMap = new SjlMap(entries),
                iterator = sjlMap.values(),
                value,
                index = 0;
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value).to.equal(entries[index][1]);
                index += 1;
            }
        });
    });

    describe('#`SjlMap#get`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
            ['v4', 4], ['v5', 5], ['v6', 6],
            ['v7', 5], ['v8', 4]],
            sjlMap = new SjlMap(entries);
        it ('should return the correct value for a given key.', function () {
            expect(sjlMap.get('v1')).to.equal(1);
        });

        it ('should return undefined for for a given non-existent key entry.', function () {
            expect(sjlMap.get('v9')).to.equal(undefined);
        });
    });

    describe('#`SjlMap#set`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
            ['v4', 4], ['v5', 5], ['v6', 6],
            ['v7', 5], ['v8', 4]],
            sjlMap = new SjlMap(entries);
        it ('should return `self` when setting a key-value pair.', function () {
            expect(sjlMap.has('v9')).to.equal(false);
            expect(sjlMap.set('v9')).to.equal(sjlMap);
            expect(sjlMap.has('v9')).to.equal(true);
        });

        it ('should return undefined for for a given non-existent key entry.', function () {
            expect(sjlMap.get('v10')).to.equal(undefined);
        });
    });

    describe('#`SjlMap#addFromArray`', function () {
        it ('should import unique values from an array.', function () {
            var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                    ['v4', 4], ['v5', 5], ['v6', 6],
                    ['v7', 5], ['v8', 4]],
                otherEntries = [['v10', 7], ['v11', 8], ['v12', 9]],
                expectedEntries = entries.concat(otherEntries),
                sjlMap = new SjlMap(entries),
                value,
                index = 0,
                iterator;
            //console.log(sjlMap.iterator());
            sjlMap.addFromArray(otherEntries);
            iterator = sjlMap.entries();
            expect(sjlMap.size).to.equal(expectedEntries.length);
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value[0]).to.equal(expectedEntries[index][0]);
                expect(value.value[1]).to.equal(expectedEntries[index][1]);
                index += 1;
            }
        });
    });

    describe('#`SjlMap#iterator`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            sjlMap = new SjlMap(entries),
            iterator = sjlMap.iterator(),
            value;

        // Validate
        it ('should work as an iterator with included extra functions (`valid`).', function () {
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.done).to.equal(false);
                expect(value.value[0]).to.equal(entries[iterator.pointer() - 1][0]);
                expect(value.value[1]).to.equal(entries[iterator.pointer() - 1][1]);
            }
        });
    });

});
/**
 * Created by Ely on 8/6/2015.
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

describe('SjlSet', function () {

    "use strict";

    var SjlSet = sjl.package.stdlib.SjlSet;

    function validateHasFunction (obj, funcName) {
        it ('should have a `' + funcName + '` function.', function () {
            // Ensure set has `funcName` function
            expect(sjl.classOf(obj[funcName])).to.equal('Function');
        });
    }

    describe('#Set Methods', function () {
        var methods = ['add', 'clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values'],
            sjlSet = new SjlSet([1, 2, 3, 4, 5]);
        describe ('should have methods [`' + methods.join('`, `') + '`].', function () {
            methods.forEach(function (method) {
                validateHasFunction(sjlSet, method);
            });
        });
    });

    describe('#`SjlSet#add`', function () {
        var sjlSet = new SjlSet([1, 2, 3, 4, 5, 6, 6, 5, 4]),
            expected = [1, 2, 3, 4, 5, 6];

        it ('should be able to add unique values', function () {
            // Validate size of set
            expect(sjlSet.size).to.equal(6);

            // Validate indexes
            sjlSet.forEach(function (value, index) {
                expect(value).to.equal(expected[index]);
            });
        });
    });

    describe('#`SjlSet#clear, size`', function () {
        var sjlSet = new SjlSet([1, 2, 3, 4, 5]);

        it ('should return `self`.', function () {
            expect(sjlSet.size).to.equal(5);
            // Ensure `clear` returns `self`
            expect(sjlSet.clear()).to.equal(sjlSet);
        });
        it ('should set `size` to `0` as a side effect.', function () {
            // Validate size of set
            expect(sjlSet.size).to.equal(0);
        });
    });

    describe('#`SjlSet#entries, valid, next`', function () {
        var values = [1, 2, 3, 4, 5, 6, 6, 5, 4],
            sjlSet = new SjlSet(values),
            iterator = sjlSet.entries(),
            value;

        it ('should have an `entries` function.', function () {
            expect(typeof sjlSet.entries).to.equal('function');
        });

        // Validate
        it ('should work as an iterator with included extra functions (`valid`).', function () {
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.done).to.equal(false);
                expect(value.value[0]).to.equal(values[iterator.pointer() - 1]);
            }
        });
    });

    describe('#`SjlSet#forEach`', function () {
        var values = [1, 2, 3, 4, 5, 6, 6, 5, 4],
            expectedLength = 6,
            sjlSet = new SjlSet(values),
            exampleContext = {someProperty: 'someValue'},
            indexCount = 0;

        it ('should exists and be of type `Function`.', function () {
            // Validate set has `forEach` method
            expect(typeof sjlSet.forEach).to.equal('function');
        });

        it ('should work as expected when no context is passed in as the 3rd parameter.', function () {
            // Validate `forEach` method works as expected
            sjlSet.forEach(function (value, index, array) {
                expect(array.length).to.equal(expectedLength);
                expect(values[index]).to.equal(value);
                expect(index).to.equal(indexCount);
                expect(this).to.equal(undefined);
                indexCount += 1;
            });
        });

        it ('should work as expected when a context is passed in.', function () {
            // Reset the index count
            indexCount = 0;

            // Validate `forEach` method works as expected
            sjlSet.forEach(function (value, index, array) {
                expect(array.length).to.equal(expectedLength);
                expect(values[index]).to.equal(value);
                expect(index).to.equal(indexCount);
                expect(this).to.equal(exampleContext);
                indexCount += 1;
            }, exampleContext);
        });

    });

    describe('#`SjlSet#has`', function () {
        var values = [1, 2, 3, 4, 5, 6, 6, 5, 4],
            valueInSet = 5,
            valueNotInSet = 8,
            sjlSet = new SjlSet(values);
        it ('should return `false` for values not in set.', function () {
            expect(sjlSet.has(valueNotInSet)).to.equal(false);
        });
        it ('should return `true` for values in set.', function () {
            expect(sjlSet.has(valueInSet)).to.equal(true);
        });
    });

    describe('#`SjlSet#keys`', function () {
        var values = [1, 2, 3, 4, 5, 6, 6, 5, 4],
            sjlSet = new SjlSet(values);
        it ('should return an iterable object.', function () {
            var iterator = sjlSet.keys(),
                value,
                index = 0;
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value).to.equal(values[index]);
                index += 1;
            }
        });
    });

    describe('#`SjlSet#values`', function () {
        var values = [1, 2, 3, 4, 5, 6, 6, 5, 4],
            sjlSet = new SjlSet(values);
        it ('should return an iterable', function () {
            var iterator = sjlSet.values(),
                value,
                index = 0;
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value).to.equal(values[index]);
                index += 1;
            }
        });
    });

    describe('#`SjlSet#addFromArray`', function () {
        it ('should import unique values from an array.', function () {
            var values = [1, 2, 3, 4, 5],
                otherValues = [6, 7, 8, 9, 10],
                expectedValues = values.concat(otherValues),
                sjlSet = new SjlSet(values),
                value,
                index = 0,
                iterator;
            sjlSet.addFromArray(otherValues);
            iterator = sjlSet.values();
            expect(sjlSet.size).to.equal(expectedValues.length);
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value).to.equal(expectedValues[index]);
                index += 1;
            }
        });
    });

    describe('#`SjlSet#iterator`', function () {
        var values = [1, 2, 3, 4, 5, 6, 6, 5, 4],
            sjlSet = new SjlSet(values);
        it ('should return an iterable object which contains values.', function () {
            var iterator = sjlSet.iterator(),
                value,
                index = 0;
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value).to.equal(values[index]);
                index += 1;
            }
        });
    });

});
/**
 * Created by Ely on 6/21/2014.
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

describe('Sjl Attributable', function () {

    'use strict';

    var Attributable = sjl.package.stdlib.Attributable,
        attributable = new Attributable({
            nullValue:              null,
            undefinedValue:         undefined,
            nonEmptyStringValue:    'hello',
            emptyStringValue:       '',
            nonEmptyNumberValue:    1,
            emptyNumberValue:       0,
            nonEmptyBooleanValue:   true,
            emptyBooleanValue:      false,
            functionValue:       function HelloWorld () {},
            emptyObjectValue:    {},
            nonEmptyObjectValue: {all:{your:{base:{are:{belong:{to:{us:{}}}}}}}},
            emptyArrayValue:     [],
            nonEmptyArrayValue:  [1]
        });

    describe('#`attr` and #`attr`', function () {

        it ('should be able to set and/or get one attribute value.', function () {
            // Set attrib to not `null`
            attributable.attr('nullValue', 'not-null-value');
            expect(attributable.attr('nullValue')).to.equal('not-null-value');

            // Set attrib to `null`
            attributable.attr('nullValue', null);
            expect(attributable.attr('nullValue')).to.equal(null);
        });

        it ('should be able to set and/or get multiple attributes in one call.', function () {
            var keysBeingUsed = ['nullValue', 'emptyStringValue', 'nonEmptyBooleanValue'],
                originalValues = attributable.attr(['nullValue', 'emptyStringValue', 'emptyBooleanValue']),
                nonOriginalValues = {
                    nullValue: 'not-null-value',
                    emptyStringValue: 'non-empty-string-value',
                    emptyBooleanValue: true
                },
                returnedValues;

            // Verify original values were returned
            expect(originalValues['nullValue']).to.equal(null);
            expect(sjl.classOfIs(originalValues['emptyStringValue'], 'String')
                && originalValues.emptyStringValue.length === 0).to.equal(true);
            expect(originalValues.emptyBooleanValue).to.equal(false);

            // Set multiple attributes
            attributable.attr(nonOriginalValues);

            // Get multiple attribute values
            returnedValues = attributable.attr(keysBeingUsed);

            // Verify values were set properly on attributable
            keysBeingUsed.forEach(function (key) {
                    expect(returnedValues[key]).to.equal(attributable.attr(key));
                });

            // Reset attributable object
            attributable.attr(originalValues);

        });

    });

});

// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    var sjl = require('./../../src/sjl/sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl Extendable', function () {

    'use strict';

    var Extendable = sjl.package.stdlib.Extendable,
        Iterator = sjl.package.stdlib.Iterator;

    it ('should create an extendable class', function () {
        var extendable = new Extendable();
        expect(extendable instanceof Extendable).to.equal(true);
        extendable = null;
    });

    it ('should have an `extend` function', function () {
        expect(typeof Extendable.extend).to.equal('function');
    });

    // Extendable
    it ('should be extendable', function () {
        // sjl.Iterator extends sjl.Extendable
        var iterator = new Iterator();
        expect(iterator instanceof Iterator).to.equal(true);
        iterator = null;
    });

    // Extendable family
    it ('it\'s extended family should be extendable', function () {
        // New Iterator classes
        var NewIterator = Iterator.extend(function NewIterator() {}, {somemethod: function () {}}),
            newIterator = new NewIterator(),
            NewNewIterator = NewIterator.extend(function NewNewIterator() {}, {somemethod: function () {}}),
            newNewIterator = new NewNewIterator();

        // Test new classes
        expect(newIterator instanceof NewIterator).to.equal(true);
        expect(newNewIterator instanceof NewNewIterator).to.equal(true);
    });

});
