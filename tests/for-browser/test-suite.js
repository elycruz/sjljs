/**
 * Created by Ely on 4/21/2016.
 * File: test-header.js
 * @todo Ensure all included files in test suite have a description in the header comment and ensure that they have header comments.
 */
// Use strict globally for our test page
'use strict';

// Require `sjljs` (get's set on `window` so no need to put it in a variable).
require('sjl');

/**
 * Created by elyde on 11/19/2016.
 */

describe ('sjl.classOf', function () {

        // Do not run these tests for the browser
    if (!sjl.isNodeEnv) {
        return;
    }

    let Namespace = sjl.ns.nodejs.Namespace,
        ns = new Namespace(path.join(__dirname, './../../src'));

    it ('should generate a namespace object that has the contents of the "./src/version.js" file.', function () {
        if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'dev') {
            console.log('---------------- From Tests ------------------');
            console.log('Generated Namespace Obj: ', ns);
            console.log('----------------------------------------------');
            console.log('\n');
        }
        expect(ns.version === sjl.version).to.equal(true);
    });

});

describe('sjl.argsToArray', function () {

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
describe('sjl.autoNamespace', function () {

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
        expect(sjl.autoNamespace('all', subject)).to.equal(subject.all);
        expect(sjl.autoNamespace('all.your', subject)).to.equal(subject.all.your);
        expect(sjl.autoNamespace('all.your.base', subject)).to.equal(subject.all.your.base);
    });

    it ('should be able to set a value within nested object.', function () {
        var replacementValue = 'are belong to us',
            oldValue = subject.all.your.base;

        // Replace value
        sjl.autoNamespace('all.your.base', subject, replacementValue);
        expect(subject.all.your.base).to.equal(replacementValue);

        // Re inject old value
        sjl.autoNamespace('all.your.base', subject, oldValue);
        expect(subject.all.your.base).to.equal(oldValue);
    });

    it ('should be able to set a value on object.', function () {
        var replacementValue = 'your base are belong to us',
            oldValue = subject.all;

        // Replace value
        sjl.autoNamespace('all', subject, replacementValue);
        expect(subject.all).to.equal(replacementValue);

        // Re inject old value
        sjl.autoNamespace('all', subject, oldValue);
        expect(subject.all).to.equal(oldValue);
    });

    it ('should throw a type error when second parameter isn\'t an object or an instance of `Function`.', function () {
        var caughtError;
        try {
            sjl.autoNamespace('all', 99);
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

    it ('should throw a type error when no params are passed in.', function () {
        var caughtError;
        try {
            sjl.autoNamespace();
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

describe ('sjl.classOf', function () {

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

describe('sjl.classOfIs', function () {

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

describe('sjl.classOfIsMulti', function () {

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

/**
 * Created by elyde on 11/13/2016.
 */
describe('sjl.compose', function () {

        it ('should be of type function.', function () {
        expect(sjl.compose).to.be.instanceOf(Function);
    });

    it ('should return a function whether or not any parameters were passed in to it.', function () {
        expect(sjl.compose()).to.be.instanceOf(Function);
        expect(sjl.compose(console.log)).to.be.instanceOf(Function);
    });

    it ('should return a function that when used returns the passed in value if `compose` ' +
        'itself didn\'t receive any parameters.', function () {
        var result = sjl.compose();
        expect(result(99)).to.equal(99);
    });

    it ('should be able to compose an arbitrary number of functions and execute them as expected ' +
        'from generated function.', function () {
        var curry2 = sjl.curry2,
            min = curry2(Math.min),
            max = curry2(Math.max),
            pow = curry2(Math.pow),
            composed = sjl.compose(min(8), max(5), pow(2)),
            randomNum = curry2(function (start, end) { return Math.round(Math.random() * end + start); }),
            random = randomNum(0),
            expectedFor = function (num) { return min(8, max(5, pow(num, 2))); };
            [8,5,3,2,1,0, random(89), random(55), random(34)].forEach(function (num) {
                expect(composed(num)).to.equal(expectedFor(num));
            });
    });

});

/**
 * Created by elyde on 11/13/2016.
 */
describe('sjl.curry', function () {

        // Set curry here to use below
    var slice = Array.prototype.slice,
        multiplyRecursive = function () {
            return slice.call(arguments).reduce(function (agg, num) {
                return num * agg;
            }, 1);
        },
        addRecursive =function () {
            return slice.call(arguments).reduce(function (agg, num) {
                return num + agg;
            }, 0);
        },
        divideR = function () {
            var args = slice.call(arguments);
            return args.reduce(function (agg, num) {
                return agg / num;
            }, args.shift());
        },
        curry = sjl.curry,
        curry2 = sjl.curry2,
        __ = sjl._;

    it ('should be of type function.', function () {
        expect(sjl.curry).to.be.instanceOf(Function);
    });

    it ('should return a function when called with or without args.', function () {
        expect(sjl.curry()).to.be.instanceOf(Function);
        expect(sjl.curry(99)).to.be.instanceOf(Function);
        expect(sjl.curry(() => {})).to.be.instanceOf(Function);
        expect(sjl.curry(console.log)).to.be.instanceOf(Function);
    });

    it('should return a function that fails when no function is passed (as it\'s first param).', function () {
        assert.throws(sjl.curry(), Error);
        assert.throws(sjl.curry(99), Error);
    });

    it ('should return a properly curried function when correct arity for said function is met.', function () {
        var min8 = curry(Math.min, 8),
            max5 = curry(Math.max, 5),
            pow2 = curry(Math.pow, 2);

        // Expect functions
        [min8, max5, pow2].forEach(function (func) {
            expect(func).to.be.instanceOf(Function);
        });

        // Expect functions work correctly
        expect(min8(9)).to.equal(8);
        expect(min8(8)).to.equal(8);
        expect(min8(7)).to.equal(7);
        expect(max5(6)).to.equal(6);
        expect(max5(5)).to.equal(5);
        expect(max5(4)).to.equal(5);
        expect(pow2(2)).to.equal(4);
        expect(pow2(3)).to.equal(8);
        expect(pow2(4)).to.equal(16);
    });

    it ('should be able to correctly curry functions of different arity as long as their arity is met.', function () {
        var min = curry2(Math.min),
            max = curry2(Math.max),
            pow = curry2(Math.pow),
            min8 = curry(Math.min, 8),
            max5 = curry(Math.max, 5),
            pow2 = curry(Math.pow, 2),
            isValidTangentLen = curry(function (a, b, cSqrd) { return pow(a, 2) + pow(b, 2) === cSqrd; }, 2, 2),
            random = curry(function (start, end) { return Math.round(Math.random() * end + start); }, 0),
            expectedFor = function (num) { return min(8, max(5, pow(2, num))); };


        // Expect functions returned for `curry` calls
        expect(isValidTangentLen).to.be.instanceOf(Function);

        // Expect functions returned for `curry` calls
        [min8, max5, pow2].forEach(function (func) {
            expect(func).to.be.instanceOf(Function);
        });

        // Expect `curry`ed functions to work as expected
        expect(isValidTangentLen(8)).to.equal(true);
        expect(isValidTangentLen(21)).to.equal(false);

        // Expect `curry`ed functions to work as expected
        [8,5,3,2,1,0, random(89), random(55), random(34)].forEach(function (num) {
            var composed = sjl.compose(min8, max5, pow2);
            expect(composed(num)).to.equal(expectedFor(num));
        });
    });

    it ('should enforce `Placeholder` values when currying', function () {
        var add = curry(addRecursive),
            multiply = curry(multiplyRecursive),
            multiplyExpectedResult = Math.pow(5, 5);

        // Curry add to add 3 numbers
        expect(add(__, __, __)(1, 2, 3)).to.equal(6);
        expect(add(1, __, __)(2, 3)).to.equal(6);
        expect(add(1, 2, __)(3)).to.equal(6);
        expect(add(1, 2, 3)).to.equal(6);

        // Curry multiply and pass args in non-linear order
        expect(multiply(__, __, __, __, __)(5, 5, 5, 5, 5)).to.equal(multiplyExpectedResult);
        expect(multiply(__, __, 5, __, __)(5, 5, 5, 5)).to.equal(multiplyExpectedResult);
        expect(multiply(5, __, 5, __, __)(5, 5, 5)).to.equal(multiplyExpectedResult);
        expect(multiply(5, __, 5, __, 5)(5, 5)).to.equal(multiplyExpectedResult);
        expect(multiply(5, __, 5, 5, 5)(5)).to.equal(multiplyExpectedResult);
        expect(multiply(5, 5, 5, 5, 5)).to.equal(multiplyExpectedResult);

        expect(add(__, __, __)(1, 2, 3, 5, 6)).to.equal(17);
        expect(add(__, 1, __)(2, 3, 5, 6)).to.equal(17);
        expect(add(__, 1, 2)(3, 5, 6)).to.equal(17);
        expect(add(1, 2, 3, 5, 6)).to.equal(17);

    });

    it ('should respect argument order and placeholder order.', function () {
        // Curry divideR to divde 3 or more numbers
        expect(curry(divideR, 25, 5)).to.be.instanceOf(Function);
        expect(curry(divideR, __, 625, __)(3125, 5)).to.equal(1);
        expect(curry(divideR, Math.pow(3125, 2), 3125, __)(5)).to.equal(625);
    });

});

/**
 * Created by elyde on 11/25/2016.
 */
/**
 * Created by elyde on 11/13/2016.
 */
describe('sjl.curry', function () {

        // Set curry here to use below
    var slice = Array.prototype.slice,
        multiplyRecursive = function () {
            return slice.call(arguments).reduce(function (agg, num) {
                return num * agg;
            }, 1);
        },
        addRecursive =function () {
            return slice.call(arguments).reduce(function (agg, num) {
                return num + agg;
            }, 0);
        },
        divideR = function () {
            var args = slice.call(arguments);
            return args.reduce(function (agg, num) {
                return agg / num;
            }, args.shift());
        },
        curryN = sjl.curryN,
        __ = sjl._;

    it ('should be of type function.', function () {
        expect(curryN).to.be.instanceOf(Function);
    });

    it ('should return a function that throws an error when no arguments are passed.', function () {
        var result = curryN();
        expect(result).to.be.instanceOf(Function);
        assert.throws(result, Error);
    });

    it ('should enforce `Placeholder` values when currying', function () {
        var add3Nums = curryN(addRecursive, 3),
            multiply5Nums = curryN(multiplyRecursive, 5),
            multiplyExpectedResult = Math.pow(5, 5);

        // Curry add to add 3 numbers
        expect(add3Nums(__, __, __)(1, 2, 3)).to.equal(6);
        expect(add3Nums(1, __, __)(2, 3)).to.equal(6);
        expect(add3Nums(1, 2, __)(3)).to.equal(6);
        expect(add3Nums(1, 2, 3)).to.equal(6);

        // Curry multiply and pass args in non-linear order
        expect(multiply5Nums(__, __, __, __, __)(5, 5, 5, 5, 5)).to.equal(multiplyExpectedResult);
        expect(multiply5Nums(__, __, 5, __, __)(5, 5, 5, 5)).to.equal(multiplyExpectedResult);
        expect(multiply5Nums(5, __, 5, __, __)(5, 5, 5)).to.equal(multiplyExpectedResult);
        expect(multiply5Nums(5, __, 5, __, 5)(5, 5)).to.equal(multiplyExpectedResult);
        expect(multiply5Nums(5, __, 5, 5, 5)(5)).to.equal(multiplyExpectedResult);
        expect(multiply5Nums(5, 5, 5, 5, 5)).to.equal(multiplyExpectedResult);

    });

    it ('should pass in any values passed the arity when executing the curried function', function () {
        var add3Nums = curryN(addRecursive, 3);

        // Curry add to add 3 numbers
        expect(add3Nums(__, __, __)(1, 2, 3)).to.equal(6);
        expect(add3Nums(1, __, __)(2, 3)).to.equal(6);
        expect(add3Nums(1, 2, __)(3)).to.equal(6);
        expect(add3Nums(1, 2, 3)).to.equal(6);

        // Curry `add` to add any numbers passed required arity
        expect(add3Nums(__, __, __)(1, 2, 3, 5, 6)).to.equal(17);
        expect(add3Nums(__, 1, __)(2, 3, 5, 6)).to.equal(17);
        expect(add3Nums(__, 1, 2)(3, 5, 6)).to.equal(17);
        expect(add3Nums(1, 2, 3, 5, 6)).to.equal(17);
    });

    it ('should respect the passed in "executeArity" (shouldn\'t be called to passed in arity length is reached', function () {
        var multiply5Nums = curryN(multiplyRecursive, 5),
            multiplyExpectedResult = Math.pow(5, 5),
            argsToTest = [
                [5, 5, 5, 5, 5],
                [5, 5, 5, 5],
                [5, 5, 5],
                [5, 5],
                [5]
            ],
            partiallyAppliedResults = [
                multiply5Nums(__, __, __, __, __),
                multiply5Nums(__, __, 5, __, __),
                multiply5Nums(5, __, 5, __, __),
                multiply5Nums(5, __, 5, __, 5),
                multiply5Nums(5, __, 5, 5, 5)
            ];

        // Curry multiply and pass args in non-linear order
        argsToTest.forEach(function (args, index) {
            expect(partiallyAppliedResults[index]).to.be.instanceOf(Function);
            expect(partiallyAppliedResults[index].apply(null, args)).to.equal(multiplyExpectedResult);
        });

    });

    it ('should respect argument order and placeholder order.', function () {
        var divideC = curryN(divideR, 3);

        // Curry divideR to divde 3 or more numbers
        expect(divideC(25, 5)).to.be.instanceOf(Function);
        expect(divideC(__, 625, __)(3125, 5)).to.equal(1);
        expect(divideC(Math.pow(3125, 2), 3125, __)(5)).to.equal(625);
    });

});

describe('sjl.defineSubClass', function () {

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
        var InitialConstructor = function SubClass() {},
            SubClass = SomeConstructor.extend(sjl.extend({
                constructor: InitialConstructor
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

        it ('should have it\'s prototype\'s constructor property properly set.', function () {
            expect(SubClass.prototype.constructor).to.equal(InitialConstructor);
        });
    });

});

/**
 * Created by elydelacruz on 4/16/16.
 * @note This method will be deprecate in next version of library (v6.0.0)
 */
describe('sjl.empty', function () {

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
describe('sjl.extractFromArrayAt', function () {

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

/**
 * Created by elyde on 11/25/2016.
 */
/**
 * Created by elyde on 11/20/2016.
 */
describe('sjl.Maybe', function () {

        var Either = sjl.ns.Either,
        Left = Either.Left,
        Right = Either.Right,
        either = Either.either,
        memberNames = ['Right', 'Left', 'either'],
        expectInstanceOf = sjl.curry2((Type, functor) => expect(functor).to.be.instanceOf(Type)),
        expectRight = expectInstanceOf(Right),
        expectLeft = expectInstanceOf(Left),
        math = sjl.ns.math;

    it ('should be an object', function () {
        expect(typeof Either).to.equal('object');
    });

    it (`should contain the following members: ${memberNames.join(',')}`, function () {
        var foundKeys = Object.keys(Either);
        expect(memberNames.length).to.equal(foundKeys.length);
        foundKeys.forEach(function (key) {
            expect(memberNames.indexOf(key)).to.be.greaterThan(-1);
        });
    });

    describe ('#Left', function () {
        it ('shouldn\'t be mappable (should return the same value no matter what when mapped)', function () {
            var leftValue = Left(2);
            expect(leftValue.map(sjl.curry(Math.pow, 99)).value).to.equal(leftValue.value);
            expectLeft(leftValue);
        });
    });

    describe ('#Right', function () {
        it ('should be mappable', function () {
            var rightValue = Right(2);
            expect(rightValue.map(sjl.curry(Math.pow, 99)).value).to.equal(99 * 99);
            expectRight(rightValue);
        });
        it ('should return an instance of `Left` when being mapped over if it\'s value is empty (undefined or null)', function () {
            var value = Right(null),
                result = value.map(sjl.curry(Math.pow, 99));
            expect(result.value).to.equal(null);
            expectLeft(result);
        });
    });

    describe ('#either', function () {
        it ('should return the right value applied to the `rightCallback` function when value is set (!null !undefined)', function () {
            var multiply = math.multiply,
                multiplyBy2 = multiply(2),
                multiplyBy3 = multiply(3),
                errorMessageCallback = function (value) {
                    return 'An error occurred.  Could not multiply ' + value + '.';
                };
            expect(either(multiplyBy2, multiplyBy3, Right(99))).to.equal(99 * 3);
            expect(either(errorMessageCallback, multiplyBy3, Right(null))).to.equal(errorMessageCallback(null));
        });
    });

});

/**
 * Created by elyde on 11/20/2016.
 */
describe('sjl.Maybe', function () {

        var Maybe = sjl.ns.Maybe,
        Just = Maybe.Just,
        Nothing = Maybe.Nothing,
        maybe = Maybe.maybe,
        nothing = Maybe.nothing,
        memberNames = ['Just', 'Nothing', 'nothing', 'maybe'],
        expectInstanceOf = sjl.curry2((Type, functor) => expect(functor).to.be.instanceOf(Type)),
        expectNothing = expectInstanceOf(Nothing),
        expectJust = expectInstanceOf(Just);

    it ('should be an object', function () {
        expect(typeof Maybe).to.equal('object');
    });

    it (`should contain the following members: ${memberNames.join(',')}`, function () {
        var foundKeys = Object.keys(Maybe);
        expect(memberNames.length).to.equal(foundKeys.length);
        foundKeys.forEach(function (key) {
            expect(memberNames.indexOf(key)).to.be.greaterThan(-1);
        });
    });

    describe ('#Just', function () {
        it ('should return an instance when receiving any value', function () {
            [null, undefined, 99, 0, -1, true, false, [1,2,3], {}, {a: 'b'}, () => {}]
                .forEach(function (value) {
                    expectJust(Just(value));
                });
        });
        it ('should return an instance of itself even when receiving no value', function () {
            expectJust(Just());
        });

        describe ('#map', function () {
            var someFn = function (value) { return value.toString(); };
            it('should return nothing when contained value is `null` or `undefined`', function () {
                expectNothing(Just().map(someFn));
                expectNothing(Just(null).map(someFn));
                expectNothing(Just(undefined).map(someFn));
            });
            expectJust(Just(-1).map(someFn));
            expectJust(Just(0).map(someFn));
            expectJust(Just(1).map(someFn));
            [-1, 0, 1, true, false, [1,2,3], {}, {a: 'b'}, () => {}]
                .forEach(function (value) {
                    it ('should return an instance of `Just` when contained value is ' +
                        '`' + value.toString() + '`', function () {
                        expectJust(Just(value).map(someFn));
                    });
                });

        });
    });

    describe ('#Nothing', function () {
        describe ('should return `Nothing` for it\'s monadic interface [map, ap, join, chain]', function () {
            var someFn = function (value) { return value * 2; },
                someMonad = Just(99);
            it ('should return `Nothing` for `map`.', function () {
                expectNothing(Nothing(100).map(someFn));
                expectNothing(Nothing(99).map(someFn));
                expectNothing(Nothing(Just(98)).map(someFn));
            });
            it ('should return `Nothing` for `join` even when nested has `Nothing`s.', function () {
                expectNothing(Nothing(Nothing(98)).join());
                expectNothing(Nothing(Just(99)).join());
                expectNothing(Nothing(99).join());
                expectNothing(Nothing().join());
            });
            it ('should return `Nothing` for `ap`.', function () {
                expectNothing(Nothing(98).ap(someMonad));
                expectNothing(Nothing(Just(99)).ap(someMonad));
            });
            it ('should return `Nothing` for `chain`.', function () {
                expectNothing(Nothing(97).chain(someFn));
                expectNothing(Nothing(Just(96)).chain(someFn));
            });
        });

    });

    describe ('#maybe', function () {
        it ('should return the replacement value when value to check is not set (null | undefined)', function () {
            var just100 = Just(100),
                justNull = Just(null),
                id = sjl.ns.fn.id,
                justTimes2 = incomingValue => 2 * incomingValue;
            expect(maybe(just100, id, justNull)).to.equal(just100);
            expect(maybe(Just(99), justTimes2, just100).value).to.equal(200);
            expect(maybe(Just(1000), justTimes2, Just(null)).value).to.equal(1000);
            expect(maybe(Just(2000), justTimes2, Just(1000)).value).to.equal(2000);
        });
    });

    describe ('#nothing', function () {
        it ('should be a function.', function () {
            expect(nothing).to.be.instanceOf(Function);
        });
        it ('should return an instance of `Nothing`', function () {
            expect(nothing()).to.be.instanceOf(Nothing);
        });
    });

});

/**
 * Created by edlc on 11/14/16.
 */
describe('sjl.Monad', function () {

        var Monad = sjl.ns.Monad,
        expectMonad = monad => expect(monad).to.be.instanceOf(Monad);

    it ('should have the appropriate (monadic) interface.', function () {
        var monad = Monad();
        ['map', 'join', 'chain', 'ap'].forEach(function (key) {
            expect(monad[key]).to.be.instanceOf(Function);
        });
    });

    it ('should have a `of` static method.', function () {
        expect(Monad.of).to.be.instanceOf(Function);
    });

    describe ('#map', function () {
        var monad = Monad(2),
            pow = sjl.curry2(Math.pow),
            result = monad.map(pow(8));
        it ('should pass `Monad`\'s contained value to passed in function.', function () {
            expect(result.value).to.equal(64);
        });
        it ('should return a new instance of `Monad`.', function () {
            expect(result).to.be.instanceOf(Monad);
        });
    });

    describe ('#join', function () {
        it ('should remove one level of monadic structure on it\'s own type;  ' +
            'E.g., If it\'s inner value is of the same type.', function () {
            var innerMostValue = 5,
                monad1 = Monad(innerMostValue),
                monad2 = Monad(monad1),
                monad3 = Monad(monad2),
                monad4 = Monad(),
                expectInnerValueEqual = (value, value2) => expect(value).to.equal(value2),
                expectations = (result, equalTo) => {
                    expectMonad(result);
                    expectInnerValueEqual(result.value, equalTo);
                };
                expectations(monad1.join(), innerMostValue);
                expectations(monad2.join(), innerMostValue);
                expectations(monad3.join(), monad1);
                expectations(monad4.join(), undefined);
        });
    });

    describe ('#ap', function () {
        var add = sjl.curry2(function (a, b) { return a + b; }),
            multiply = sjl.curry2(function (a, b) { return a * b; }),
            idAdd = Monad(add),
            idMultiply = Monad(multiply),
            idMultiplyBy5 = idMultiply.ap(Monad(5));

        it ('Should effectively apply the function contents of one `Monad` obj to another.', function () {
            var result = idMultiplyBy5.ap(Monad(5)),
                result2 = idAdd.ap(Monad(3)).ap(Monad(5));
            expectMonad(result);
            expectMonad(result2);
            expect(result.value).to.equal(5 * 5);
            expect(result2.value).to.equal(8);
        });

        it ('should throw an error when trying to apply one Functor with a non ' +
            'function value in it to another.', function () {
            assert.throws(() => Monad(5).ap(Monad(3)), Error);
        });
    });

    describe ('#chain', function () {
        var split = function (str) { return str.split(''); },
            camelCase = sjl.camelCase,
            ucaseFirst = sjl.ucaseFirst,
            compose = sjl.compose,
            idSplit = compose(Monad, split),
            originalStr = 'hello-world',

            // Monad(['H', 'e', 'l', 'l', 'o', 'W', 'o', 'r', 'l', 'd'])
            expectedStrTransform = compose(idSplit, ucaseFirst, camelCase)(originalStr),

            // Expected: Monad(['H', 'e', 'l', 'l', 'o', 'W', 'o', 'r', 'l', 'd'])
            result = Monad(originalStr)
                .chain(camelCase)
                .chain(ucaseFirst)
                .chain(idSplit);

        it ('Should return a type of `Monad`.', function () {
            expectMonad(result);
        });

        it ('Should apply passed in method.', function () {
            expect(result.value).to.be.instanceOf(Array);
            expect(result.value.length).to.equal(result.value.length);
            result.chain(function (value) {
                value.forEach(function (innerValue, index) {
                    expect(innerValue).to.equal(expectedStrTransform.value[index]);
                });
            });
        });

        it ('Should retain monadic structure when called.', function () {
            var result2 = Monad(originalStr)
                .chain(camelCase)
                .chain(ucaseFirst)
                .chain(compose(Monad, idSplit));
            expectMonad(result2);
            expectMonad(result2.value);
            expect(result2.value.value).to.be.instanceOf(Array);
        });

    });

    // describe ('#unwrap', function () {
    //     it ('should return it\'s contained value.', function () {
    //         let id1= Monad(1),
    //             id2 = Monad(),
    //             id3 = Monad(3),
    //             id4 = Monad(id3);
    //         expect(id1.unwrap()).to.equal(1);
    //         expect(id2.unwrap()).to.equal(undefined);
    //         expect(id4.unwrap()).to.equal(id3.unwrap());
    //     });
    // });

});

/**
 * Created by elyde on 11/20/2016.
 */
describe('sjl.fn', function () {

        var sjlFn = sjl.isNodeEnv ? sjl.ns.fn : sjl.fn;

    describe ('#id', function () {
        it ('should be a function.', function () {
            expect(sjlFn.id).to.be.instanceOf(Function);
        });
        [
            [[], '[]'],
            [{}, '{}'],
            ['', '""'],
            [-1, '-1'],
            [0, '0'],
            [1, '1'],
            [false, 'false'],
            [true, 'true'],
            [null, 'null'],
            [undefined, 'undefined'],
            [['hello'], '["hello"]'],
            ['hello-world', 'hello-world'],
            [{someProp: 'some-prop-value'}, '{someProp: "some-prop-value"}'],
            [function () {}, 'function () {}']
        ].forEach(function (pair) {
            it ('should return value `' + pair[1] + '` when passed in.', function () {
                expect(sjlFn.id(pair[0])).to.equal(pair[0]);
            });
        });
    });

});

/**
 * Created by elydelacruz on 4/16/16.
 */
describe('sjl.isEmpty', function () {

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
describe('sjl.isEmptyObj', function () {

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
describe('sjl.isEmptyOrNotOfType', function () {

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
describe ('sjl.isset', function () {

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
describe('sjl.issetAndOfType', function () {

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
describe('sjl.issetMulti', function () {

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
describe('sjl.jsonClone', function () {

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
describe('sjl.lcaseFirst', function () {

        var argsForTruthyTests = [
        ['HelloWorld', 'helloWorld'],
        [String.name, 'string'],
        ['world-wide-web', 'world-wide-web'],
        ['99-World-wide-web', '99-world-wide-web'],
        ['$(*@&#(*$---WORLD', '$(*@&#(*$---wORLD']
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
describe('sjl.notEmptyAndOfType', function () {

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
describe ('sjl.restArgs', function () {

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

describe('sjl.searchObj', function () {

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



describe('sjl.throwTypeErrorIfEmpty', function () {

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

describe('sjl.throwTypeErrorIfNotOfType', function () {

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
describe('sjl.ucaseFirst', function () {

        var argsForTruthyTests = [
        ['helloWorld', 'HelloWorld'],
        [String.name, 'String'],
        ['world-wide-web', 'World-wide-web'],
        ['99-world-wide-web', '99-World-wide-web'],
        ['$(*@&#(*$---wORLD', '$(*@&#(*$---WORLD']
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
describe('sjl.unset', function () {

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
 * Created by elyde on 11/19/2016.
 */

describe('sjl.version', function () {

        it ('should be set.', function () {
        // @note below member is imported as side effect for node version only
        // (it is bundled with the browser version)
        var version = sjl.isNodeEnv ? require('./../../src/generated/version') : sjl.version;
        expect(sjl.notEmptyAndOfType(version, String)).to.equal(true);
    });

});
/**
 * Created by elydelacruz on 4/20/16.
 */
describe('sjl.wrapPointer', function () {

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
            var result = sjl.wrapPointer.apply(sjl, args);
            expect(result).to.equal(expectedValue);
        });
    });
});

/**
 * Created by Ely on 12/17/2014.
 */
describe('sjl.stdlib.Config', function () {

        var exampleObj = {
        'Null': null,
        'Array': ['hello-world'],
        'String': 'helloworld',
        'Function': function () {},
        'Object': {all: {your: {base: 'are.belong.to.us'}}},
        'Boolean': false
    },
        exampleObj2 = {
            eightiesSaying: {all: {your: {base: {are: {belong: {to: {us: 'All your base are belong to us'}}}}}}}
        },
        exampleObjKeys = Object.keys(exampleObj),
        exampleObj2Keys = Object.keys(exampleObj2),
        Config = sjl.ns.stdlib.Config;

    it ('should be an instance of `sjl.stdlib.Extendable`.', function () {
        expect(new Config()).to.be.instanceof(sjl.ns.stdlib.Extendable);
    });

    it ('should be able to set multiple properties from one object passed int to constructor.', function () {
        var config = new Config(exampleObj);
        exampleObjKeys.forEach(function (key) {
            expect(config[key]).to.equal(exampleObj[key]);
        });
    });

    it ('should be able to set multiple properties via multiple objects passed in via the constructor.', function () {
        var config = new Config(exampleObj, exampleObj2);
        exampleObjKeys.forEach(function (key) {
            expect(config[key]).to.equal(exampleObj[key]);
        });
        exampleObj2Keys.forEach(function (key) {
            expect(config[key]).to.equal(exampleObj2[key]);
        });
    });

    describe ('#set', function () {

        it ('should be able to set multiple properties from one object passed in and should return self when doing so.', function () {
            var config = new Config(),
                result = config.set(exampleObj);
            expect(result).to.equal(config);
            exampleObjKeys.forEach(function (key) {
                expect(config[key]).to.equal(exampleObj[key]);
            });
        });

        it ('should be able to set multiple properties via multiple objects passed in and should return self when doing so.', function () {
            var config = new Config(),
                result = config.set(exampleObj, exampleObj2);
            expect(result).to.equal(config);
            exampleObjKeys.forEach(function (key) {
                expect(config[key]).to.equal(exampleObj[key]);
            });
            exampleObj2Keys.forEach(function (key) {
                expect(config[key]).to.equal(exampleObj2[key]);
            });
        });

        it ('should be able to set one property via "key" and "value" parameters and return self when doing so.', function () {
            var config = new Config(),
                result = config.set('hello', 'world');
            expect(result).to.equal(config);
            expect(config.hello).to.equal('world');
        });

        it ('should be able to set a property via namespace string and value parameter and return itself after doing so.', function () {
            var config = new Config(exampleObj),
                result;
            expect(config.all).to.equal(exampleObj.all);
            result = config.set('all.your.base', exampleObj2.eightiesSaying.all.your.base);
            expect(result.all.your.base).to.equal(exampleObj2.eightiesSaying.all.your.base);
        });

        it ('should do nothing and return itself when no params are passed in.', function () {
            var config = new Config();
            expect(config.set()).to.equal(config);
            expect(Object.keys(config).length).to.equal(0);
        });

        it ('should throw a type error when param `0` is neither of type `String` or of type `Object`.', function () {
            var caughtError;
            try {
                (new Config()).set(function () {}, null);
            }
            catch (e) {
                caughtError = e;
            }
            try {
                (new Config()).set(['hello'], null);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    });

    describe ('#get', function () {

        it ('should be able to get a value by key.', function () {
            var config = new Config(exampleObj);
            exampleObjKeys.forEach(function (key) {
                expect(config.get(key)).to.equal(exampleObj[key]);
            });
        });

        it ('should be able to get a value by namespace key.', function () {
            expect((new Config(exampleObj)).get('Object.all.your.base')).to.equal(exampleObj.Object.all.your.base);
        });

        it ('should throw a type error when passed in key is not a string.', function () {
            var config = new Config(),
                caughtError;
            try {
                config.get(['hello']);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
            try {
                config.get(function () {});
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
            try {
                config.get();
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    });

    describe ('#has', function () {

        it ('should return true if config has a key with a value other than `null` or `undefined`.', function () {
            var config = new Config(exampleObj);
            exampleObjKeys.filter(function (key) {
                return sjl.isset(exampleObj[key]);
            }).forEach(function (key) {
                expect(config.has(key)).to.be.true();
            });
        });

        it ('should return false if config doesn\'t have a key or key value is `null`.', function () {
            var config = new Config(exampleObj2);
            exampleObjKeys.filter(function (key) {
                return sjl.isset(exampleObj[key]);
            }).forEach(function (key) {
                expect(config.has(key)).to.be.false();
            });
        });

        it ('should throw a type error when passed in key is not a string.', function () {
            var config = new Config(),
                caughtError;
            try {
                config.has(['hello']);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
            try {
                config.has(function () {});
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
            try {
                config.has();
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    });

}); // end of Test Suite



describe('sjl.stdlib.Extendable', function () {

        var Extendable = sjl.ns.stdlib.Extendable,
        Iterator = sjl.ns.stdlib.Iterator;

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
        var iterator = new Iterator([]);
        expect(iterator instanceof Iterator).to.equal(true);
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


describe('sjl.stdlib.Iterator', function () {

        var interfaceKeys = [
        'current', 'next', 'rewind', 'valid'
        ],
        basicArray = 'abcdefghijklmnopqrstuvwxyz'.split(''),
        Iterator = sjl.ns.stdlib.Iterator,
        iterator = new Iterator(basicArray);

    it ('should create a new `Iterator`.', function () {
        expect(iterator instanceof Iterator).to.equal(true);
        expect((new Iterator(basicArray)) instanceof Iterator).to.equal(true);
    });

    it ('should have `_values` and `pointer` properties of the correct types', function () {
        expect(sjl.issetAndOfType(iterator._values, 'Array')).to.equal(true);
        expect(sjl.issetAndOfType(iterator.pointer, 'Number')).to.equal(true);
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
            expect(value.value).to.equal(basicArray[iterator.pointer - 1]);
            expect(value.done).to.equal(false);
        }
        expect(iterator.valid()).to.equal(false);
    });

    it ('should be able to be rewound.', function () {
        expect(iterator.pointer).to.equal(basicArray.length);
        expect(iterator.rewind().pointer).to.equal(0);
    });

    it ('should be able to set the __internal `pointer` via the `pointer` method.', function () {
        iterator.pointer = 16;
        expect(iterator.pointer).to.equal(16);
    });

    it ('should be able to set the __internal `values` via the `values` method.', function () {
        iterator.values = ['a', 'b', 'c'];
        expect(iterator.values.length).to.equal(3);
    });

    it ('should be able to get the value at the `current` pointer position via the `current` method.', function () {
        iterator.pointer = 1;
        expect(iterator.current().value).to.equal('b');
    });

});

/**
 * Created by Ely on 12/17/2014.
 */
describe('sjl.stdlib.Optionable', function () {

        var exampleObj = {
            'Null': null,
            'Array': ['hello-world'],
            'String': 'helloworld',
            'Function': function () {},
            'Object': {all: {your: {base: 'are.belong.to.us'}}},
            'Boolean': false
        },
        exampleObj2 = {
            eightiesSaying: {all: {your: {base: {are: {belong: {to: {us: 'All your base are belong to us'}}}}}}}
        },
        exampleObjKeys = Object.keys(exampleObj),
        exampleObj2Keys = Object.keys(exampleObj2),
        Optionable = sjl.ns.stdlib.Optionable;

    it ('should be an instance of `sjl.stdlib.Extendable`.', function () {
        expect(new sjl.ns.stdlib.Optionable()).to.be.instanceof(sjl.ns.stdlib.Extendable);
    });

    it ('should be able to set multiple properties from one object passed int to constructor.', function () {
        var optionable = new Optionable(exampleObj),
            options = optionable.getStoreHash();
        exampleObjKeys.forEach(function (key) {
            expect(options[key]).to.equal(exampleObj[key]);
        });
    });

    it ('should be able to set multiple properties via multiple objects passed in via the constructor.', function () {
        var optionable = new Optionable(exampleObj, exampleObj2),
            options = optionable.getStoreHash();
        exampleObjKeys.forEach(function (key) {
            expect(options[key]).to.equal(exampleObj[key]);
        });
        exampleObj2Keys.forEach(function (key) {
            expect(options[key]).to.equal(exampleObj2[key]);
        });
    });

    describe ('#set', function () {

        it ('should be able to set multiple properties from one object passed in and should return self when doing so.', function () {
            var optionable = new Optionable(),
                result = optionable.set(exampleObj);
            expect(result).to.equal(optionable);
            exampleObjKeys.forEach(function (key) {
                expect(optionable.getStoreHash()[key]).to.equal(exampleObj[key]);
            });
        });

        it ('should be able to set multiple properties via multiple objects passed in and should return self when doing so.', function () {
            var optionable = new Optionable(),
                result = optionable.set(exampleObj, exampleObj2),
                resultOptions = result.getStoreHash();
            expect(result).to.equal(optionable);
            exampleObjKeys.forEach(function (key) {
                expect(resultOptions[key]).to.equal(exampleObj[key]);
            });
            exampleObj2Keys.forEach(function (key) {
                expect(resultOptions[key]).to.equal(exampleObj2[key]);
            });
        });

        it ('should be able to set one property via "key" and "value" parameters and return self when doing so.', function () {
            var optionable = new Optionable(),
                result = optionable.set('hello', 'world'),
                resultOptions = result.getStoreHash();
            expect(result).to.equal(optionable);
            expect(resultOptions.hello).to.equal('world');
        });

        it ('should be able to set a property via namespace string and value parameter and return itself after doing so.', function () {
            var optionable = new Optionable(exampleObj),
                result,
                resultOptions;
            expect(optionable.all).to.equal(exampleObj.all);
            result = optionable.set('all.your.base', exampleObj2.eightiesSaying.all.your.base);
            resultOptions = result.getStoreHash();
            expect(resultOptions.all.your.base).to.equal(exampleObj2.eightiesSaying.all.your.base);
        });

        it ('should do nothing and return itself when no params are passed in.', function () {
            var optionable = new Optionable();
            expect(optionable.set()).to.equal(optionable);
            expect(Object.keys(optionable.getStoreHash()).length).to.equal(0);
        });

        it ('should throw a type error when param `0` is neither of type `String` or of type `Object`.', function () {
            var caughtError;
            try {
                (new Optionable()).set(function () {}, null);
            }
            catch (e) {
                caughtError = e;
            }
            try {
                (new Optionable()).set(['hello'], null);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    });

    describe ('#get', function () {

        it ('should be able to get a value by key.', function () {
            var optionable = new Optionable(exampleObj);
            exampleObjKeys.forEach(function (key) {
                expect(optionable.get(key)).to.equal(exampleObj[key]);
            });
        });

        it ('should be able to get a value by namespace key.', function () {
            expect((new Optionable(exampleObj)).get('Object.all.your.base')).to.equal(exampleObj.Object.all.your.base);
        });

        it ('should throw a type error when passed in key is not a string.', function () {
            var optionable = new Optionable(),
                caughtError;
            try {
                optionable.get(['hello']);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
            try {
                optionable.get(function () {});
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
            try {
                optionable.get();
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    });

    describe ('#has', function () {

        it ('should return true if optionable has a key with a value other than `null` or `undefined`.', function () {
            var optionable = new Optionable(exampleObj);
            exampleObjKeys.filter(function (key) {
                return sjl.isset(exampleObj[key]);
            }).forEach(function (key) {
                expect(optionable.has(key)).to.be.true();
            });
        });

        it ('should return false if optionable doesn\'t have a key or key value is `null`.', function () {
            var optionable = new Optionable(exampleObj2);
            exampleObjKeys.filter(function (key) {
                return sjl.isset(exampleObj[key]);
            }).forEach(function (key) {
                expect(optionable.has(key)).to.be.false();
            });
        });

        it ('should throw a type error when passed in key is not a string.', function () {
            var optionable = new Optionable(),
                caughtError;
            try {
                optionable.has(['hello']);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
            try {
                optionable.has(function () {});
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
            try {
                optionable.has();
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    });

    describe ('#getStoreHash', function () {
        it ('should be a method.', function () {
            var optionable = new Optionable();
            expect(optionable.getStoreHash).to.be.instanceof(Function);
        });
        it ('should return the options store which should be an instance of `sjl.stdlib.Config`.', function () {
            var optionable = new Optionable();
            expect(optionable.getStoreHash).to.be.instanceof(Function);
            expect(optionable.getStoreHash()).to.be.instanceof(sjl.ns.stdlib.Config);
        });
    });

}); // end of Test Suite

/**
 * Created by elyde on 1/12/2016.
 * @todo add tests iterator methods
 */

describe('sjl.stdlib.PriorityList', function () {

        var PriorityList = sjl.ns.stdlib.PriorityList;

    function priorityListEntriesObjValues (startIndice, numObjs) {
        var out = [];
        for (var i = startIndice; i < numObjs; i += 1) {
            out.push([
                'item' + i,
                {randomNumber: Math.round(Math.random() * numObjs)}
            ]);
        }
        return out;
    }

    describe('#`PriorityList Methods Existence`', function () {
            var priorityList = new PriorityList(),
            methods = ['clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values', 'get', 'set',
                'next', 'current', 'valid', 'rewind', 'addFromArray', 'addFromObject'];
        it ('should have the following methods: [`' + methods.join('`, `') + '`]', function () {
            methods.forEach(function (method) {
                expect(typeof priorityList[method]).to.equal('function');
            });
        });
    });

    describe('#`PriorityList#current', function () {
        var entries = priorityListEntriesObjValues(0, 8),
            priorityList = new PriorityList(entries);
        it ('should return the item at internal `pointer` position when `wrapItems` is false.', function () {
            var currentItem = entries[0][1];
            expect(priorityList.pointer).to.equal(0);
            expect(priorityList.current().value).to.equal(currentItem);
        });
    });
    describe('#`PriorityList#next', function () {
        var entries = priorityListEntriesObjValues(0, 8),
            priorityList = new PriorityList(entries);
        it ('should return the next item in the list starting with the first item.', function () {
            expect(priorityList.pointer).to.equal(0);
            expect(priorityList.next().value).to.equal(entries[0][1]);
            expect(priorityList.next().value).to.equal(entries[1][1]);
            expect(priorityList.next().value).to.equal(entries[2][1]);
        });
    });

    describe('#`PriorityList#rewind', function () {
        var entries = priorityListEntriesObjValues(0, 8),
            priorityList = new PriorityList(entries),
            listEnd = entries.length - 1;
        priorityList.pointer = listEnd;
        it ('should return self and set pointer to `0`.', function () {
            expect(priorityList.pointer).to.equal(listEnd);
            expect(priorityList.rewind()).to.equal(priorityList);
            expect(priorityList.pointer).to.equal(0);
        });
    });

    describe('#`PriorityList#valid', function () {
        var entries = priorityListEntriesObjValues(0, 8),
            priorityList = new PriorityList(entries);
        it ('should return the true while pointer is not at end of list.', function () {
            expect(priorityList.pointer).to.equal(0);
            expect(priorityList.valid()).to.equal(true);
        });
        it ('should return false when pointer is at end of list.', function () {
            priorityList.pointer = entries.length;
            expect(priorityList.pointer).to.equal(entries.length);
            expect(priorityList.valid()).to.equal(false);
        });
    });

    describe('#`PriorityList#clear`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            priorityList = new PriorityList(entries);

        it ('should return `self`.', function () {
            expect(priorityList.size).to.equal(entries.length);
            // Ensure `clear` returns `self`
            expect(priorityList.clear()).to.equal(priorityList);
        });
        it ('should return `0` from `size` as a side effect.', function () {
            // Validate size of set
            expect(priorityList.size).to.equal(0);
        });
    });

    describe('#`PriorityList#delete`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            keyEntryToDelete = 'b',
            keyEntryToDeleteValue = Math.random() * 1000 + 500,
            mapFrom = [ ['a', 0], [keyEntryToDelete, keyEntryToDeleteValue], ['c', 3] ].concat(entries),
            priorityList = new PriorityList(mapFrom);

        it ('should delete unique key and return `self`.', function () {
            // Ensure has key entry to delete
            expect(priorityList.has(keyEntryToDelete)).to.equal(true);

            // Ensure method returns `self`
            expect(priorityList.delete(keyEntryToDelete)).to.equal(priorityList);

            // Ensure method deleted key entry
            expect(priorityList.has(keyEntryToDelete)).to.equal(false);
            expect(priorityList._values.some(function (item) {
                return item.value === keyEntryToDeleteValue;
            })).to.equal(false);
            expect(priorityList._keys.indexOf(keyEntryToDelete)).to.equal(-1);
        });

        it ('should set `size` to `size - 1` as a side effect.', function () {
            // Validate size of set
            expect(priorityList.size).to.equal(mapFrom.length - 1);
        });
    });

    describe('#`PriorityList#entries`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            allEntries = entries.concat([]),
            reversedEntries = entries.concat([]).sort(function (a, b) {
                return a[0] < b[0];
            });

        it ('should return an iterator.', function () {
            var priorityList = new PriorityList(entries, true),
                iterator = priorityList.entries();
                expect(iterator).to.be.instanceOf(sjl.ns.stdlib.Iterator);
        });

        it ('should have all values sorted when LIFO is true.', function () {
            var priorityList = new PriorityList(entries, true),
                iterator = priorityList.entries();
            while (iterator.valid()) {
                var value = iterator.next(),
                    originalEntry = reversedEntries[iterator.pointer - 1];
                expect(value.done).to.equal(false);
                expect(value.value[0]).to.equal(originalEntry[0]);
                expect(value.value[1]).to.equal(originalEntry[1]);
            }
        });

        it ('should have all values sorted in reverse priority order when `LIFO` is `false`.', function () {
            var priorityList = new PriorityList(entries, false),
                iterator = priorityList.entries();
            while (iterator.valid()) {
                var value = iterator.next(),
                    originalEntry = allEntries[iterator.pointer - 1];
                expect(value.done).to.equal(false);
                expect(value.value[0]).to.equal(originalEntry[0]);
                expect(value.value[1]).to.equal(originalEntry[1]);
            }
        });
    });

    describe('#`PriorityList#forEach`', function () {
        var entries = [
                ['v1', {valor: 1}],
                ['v2', {valor: 2}],
                ['v3', {valor: 3}],
                ['v4', {valor: 4}],
                ['v5', {valor: 5}],
                ['v6', {valor: 6}],
                ['v7', {valor: 7}],
                ['v8', {valor: 8}],
            ],
            reversedEntries = entries.concat([]).sort(function (a, b) {
                return a[0] < b[0];
            }),
            priorityList = new PriorityList(entries, true, false),
            exampleContext = {someProperty: 'someValue'},
            indexCount = 0;

        it ('should work as expected when no context is passed in.', function () {
            // Validate `forEach` method works as expected
            priorityList.forEach(function (value, key) {
                expect(reversedEntries[indexCount][0]).to.equal(key);
                expect(reversedEntries[indexCount][1]).to.equal(value);
                expect(this).to.equal(undefined);
                indexCount += 1;
            });
        });

        it ('should work as expected when a context is passed in.', function () {
            // Reset index count
            indexCount = 0;

            // Validate `forEach` method works as expected
            priorityList.forEach(function (value, key) {
                expect(reversedEntries[indexCount][0]).to.equal(key);
                expect(reversedEntries[indexCount][1]).to.equal(value);
                expect(this).to.equal(exampleContext);
                indexCount += 1;
            }, exampleContext);
        });
    });

    describe('#`PriorityList#has`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            keyInMap = 'v5',
            keyNotInMap = 'v9',
            priorityList = new PriorityList(entries);
        it ('should return `false` for keys not in set.', function () {
            expect(priorityList.has(keyNotInMap)).to.equal(false);
        });
        it ('should return `true` for keys in set.', function () {
            expect(priorityList.has(keyInMap)).to.equal(true);
        });
    });

    describe('#`PriorityList#keys`', function () {
        it ('should return an iterable object.', function () {
            var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                    ['v4', 4], ['v5', 5], ['v6', 6],
                    ['v7', 5], ['v8', 4]],
                priorityList = new PriorityList(entries),
                iterator = priorityList.keys(),
                reversedEntries = entries.concat([]).sort(function (a, b) {
                    return a[0] > b[0];
                }),
                value,
                index = 0;
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value).to.equal(reversedEntries[index][0]);
                index += 1;
            }
        });
    });

    describe('#`PriorityList#values`', function () {
            var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                    ['v4', 4], ['v5', 5], ['v6', 6],
                    ['v7', 5], ['v8', 4]],

                priorityList = new PriorityList(entries);

        it ('should return an iterable', function () {
            var iterator = priorityList.values();
            expect(iterator).to.be.instanceOf(sjl.ns.stdlib.Iterator);
        });

        it ('should return an iterator that contains all values in the expected order (FIFO by priority/serial).', function () {
            var index = 0,
                iterator = priorityList.values();
            while (iterator.valid()) {
                var value = iterator.next();
                expect(value.value).to.equal(entries[index][1]);
                index += 1;
            }
        });

        it ('should return an iterator that contains all values in the expected order (FIFO by priority/serial).', function () {
            priorityList.LIFO = true;
            var index = 0,
                reversedEntries = entries.sort(function (a, b) {
                    return a[0] > b[0];
                });
            while (priorityList.valid()) {
                var value = priorityList.next();
                expect(value.value).to.equal(reversedEntries[index][1]);
                index += 1;
            }
        });
    });

    describe('#`PriorityList#get`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            priorityList = new PriorityList(entries);
        it ('should return the correct value for a given key.', function () {
            expect(priorityList.get('v1')).to.equal(1);
        });
        it ('should return undefined for for a given non-existent key entry.', function () {
            expect(priorityList.get('v9')).to.equal(undefined);
        });
    });

    describe('#`PriorityList#set`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            priorityList = new PriorityList(entries);
        it ('should return `self` when setting a key-value pair.', function () {
            expect(priorityList.has('v9')).to.equal(false);
            expect(priorityList.set('v9')).to.equal(priorityList);
            expect(priorityList.has('v9')).to.equal(true);
        });
        it ('should return undefined for for a given non-existent key entry.', function () {
            expect(priorityList.get('v10')).to.equal(undefined);
        });
    });

    describe('#`PriorityList#addFromArray`', function () {
        it ('should import unique values from an array.', function () {
            var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                    ['v4', 4], ['v5', 5], ['v6', 6],
                    ['v7', 5], ['v8', 4]],
                otherEntries = [['v10', 7], ['v11', 8], ['v12', 9]],
                expectedEntries = entries.concat(otherEntries).reverse(),
                priorityList = new PriorityList(entries, true),
                value,
                index = 0,
                iterator;
            priorityList.addFromArray(otherEntries);
            iterator = priorityList.entries();
            expect(priorityList.size).to.equal(expectedEntries.length);
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value[0]).to.equal(expectedEntries[index][0]);
                expect(value.value[1]).to.equal(expectedEntries[index][1]);
                index += 1;
            }
        });
    });

    describe('#`PriorityList#addFromObject`', function () {
        it ('Should be able to populate itself from a value of type `Object`.', function () {
            var object = {
                    all: {your: {base: {are: {belong: {to: {us: true}}}}}},
                    someBooleanValue: false,
                    someNumberValue: 100,
                    objectValue: {someKey: 'some value'},
                    functionValue: function HelloWorld() {},
                    someStringValue: 'string value here',
                    someNullValue: null
                },
                priorityList = new PriorityList(object);
            Object.keys(object).forEach(function (key) {
                expect(object[key]).to.equal(priorityList.get(key));
            });
        });

    });
});

/**
 * Created by Ely on 8/6/2015.
 */

describe('sjl.stdlib.SjlMap', function () {

        var SjlMap = sjl.ns.stdlib.SjlMap;

    describe('#`SjlMap Methods Existence`', function () {
        var
            // entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
            // ['v4', 4], ['v5', 5], ['v6', 6],
            // ['v7', 5], ['v8', 4]],
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
        var
            // entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
            //     ['v4', 4], ['v5', 5], ['v6', 6],
            //     ['v7', 5], ['v8', 4]],
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
                expect(value.value[0]).to.equal(entries[iterator.pointer - 1][0]);
                expect(value.value[1]).to.equal(entries[iterator.pointer - 1][1]);
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
            sjlMap.forEach(function (value, key) {
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
            sjlMap.forEach(function (value, key) {
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
                expect(value.value[0]).to.equal(entries[iterator.pointer - 1][0]);
                expect(value.value[1]).to.equal(entries[iterator.pointer - 1][1]);
            }
        });
    });

    describe('#`SjlMap#addFromObject`', function () {
        it ('Should be able to populate itself from a value of type `Object`.', function () {
            var object = {
                all: {your: {base: {are: {belong: {to: {us: true}}}}}},
                someBooleanValue: false,
                someNumberValue: 100,
                objectValue: {someKey: 'some value'},
                functionValue: function HelloWorld() {},
                someStringValue: 'string value here',
                someNullValue: null
            },
                sjlMap = new SjlMap(object);
            Object.keys(object).forEach(function (key) {
                expect(object[key]).to.equal(sjlMap.get(key));
            });
        });

    });

});

/**
 * Created by Ely on 8/6/2015.
 */

describe('sjl.stdlib.SjlSet', function () {

        var SjlSet = sjl.ns.stdlib.SjlSet;

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
                expect(value.value[0]).to.equal(values[iterator.pointer - 1]);
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
