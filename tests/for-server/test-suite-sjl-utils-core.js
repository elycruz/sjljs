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
