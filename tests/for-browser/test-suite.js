/**
 * Created by Ely on 6/21/2014.
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

describe('Sjl Attributable', function () {

    "use strict";

});

// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    require('./../../sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl Extendable', function () {

    "use strict";

    it ('should create an extendable class', function () {
        var extendable = new sjl.Extendable();
        expect(extendable instanceof sjl.Extendable).to.equal(true);
        extendable = null;
    });

    it ('should have an `extend` function', function () {
        expect(typeof sjl.Extendable.extend).to.equal('function');
    });

    // Extendable
    it ('should be extendable', function () {
        // sjl.Iterator extends sjl.Extendable
        var iterator = new sjl.Iterator();
        expect(iterator instanceof sjl.Iterator).to.equal(true);
        iterator = null;
    });

    // Extendable family
    it ('it\'s extended family should be extendable', function () {
        // New Iterator classes
        var NewIterator = sjl.Iterator.extend(function NewIterator() {}, {somemethod: function () {}}),
            newIterator = new NewIterator(),
            NewNewIterator = NewIterator.extend(function NewNewIterator() {}, {somemethod: function () {}}),
            newNewIterator = new NewNewIterator();

        // Test new classes
        expect(newIterator instanceof NewIterator).to.equal(true);
        expect(newNewIterator instanceof NewNewIterator).to.equal(true);
    });

    // Classes from string name
    it ('should be able to create a subclass from a string name', function () {
        var HelloWorld = sjl.Extendable.extend('HelloWorld',
            {sayHello: function () {}});
        expect(sjl.classOfIs(HelloWorld, 'Function')).to.equal(true);
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
    require('./../../sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl Input', function () {

    "use strict";

    describe('Should have the appropriate interface', function () {
        var input = new sjl.Input(),
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
    require('./../../sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl InputFilter', function () {

    "use strict";

    describe ('Should have the appropriate interface', function () {
        var inputFilter = new sjl.InputFilter();
        var methods = [
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
        expect (typeof sjl.InputFilter.factory).to.equal('function');
    });

    describe ('Should create an auto-populated instance via it\'s static method "factory"', function () {
        var inputFilter = sjl.InputFilter.factory({
            inputs: {
                id: {
                    validators: [
                        new sjl.RegexValidator({pattern: /^\d{1,20}$/})
                    ]
                },
                // @todo fix the required attribute within the `InputFilter` class as it is overriding populated
                // values and forcing validation to be skipped
                alias: {
                    validators: [
                        new sjl.RegexValidator({pattern: /^[a-z\-_\d]{1,55}$/i})
                    ]
                }
            }
        });

        it ('should have 2 new created inputs', function () {
            expect(Object.keys(inputFilter.getInputs()).length).to.equal(2);
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

    describe ('It should have It\'s set functions set', function () {
        var funcNames = ['extend']; // 'intersection', 'merge', 'restrict', 'subtract', 'union'];

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
                    obj: {a: 'A', b: 'B'}, str: "unitee1"
                },
                unitee2 = {
                    func: function otherFunc() { }, num: 456, bln: true,
                    obj: {c: 'C', d: 'D'}, str: "unitee2"
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
    require('./../../sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl#`namespace`', function () {

    "use strict";

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
        evaluatedValues.push(evaluated)
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
    require('./../../sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl Reflection', function () {

    "use strict";

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
            "([])":         sjl.classOf( []        ),
            "(true)":       sjl.classOf( true      ),
            "(1)":          sjl.classOf( 1         ),
            "({})":         sjl.classOf( {}        ),
            "('')":         sjl.classOf( ''        ),
            "(null)":       sjl.classOf( null      ),
            "(undefined)":  sjl.classOf( undefined ),
            "(function hello () {})":   sjl.classOf( (function hello() {}) )
        };

        Object.keys(dataTypeClassStrings).forEach(function (x) {
            it('should return true for alias "' +
                dataTypeClassStrings[x] +
                '" when checking "' + x +'"', function () {
                expect(

                    sjl.classOfIs(eval(x), sjl.classOf(eval(x)))

                ).to.equal(true);
            });
        });

    });

});

// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    require('./../../sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe ('Sjl String', function () {

    "use strict";

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
// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    require('./../../sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl Utils', function () {

    "use strict";

    describe('#`argsToArray`', function () {

        var helloFunc = function hello () {},
            helloArray = ["a", "b", "c"];

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
        })

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

    describe('#`empty`', function () {

        function makeEmptyTestsForValueMap(valMap, retValString) {
            Object.keys(valMap).forEach(function (key) {
                it('should return ' + retValString + ' for `' + key + '`', function () {
                    expect(sjl.empty(valMap[key])).to.equal(eval(retValString));
                });
            });
        }

        var emptyValueMap = {
                "0 value": 0,
                "null value": null,
                "undefined value": undefined,
                "empty string": "",
                "empty object": {},
                "empty array": []
            },

            nonEmptyValueMap = {
                "number other than zero": 1,
                "negative number": -1,
                "true value": true,
                "non-empty object": {a: 'b'},
                "non-empty array": [1],
                "non-empty string": "0"
            };

        // empty Should return true for empty values; I.e., 0, null, undefined, "", {}, []
        it('should return true for all ' +
            'empty values (0, null, undefined, "", {}, [])', function () {
            expect(sjl.empty(0, null, undefined, "", {}, [])).to.equal(true);
        });

        // Should return false for each in empty values
        makeEmptyTestsForValueMap(emptyValueMap, "true");

        // empty Should return false for all non-empty values
        it('should return false for all passed in non-empty ' +
            'values: [1], {hello: "world"}, "0", -1, true, 1', function () {
            expect(sjl.empty([1], {hello: "world"}, "0", -1, true, 1)).to.equal(false);
        });

        // Should return false for each in non-empty values
        makeEmptyTestsForValueMap(nonEmptyValueMap, "false");

    });

});
/**
 * Created by edelacruz on 7/28/2014.
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

describe('Sjl Validator NS', function () {

    "use strict";

    describe('#`sjl.RegexValidator`', function () {

        function regexTest(keyValMap, validator, expected) {
            var key, value, regex;
            for (key in keyValMap) {
                value = keyValMap[key];
                regex = new RegExp(key);
                validator.setPattern(regex);
                it('should return ' + expected + ' when testing "' + key + '" with "' + value + '".', function () {
                    expect(validator.isValid(value)).to.equal(expected);
                });
            }
        }

        var truthyMap = {
                '/^\\d+$/': 199, // Unsigned Number
                '/^[a-z]+$/': 'abc', // Alphabetical
                '^(:?\\+|\\-)?\\d+$': '-100' // Signed Number
            },
            falsyMap = {
                '/^\\d+$/': '-199edd1', // Unsigned Number
                '/^[a-z]+$/': '0123a12bc', // Alphabetical
                '^(:?\\+|\\-)?\\d+$': '-10sd0e+99' // Signed Number
            },
            validator = new sjl.RegexValidator();

        // Run tests
        regexTest(truthyMap, validator, true);
        regexTest(falsyMap, validator, false);

    });

    describe('#`sjl.InRangeValidator`', function () {

        function inRangeTest(keyValMap, validator, expected) {
            var key, config, min, max, value;
            for (key in keyValMap) {
                config = keyValMap[key];
                validator.setOptions(config);
                min = validator.getMin();
                max = validator.getMax();
                value = validator.getValue();
                it('should return ' + expected + ' when testing for a ' +
                    'Number within range {min: ' + min + ', max: ' + max + '} with value: ' + value, function () {
                    expect(validator.isValid(value)).to.equal(expected);
                });
            }
        }

        var validator = new sjl.InRangeValidator(),
            truthyMap = {
                config1: {
                    min: 0,
                    max: 100,
                    value: 99
                },
                config2: {
                    min: -0,
                    max: 1,
                    value: 0
                },
                config3: {
                    min: -1,
                    max: 1,
                    value: 0
                }
            },
            falsyMap = {
                config1: {
                    min: 0,
                    max: 100,
                    value: 99e5
                },
                config2: {
                    min: -0,
                    max: 1,
                    value: 11
                },
                config3: {
                    min: -1,
                    max: 1,
                    value: 100
                }
            };

        inRangeTest(truthyMap, validator, true);
        inRangeTest(falsyMap, validator, false);
    });

    describe('#`sjl.ValidatorChain`', function () {
        var chain = new sjl.ValidatorChain({
            validators: [
                new sjl.InRangeValidator({min: 0, max: 100}),
                new sjl.RegexValidator({pattern: /^\d+$/})
            ]
        });

        it ('should have the appropriate interface', function () {
            var chain = new sjl.ValidatorChain(),
                methods = ['isValid', 'addValidator', 'addValidators', 'getMessages'],
                method;
            for (method in methods) {
                if (methods.hasOwnProperty(method)) {
                    method = methods[method];
                    expect(typeof chain[method]).to.equal('function');
                }
            }
        });

        // @todo explode this definition. It should be a separated into a definition per method test (defined this way it is due to shortness of time;  e.g., addValidator, addValidators, and constructor
        it('should be able to add validators (one or many, also via constructor ' +
            'and via `addValidator` and `addValidators`).', function () {
            var chain1 = new sjl.ValidatorChain({
                    validators: [new sjl.InRangeValidator()]
                }),
                chain2 = new sjl.ValidatorChain({
                    validators: [
                        new sjl.InRangeValidator({min: 0, max: 100}),
                        new sjl.RegexValidator({pattern: /^\d+$/})
                    ]
                }),
                chain3 = new sjl.ValidatorChain(),
                chain4 = new sjl.ValidatorChain();

            // Add multiple validators
            chain3.addValidators([
                new sjl.InRangeValidator({min: 0, max: 100}),
                new sjl.RegexValidator({pattern: /^\d+$/})
            ]);
            chain3.addValidator(new sjl.InRangeValidator());

            // Add validators one by one
            chain4.addValidator(new sjl.InRangeValidator());
            chain4.addValidator(new sjl.InRangeValidator());
            chain4.addValidator(new sjl.InRangeValidator());
            chain4.addValidator(new sjl.InRangeValidator());

            // Validate
            expect(chain1.getValidators().length).to.equal(1);
            expect(chain2.getValidators().length).to.equal(2);
            expect(chain3.getValidators().length).to.equal(3);
            expect(chain4.getValidators().length).to.equal(4);
        });

        it('should return true when checking value `100` for a range ' +
            'between 0-100 (inclusive) and should have zero error messages.', function () {
            var messages = chain.getMessages();
            expect(chain.isValid(100)).to.equal(true);
            expect(messages.length).to.equal(0);
        });

        it('should return true when checking value `99` for a range ' +
            'between 0-100 (exclusive) and should return 0 messages for each validator.', function () {
            var messages = chain.getMessages();
            expect(chain.isValid(99)).to.equal(true);
            expect(messages.length).to.equal(0);
        });

    });
});
