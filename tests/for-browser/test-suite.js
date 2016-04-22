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
 * Created by elydelacruz on 3/25/16.
 */
describe(
    'sjl.filter.SlugFilter,' +
    'sjl.filter.SlugFilter#filter,' +
    'sjl.filter.SlugFilter.filter', function () {

                var SlugFilter = sjl.filter.SlugFilter;
            //testUtils = sjl.utils.testUtils;

        function filterDataProvider() {
            return [
                [{
                    'unfiltered': 'Hello.  What is your name?',
                    'filtered': 'hello-what-is-your-name'
                }],
                [{
                    'unfiltered': 'Thrice as nice!',
                    'filtered': 'thrice-as-nice'
                }],
                [{
                    'unfiltered': 'hello%world',
                    'filtered': 'hello-world'
                }],
                [{
                    'unfiltered': 'unaffected-value;',
                    'filtered': 'unaffected-value'
                }],
                [{
                    'unfiltered': 'some" other" value',
                    'filtered': 'some-other-value'
                }],
                [{
                    'unfiltered': ' \\ \\ \\ \\ ',
                    'filtered': ''
                }],
                [{
                    'unfiltered': 'Not needing escape.',
                    'filtered': 'not-needing-escape'
                }],
                [{
                    'unfiltered': 'All your base are belong to us.',
                    'filtered': 'all-your-base-are-belong-to-us'
                }],
                [{
                    'unfiltered': ';All ;your ;base ;are ;belong ;to ;us.',
                    'filtered': 'all-your-base-are-belong-to-us'
                }]
            ];
        }

        //function invalidFilterCandidateProvider() {
        //    return [
        //        // Not of correct type for test:  Should throw exception
        //        [function () {
        //        }],
        //        // Not of correct type for test;  Should throw exception
        //        [true],
        //        // Not of correct type for test;  Should throw exception
        //        [99]
        //    ];
        //}

        var filter = new SlugFilter();
        filterDataProvider().forEach(function (args) {
            var filteredValue = args[0].filtered,
                unfilteredValue = args[0].unfiltered;
            it(`should return slug ${filteredValue} when \`value\` is ${unfilteredValue}.`, function () {
                expect(filter.filter(unfilteredValue)).to.equal(filteredValue);
                expect(SlugFilter.filter(unfilteredValue)).to.equal(filteredValue);
                expect(SlugFilter(unfilteredValue)).to.equal(filteredValue);
            });
        });

        //it ('should throw an error when attempting to filter unsupported values.', function () {
        //    invalidFilterCandidateProvider()[0].forEach(function (args) {
        //        return expect(SlugFilter(args[0])).to.throw(Error);
        //    });
        //});
    });

/**
 * Created by elydelacruz on 3/25/16.
 */
describe(
    'sjl.filter.StringToLowerFilter,' +
    'sjl.filter.StringToLowerFilter#filter,' +
    'sjl.filter.StringToLowerFilter.filter', function () {

                var StringToLowerFilter = sjl.filter.StringToLowerFilter;

        function filterDataProvider() {
            return [
                [{
                    'unfiltered': 'Hello.  What is your name?',
                    'filtered': 'hello.  what is your name?'
                }],
                [{
                    'unfiltered': 'Thrice as nice!',
                    'filtered': 'thrice as nice!'
                }],
                [{
                    'unfiltered': 'hello%world',
                    'filtered': 'hello%world'
                }],
                [{
                    'unfiltered': 'unaffected-value',
                    'filtered': 'unaffected-value'
                }],
                [{
                    'unfiltered': 'some" other" value',
                    'filtered': 'some" other" value'
                }],
                [{
                    'unfiltered': ' \\ \\ \\ \\ ',
                    'filtered': ' \\ \\ \\ \\ '
                }],
                [{
                    'unfiltered': 'All your base are belong to us.',
                    'filtered': 'all your base are belong to us.'
                }],
                [{
                    'unfiltered': ';All ;your ;base ;are ;belong ;to ;us.',
                    'filtered': ';all ;your ;base ;are ;belong ;to ;us.'
                }]
            ];
        }

        var filter = new StringToLowerFilter();

        filterDataProvider().forEach(function (args) {
            var filteredValue = args[0].filtered,
                unfilteredValue = args[0].unfiltered;
            it(`should return slug ${filteredValue} when \`value\` is ${unfilteredValue}.`, function () {
                expect(filter.filter(unfilteredValue)).to.equal(filteredValue);
                expect(StringToLowerFilter.filter(unfilteredValue)).to.equal(filteredValue);
                expect(StringToLowerFilter(unfilteredValue)).to.equal(filteredValue);
            });
        });

    });

/**
 * Created by elydelacruz on 3/25/16.
 */
describe(
    'sjl.filter.StringTrimFilter,' +
    'sjl.filter.StringTrimFilter#filter,' +
    'sjl.filter.StringTrimFilter.filter', function () {

            var StringTrimFilter = sjl.filter.StringTrimFilter;

        function filterDataProvider() {
            return [
                [{
                    'unfiltered': ' Hello.  What is your name? ',
                    'filtered': 'Hello.  What is your name?',
                }],
                [{
                    'unfiltered': '\n\tThrice as nice!\n\t',
                    'filtered': 'Thrice as nice!',
                }],
                [{
                    'unfiltered': '  \n\tAll your base ...\n\t  ',
                    'filtered': 'All your base ...',
                }],

            ];
        }

    var filter = new StringTrimFilter();
    filterDataProvider().forEach(function (args) {
        var filteredValue = args[0].filtered,
            unfilteredValue = args[0].unfiltered;
        it(`should return slug ${filteredValue} when \`value\` is ${unfilteredValue}.`, function () {
            expect(filter.filter(unfilteredValue)).to.equal(filteredValue);
            expect(StringTrimFilter.filter(unfilteredValue)).to.equal(filteredValue);
            expect(StringTrimFilter(unfilteredValue)).to.equal(filteredValue);
        });
    });

});

/**
 * Created by Ely on 3/30/2016.
 */


describe('sjl.filter.StripTagsFilter', function () {

        var StripTagsFilter = sjl.filter.StripTagsFilter;

    it ('should be an instance of StripTagsFilter constructor.', function () {
        expect(new StripTagsFilter()).to.be.instanceOf(StripTagsFilter);
    });

    describe('filter.StripTagsFilter.filter', function () {
            StripTagsFilter.filter(
                '<html lang="eng" lang="chinese" mambo="no.3">' +
                '<head mambo="no.9" mambo="hello" mambo="what is your name?">Hello</head>Hello World' +
                '<head>Hello</head><!-- This is a comment.  Hello World x2. -->Hello World' +
                '<head style="display: inline-block;">Hello</head>Hello World' +
                '<head>Hello<p>Carlos Patatos</p></head>Hello World' +
                '</html>', ['p'], ['lang', 'style', 'mambo'], true);
    });

});

/**
 * Created by Ely on 3/26/2016.
 */

describe ('sjl.input.Input', function () {

        var Input = sjl.ns.input.Input;

    describe('Should have the appropriate interface', function () {
        var input = new Input(),
            //propNames = [
            //    'allowEmpty',
            //    'continueIfEmpty',
            //    'breakOnFailure',
            //    'fallbackValue',
            //    'filterChain',
            //    'alias',
            //    'required',
            //    'validatorChain',
            //    'value',
            //    'rawValue',
            //    'messages'
            //],
            methodNames = [
                'isValid',
                'mergeValidatorChain'
            ],
            method;

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
 * Created by elydelacruz on 4/20/16.
 */
describe('sjl.wrapPointerWithinBounds', function () {

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

/**
 * Created by elyde on 1/15/2016.
 */

describe('sjl.validator.AlnumValidator', function () {

        var AlnumValidator = sjl.ns.validator.AlnumValidator,
        Validator = sjl.ns.validator.Validator;

    it ('should be a subclass of `Validator`.', function () {
        var validator = new AlnumValidator();
        expect(validator instanceof Validator).to.equal(true);
    });

    it ('should return `true` value is `alpha numeric` and `false` otherwise.', function () {
        var validator = new AlnumValidator(),
            values = [
                [true, 'helloworld'],
                [true, 'testingtesting123testingtesting123'],
                [true, 'sallysellsseashellsdownbytheseashore'],
                [false, 'hello[]world'],
                [false, '99 bottles of beer on the wall']
            ],
            // Falsy values count
            falsyValuesLen = values.filter(function (value) { return value[0] === false; }).length;

        // Validate values and expect value[0] to be return value of validation check
        values.forEach(function (value) {
            expect(validator.isValid(value[1])).to.equal(value[0]);
        });

        // Expect messages for falsy values
        expect(validator.messages.length).to.equal(falsyValuesLen);
    });

});

/**
 * Created by elyde on 1/15/2016.
 */
describe('sjl.validator.DigitValidator', function () {

        var DigitValidator = sjl.validator.DigitValidator,
        Validator = sjl.validator.Validator,
        generalValidator = new DigitValidator();

    it ('should be a subclass of `Validator`.', function () {
        expect(generalValidator instanceof Validator).to.equal(true);
    });

    describe ('instance properties', function () {
        it ('should have a `pattern` property of type `RegExp`.', function () {
            expect(sjl.classOf(generalValidator.pattern)).to.equal(RegExp.name);
        });
    });

    it ('should return `true` if value contains only digits.', function () {
        var validator = new DigitValidator(),
            values = [
                [true, '999'],
                [true, '123'],
                [true, 12345],
                [true, 0x009900],
                [false, false],
                [false, true],
                [false, ['a', 'b', 'c']],
                [false, 'hello[]world99'],
                [false, '99 bottles of beer on the wall']
            ];

        // Validate values and expect value[0] to be return value of validation check
        values.forEach(function (value) {
            var result = validator.isValid(value[1]);
            expect(result).to.equal(value[0]);
            if (value[0] === false) {
                expect(validator.messages.length).to.equal(1);
            }
        });
    });

});

/**
 * Created by elyde on 1/15/2016.
 */
describe('sjl.validator.NotEmptyValidator', function () {

        var NotEmptyValidator = sjl.ns.validator.NotEmptyValidator,
        Validator = sjl.ns.validator.Validator;

    it ('should be a subclass of `Validator`.', function () {
        var validator = new NotEmptyValidator();
        expect(validator instanceof Validator).to.equal(true);
    });

    it ('should return `true` for `validate` and `isValid` if value is not `empty`.', function () {
        var validator = new NotEmptyValidator();
        ['hello', 99, true, [1], {a: 1}].forEach(function (value) {
            expect(validator.validate(value)).to.equal(true);
            expect(validator.isValid(value)).to.equal(true);
        });
    });

    it ('should return `false` for `validate` and `isValid` if value is `empty`.', function () {
        var validator = new NotEmptyValidator();
        ['', 0, false, [], {}].forEach(function (value) {
            expect(validator.validate(value)).to.equal(false);
            expect(validator.isValid(value)).to.equal(false);
        });
    });

    it ('should have messages when `validate` returns false.', function () {
        var validator = new NotEmptyValidator();
        ['', 0, false, [], {}].forEach(function (value) {
            expect(validator.validate(value)).to.equal(false);
            expect(validator.messages.length > 0).to.equal(true);
        });
    });

});

/**
 * Created by edelacruz on 7/28/2014.
 */

describe('sjl.validator.NumberValidator`', function () {

        var Validator = sjl.ns.validator.Validator,
        NumberValidator = sjl.ns.validator.NumberValidator;

    // @note got algorithm from http://www.wikihow.com/Convert-from-Decimal-to-Hexadecimal
    const hexMap = [
        [0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5],
        [6, 6], [7, 7], [8, 8], [9, 9], [10, 'A'], [11, 'B'],
        [12, 'C'], [13, 'D'], [14, 'E'], [15, 'F']
    ];

    function numToHex(d) {
        var q,
            r,
            a = [],
            out = '0x';
        do {
            q = parseInt(d / 16, 10);
            r = d - (q * 16);
            a.push(hexMap[r][1]);
            d = q;
        }
        while (q > 0);
        for (var i = a.length - 1; i >= 0; i -= 1) {
            out += a[i];
        }
        return out;
    }

    function fib(limit) {
        var out = [],
            a = 0,
            b = 1;
        while (a <= limit) {
            out.push(a);
            if (b <= limit) {
                out.push(b);
            }
            a = a + b;
            b = a + b;
        }
        return out;
    }

    function createValidationParser (validator, funcs) {
        return function (value) {
            return validator._parseValidationFunctions.call(validator, funcs, value);
        };
    }

    it('should be a subclass of `Validator`.', function () {
        expect((new NumberValidator()) instanceof Validator).to.equal(true);
        expect((new NumberValidator()) instanceof NumberValidator).to.equal(true);
    });

    describe('`_validateHex`', function () {
        it('should return an array of [1, Number] when hex value is a valid hex value.', function () {
            var vals = fib(1000).map(function (value) {
                    return [value, numToHex(value), 1];
                }),
                validator,
                failingVals;

            // Instantiate validator (set separately to easily debug
            validator = new NumberValidator({allowHex: true});

            // Failing values
            // Last index in inner arrays stand for untouched;  NumberValidator#_validate* functions return an array of
            // [performedOpFlag{Number[-1,0,1]}, value{String|Number|*}]  `performedOpFlag` is:
            // -- -1 was candidate for test but test failed
            // -- 0 is not candidate so value wasn't touched
            // -- 1 was candidate value and test passed and value was transformed
            failingVals = [
                [Math.floor(Math.random() * 98), 'object', 0],
                [Math.floor(Math.random() * 97), 'somevalue', 0],
                [Math.floor(Math.random() * 96), 'someothervalue', 0],
                [Math.floor(Math.random() * 95), 'someothervalue', 0],
                [Math.floor(Math.random() * 94), 'someothervalue', 0]
            ];

            // Test values
            vals.forEach(function (value, index) {
                var checkedValuePair = validator._validateHex(value[1]);
                //console.log(blnValue, hexValue, checkedValuePair);
                expect(checkedValuePair[1]).to.equal(vals[index][0]);
                expect(checkedValuePair[0]).to.equal(vals[index][2]);
            });

            // Zero error messages;  All checks up to should have passed
            expect(validator.messages.length).to.equal(0);

            // Test values
            failingVals.forEach(function (value, index) {
                var checkedValuePair = validator._validateHex(value[1]);
                expect(checkedValuePair[1]).to.equal(failingVals[index][1]);
                expect(checkedValuePair[0]).to.equal(failingVals[index][2]);
            });

            // Expect length of `failingVals`
            expect(validator.messages.length).to.equal(0);
        });
    });

    describe('`_validateSigned', function () {
        it ('should return [-1, value] when value is a signed number.', function () {
            var validator = new NumberValidator({allowSigned: false}),
                values = [
                    // Should return failure (-1) and value
                    [-1, -3], [-1, -999.99], [-1, -0x99ff99], [-1, '+100'],
                    // Should return untouched and value
                    [0, 99], [0, '123123.234e20'], [0, 0xff9900]],
                result;

            // Test for `allowSigned` is false
            values.forEach(function (value, index) {
                result = validator._validateSigned(value[1]);
                expect(result[0]).to.equal(values[index][0]);
                expect(result[1]).to.equal(values[index][1]);
            });
        });
    });

    describe('`_validateComma', function () {
        it ('should return [-1, value] when value contains comma(s) and `allowComma` is `false`.', function () {
            var validator = new NumberValidator(),
                valuesWithCommas = [[-1, ',1,000,000,000', 1000000000], [-1, ',', ','], [-1, '1,000,000', 1000000], [-1, '+100,000', 100000]],
                valuesWithCommas2 = [[1, ',1,000,000,000', 1000000000], [-1, ',', ','], [1, '1,000,000', 1000000], [1, '+100,000', 100000]],
                valuesWithoutCommas = [[0, 99], [0, '123123.234e20'], [0, 0xff9900]],
                values = valuesWithCommas.concat(valuesWithoutCommas),
                result;

            // Test for `allowComma` is false
            values.forEach(function (value, index) {
                result = validator._validateComma(value[1]);
                expect(result[0]).to.equal(values[index][0]);
                expect(result[1]).to.equal(values[index][1]);
            });

            // Test for `allowComma` is true
            validator.allowCommas = true;
            valuesWithCommas2.forEach(function (value, index) {
                result = validator._validateComma(value[1]);
                expect(result[0]).to.equal(valuesWithCommas2[index][0]);
                expect(result[1]).to.equal(valuesWithCommas2[index][2]);
            });
        });
    });

    describe('`_validateFloat', function () {
        it ('should return [-1, value] when value contains a decimal point and `allowFloat` is `false`.', function () {
            var validator = new NumberValidator({allowFloat: false}),
                valuesWithFloats = [[-1, ',1,000,000,000.00'], [-1, '.', '.'], [-1, '1,000,000.00'], [-1, '+100,000.00']],
                valuesWithFloats2 = [[0, ',1,000,000,000.00'], [0, '.', '.'], [0, '1,000,000.00'], [0, '+100,000.00']],
                //valuesWithoutFloats = [[0, 99], [0, '123123e10'], [0, 0xff9900]],
                //values = valuesWithFloats.concat(valuesWithoutFloats),
                result;

            // Test for `allowFloat` is false
            valuesWithFloats.forEach(function (value, index) {
                result = validator._validateFloat(value[1]);
                expect(result[0]).to.equal(valuesWithFloats[index][0]);
                expect(result[1]).to.equal(valuesWithFloats[index][1]);
            });

            //// Test for `allowFloat` is true
            validator.allowFloat = true;
            valuesWithFloats2.forEach(function (value, index) {
                result = validator._validateFloat(value[1]);
                expect(result[0]).to.equal(valuesWithFloats2[index][0]);
                expect(result[1]).to.equal(valuesWithFloats2[index][1]);
            });
        });
    });

    describe('`_validateBinary', function () {
        it ('should return [-1, value] when value contains a decimal point and `allowBinary` is `false`.', function () {
            var validator = new NumberValidator({allowBinary: false}),
                binaryValues = [[-1, 'abcdefg'], [-1, '0b98345'], [-1, '0b111'], [0, '9999'], [0, 9999], [-1, 'bb010101'], [-1, '0b01010101']],
                binaryValues2 = [[-1, 'abcdefg'], [-1, '0b98345'], [1, '0b111'], [0, '9999'], [0, 9999], [-1, 'bb010101'], [1, '0b01010101']],
                result;

            // Test for `allowBinary` is false
            binaryValues.forEach(function (value, index) {
                result = validator._validateBinary(value[1]);
                expect(result[0]).to.equal(binaryValues[index][0]);
                expect(result[1]).to.equal(binaryValues[index][1]);
            });

            //// Test for `allowBinary` is true
            validator.allowBinary = true;
            binaryValues2.forEach(function (value, index) {
                result = validator._validateBinary(value[1]);
                //console.log(result, binaryValues2[index]);
                expect(result[0]).to.equal(binaryValues2[index][0]);
                if (result[0] !== 1) {
                    expect(result[1]).to.equal(binaryValues2[index][1]);
                }
                else {
                    expect(result[1]).to.equal(Number(binaryValues2[index][1]));
                }
            });
        });
    });

    describe('`_validateOctal', function () {
        it ('should return [-1, value] when value contains a decimal point and `allowOctal` is `false`.', function () {
            var validator = new NumberValidator({allowOctal: false}),
                octalValues = [[0, '999'], [0, 999], [0, '0b111'], [-1, '0777'], [-1, '0757']],
                octalValues2 = [[0, '999'], [0, 999], [0, '0b111'], [1, '0777'], [1, '0757']],
                result;

            // Test for `allowOctal` is false
            octalValues.forEach(function (value, index) {
                result = validator._validateOctal(value[1]);
                expect(result[0]).to.equal(octalValues[index][0]);
                expect(result[1]).to.equal(octalValues[index][1]);
            });

            //// Test for `allowOctal` is true
            validator.allowOctal = true;
            octalValues2.forEach(function (value, index) {
                result = validator._validateOctal(value[1]);
                expect(result[0]).to.equal(octalValues2[index][0]);
                if (result[0] !== 1) {
                    expect(result[1]).to.equal(octalValues2[index][1]);
                }
                else {
                    expect(result[1]).to.equal(parseInt(octalValues2[index][1], 8));
                }
            });
        });
    });

    describe('`_validateScientific', function () {
        it ('should return [-1, value] when value contains a decimal point and `allowScientific` is `false`.', function () {
            var validator = new NumberValidator({allowScientific: false}),
                scientificValues = [[0, '999'], [0, 999], [0, '0b111'], [-1, '10e10'], [-1, '-29.01e+29'], [-1, '29.01e-29'], [-1, '29.01e29'], [-1, '29e29']],
                scientificValues2 = [[0, '999'], [0, 999], [0, '0b111'], [1, '10e10'], [1, '-29.01e+29'], [1, '29.01e-29'], [1, '29.01e29'], [1, '29e29']],
                result;

            // Test for `allowScientific` is false
            scientificValues.forEach(function (value, index) {
                result = validator._validateScientific(value[1]);
                expect(result[0]).to.equal(scientificValues[index][0]);
                expect(result[1]).to.equal(scientificValues[index][1]);
            });

            //// Test for `allowScientific` is true
            validator.allowScientific = true;
            scientificValues2.forEach(function (value, index) {
                result = validator._validateScientific(value[1]);
                expect(result[0]).to.equal(scientificValues2[index][0]);
                if (result[0] !== 1) {
                    expect(result[1]).to.equal(scientificValues2[index][1]);
                }
                else {
                    expect(result[1]).to.equal(Number(scientificValues2[index][1]));
                }
            });
        });
    });

    describe('`_validateRange', function () {
        it ('should return [-1, value] when value contains a decimal point and `allowRange` is `false`.', function () {
            var validator = new NumberValidator({checkRange: false}),
                rangeValues = [[0, 999], [0, 100], [0, 'abc']],
                rangeValues2 = [[-1, 999, 0, 998], [1, 999, 0, 999], [-1, 999, 99, 100]],
                result;

            // Test for `allowRange` is false
            rangeValues.forEach(function (value, index) {
                result = validator._validateRange(value[1]);
                expect(result[0]).to.equal(rangeValues[index][0]);
                expect(result[1]).to.equal(rangeValues[index][1]);
            });

            validator.checkRange = true;
            validator.inclusive = true;
            rangeValues2.forEach(function (value, index) {
                validator.min = value[2];
                validator.max = value[3];
                result = validator._validateRange(value[1]);
                //console.log(result, value);
                expect(result[0]).to.equal(rangeValues2[index][0]);
                expect(result[0]).to.equal(rangeValues2[index][0]);
                expect(result[1]).to.equal(rangeValues2[index][1]);
            });
        });
    });

    describe('`_parseValidationFunctions`', function () {
        var validator = new NumberValidator({
            allowHex: true,
            allowBinary: true,
            allowOctal: true,
            allowCommas: true,
            allowScientific: true
        }),
            numTypeFuncs = ['_validateComma', '_validateHex',
                '_validateBinary', '_validateOctal', '_validateScientific'],
            parser = createValidationParser(validator, numTypeFuncs),
            values = [
                [1, numToHex(999), 999],
                [1, numToHex(1500), 1500],
                [1, '0b0101010', 42],
                [1, '0b111', 7],
                [1, '0747', 487],
                [1, '0777', 511],
                [1, '12e2', 1200],
                [1, '-12e2', -1200],
                [1, '-12e-2', -0.12],
                [1, '1,000.35', 1000.35],
                [1, '1,000,000.35', 1000000.35],
                [0, 'helloworld', 'helloworld'],
                [-1, '0ehello', '0ehello'],
                [-1, '0bhello', '0bhello'],
                [0, '0x', '0x']
            ],
            result;

        values.forEach(function (value) {
            result = parser(value[1]);
            expect(result[0]).to.equal(value[0]);
            expect(result[1]).to.equal(value[2]);
        });
    });

    describe ('`isValid`', function () {
        var validator = new NumberValidator({
                allowFloat: true,
                allowHex: true,
                allowBinary: true,
                allowOctal: true,
                allowCommas: true,
                allowScientific: true,
                allowSigned: true
        }),
            values = [
                [true, 999, 999],
                [true, -999, -999],
                [true, 10e2, 200],
                [true, 0xff9900, 200],
                [true, 999.88, 999.88],
                [true, numToHex(999), 999],
                [true, numToHex(1500), 1500],
                [true, '0b0101010', 42],
                [true, '0b111', 7],
                [true, '0747', 487],
                [true, '0777', 511],
                [true, '12e2', 1200],
                [true, '-12e2', -1200],
                [true, '-12e-2', -0.12],
                [true, '1,000.35', 1000.35],
                [true, '1,000,000.35', 1000000.35],
                [false, 'helloworld', 'helloworld'],
                [false, '0ehello', '0ehello'],
                [false, '0bhello', '0bhello'],
                [false, '0x', '0x']
            ];

        values.forEach(function (value) {
            expect(validator.isValid(value[1])).to.equal(value[0]);
        });

        // Ensure we have 7
        expect(validator.messages.length).to.equal(7);
    });

});

/**
 * Created by edelacruz on 7/28/2014.
 */
describe('sjl.validator.RegexValidator`', function () {


        var Validator = sjl.ns.validator.Validator,
        RegexValidator = sjl.ns.validator.RegexValidator;

    it('should be a subclass of `Validator`.', function () {
        expect((new RegexValidator()) instanceof Validator).to.equal(true);
        expect((new RegexValidator()) instanceof RegexValidator).to.equal(true);
    });

    function regexTest(keyValMap, validator, expected) {
        var key, value, regex;
        for (key in keyValMap) {
            value = keyValMap[key];
            regex = new RegExp(key);
            validator.pattern = regex;
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
        validator = new sjl.ns.validator.RegexValidator();

    // Run tests
    regexTest(truthyMap, validator, true);
    regexTest(falsyMap, validator, false);

});

/**
 * Created by elyde on 1/15/2016.
 */



describe('sjl.validator.StringLengthValidator', function () {

        var StringLengthValidator = sjl.validator.StringLengthValidator,
        Validator = sjl.validator.Validator,
        testUtils = sjl.utils.testUtils,
        generalValidator = new StringLengthValidator();

    it ('should be a subclass of `Validator`.', function () {
        expect(generalValidator instanceof Validator).to.equal(true);
    });

    describe ('instance properties', function () {
        it ('should have a min and max property.', function () {
            expect(sjl.classOf(generalValidator.min)).to.equal(Number.name);
            expect(sjl.classOf(generalValidator.max)).to.equal(Number.name);
        });
        it ('should have a default value of `0` for `min` property.', function () {
            expect(generalValidator.min).to.equal(0);
        });
        it ('should have a default value of `' + Number.POSITIVE_INFINITY + '` for `max` property.', function () {
            expect(generalValidator.max).to.equal(Number.POSITIVE_INFINITY);
        });
    });

    it ('should return `true` value.length is within default range.', function () {
        var validator = new StringLengthValidator(),
            values = [
                [true, 'helloworld'],
                [true, 'testingtesting123testingtesting123'],
                [true, 'sallysellsseashellsdownbytheseashore'],
                [true, 'hello[]world'],
                [true, '99 bottles of beer on the wall']
            ];

        // Validate values and expect value[0] to be return value of validation check
        values.forEach(function (value) {
            expect(validator.isValid(value[1])).to.equal(value[0]);
        });

        // Expect messages for falsy values
        expect(validator.messages.length).to.equal(0);
    });

    describe ('isValid with set min and max values', function () {
        var validator = new StringLengthValidator({min: 0, max: 55}),
            values = [
                [true, 'within', 'helloworld'],
                [true, 'within', 'testingtesting123testingtesting123'],
                [true, 'within', 'sallysellsseashellsdownbytheseashore'],
                [true, 'within', 'hello[]world'],
                [true, 'within', '99 bottles of beer on the wall'],
                [false, 'without', testUtils.repeatStr('a', 56)],
                [false, 'without', testUtils.repeatStr('b', 99)]
            ];

        // Validate values and expect value[0] to be return value of validation check
        values.forEach(function (args) {
            it ('should return `' + args[0] + '` when value.length is '+ args[1] +' allowed range.', function () {
                expect(validator.isValid(args[2])).to.equal(args[0]);
            });
        });

        // Expect messages for falsy values
        expect(validator.messages.length).to.equal(0);
    });

});

/**
 * Created by elyde on 1/15/2016.
 */
describe('sjl.validator.Validator', function () {

        var Validator = sjl.ns.validator.Validator,

        expectedPropertyAndTypes = {
            messages: 'Array',
            messagesMaxLength: 'Number',
            messageTemplates: 'Object',
            valueObscured: 'Boolean',
            value: 'Null'
        },
        expectedMethodNames = [

            // Value getter and setters
            //'messages',
            //'messagesMaxLength',
            //'messageTemplates',
            //'valueObscured',
            //'value',

            // Application methods
            'addErrorByKey',
            'clearMessages',
            'validate',
            'isValid'
        ];

    it('should have the expected properties as expected types.', function () {
        var validator = new Validator();
        Object.keys(expectedPropertyAndTypes).forEach(function (key) {
            expect(validator.hasOwnProperty(key)).to.equal(true);
            expect(sjl.classOf(validator[key])).to.equal(expectedPropertyAndTypes[key]);
        });
    });

    it('should have the expected methods.', function () {
        var validator = new Validator();
        expectedMethodNames.forEach(function (methodName) {
            expect(typeof validator[methodName]).to.equal('function');
            expect(typeof Validator.prototype[methodName]).to.equal('function');
        });
    });

});

/**
 * Created by edelacruz on 7/28/2014.
 */

describe('sjl.validator.ValidatorChain', function () {

        var Validator =         sjl.ns.validator.Validator,
        ValidatorChain =    sjl.ns.validator.ValidatorChain,
        RegexValidator =    sjl.ns.validator.RegexValidator,
        NumberValidator =   sjl.ns.validator.NumberValidator,
        NotEmptyValidator = sjl.ns.validator.NotEmptyValidator,
        AlnumValidator =    sjl.ns.validator.AlnumValidator;

    it ('should extend `sjl.ns.validator.Validator', function () {
        expect((new ValidatorChain()) instanceof Validator).to.equal(true);
    });

    it('should have the appropriate interface', function () {
        var chain = new ValidatorChain(),
            methods = ['isValid', 'addValidator', 'addValidators'];
        methods.forEach(function (method) {
            expect(typeof chain[method]).to.equal('function');
        });
    });

    it('should merge in passed in options on construction.', function () {
        var validators = [
                new RegexValidator({pattern: /^somepatternhere$/}),
                new NumberValidator(),
                new NotEmptyValidator()
            ],
            defaults = {
                validators: validators.concat([]),
                breakChainOnFailure: true
            },
            validatorChain = new ValidatorChain(defaults);
        expect(validatorChain.breakChainOnFailure).to.equal(defaults.breakChainOnFailure);
        expect(validatorChain.validators.length).to.equal(defaults.validators.length);
        validatorChain.validators.forEach(function (validator, index) {
            expect(defaults.validators[index]).to.equal(validator);
        });
    });

    describe('`isValidator`', function () {
        it('should return true when object is a validator and false when it isn\'t.', function () {
            var validatorChain = new ValidatorChain(),
                regexValidator = new RegexValidator({pattern: /^\d+$/});
            expect(validatorChain.isValidator(regexValidator)).to.equal(true);
            expect(validatorChain.isValidator({})).to.equal(false);
        });
    });

    describe('`isValidatorChain`', function () {
        it('should return true when object is a validator chain and false when it isn\'t.', function () {
            var validatorChain = new ValidatorChain(),
                otherValidatorChain = new ValidatorChain();
            expect(validatorChain.isValidatorChain(otherValidatorChain)).to.equal(true);
            expect(validatorChain.isValidatorChain({})).to.equal(false);
        });
    });

    describe('`addValidator`', function () {
        it('should be able to add a validator to it\'s validator list.', function () {
            var validatorChain = new ValidatorChain(),
                regexValidator = new RegexValidator({pattern: /^\d+$/});
            expect(validatorChain.addValidator(regexValidator)).to.equal(validatorChain);
            expect(validatorChain.validators[0]).to.equal(regexValidator);
            expect(validatorChain.validators.length).to.equal(1);
        });
    });

    describe('`addValidators`', function () {
        it('should be able to add a multiple validators from an array or from an object.', function () {
            var validatorChain = new ValidatorChain(),

                // Array to add validators from
                arrayOfValidators = [
                    new RegexValidator({pattern: /^somepatternhere$/}),
                    new AlnumValidator(),
                    new NotEmptyValidator()
                ],

                // Obj to add validators from
                objOfValidators = {},

                // Obj iterator from where to get values from objOfValidators
                objectIterator;

            // Expect returns self
            expect(validatorChain.addValidators(arrayOfValidators)).to.equal(validatorChain);

            // Expect added all validators in list
            expect(validatorChain.validators.length).to.equal(arrayOfValidators.length);

            // Validate additions
            arrayOfValidators.forEach(function (validator, index) {
                expect(validatorChain.validators[index]).to.equal(validator);

                // Inject `objOfValidators` with validator
                objOfValidators[sjl.lcaseFirst(sjl.classOf(validator))] = validator;
            });

            // Clear validators
            validatorChain.validators = [];

            // Ensure validators cleared out
            expect(validatorChain.validators.length).to.equal(0);

            // Iterator
            objectIterator = new sjl.ns.stdlib.ObjectIterator(objOfValidators);

            // Expect returns self
            expect(validatorChain.addValidators(objOfValidators)).to.equal(validatorChain);

            // Expect added all validators in list
            expect(validatorChain.validators.length).to.equal(objectIterator.values.length);

            // Validate additions
            objectIterator.values.forEach(function (validator, index) {
                expect(validatorChain.validators[index]).to.equal(validator);
            });

        });
    });

    describe('`prependValidator`', function () {
        it('should be able to add a multiple validators from an array or from an object.', function () {
            var validatorChain = new ValidatorChain(),
                validatorToPrepend = new NumberValidator(),

                // Array to add validators from
                arrayOfValidators = [
                    new RegexValidator({pattern: /^somepatternhere$/}),
                    new AlnumValidator(),
                    new NotEmptyValidator()
                ],

                // Run op
                resultOfOp = validatorChain.addValidators(arrayOfValidators)
                    .prependValidator(validatorToPrepend);

            // Expect returns self
            expect(resultOfOp).to.equal(validatorChain);
            expect(validatorChain.validators.length).to.equal(arrayOfValidators.length + 1);
            expect(validatorChain.validators[0]).to.equal(validatorToPrepend);
        });
    });

    describe('`mergeValidatorChain`', function () {
        it('should be able to add a multiple validators from an array or from an object.', function () {
            var // Array to add validators from
                arrayOfValidators = [
                    new NotEmptyValidator(),
                    new AlnumValidator(),
                ],

                // Array to add validators from
                arrayOfValidators2 = [
                    new NotEmptyValidator(),
                    new NumberValidator()
                ],

                // Chain to merge to
                validatorChain = new ValidatorChain({
                    validators: arrayOfValidators.concat([]),
                    breakChainOnFailure: false
                }),

                // Copy of chain to merge to
                //copyOfValidatorChain = new ValidatorChain({
                //    validators: arrayOfValidators.concat([]),
                //    breakChainOnFailure: false
                //}),

                // Chain to merge from
                validatorChain2 = new ValidatorChain({
                    validators: arrayOfValidators2.concat([]),
                    breakChainOnFailure: true
                }),

                // Run op
                resultOfOp = validatorChain.mergeValidatorChain(validatorChain2);

            // Expect correct length of validators
            expect(validatorChain.validators.length).to.equal(arrayOfValidators.length + arrayOfValidators2.length);

            // Expect merged in `breakChainOnFailure`
            expect(validatorChain.breakChainOnFailure).to.equal(true);

            // Expect original validator chain to be returned
            expect(resultOfOp).to.equal(validatorChain);
        });


    });

    describe('`isValid`', function () {
        var // Array to add validators from
            arrayOfValidators = [
                new NotEmptyValidator(),
                new AlnumValidator(),
            ],

            // Array to add validators from
            arrayOfValidators2 = [
                new NotEmptyValidator(),
                new NumberValidator()
            ],

            // Chain to merge to
            validatorChain = new ValidatorChain({
                validators: arrayOfValidators.concat([]),
                breakChainOnFailure: false
            }),

            // Copy of chain to merge to
            copyOfValidatorChain = new ValidatorChain({
                validators: arrayOfValidators.concat([]),
                breakChainOnFailure: false
            }),

            // Chain to merge from
            validatorChain2 = new ValidatorChain({
                validators: arrayOfValidators2.concat([]),
                breakChainOnFailure: true
            }),

            // Merge validator into first validator
            resultOfOp = validatorChain.mergeValidatorChain(validatorChain2);

        expect(copyOfValidatorChain.isValid('helloworld')).to.equal(true);
        expect(copyOfValidatorChain.messages.length).to.equal(0);

        expect(validatorChain.isValid('helloworld')).to.equal(false); // this chain has a number validator in it so 'helloworld' should fail
        expect(validatorChain.messages.length).to.equal(1);

        expect(validatorChain2.isValid('helloworld')).to.equal(false); // this chain has a number validator in it so 'helloworld' should fail
        expect(validatorChain2.messages.length).to.equal(2);

        // @note validator.messages get cleared from within `isValid` before validation occurs
        expect(validatorChain2.isValid(99)).to.equal(true);
        expect(validatorChain2.messages.length).to.equal(0);

        // Expect return value of merge operation to be original validator chain
        expect(resultOfOp).to.equal(validatorChain);
    });

});
