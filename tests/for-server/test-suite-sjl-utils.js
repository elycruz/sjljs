// Make test suite directly interoperable with the browser
if (typeof window === 'undefined' && typeof chai === 'undefined') {
    var chai = require('chai');
    require('./../../sjl.js');
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
        truthyKeysForMultipleTypes = {
            nullValue:              ['String', 'Function', 'Null'],
            undefinedValue:         ['String', 'Undefined', 'Number'],
            nonEmptyStringValue:    ['Function', 'String', 'Number'],
            emptyStringValue:       ['Object', 'Function', 'String'],
            nonEmptyNumberValue:    ['Function', 'String', 'Number'],
            emptyNumberValue:       ['Function', 'Number', 'String'],
            nonEmptyBooleanValue:   ['Boolean'],
            emptyBooleanValue:      ['Boolean', 'Function'],
            functionValue:          ['Function', 'Boolean'],
            emptyObjectValue:       ['Object', 'String'],
            nonEmptyObjectValue:    ['Object'],
            emptyArrayValue:        ['Function', 'Object', 'Number', 'Array'],
            nonEmptyArrayValue:     ['Function', 'Object', 'Array', 'Number']
        },
        falsyKeysForMultipleTypes = {
            nullValue:              ['String', 'Function'],
            undefinedValue:         ['String', 'Number'],
            nonEmptyStringValue:    ['Function', 'Number'],
            emptyStringValue:       ['Object', 'Function'],
            nonEmptyNumberValue:    ['Function', 'String'],
            emptyNumberValue:       ['Function', 'String'],
            nonEmptyBooleanValue:   ['Number'],
            emptyBooleanValue:      ['Function'],
            functionValue:          ['Boolean'],
            emptyObjectValue:       ['String'],
            nonEmptyObjectValue:    ['Function'],
            emptyArrayValue:        ['Function', 'Object', 'Number'],
            nonEmptyArrayValue:     ['Function', 'Object', 'Number']
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

    describe('#`issetObjKey`', function () {
        var obj = objForIssetAndEmptyChecks,
            evaledObj = returnedObjWithEvaledValues(objForIssetAndEmptyChecks);

        // Falsy values
        ['nullValue', 'undefinedValue'].forEach(function (key) {
            it('should return false for value "' + obj[key] + '" of type "'
            + sjl.classOf(evaledObj[key]) + '".', function () {
                expect(sjl.issetObjKey(evaledObj, key)).to.equal(false);
            });
        });

        // Truthy values
        Object.keys(obj).forEach(function (key) {
            if (['nullValue', 'undefinedValue'].indexOf(key) > -1) return;
            it('should return true for value "' + obj[key] + '" of type "'
            + sjl.classOf(evaledObj[key]) + '".', function () {
                expect(sjl.issetObjKey(evaledObj, key)).to.equal(true);
            });
        });
    });

    describe('#`isEmptyObjKeyOrNotOfType` and #`isEmptyObjKey`', function () {
        var obj = objForIssetAndEmptyChecks,
            evaledObj = returnedObjWithEvaledValues(objForIssetAndEmptyChecks);

        // Ensure legacy alias for function
        expect(sjl.hasOwnProperty('isEmptyObjKey') && sjl.classOfIs(sjl.isEmptyObjKey, 'Function')).to.equal(true);

        // Truthy values
        ['nullValue', 'undefinedValue', 'emptyNumberValue', 'emptyObjectValue', 'emptyBooleanValue', 'emptyArrayValue']
        .forEach(function (key) {
            it('should return true for value "' + obj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when no `type` param is passed in.', function () {
                expect(sjl.isEmptyObjKeyOrNotOfType(evaledObj, key)).to.equal(true);
            });
        });

        // Falsy values
        ['nonEmptyNumberValue', 'nonEmptyBooleanValue', 'nonEmptyStringValue', 'nonEmptyArrayValue', 'nonEmptyObjectValue']
        .forEach(function (key) {
            it('should return `false` for value "' + obj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when no `type` param is passed in.', function () {
                expect(sjl.isEmptyObjKeyOrNotOfType(evaledObj, key)).to.equal(false);
            });
        });

        // Truthy values
        ['nullValue', 'undefinedValue', 'emptyNumberValue', 'emptyObjectValue', 'emptyBooleanValue', 'emptyArrayValue']
        .forEach(function (key) {
            it('should return true for value "' + obj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when `type` params are passed in.  Passed in type params: [' + falsyKeysForMultipleTypes[key].join(',') + ']', function () {
                expect(sjl.isEmptyObjKeyOrNotOfType(evaledObj, key, falsyKeysForMultipleTypes[key])).to.equal(true);
            });
        });

        // Falsy values
        ['nonEmptyNumberValue', 'nonEmptyBooleanValue', 'nonEmptyStringValue', 'nonEmptyArrayValue', 'nonEmptyObjectValue']
        .forEach(function (key) {
            it('should return `false` for value "' + obj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when  `type` params are passed in.  Passed in type params: [' + truthyKeysForMultipleTypes[key].join(',') + ']', function () {
                expect(sjl.isEmptyObjKeyOrNotOfType(evaledObj, key, truthyKeysForMultipleTypes[key])).to.equal(false);
            });
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
            '" when value is set and comparison type(s) are "[' + truthyKeysForMultipleTypes[key].join(',') + ']" and passed in as an array.', function () {
                expect(sjl.issetAndOfType.call(sjl, evaledObj[key], truthyKeysForMultipleTypes[key])).to.equal(true);
            });
        });

        // Perform falsy tests for array of types
        keys.forEach(function (key) {
            it('should return false for value "' + refObj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when value is not set or comparison type(s) are "[' + falsyKeysForMultipleTypes[key].join(',') + ']" and passed in as an array.', function () {
                expect(sjl.issetAndOfType.call(sjl, evaledObj[key], falsyKeysForMultipleTypes[key])).to.equal(false);
            });
        });

        // -------------------------------------------------------------------------------------------------------
        // Tests for key values when passing in an array of types
        // -------------------------------------------------------------------------------------------------------

        // Perform truthy tests when passing in one or more types
        truthyKeys.forEach(function (key) {
            it('should return true for value "' + refObj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when value is set and of given comparison type(s) "[' + truthyKeysForMultipleTypes[key].join(',') + ']" and passed in as separate params.', function () {
                expect(sjl.issetAndOfType.apply(sjl, [evaledObj[key]].concat(truthyKeysForMultipleTypes[key]))).to.equal(true);
            });
        });

        // Perform falsy tests when passing in one or more types
        keys.forEach(function (key) {
            it('should return false for value "' + refObj[key] + '" of type "' + sjl.classOf(evaledObj[key]) +
            '" when value is not set or value is not of given comparison type(s) "[' + falsyKeysForMultipleTypes[key].join(',') + ']" and passed in as separate params.', function () {
                expect(sjl.issetAndOfType.apply(sjl, [evaledObj[key]].concat(falsyKeysForMultipleTypes[key]))).to.equal(false);
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