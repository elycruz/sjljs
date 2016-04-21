describe('#sjl.argsToArray', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    it('should return an array for an arguments object.', function () {
        expect(Array.isArray(sjl.argsToArray(arguments))).to.equal(true);
    });

    it('should return an array for an array.', function () {
        var subjectArray = [['hello'].true, function () {}, {}, 'Hello World'],
            operationResult = sjl.argsToArray(subjectArray);
        expect(Array.isArray(operationResult)).to.equal(true);
    });

    it('should return an array of the exact same length as the array like object passed (Array|Arguments).', function () {
        var subjectArray = [['hello'].true, function () {
            }, {}, 'Hello World'],
            operationResult = sjl.argsToArray(subjectArray);
        expect(operationResult.length).to.equal(subjectArray.length);
    });

    it('Returned array should contain passed in values.', function () {
        var operationResult = null,
            subjectParams = [['hello'], true, function () {}, {}, 'Hello World'];

        // Get values to test
        (function () {
            operationResult = sjl.argsToArray(arguments);
        })
            .apply(null, subjectParams);

        // Test operation result
        operationResult.forEach(function (value, i) {
            expect(value).to.equal(subjectParams[i]);
        });
    });

});

/**
 * Created by elydelacruz on 4/16/16.
 */

describe ('#sjl.classOf', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    // Test generic-types/primitives
    [
        [[],                Array.name,     '[]'],
        [true,              Boolean.name,   'true'],
        [false,             Boolean.name,   'false'],
        [function () {},    Function.name,  'function () {}'],
        [{},                Object.name,    '{}'],
        [99,                Number.name,    'new Map()'],
        [null,              'Null',         'null'],
        [undefined,         'Undefined',    'undefined']
    ]
    .forEach(function (args) {
        it ('should return "' + args[1] + '" for value `' + args[2] + '`.', function () {
            expect(sjl.classOf(args[0])).to.equal(args[1]);
        });
    });

    it ('should return "Undefined" when no value is passed.', function () {
        expect(sjl.classOf()).to.equal('Undefined');
    });

});

/**
 * Created by elydelacruz on 4/16/16.
 */

describe('#sjl.classOfIs', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    describe('truthy checks', function () {
        // Test generic-types/primitives
        [
            [[], Array.name, '[]'],
            [true, Boolean.name, 'true'],
            [false, Boolean.name, 'false'],
            [function () {
            }, Function.name, 'function () {}'],
            [99, Number.name, '99'],
            [{}, Object.name, '{}'],
            [null, 'Null', 'null'],
            [undefined, 'Undefined', 'undefined']
        ]
            .forEach(function (args) {
                it('should return `true` for value args [' + args[2] + ', ' + args[1] + '] .', function () {
                    expect(sjl.classOfIs(args[0], args[1])).to.equal(true);
                });
            });
    });

    describe('falsy checks', function () {
        // Test generic-types/primitives for non-matching type checks
        [
            [[], Boolean.name, '[]'],
            [true, Array.name, 'true'],
            [false, Array.name, 'false'],
            [function () {}, Number.name, 'function () {}'],
            [99, Function.name, '99'],
            [{}, 'Null', '{}'],
            [null, Object.name, 'null'],
            [undefined, Array.name, 'undefined']
        ]
            .forEach(function (args) {
                it('should return `false` for value args [' + args[2] + ', ' + args[1] + '] .', function () {
                    expect(sjl.classOfIs(args[0], args[1])).to.equal(false);
                });
            });
    });

    it('should throw a type error when no `type` parameter is passed in or when no types are passed in.', function () {
        var caughtError = false;
        try {
            sjl.classOfIs();
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

});

/**
 * Created by elydelacruz on 4/16/16.
 */

describe('#sjl.classOfIsMulti', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    describe('truthy checks', function () {
        // Test generic-types/primitives
        [
            [[], Function, Array, '[]'],
            [true, String, Boolean, 'true'],
            [false, Function, Boolean, 'false'],
            [function () {
            }, Boolean, Function, 'function () {}'],
            [99, Boolean, Number, '99'],
            [{}, Number, Object, '{}'],
            [null, String, 'Null', 'null'],
            [undefined, Array, 'Undefined', 'undefined']
        ]
            .forEach(function (args) {
                it('should return `true` for value args [' + args.pop() + ', ' + args[1] + '] .', function () {
                    var result = sjl.classOfIsMulti.apply(sjl, args);
                    expect(result).to.equal(true);
                });
            });
    });

    describe('falsy checks', function () {
        // Test generic-types/primitives for non-matching type checks
        [
            [[], Boolean, '[]'],
            [true, Array, 'true'],
            [false, Array, 'false'],
            [function () {
            }, Number, 'function () {}'],
            [99, Function, '99'],
            [{}, 'Null', '{}'],
            [null, Object, 'null'],
            [undefined, Array, 'undefined']
        ]
            .forEach(function (args) {
                it('should return `false` for value args [' + args.pop() + ', ' + args[1] + '] .', function () {
                    var result = sjl.classOfIsMulti.apply(sjl, args);
                    //console.log(args, result);
                    expect(result).to.equal(false);
                });
            });
    });

    it('should throw a type error when no `type` parameter is passed in or when no types are passed in.', function () {
        expect(sjl.classOfIsMulti()).to.be.false();
    });

});

describe('#sjl.defineSubClass', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

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

    var Extendable = sjl.defineSubClass(Function, function Extendable() {
        }, methods1, statics1),
        SomeConstructor = sjl.defineSubClass(Extendable, function SomeConstructor() {
        }, methods2, statics2);

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
        var SubClass = SomeConstructor.extend(function SubClass() {
        }, methods3, statics3);

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

    describe('returned subclass via parent\'s `extend` method with constructor via `constructor` key', function () {

        // Subclass from extend method via with constructor via constructor key
        var SubClass = SomeConstructor.extend(sjl.extend({
            constructor: function SubClass() {
            }
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

/**
 * Created by elydelacruz on 4/16/16.
 * @note This method will be deprecate in next version of library (v6.0.0)
 */
describe('#sjl.empty', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var emptyTestArgs = [
        [[], '[]'],
        [{}, '{}'],
        ['', '""'],
        [0, '0'],
        [false, 'false'],
        [null, 'null'],
        [undefined, 'undefined']
    ],
        emptyValueReps = emptyTestArgs.map(function (args) {
            return args[1];
        }),
        nonEmptyTestArgs = [
            [['hello'], '["hello"]'],
            [{someProp: 'some-prop-value'}, '{someProp: "some-prop-value"}'],
            ['hello-world', 'hello-world'],
            [1, '1'],
            [-1, '-1'],
            [true, 'true'],
            [function () {}, 'function () {}']
        ],
        nonEmptyValueReps = emptyTestArgs.map(function (args) {
            return args[1];
        });

    it ('should return true for empty values [' + emptyValueReps.join(',') + '].', function () {
        emptyTestArgs.forEach(function (args) {
            expect(sjl.empty(args[0])).to.be.true();
        });
    });

    it ('should return false for non empty values [' + nonEmptyValueReps.join(',') + '].', function () {
        nonEmptyTestArgs.forEach(function (args) {
            expect(sjl.empty(args[0])).to.be.false();
        });
    });

    it ('should return true when no params are passed in.', function () {
        expect(sjl.empty()).to.equal(true);
    });

});

/**
 * Created by Ely on 4/15/2016.
 * File: test-sjl-restArgs.js
 */
describe('#sjl.extractFromArrayAt', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    describe('When passing in only `array` and `index`.', function () {
        var testArray = ['a', 'b', 'c', 'd', 'e'],
            stringOfTestArray = '[' + testArray.join(',') + ']';

        // Loop through testArray and generate tests based on current element in loop
        testArray.forEach(function (elm, index, list) {
            var result = sjl.extractFromArrayAt(list, index),
                extractedValue = result[0],
                splicedArray = result[1];
            it('should extract "' + list[index] + '" from `' + stringOfTestArray + '`.', function () {
                expect(extractedValue).to.equal(list[index]);
            });
            it('should return an array with the extracted value, and the newly spliced array in it.', function () {
                expect(splicedArray).to.not.equal(list);
                expect(splicedArray.length).to.not.equal(list.length);
                expect(splicedArray.indexOf(extractedValue)).to.equal(-1);
                expect(result.length).to.equal(2);
            });
            // console.log(result);
        });
    });

    describe('When passing in `array`, `index`, and `type`.', function () {

        // Array<[constructor, value, expected-outcome]>
        // @type {Array<[Constructor, *, Boolean]>}
        var testArray = [
                [Array, ['hello']],
                [Boolean, true],
                [Function, function () {}],
                [Object, {someObjectName: 'some-object-name'}],
                [String, 'hello-world']
            ],
            testArrayValues = testArray.map(function (elm, index, list) {
                return elm[1];
            }),
            testArrayTypes = testArray.map(function (elm, index, list) {
                return elm[0];
            }),
            stringOfTestArray = '[' + testArray.join(',') + ']';

        // Loop through testArray and generate tests based on current element in loop
        testArrayTypes.forEach(function (type, index) {
            var result = sjl.extractFromArrayAt(testArrayValues, index, type),
                extractedValue = result[0],
                splicedArray = result[1];
            it('should extract value from array if it is of the passed in type.', function () {
                expect(extractedValue).to.equal(testArrayValues[index]);
            });
            it('should extract "' + testArrayValues[index] + '" from `' + stringOfTestArray + '`.', function () {
                expect(extractedValue).to.equal(testArrayValues[index]);
            });
            it('should return an array with the extracted value, and the newly spliced array in it.', function () {
                expect(splicedArray).to.not.equal(testArrayValues);
                expect(splicedArray.length).to.not.equal(testArrayValues.length);
                expect(splicedArray.indexOf(extractedValue)).to.equal(-1);
                expect(result.length).to.equal(2);
            });
            // console.log(result);
        });
    });

    describe('When value to extracts `type` doesn\'t match passed in `type`.', function () {
        // Array<[constructor, value, expected-outcome]>
        // @type {Array<[Constructor, *, Boolean]>}
        var testArray = [
                [Array, ['hello']],
                [Boolean, true],
                [Function, function () {
                }],
                [Object, {someObjectName: 'some-object-name'}],
                [String, 'hello-world']
            ],
            testArrayValues = testArray.map(function (elm, index, list) {
                return elm[1];
            }),
            testArrayTypes = testArray.map(function (elm, index, list) {
                return elm[0];
            });

        it('should return null for values that do not match the type value in an array.', function () {
            testArrayTypes.reverse().forEach(function (type, index) {
                var result = sjl.extractFromArrayAt(testArrayValues, index, type),
                    extractedValue = result[0],
                    splicedArray = result[1];
                it('should return `null` when value to extract doesn\'t match .', function () {
                    expect(extractedValue).to.equal(null);
                });
                it('should return a new unspliced array when value to extract doesn\'t match passed in type.', function () {
                    expect(splicedArray).to.not.equal(testArrayValues);
                    expect(splicedArray.length).to.equal(testArrayValues.length);
                    expect(result.length).to.equal(2);
                });
            });
        });
    });

    describe('When passing in `array`, `index`, `type`, and `makeCopyOfArray`.', function () {
        // Array<[constructor, value, expected-outcome]>
        // @type {Array<[Constructor, *, Boolean]>}
        var testArray = [
                [Array, ['hello']],
                [Boolean, true],
                [Function, function () {
                }],
                [Object, {someObjectName: 'some-object-name'}],
                [String, 'hello-world']
            ],
            testArrayValues = testArray.map(function (elm, index, list) {
                return elm[1];
            }),
            testArrayTypes = testArray.map(function (elm, index, list) {
                return elm[0];
            });


        // Loop through testArray and generate tests based on current element in loop
        testArrayTypes.forEach(function (type, index) {
            var result = sjl.extractFromArrayAt(testArrayValues, index, type, true),
                extractedValue = result[0],
                splicedArray = result[1];
            it('should return an array with the extracted value, and the newly spliced array in it.', function () {
                expect(splicedArray).to.not.equal(testArrayValues);
                expect(splicedArray.length).to.not.equal(testArrayValues.length);
                expect(splicedArray.indexOf(extractedValue)).to.equal(-1);
                expect(result.length).to.equal(2);
            });
            // console.log(result);
        });

        // Loop through testArray and generate tests based on current element in loop
        testArrayTypes.forEach(function (type, index) {
            var result = sjl.extractFromArrayAt(testArrayValues, index, type, false),
                extractedValue = result[0],
                splicedArray = result[1];
            it('should return an array with the extracted value, and the spliced array in it.', function () {
                expect(splicedArray).to.equal(testArrayValues);
                expect(splicedArray.indexOf(extractedValue)).to.equal(-1);
                expect(testArrayValues.indexOf(extractedValue)).to.equal(-1);
                expect(result.length).to.equal(2);
            });
            // console.log(result);
        });
    });

});



describe('#sjl.getValueFromObj', function () {

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

        objKeys = Object.keys(objToTest);

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

/**
 * Created by elydelacruz on 4/16/16.
 */
describe('#sjl.isEmpty', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var emptyTestArgs = [
        [[], '[]'],
        [{}, '{}'],
        ['', '""'],
        [0, '0'],
        [false, 'false'],
        [null, 'null'],
        [undefined, 'undefined']
    ],
        emptyValueReps = emptyTestArgs.map(function (args) {
            return args[1];
        }),
        nonEmptyTestArgs = [
            [['hello'], '["hello"]'],
            [{someProp: 'some-prop-value'}, '{someProp: "some-prop-value"}'],
            ['hello-world', 'hello-world'],
            [1, '1'],
            [-1, '-1'],
            [true, 'true'],
            [function () {}, 'function () {}']
        ],
        nonEmptyValueReps = emptyTestArgs.map(function (args) {
            return args[1];
        });

    it ('should return true for empty values [' + emptyValueReps.join(',') + '].', function () {
        emptyTestArgs.forEach(function (args) {
            expect(sjl.isEmpty(args[0])).to.be.true();
        });
    });

    it ('should return false for non empty values [' + nonEmptyValueReps.join(',') + '].', function () {
        nonEmptyTestArgs.forEach(function (args) {
            expect(sjl.isEmpty(args[0])).to.be.false();
        });
    });

    it ('should return true when no params are passed in.', function () {
        expect(sjl.isEmpty()).to.equal(true);
    });

});

/**
 * Created by elydelacruz on 4/16/16.
 */
describe('#sjl.isEmptyObj', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    it ('should return true for empty objects.', function () {
        expect(sjl.isEmptyObj({})).to.be.true();
    });

    it ('should return false for non-empty objects.', function () {
        expect(sjl.isEmptyObj({hello: 'world'})).to.be.false();
    });

    // Check for result of checking `null` and `undefined`
    [
        [null, 'null'],
        [undefined, 'undefined']
    ]
        .forEach(function (args) {
            // Pass through or check error type
            var caughtError = false;
            try {
                sjl.classOfIs(args[0]);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    it ('should throw an `TypeError` when called with no params.', function () {
        var caughtError = false;
        try {
            sjl.isEmptyObj();
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

});

/**
 * Created by elydelacruz on 4/16/16.
 */
describe('#sjl.isEmptyOrNotOfType', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    function randNum(start, end) {
        return Math.floor(Math.random() * end + start);
    }

    function generateRandomPrimitiveName (notName) {
        var name = notName,
            names = [
                String.name,
                Boolean.name,
                Function.name,
                Number.name,
                Object.name
            ],
            namesLen = names.length;

        if (typeof notName === 'undefined') {
            name = names[randNum(0, namesLen)];
        }
        while (name === notName) {
            name = names[randNum(0, namesLen)];
        }
        return name;
    }

    var emptyTestArgs = [
            [[], '[]', Array],
            [{}, '{}', Object],
            ['', '""', String],
            [0, '0', Number],
            [false, 'false', Boolean],
            [null, 'null', 'Null'],
            [undefined, 'undefined', 'Undefined']
        ],
        emptyValueReps = emptyTestArgs.map(function (args) {
            return args[1];
        }),
        nonEmptyTestArgs = [
            [['hello'], '["hello"]', Array],
            [{someProp: 'some-prop-value'}, '{someProp: "some-prop-value"}', Object],
            ['hello-world', 'hello-world', String],
            [1, '1', Number],
            [-1, '-1', Number],
            [true, 'true', Boolean],
            [function () {}, 'function () {}', Function]
        ],
        nonEmptyValueReps = emptyTestArgs.map(function (args) {
            return args[1];
        });

    it('should return true for empty values [' + emptyValueReps.join(',') + '].', function () {
        emptyTestArgs.forEach(function (args) {
            expect(sjl.isEmptyOrNotOfType(args[0], args[2])).to.be.true();
        });
    });

    it('should return false for non empty values [' + nonEmptyValueReps.join(',') + '].', function () {
        nonEmptyTestArgs.forEach(function (args) {
            expect(sjl.isEmptyOrNotOfType(args[0], args[2])).to.be.false();
        });
    });

    it ('should return false for values that are not empty and match the passed in `type`.', function () {
        nonEmptyTestArgs.forEach(function (args) {
            expect(sjl.isEmptyOrNotOfType(args[0], args[2])).to.be.false();
        });
    });

    it ('should return true for values that do not match the passed `type`.', function () {
        var argsForTest = JSON.parse(JSON.stringify(nonEmptyTestArgs)).map(function (args) {
            var valueType = sjl.classOf(args[0]);
            args[2] = generateRandomPrimitiveName(valueType);
            return args;
        });
        // Ensure a function case is in the test args since JSON.stringify will
        // remove all properties that have a function value.
        argsForTest.push([function () {}, 'function () {}', String]);

        // Run tests
        argsForTest.forEach(function (args) {
            expect(sjl.isEmptyOrNotOfType(args[0], args[2])).to.be.true();
        });
    });

    it('should return true when no params are passed in.', function () {
        expect(sjl.isEmptyOrNotOfType()).to.equal(true);
    });

});

/**
 * Created by elydelacruz on 4/16/16.
 */
describe ('#sjl.isset', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    it('should return false for null value.', function () {
        expect(sjl.isset(null)).to.equal(false);
    });
    it('should return false for undefined value.', function () {
        expect(sjl.isset(undefined)).to.equal(false);
    });
    it('should return true for a defiend value (1).', function () {
        // Defined values
        [true, false, function () {}, 'hello', {}].forEach(function (value) {
            expect(sjl.isset(value)).to.equal(true);
        });
    });
    it('should return `false` when called without arguments.', function () {
        expect(sjl.isset()).to.be.false();
    });
});

/**
 * Created by elydelacruz on 4/16/16.
 */
describe('#sjl.issetAndOfType', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    it('should return true for values that are `set` and are of the passed `type`.', function () {
        // Args to test
        [
            [['hello'], Array],
            [false, Boolean],
            [function () {
            }, Function],
            ['Hello World', String]
        ]
            .forEach(function (args) {
                expect(sjl.issetAndOfType.apply(sjl, args)).to.equal(true);
            });
    });

    it('should return false for values that are `set` but not of the passed in `type`.', function () {
        // Args to test
        [
            ['hello', Array],
            [['hello'], Boolean],
            [{hello: 'ola'}, Function],
            [function () {
            }, String]
        ]
            .forEach(function (args) {
                expect(sjl.issetAndOfType.apply(sjl, args)).to.equal(false);
            });
    });

    it('should return false for values that are `not-set`.', function () {
        [
            [null, Array],
            [undefined, Boolean],
            [null, Function],
            [undefined, String]
        ]
            .forEach(function (args) {
                expect(sjl.issetAndOfType.apply(sjl, args)).to.equal(false);
            });
    });

    it('should return false for values that are `not-set` or not of `type` passed in.', function () {
        [
            [null, Array],
            [['hello'], Boolean],
            [99, Function],
            [undefined, String]
        ]
            .forEach(function (args) {
                expect(sjl.issetAndOfType.apply(sjl, args)).to.equal(false);
            });
    });

    it('should return `false` when no `type` param is passed in.', function () {
        var argsForTest = [
                [['hello']],
                [false],
                [function () {}],
                ['Hello World']
            ];
        argsForTest.forEach(function (args) {
            expect(sjl.issetAndOfType(args)).to.be.false();
        });
    });

    it('should return false when no arguments are passed in.', function () {
        expect(sjl.issetAndOfType()).to.be.false();
    });

});

/**
 * Created by elydelacruz on 4/16/16.
 */
describe('#sjl.issetMulti', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var falsyArgSets = [
            [null, undefined],
            [null, 'hello', undefined, {}, []],
            [undefined, 'hello', function () {}],
        ],
        truthyArgSets = [
            ['hello', {hello: 'ola'}, function () {}]
        ];
    it ('should return false for calls with any values that are null or undefined.', function () {
        falsyArgSets.forEach(function (args) {
            expect(sjl.issetMulti.apply(sjl, args)).to.equal(false);
        });
    });
    it ('should return true if no values passed in are null or undefined.', function () {
        truthyArgSets.forEach(function (args) {
            expect(sjl.issetMulti.apply(sjl, args)).to.equal(true);
        });
    });
});

/**
 * Created by elydelacruz on 4/16/16.
 */
describe('#sjl.jsonClone', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var argsForTests = [
        [{
            all: {your: {base: {are: {belong: {to: {us: false}}}}}},
            arrayProp1: [],
            arrayProp2: ['how are you'],
            booleanProp: true,
            functionProp: function () {
            },
            numberProp: 99,
            objectProp: {},
            stringProp: 'Hello World'
        }]
    ];

    it('should return a cloned object that conforms to the JSON format.', function () {
        var testSubject = argsForTests[0][0],
            result = sjl.jsonClone(testSubject);

        // Filter to keys for truthy check
        Object.keys(testSubject).filter(function (key) {
                return typeof testSubject[key] !== 'function';
            })
            // Ensure all keys are output by json clone
            .forEach(function (key) {
                expect(result.hasOwnProperty(key)).to.be.true();
            });

        // Ensure no props with function values present
        expect(result.hasOwnProperty('functionProp')).to.be.false();
    });

    it ('should return a syntax error when no params are passed in.', function () {
        var caughtError;
        try {
            sjl.jsonClone();
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(SyntaxError);
    });

});

/**
 * Created by elydelacruz on 4/16/16.
 */
describe('#sjl.lcaseFirst', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var argsForTruthyTests = [
        ['HelloWorld', 'helloWorld'],
        [String.name, 'string'],
        ['world-wide-web', 'world-wide-web'],
        ['99-World-wide-web', '99-world-wide-web'],
        ['#$(*@&#(*$---WORLD', '#$(*@&#(*$---wORLD']
    ];

    it('should return a new string with the first alpha character lower cased.', function () {
        argsForTruthyTests.forEach(function (args) {
            expect(sjl.lcaseFirst(args[0])).to.equal(args[1]);
        });
    });

    it ('should throw a `TypeError` error when no params are passed in' +
        'or when param is not of type `String`.', function () {
        var caughtError;
        try {
            sjl.lcaseFirst();
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
        caughtError = undefined;
        try {
            sjl.lcaseFirst(99);
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

});

/**
 * Created by elydelacruz on 4/16/16.
 */
describe('#sjl.naiveNamespace', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var argsForTests = [
        [{
            all: {your: {base: {are: {belong: {to: {us: false}}}}}},
            arrayProp1: [],
            arrayProp2: ['how are you'],
            booleanProp: true,
            functionProp: function () {},
            numberProp: 99,
            objectProp: {},
            stringProp: 'Hello World'
        }]
    ],
    subject = argsForTests[0][0];

    it ('should be able to fetch any nested value within a nested object.', function () {
        expect(sjl.naiveNamespace('all', subject)).to.equal(subject.all);
        expect(sjl.naiveNamespace('all.your', subject)).to.equal(subject.all.your);
        expect(sjl.naiveNamespace('all.your.base', subject)).to.equal(subject.all.your.base);
    });

    it ('should be able to set a value within nested object.', function () {
        var replacementValue = 'are belong to us',
            oldValue = subject.all.your.base;

        // Replace value
        sjl.naiveNamespace('all.your.base', subject, replacementValue);
        expect(subject.all.your.base).to.equal(replacementValue);

        // Re inject old value
        sjl.naiveNamespace('all.your.base', subject, oldValue);
        expect(subject.all.your.base).to.equal(oldValue);
    });

    it ('should be able to set a value on object.', function () {
        var replacementValue = 'your base are belong to us',
            oldValue = subject.all;

        // Replace value
        sjl.naiveNamespace('all', subject, replacementValue);
        expect(subject.all).to.equal(replacementValue);

        // Re inject old value
        sjl.naiveNamespace('all', subject, oldValue);
        expect(subject.all).to.equal(oldValue);
    });

    it ('should throw a type error when second parameter isn\'t an object or an instance of `Function`.', function () {
        var caughtError;
        try {
            sjl.naiveNamespace('all', 99);
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

    it ('should throw a type error when no params are passed in.', function () {
        var caughtError;
        try {
            sjl.naiveNamespace();
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

});

/**
 * Created by elydelacruz on 4/16/16.
 */
describe('#sjl.notEmptyAndOfType', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    function randNum(start, end) {
        return Math.floor(Math.random() * end + start);
    }

    function generateRandomPrimitiveName (notName) {
        var name = notName,
            names = [
                String.name,
                Boolean.name,
                Function.name,
                Number.name,
                Object.name
            ],
            namesLen = names.length;

        if (typeof notName === 'undefined') {
            name = names[randNum(0, namesLen)];
        }
        while (name === notName) {
            name = names[randNum(0, namesLen)];
        }
        return name;
    }

    var emptyTestArgs = [
            [[], '[]', Array],
            [{}, '{}', Object],
            ['', '""', String],
            [0, '0', Number],
            [false, 'false', Boolean],
            [null, 'null', 'Null'],
            [undefined, 'undefined', 'Undefined']
        ],
        emptyValueReps = emptyTestArgs.map(function (args) {
            return args[1];
        }),
        nonEmptyTestArgs = [
            [['hello'], '["hello"]', Array],
            [{someProp: 'some-prop-value'}, '{someProp: "some-prop-value"}', Object],
            ['hello-world', 'hello-world', String],
            [1, '1', Number],
            [-1, '-1', Number],
            [true, 'true', Boolean],
            [function () {}, 'function () {}', Function]
        ];

    it('should return false for empty values [' + emptyValueReps.join(',') + '] even though they match the passed in `type`.', function () {
        emptyTestArgs.forEach(function (args) {
            expect(sjl.notEmptyAndOfType(args[0], args[2])).to.be.false();
        });
    });

    it ('should return true for values that are not empty and match the passed in `type`.', function () {
        nonEmptyTestArgs.forEach(function (args) {
            expect(sjl.notEmptyAndOfType(args[0], args[2])).to.be.true();
        });
    });

    it ('should return true for values that do not match the passed `type`.', function () {
        var argsForTest = JSON.parse(JSON.stringify(nonEmptyTestArgs)).map(function (args) {
            var valueType = sjl.classOf(args[0]);
            args[2] = generateRandomPrimitiveName(valueType);
            return args;
        });
        argsForTest.forEach(function (args) {
            expect(sjl.notEmptyAndOfType(args[0], args[2])).to.be.false();
        });
    });

    it('should return true when no params are passed in.', function () {
        expect(sjl.notEmptyAndOfType()).to.equal(false);
    });

});

/**
 * Created by Ely on 4/15/2016.
 * File: test-sjl-restArgs.js
 */
describe ('#sjl.restArgs', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    it('should return an array when receiving an `arguments` object.', function () {
        expect(Array.isArray(sjl.restArgs(arguments))).to.be.true();
    });

    it ('should return args from 0 to `end`.', function () {
        (function () {
            var args = arguments,
                restArgs = sjl.restArgs(args, 0, 3);
            restArgs.forEach(function (arg, index) {
                expect(args[index]).to.equal(arg);
            });
            expect(restArgs.length).to.equal(3);
        }('some', 3, 'args', 'here', '.'));
    });

    it ('should return args from 0 to end when no `end` is passed in.', function () {
        (function () {
            var args = arguments,
                restArgs = sjl.restArgs(args, 0);
            restArgs.forEach(function (arg, index) {
                expect(args[index]).to.equal(arg);
            });
            expect(restArgs.length).to.equal(args.length);
        }('some', 3, 'args', 'here', '.'));
    });

    describe ('should work with plain arrays.', function () {
        var testArray = [null, undefined, true, false, function () {}, []];
        it ('should return args from 0 to `end`.', function () {
            var args = testArray,
                restArgs = sjl.restArgs(args, 0, 3);
            restArgs.forEach(function (arg, index) {
                expect(args[index]).to.equal(arg);
            });
            expect(restArgs.length).to.equal(3);
        });

        it ('should return args from 0 to end when no `end` is passed in.', function () {
            var args = testArray,
                restArgs = sjl.restArgs(args, 0);
            restArgs.forEach(function (arg, index) {
                expect(args[index]).to.equal(arg);
            });
            expect(restArgs.length).to.equal(args.length);
        });
    });
});

describe('#sjl.searchObj', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var argsForTests = [
            [{
                all: {your: {base: {are: {belong: {to: {us: false}}}}}},
                arrayProp1: [],
                arrayProp2: ['how are you'],
                booleanProp: true,
                functionProp: function () {},
                numberProp: 99,
                objectProp: {},
                stringProp: 'Hello World'
            }]
        ],
        subject = argsForTests[0][0];

    it ('should be able to search an object by namespace string.', function () {
        expect(sjl.searchObj('all.your.base', subject)).to.equal(subject.all.your.base);
    });

    it ('should be able to search an object by key name.', function () {
        expect(sjl.searchObj('arrayProp2', subject)).to.equal(subject.arrayProp2);
    });

    it ('should return `undefined` for keys that are not found.', function () {
        expect(sjl.searchObj('arrayProp3', subject)).to.be.undefined();
    });
    
    it ('should throw a type error when no parameters are passed in.', function () {
        var caughtError;
        try {
            sjl.searchObj();
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

    it ('should throw a type error when parameter one is not of type `String`.', function () {
        var caughtError;
        try {
            sjl.searchObj(99);
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

    it ('should throw a type error when parameter 2 is not of type `Object` or instance of `Function`.', function () {
        var caughtError;
        try {
            sjl.searchObj('some.prop', 99);
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

});

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



describe('#sjl.throwTypeErrorIfEmpty', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    it('should throw a type error if `value` is empty ([0, null, undefined, [], {}, "", false]).', function () {
        [
            [0, String],
            [null, Function],
            [{}, String],
            [[], Boolean],
            [false, Object]
        ].forEach(function (args) {
            var caughtError;
            try {
                sjl.throwTypeErrorIfEmpty('some.namespace', 'paramName', args[0]);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    });

    it('should throw a type error when `value` is not of passed in type.', function () {
        [
            [99, Array],
            [{helloWorld: 'world'}, Boolean],
            [[1, 2, 3], Function],
            [true, String],
            ['hello-world', Object],
            [function () {
            }, Array]
        ].forEach(function (args) {
            var caughtError;
            try {
                sjl.throwTypeErrorIfEmpty('some.namespace', 'paramName', args[0], args[1]);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });
    });

    it('should throw a type error when `value` is empty or not of passed in `type`.', function () {
        [
            // Not matching types
            [99, Array],
            [{helloWorld: 'world'}, Boolean],
            [[1, 2, 3], Function],
            [true, String],
            ['hello-world', Object],
            [function () {}, Array],

            // Empty values
            [0, Number],
            [[], Array],
            ['', String],
            ['', Function],
            [{}, Object],
            [false, Boolean]
        ]
            .forEach(function (args) {
                var caughtError;
                try {
                    sjl.throwTypeErrorIfEmpty('some.namespace', 'paramName', args[0], args[1]);
                }
                catch (e) {
                    caughtError = e;
                }
                expect(caughtError).to.be.instanceof(TypeError);
            });
    });

    it('should not throw any errors when `value` is not empty and of passed in `type`.', function () {
        [
            [99, Number],
            [{helloWorld: 'world'}, Object],
            [[1, 2, 3], Array],
            [true, Boolean],
            ['hello-world', String],
            [function () {}, Function]
        ]
            .forEach(function (args) {
                var caughtError;
                try {
                    sjl.throwTypeErrorIfEmpty('some.namespace', 'paramName', args[0], args[1]);
                }
                catch (e) {
                    caughtError = e;
                }
                expect(caughtError).to.be.undefined();
            });
    });

});

describe('#sjl.throwTypeErrorIfNotOfType', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    it ('should throw a type error when `value` is not of passed in `type`.', function () {
        [
            [0, String],
            [null, Function],
            [{}, String],
            [[], Boolean],
            [true, Object]
        ].forEach(function (args) {
            var caughtError;
            try {
                sjl.throwTypeErrorIfNotOfType('some.namespace', 'paramName', args[0], args[1]);
            }
            catch(e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    });

    it ('should not throw any errors when `value` is of passed in `type`.', function () {
        [
            [0, Number],
            [null, 'Null'],
            [{}, Object],
            [[], Array],
            [true, Boolean],
            ['', String]
        ].forEach(function (args) {
            var caughtError;
            try {
                sjl.throwTypeErrorIfNotOfType('some.namespace', 'paramName', args[0], args[1]);
            }
            catch(e) {
                caughtError = e;
            }
            expect(caughtError).to.be.undefined();
        });
    });

});

/**
 * Created by elydelacruz on 4/16/16.
 */
describe('#sjl.ucaseFirst', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var argsForTruthyTests = [
        ['helloWorld', 'HelloWorld'],
        [String.name, 'String'],
        ['world-wide-web', 'World-wide-web'],
        ['99-world-wide-web', '99-World-wide-web'],
        ['#$(*@&#(*$---wORLD', '#$(*@&#(*$---WORLD']
    ];

    it('should return a new string with the first alpha character upper cased.', function () {
        argsForTruthyTests.forEach(function (args) {
            expect(sjl.ucaseFirst(args[0])).to.equal(args[1]);
        });
    });

    it ('should throw a `TypeError` error when no params are passed in' +
        'or when param is not of type `String`.', function () {
        var caughtError;
        try {
            sjl.ucaseFirst();
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
        caughtError = undefined;

        try {
            sjl.ucaseFirst(99);
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

});

/**
 * Created by elydelacruz on 4/16/16.
 */
describe('#sjl.unset', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    it ('should remove a property from an object.', function () {
        var helloWorld = {name: 'hello-world-object', message: 'hello-world'};
        expect(sjl.unset(helloWorld, 'message').hasOwnProperty('message')).to.be.false();
    });

    it ('should return true when the removal of the passed in proeprty was successful.', function () {
        var helloWorld = {name: 'hello-world-object', message: 'hello-world'};
        expect(sjl.unset(helloWorld, 'message')).to.be.true();
    });

});

/**
 * Created by elydelacruz on 4/20/16.
 */

/**
 * Created by elydelacruz on 4/20/16.
 */
describe('#sjl.wrapPointerWithinBounds', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    [
        // pointer : min : max : {result-of-wrap {Number}}
        [0, 0, 100, 0],
        [-1, 0, 100, 100],
        [101, 0, 100, 0],
        [99, 0, 100, 99],
    ]
    .forEach(function (args) {
        var expectedValue = args.pop();
        it ('should return ' + expectedValue + ' when args are [' + args.join(', ') + '].', function () {
            var result = sjl.wrapPointerWithinBounds.apply(sjl, args);
            expect(result).to.equal(expectedValue);
        });
    });
});
