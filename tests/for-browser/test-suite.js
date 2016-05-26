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
describe('sjl.filter.SlugFilter,', function () {

        var BooleanFilter = sjl.filter.BooleanFilter;

    it('should be a subclass of sjl.filter.Filter.', function () {
        expect(new BooleanFilter()).to.be.instanceof(sjl.filter.Filter);
    });

    it('should have expected interface.', function () {
        var filter = new BooleanFilter();

        // expect has required method(s)
        expect(typeof filter.filter).to.equal('function');

        // Expect has required properties
        ['allowCasting', 'conversionRules', 'translations'].forEach(function (key) {
            expect(sjl.isset(filter[key])).to.be.true();
        });

        // Expect has required static properties
        ['filter', 'castingRules'].forEach(function (key) {
            expect(sjl.isset(BooleanFilter[key])).to.be.true();
        });
    });

    it('should return a Boolean as is when it is filtering a Boolean.', function () {
        var filter = new BooleanFilter();
        expect(filter.filter(true)).to.be.true();
        expect(filter.filter(false)).to.be.false();
    });

    it('should return a `false` for all empty values.', function () {
        var filter = new BooleanFilter();
        [function () {
        }, null, undefined, [], {}, ''].forEach(function (value) {
            expect(filter.filter(value)).to.be.false();
        });
    });

    it('should return a `true` for all non-empty values.', function () {
        var filter = new BooleanFilter();
        [[1, 2, 3], 'hello', true, {hello: 'world'}].forEach(function (value) {
            expect(filter.filter(value)).to.be.true();
        });
    });

    it('should return `false` for all empty values representations as strings ["null", "false", etc.].', function () {
        var filter = new BooleanFilter();
        ['0', 'null', 'undefined', '[]', '{}', 'false'].forEach(function (value) {
            expect(filter.filter(value)).to.be.false();
        });
    });

    it('should cast "yes" and any translations passed in to boolean (based on translations passed in).', function () {
        var filter = new BooleanFilter({
            conversionRules: ['yesNo', 'boolean'],
            translations: {'hai': true, 'si': true}
        });
        ['yes', 'si', 'hai'].forEach(function (value) {
            expect(filter.filter(value)).to.be.true();
        });
        ['no', 'niet', 'hello', 'how are you'].forEach(function (value) {
            expect(filter.filter(value)).to.be.false();
        });
    });

    it('should cast "no" and any translations for it, passed in, to boolean (based on translations passed in).', function () {
        var filter = new BooleanFilter({
            conversionRules: ['yesNo'],
            translations: {'iie': false, 'niet': false, 'yes': true, 'si': true, 'hai': true, 'da': true}
        });
        ['no', 'niet', 'iie'].forEach(function (value) {
            expect(filter.filter(value)).to.be.false();
        });
        ['yes', 'si', 'hai', 'da'].forEach(function (value) {
            expect(filter.filter(value)).to.be.true();
        });
    });

    it ('should return true for values that assert to true based on passed in conversion rules.', function () {
        var ruleSets = [
                ['yesNo', 'boolean'],
                ['boolean'],
                [],
                ['all']
            ],
            valueSets = [
                ['yes', 'si', 'hai', 'da', true],
                [true],
                [true],
                ['yes', 'si', 'hai', true, 1, 99, 100, {hello: 'hello'}, [1,2,3]]
            ],
            translationSets = [
                [{yes: true, si: true, hai: true, da: true}],
                [{}],
                [{}],
                [{}]
            ],
            filter = new BooleanFilter();

        ruleSets.forEach(function (ruleSet, index) {
            filter.conversionRules = ruleSet;
            filter.translations = translationSets[index][0];
            valueSets[index].forEach(function (value) {
                expect(filter.filter(value)).to.be.true();
            });
        });

    });

});

/**
 * Created by elydelacruz on 5/18/16.
 */

describe('sjl.filter.Filter', function () {

        // Get filter constructor
    var Filter = sjl.filter.Filter;

    it ('should be a subclass of sjl.stdlib.Extendable', function () {
        expect(new Filter()).to.be.instanceof(sjl.stdlib.Extendable);
    });

    it ('should have the appropriate interface.', function () {
        expect((new Filter()).filter).to.be.instanceof(Function);
    });
});

/**
 * Created by elydelacruz on 5/18/16.
 */

describe('sjl.filter.FilterChain', function () {

        var Filter =                sjl.filter.Filter,
        FilterChain =           sjl.filter.FilterChain,
        BooleanFilter =         sjl.filter.BooleanFilter,
        StringToLowerFilter =   sjl.filter.StringToLowerFilter,
        StringTrimFilter =      sjl.filter.StringTrimFilter,
        SlugFilter =            sjl.filter.SlugFilter,
        StripTagsFilter =       sjl.filter.StripTagsFilter;

    describe ('Constructor', function () {
        it ('should be a subclass of sjl.stdlib.Extendable', function () {
            expect(new FilterChain()).to.be.instanceof(sjl.stdlib.Extendable);
        });
        it ('should have populated filters when they are passed in on construction.', function () {
            var filters = [new StripTagsFilter()];
            expect((new FilterChain(filters)).filters.length).to.equal(filters.length);
        });
    });

    describe ('Properties', function () {
        it ('should have expected proporties.', function () {
            expect((new FilterChain()).filters).to.be.instanceof(Array);
        });
        describe ('#filter', function () {
            it ('should pass passed in filters through filter adding mechanisms', function () {
                var filterChain = new FilterChain(),
                    filters1 = [
                        new StringToLowerFilter(),
                        new StringTrimFilter()
                    ],
                    filters2 = [
                        new StringTrimFilter(),
                        new StringToLowerFilter(),
                        new BooleanFilter(),
                    ];
                filterChain.filters = filters1;
                expect(filterChain.filters.length).to.equal(filters1.length);
                filters1.forEach(function (filter, index) {
                    expect(filterChain.filters[index]).to.equal(filter);
                });
                filterChain.filters = filters2;
                expect(filterChain.filters.length).to.equal(filters2.length);
                filters2.forEach(function (filter, index) {
                    expect(filterChain.filters[index]).to.equal(filter);
                });
            });
        });
    });

    describe ('Methods', function () {

        it ('should have the appropriate interface.', function () {
            var filterChain = new FilterChain();

            [   'filter', 'isFilter', 'isFilterChain',
                'addFilter', 'addFilters', 'prependFilter',
                'mergeFilterChain'
            ]
                .forEach(function (methodName) {
                    expect(filterChain[methodName]).to.be.instanceof(Function);
                });
        });

        describe ('#filter', function () {
            var filter = new FilterChain(),
                filters = [
                    new StringToLowerFilter(),
                    new StringTrimFilter()
                ];
        });

        describe ('#isFilter', function () {
            var filterChain = new FilterChain();
            it ('should return false when passed in value is not a filter.', function () {
                expect(filterChain.isFilter({})).to.equal(false);
                expect(filterChain.isFilter(function () {})).to.equal(false);
            });
            it ('should return true when passed in value is filter.', function () {
                expect(filterChain.isFilter(new SlugFilter())).to.equal(true);
                expect(filterChain.isFilter(new StripTagsFilter())).to.equal(true);
            });
            it ('should return false when no value is passed in.', function () {
                expect(filterChain.isFilter()).to.equal(false);
            });
        });

        describe ('#isFilterChain', function () {
            var filterChain = new FilterChain();
            it ('should return false when passed in value is not a filter chain.', function () {
                expect(filterChain.isFilterChain({})).to.equal(false);
                expect(filterChain.isFilterChain(function () {})).to.equal(false);
            });
            it ('should return true when passed in value is filter chain.', function () {
                expect(filterChain.isFilterChain(new FilterChain())).to.equal(true);
            });
            it ('should return false when no value is passed in.', function () {
                expect(filterChain.isFilterChain()).to.equal(false);
            });
        });

        describe ('#addFilter', function () {
            it ('should add a filter to it\'s list of filters and return itself after doing so.', function () {
                var filterChain = new FilterChain(),
                    filter = new SlugFilter(),
                    result = filterChain.addFilter(filter);
                expect(filterChain.filters[0]).to.equal(filter);
                expect(result).to.equal(filterChain);
            });
            it ('should throw an error when trying to add non filter values as a filter.', function () {
                var filterChain = new FilterChain(),
                    caughtError;
                try {
                    filterChain.addFilter({});
                }
                catch (e) {
                    caughtError = e;
                }
                expect(caughtError).to.be.instanceof(TypeError);
            });
            it ('should throw an error when no value is passed in.', function () {
                var filterChain = new FilterChain(),
                    caughtError;
                try {
                    filterChain.addFilter();
                }
                catch (e) {
                    caughtError = e;
                }
                expect(caughtError).to.be.instanceof(TypeError);
            });
        });

        describe ('#addFilters', function () {
            it ('should be able to add a list of filters from passed in array of filters.', function () {
                var filterChain = new FilterChain(),
                    filters = [
                        new BooleanFilter(),
                        new SlugFilter(),
                        new StringToLowerFilter(),
                        new StringTrimFilter(),
                        new StripTagsFilter()
                    ],
                    result = filterChain.addFilters(filters);

                filters.forEach(function (filter, index) {
                    expect(filterChain.filters[index]).to.equal(filter);
                });
                expect(result).to.equal(filterChain);
            });
            it ('should be able to add filters from passed in object of filter key-value pairs.', function () {
                var filterChain = new FilterChain(),
                    filters = {
                        blnFilter: new BooleanFilter(),
                        slugFilter: new SlugFilter(),
                        strToLowerFilter: new StringToLowerFilter(),
                        strTrimFilter: new StringTrimFilter(),
                        stripTagsFilter: new StripTagsFilter()
                    },
                    result = filterChain.addFilters(filters);

                Object.keys(filters).forEach(function (key, index) {
                    expect(filterChain.filters[index]).to.equal(filters[key]);
                });
                expect(result).to.equal(filterChain);
            });
            it ('should throw an error when passed in value is not an Object or an Array.', function () {
                var filterChain = new FilterChain();
                [99, 'hello-world'].forEach(function (value) {
                    var caughtError;
                    try {
                        filterChain.addFilters(value);
                    }
                    catch (e) {
                        caughtError = e;
                    }
                    expect(caughtError).to.be.instanceof(TypeError);
                });
            });
            it ('should throw an error when no value is passed in.', function () {
                var filterChain = new FilterChain(),
                    caughtError;
                try {
                    filterChain.addFilters();
                }
                catch (e) {
                    caughtError = e;
                }
                expect(caughtError).to.be.instanceof(TypeError);
            });

        });

        describe ('#prependFilter', function () {
            it ('should prepend passed in filter and return self after doing so.', function () {
                var filterChain = new FilterChain([
                        new StringToLowerFilter(),
                        new StringTrimFilter(),
                        new StripTagsFilter()
                    ]),
                    filtersToPrepend = [
                        new BooleanFilter(),
                        new SlugFilter()
                    ];
                filtersToPrepend.forEach(function (filter) {
                    expect(filterChain.prependFilter(filter)).to.equal(filterChain);
                    expect(filterChain.filters[0]).to.equal(filter);
                });
            });
            it ('should throw an error if passed in value is not a filter.', function () {
                var filterChain = new FilterChain();
                var caughtError;
                try {
                    filterChain.prependFilter({});
                }
                catch (e) {
                    caughtError = e;
                }
                expect(caughtError).to.be.instanceof(TypeError);
            });
        });

        describe ('#mergeFilterChain', function () {
            var filters1 = [
                    new BooleanFilter(),
                    new SlugFilter()
                ],
                filterChain1 = new FilterChain(filters1),
                filters2 = [
                    new StringToLowerFilter(),
                    new StringTrimFilter(),
                    new StripTagsFilter()
                ],
                filterChain2 = new FilterChain(filters2),
                result = filterChain1.mergeFilterChain(filterChain2);

            expect(result).to.equal(filterChain1);

            filters1.concat(filters2).forEach(function (filter, index) {
                expect(filterChain1.filters[index]).to.equal(filter);
            });
        });

    });

});

/**
 * Created by elydelacruz on 3/25/16.
 */
describe(
    'sjl.filter.SlugFilter,' +
    'sjl.filter.SlugFilter#filter,' +
    'sjl.filter.SlugFilter.filter', function () {

                var SlugFilter = sjl.filter.SlugFilter;

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

        var FilterChain =       sjl.filter.FilterChain,
        ValidatorChain =    sjl.validator.ValidatorChain,
        Input =             sjl.input.Input,
        RegexValidator =    sjl.validator.RegexValidator,
        NumberValidator =   sjl.validator.NumberValidator,
        NotEmptyValidator = sjl.validator.NotEmptyValidator,
        AlnumValidator =    sjl.validator.AlnumValidator,
        BooleanFilter =         sjl.filter.BooleanFilter,
        StringToLowerFilter =   sjl.filter.StringToLowerFilter,
        StringTrimFilter =      sjl.filter.StringTrimFilter,
        SlugFilter =            sjl.filter.SlugFilter,
        StripTagsFilter =       sjl.filter.StripTagsFilter;

    describe('Constructor', function () {
        it ('should be a subclass of `sjl.stdlib.Extendable`.', function () {
            expect((new Input())).to.be.instanceof(sjl.stdlib.Extendable);
        });
        it ('should construct with no parameters passed.', function () {
            expect((new Input())).to.be.instanceof(Input);
        });
        it ('should construct an instance with the `alias` property populated when first parameter is a string.', function () {
            var alias = 'hello';
            expect((new Input(alias)).alias).to.equal(alias);
        });
        it ('should populate all properties passed in via hash object.', function () {
            var options = {
                alias: 'hello',
                breakOnFailure: true,
                fallbackValue: 'hello world'
            },
                input = new Input(options);
            Object.keys(options).forEach(function (key) {
                expect(input[key]).to.equal(options[key]);
            });
        });
    });

    describe('Interface', function () {
        var input = new Input();
        [
            'isValid',
            'mergeValidatorChain'
        ].forEach(function (method) {
            it('should have a `' + method + '` method.', function () {
                expect(input[method]).to.be.instanceof(Function);
            });
        });
    });

    describe('Properties.', function () {
        var input = new Input();
        [
            ['allowEmpty', Boolean],
            ['continueIfEmpty', Boolean],
            ['breakOnFailure', Boolean],
            ['fallbackValue', 'Undefined'],
            ['filterChain', 'Null', FilterChain],
            ['validators', Array],
            ['filters', Array],
            ['alias', String],
            ['required', Boolean],
            ['validatorChain', 'Null', ValidatorChain],
            ['value', 'Undefined'],
            ['rawValue', 'Undefined'],
            ['messages', Array],
            ['validationHasRun', Boolean]
        ].forEach(function (args) {
            it('should have an `' + args[0] + '` property.', function () {
                var isValidProp = sjl.classOfIsMulti.apply(sjl, [input[args[0]]].concat(args.slice(1)));
                expect(isValidProp).to.equal(true);
            });
        });
    });

    describe ('#isValid', function () {
        it ('should return true when value to validate passes all validators and should set `value` to "filtered" value.', function () {
            var inputs = {
                    stringInput: {
                        alias: 'stringInput',
                        validators: [
                            new NotEmptyValidator(),
                            new RegexValidator({pattern: /[a-z][a-z\d\-\s]+/})
                        ],
                        filters: [
                            new StringToLowerFilter(),
                            new StringTrimFilter()
                            //new SlugFilter()
                        ]
                    }
                },
                inputValues = {
                    stringInput: [
                        ['hello-world', 'hello-world'],
                        ['hello-99-WORLD_hoW_Are_yoU_doinG', 'hello-99-world_how_are_you_doing'],
                        [' a9_B99_999 ', 'a9_b99_999']
                    ]
                };

            sjl.forEach(inputs, function (input, key) {
                var input = new Input(input);
                inputValues[key].forEach(function (args) {
                    input.value = args[0];
                    expect(input.isValid()).to.equal(true);
                    expect(input.value).to.equal(args[1]);
                    expect(input.rawValue).to.equal(args[0]);
                });
            });
        });

    });

    describe ('#validate', function () {

    });

    describe ('#filter', function () {

    });

    describe ('#hasFallbackValue', function () {
        it ('should return false when no fallback value is defined.', function () {
            expect((new Input()).hasFallbackValue()).to.equal(false);
        });
        it ('should return true when a fallback value is defined.', function () {
            expect((new Input({fallbackValue: null})).hasFallbackValue()).to.equal(true);
        });
    });

    describe ('#clearMessages', function () {
        it ('should return itself and clear any messages when called.', function () {
            var input = new Input({messages: ['hello']});
            expect(input.messages.length).to.equal(1);
            expect(input.clearMessages()).to.equal(input);
            expect(input.messages.length).to.equal(0);
        });
    });

    describe ('#addValidators', function () {
        it ('should be able to add validators and return itself after doing so.', function () {
            var validators = [
                new NotEmptyValidator(),
                new RegexValidator(),
                new AlnumValidator()
            ],
                input = new Input(),
                result = input.addValidators(validators);
            input.validators.forEach(function (validator, index) {
                expect(validator).to.equal(validators[index]);
            });
            expect(result).to.equal(input);
        });
    });

    describe ('#addValidator', function () {
        it ('should be able to add validators and return itself after doing so.', function () {
            var validators = [
                    new NotEmptyValidator(),
                    new RegexValidator(),
                    new AlnumValidator()
                ],
                input = new Input();
            validators.forEach(function (validator, index) {
                expect(input.addValidator(validator)).to.equal(input);
                expect(validator).to.equal(input.validators[index]);
            });
        });
    });

    describe ('#prependValidator', function () {
        it ('should be able to prepend validators and return itself after doing so.', function () {
            var validators = [
                    new NotEmptyValidator(),
                    new RegexValidator(),
                    new AlnumValidator()
                ],
                input = new Input();
            validators.forEach(function (validator) {
                expect(input.prependValidator(validator)).to.equal(input);
                expect(input.validators[0]).to.equal(validator);
            });
        });
    });

    describe ('#mergeValidatorChain', function () {
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
                    validators: arrayOfValidators.slice(),
                    breakChainOnFailure: false
                }),

                input1 = new Input({validatorChain: validatorChain}),

            // Chain to merge from
                validatorChain2 = new ValidatorChain({
                    validators: arrayOfValidators2.slice(),
                    breakChainOnFailure: true
                }),

            // Run op
                resultOfOp = input1.mergeValidatorChain(validatorChain2);

            // Expect correct length of validators
            expect(input1.validators.length).to.equal(arrayOfValidators.length + arrayOfValidators2.length);

            // Expect merged in `breakChainOnFailure`
            expect(input1.validatorChain.breakChainOnFailure).to.equal(true);

            // Expect original validator chain to be returned
            expect(resultOfOp).to.equal(input1);
        });
    });

    describe ('#addFilter', function () {
        it ('should add a filter to it\'s list of filters and return itself after doing so.', function () {
            var filter = new SlugFilter(),
                input = new Input(),
                result = input.addFilter(filter);
            expect(input.filters[0]).to.equal(filter);
            expect(result).to.equal(input);
        });
    });

    describe ('#addFilters', function () {
        it ('should be able to add a list of filters from passed in array of filters.', function () {
            var input = new Input(),
                filters = [
                    new BooleanFilter(),
                    new SlugFilter(),
                    new StringToLowerFilter(),
                    new StringTrimFilter(),
                    new StripTagsFilter()
                ],
                result = input.addFilters(filters);

            filters.forEach(function (filter, index) {
                expect(input.filters[index]).to.equal(filter);
            });
            expect(result).to.equal(input);
        });
    });

    describe ('#prependFilter', function () {
        it ('should prepend passed in filter and return self after doing so.', function () {
            var filterChain = new FilterChain([
                    new StringToLowerFilter(),
                    new StringTrimFilter(),
                    new StripTagsFilter()
                ]),
                input = new Input({filterChain: filterChain}),
                filtersToPrepend = [
                    new BooleanFilter(),
                    new SlugFilter()
                ];
            filtersToPrepend.forEach(function (filter) {
                expect(input.prependFilter(filter)).to.equal(input);
                expect(input.filters[0]).to.equal(filter);
            });
        });

    });

    describe ('#mergeFilterChain', function () {
        var filters1 = [
                new BooleanFilter(),
                new SlugFilter()
            ],
            filterChain1 = new FilterChain(filters1),
            filters2 = [
                new StringToLowerFilter(),
                new StringTrimFilter(),
                new StripTagsFilter()
            ],
            filterChain2 = new FilterChain(filters2),
            input = new Input({filterChain: filterChain1}),
            result = input.mergeFilterChain(filterChain2);

        expect(result).to.equal(input);

        filters1.concat(filters2).forEach(function (filter, index) {
            expect(input.filters[index]).to.equal(filter);
        });
    });
});

/**
 * Created by Ely on 3/26/2016.
 */

describe ('sjl.input.Input', function () {

        var FilterChain =           sjl.filter.FilterChain,
        ValidatorChain =        sjl.validator.ValidatorChain,
        Input =                 sjl.input.Input,
        InputFilter =           sjl.input.InputFilter,
        RegexValidator =        sjl.validator.RegexValidator,
        NumberValidator =       sjl.validator.NumberValidator,
        NotEmptyValidator =     sjl.validator.NotEmptyValidator,
        AlnumValidator =        sjl.validator.AlnumValidator,
        BooleanFilter =         sjl.filter.BooleanFilter,
        StringToLowerFilter =   sjl.filter.StringToLowerFilter,
        StringTrimFilter =      sjl.filter.StringTrimFilter,
        SlugFilter =            sjl.filter.SlugFilter,
        StripTagsFilter =       sjl.filter.StripTagsFilter;

    describe('Constructor', function () {
        it ('should be a subclass of `sjl.stdlib.Extendable`.', function () {
            expect((new InputFilter())).to.be.instanceof(sjl.stdlib.Extendable);
        });
        it ('should construct with no parameters passed.', function () {
            expect((new InputFilter())).to.be.instanceof(InputFilter);
        });
        it ('should populate all properties passed in via hash object.', function () {
            // var options = {
            //     alias: 'hello',
            //     breakOnFailure: true,
            //     fallbackValue: 'hello world'
            // },
            //     inputFilter = new Input(options);
            // Object.keys(options).forEach(function (key) {
            //     expect(inputFilter[key]).to.equal(options[key]);
            // });
        });
    });

    describe('Properties.', function () {
        var inputFilter = new InputFilter();
        [
            ['data', Object],
            ['inputs', Object],
            ['invalidInputs', Object],
            ['validInputs', Object],
            ['messages', Object]
        ]
            .forEach(function (args) {
            it('should have an `' + args[0] + '` property.', function () {
                var isValidProp = sjl.classOfIsMulti.apply(sjl, [inputFilter[args[0]]].concat(args.slice(1)));
                expect(isValidProp).to.equal(true);
            });
        });
    });

    describe ('Methods', function () {

        describe('Interface', function () {
            var inputFilter = new InputFilter();
            [
                'addInput',
                'addInputs',
                'getInput',
                'hasInput',
                'isInput',
                'removeInput',
                'isValid',
                'validate',
                'filter',
                'getRawValues',
                'getValues',
                'getMessages',
                'mergeMessages',
                'clearMessages',
                'clearInvalidInputs',
                'clearValidInputs'
            ]
                .forEach(function (method) {
                    it('should have a `' + method + '` method.', function () {
                        expect(inputFilter[method]).to.be.instanceof(Function);
                    });
                });
        });

        describe ('#addInput', function () {
            it ('should be able to add a valid inputHash as an `Input`.', function () {
                var inputFilter = new InputFilter(),
                    inputHash = {
                        alias: 'someInputName'
                    },
                    result = inputFilter.addInput(inputHash);
                expect(result).to.equal(inputFilter);
                expect(result.inputs[inputHash.alias]).to.be.instanceof(Input);
            });
            it ('should be able to add an `Input` object as an input.', function () {
                var inputFilter = new InputFilter(),
                    input = new Input({
                        alias: 'someInputName'
                    }),
                    result = inputFilter.addInput(input);
                expect(result).to.equal(inputFilter);
                expect(result.inputs[input.alias]).to.equal(input);
            });
            it ('should throw a type error when input hash is\'nt properly formed.', function () {
                var inputFilter = new InputFilter(),
                    input = {},
                    caughtError;
                try {
                    inputFilter.addInput(input);
                }
                catch (e) {
                    caughtError = e;
                }
                expect(caughtError).to.be.instanceof(TypeError);
            });
            it ('should throw a type error if input hash is anything other than an Object or an Input object.', function () {
                var inputFilter = new InputFilter(),
                    caughtError;
                [Array, function () {}, 99, true, undefined, null].forEach(function (input) {
                    try {
                        inputFilter.addInput(input);
                    }
                    catch (e) {
                        caughtError = e;
                    }
                    expect(caughtError).to.be.instanceof(TypeError);
                });
            });

        });

        describe ('#addInputs', function () {
            it ('should be able to add input hashes to input objects on it\'s `inputs` property and return itself after doing so.', function () {
                var inputsHash = {
                    someInput1: {
                        required: true
                    },
                    someInput2: {
                        required: true
                    },
                    someInput3: {
                        required: true
                    },
                },
                    inputFilter = new InputFilter(),
                    result;

                // Ensure `inputs` has no keys
                expect(Object.keys(inputFilter.inputs).length).to.equal(0);

                // Run operation
                result = inputFilter.addInputs(inputsHash);

                // Ensure operation returned owner
                expect(result).to.equal(inputFilter);



                // Ensure inputs were added
                Object.keys(inputsHash).forEach(function (key) {
                    expect(inputFilter.inputs.hasOwnProperty(key)).to.equal(true);
                    expect(inputFilter.inputs[key]).to.be.instanceof(Input);
                });
            });
        });

        describe ('#hasInputs', function () {
            it ('should return `true` when input filter has input.', function () {
                var inputsHash = {
                        someInput1: {
                            required: true
                        },
                        someInput2: {
                            required: true
                        },
                        someInput3: {
                            required: true
                        },
                    },
                    inputFilter;

                inputFilter = new InputFilter({inputs: inputsHash});

                Object.keys(inputsHash).forEach(function (key) {
                    expect(inputFilter.hasInput(key)).to.equal(true);
                });

            });
            it ('should return `false` when input filter has input.', function () {
                var inputFilter = new InputFilter();
                expect(inputFilter.hasInput('hello')).to.equal(false);
            });
            it ('should throw a type error when key is empty or not a string.', function () {
                var inputFilter = new InputFilter();
                [undefined, '', []].forEach(function (value) {
                    var caughtError;
                    try {
                        expect(inputFilter.hasInput(value));
                    }
                    catch (e) {
                        caughtError = e;
                    }
                    expect(caughtError).to.be.instanceof(TypeError);
                });
            });

        });

        describe ('#isInput', function () {
            it ('should return `true` when value is an `Input`.', function () {
                var inputFilter = new InputFilter();
                expect(inputFilter.isInput(new Input())).to.equal(true);
            });
            it ('should return `false` when value is not an `Input`.', function () {
                var inputFilter = new InputFilter();
                expect(inputFilter.isInput({})).to.equal(false);
                expect(inputFilter.isInput()).to.equal(false);
            });
        });

        describe ('#removeInput', function () {
            it ('should be able to remove a defined input.', function () {
                var inputFilter = new InputFilter({inputs: {hello: {alias: 'hello'}}}),
                    addInput = inputFilter.inputs.hello;
                // Ensure input was added
                expect(inputFilter.inputs.hello).to.be.instanceof(Input);

                // Perform operation
                expect(inputFilter.removeInput('hello')).to.equal(addInput);

                // Check that operation was successful
                expect(Object.keys(inputFilter.inputs).length).to.equal(0);
            });
            it ('should return `Undefined` when input to remove was not found.', function () {
                var inputFilter = new InputFilter();
                expect(inputFilter.removeInput()).to.equal(undefined);
            });
        });

        describe ('#isValid', function () {

        });

        describe ('#validate', function () {

        });

        describe ('#filter', function () {

        });

        describe ('#getRawValues', function () {

        });

        describe ('#getValues', function () {

        });

        describe ('#getMessages', function () {

        });

        describe ('#mergeMessages', function () {

        });

        describe ('#clearMessages', function () {

        });

        describe ('#clearInputs', function () {

        });

        describe ('#clearValidInputs', function () {

        });

        describe ('#clearInvalidInputs', function () {

        });

        describe ('#_addInputOnInputs', function () {
            var inputFilter = new InputFilter();
            it ('should return it\'s owner.', function () {
                expect(inputFilter._addInputOnInputs({alias: 'hello'}, inputFilter.inputs)).to.equal(inputFilter);
            });
            it ('should be able to convert an hash object to an `Input`.', function () {
                inputFilter._addInputOnInputs({alias: 'hello'}, inputFilter.inputs);
                expect(inputFilter.inputs.hello).to.be.instanceof(Input);
                expect(Object.keys(inputFilter.inputs).length).to.equal(1);
            });
            it ('should be able add an `Input` object.', function () {
                var input = new Input({alias: 'hello'});
                inputFilter._addInputOnInputs(input, inputFilter.inputs);
                expect(inputFilter.inputs.hello).to.equal(input);
                expect(Object.keys(inputFilter.inputs).length).to.equal(1);                var input = new Input({alias: 'hello'});
            });
            it ('should throw a type error on malformed input hashes and objects.', function () {
                var caughtError;
                [undefined, {}].forEach(function (value) {
                    try {
                        inputFilter._addInputOnInputs(value, inputFilter.inputs);
                    }
                    catch (e) {
                        caughtError = e;
                    }
                    expect(caughtError).to.be.instanceof(TypeError);
                });
            });
        });

        describe ('#_setDataOnInputs', function () {
            var inputFilter = new InputFilter({
                inputs: {
                    input1: {alias: 'input1'},
                    input2: {alias: 'input2'},
                    input3: {alias: 'input3'},
                }
            }),
                inputValues = {
                    input1: 'hello',
                    input2: false,
                    input3: 99
                },
                result = inputFilter._setDataOnInputs(inputValues, inputFilter.inputs);

            it ('should return passed in inputs object.', function () {
                expect(result).to.equal(inputFilter.inputs);
            });

            it ('should give inputs their designated values.', function () {
                sjl.forEach(inputValues, function (value, key) {
                    expect(inputFilter.inputs[key].rawValue).to.equal(value);
                });
            });

            it ('should throw an error when `data` is not an Object.', function () {
                var caughtError;
                try {
                    inputFilter._setDataOnInputs(undefined, inputFilter.inputs);
                }
                catch (e) {
                    caughtError = e;
                }
                expect(caughtError).to.be.instanceof(TypeError);
            });

            it ('should throw an error when `inputsOn` is not an Object.', function () {
                var caughtError;
                try {
                    inputFilter._setDataOnInputs({}, undefined);
                }
                catch (e) {
                    caughtError = e;
                }
                expect(caughtError).to.be.instanceof(TypeError);
            });
        });

        describe ('#_setInputsOnInputs', function () {
            var inputFilter = new InputFilter(),
                inputHashes = {
                    input1: {alias: 'input1'},
                    input2: {alias: 'input2'},
                    input3: {alias: 'input3'}
                };
                //result = inputFilter._setDataOnInputs(inputValues, inputFilter.inputs);
        });

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
        })
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
        Config = sjl.stdlib.Config;

    it ('should be an instance of `sjl.stdlib.Extendable`.', function () {
        expect(new sjl.stdlib.Config()).to.be.instanceof(sjl.stdlib.Extendable);
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


describe('sjl.stdlib.Iterator', function () {

        var interfaceKeys = [
        'current', 'next', 'rewind', 'valid'
        ],
        basicArray = 'abcdefghijklmnopqrstuvwxyz'.split(''),
        Iterator = sjl.ns.stdlib.Iterator,
        iterator = new Iterator(basicArray);

    it ('should be able to return an iterator whether called as a function or not.', function () {
        expect(iterator instanceof Iterator).to.equal(true);
        expect((new Iterator(basicArray, 3)) instanceof Iterator).to.equal(true);
    });

    it ('should have it\'s main properties (`values` and `pointer`) set on an `__internal` object', function () {
        expect(sjl.issetAndOfType(iterator.values, 'Array')).to.equal(true);
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
        Optionable = sjl.stdlib.Optionable;

    it ('should be an instance of `sjl.stdlib.Extendable`.', function () {
        expect(new sjl.stdlib.Optionable()).to.be.instanceof(sjl.stdlib.Extendable);
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
            expect(optionable.getStoreHash()).to.be.instanceof(sjl.stdlib.Config);
        });
    });

}); // end of Test Suite

/**
 * Created by elyde on 1/12/2016.
 * @todo add tests iterator methods
 */

describe('sjl.stdlib.PriorityList', function () {

        var PriorityList = sjl.ns.stdlib.PriorityList;

    describe('#`PriorityList Methods Existence`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            priorityList = new PriorityList([]),
            methods = ['clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values', 'get', 'set',
                'next', 'current', 'valid', 'rewind', 'addFromArray', 'addFromObject'];
        it ('should have the following methods: [`' + methods.join('`, `') + '`]', function () {
            methods.forEach(function (method) {
                expect(typeof priorityList[method]).to.equal('function');
            });
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
        it ('should set `size` to `0` as a side effect.', function () {
            // Validate size of set
            expect(priorityList.size).to.equal(0);
        });
    });

    describe('#`PriorityList#delete`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            keyEntryToDelete = 'b',
            keyEntryToDeleteValue = 1,
            mapFrom = [ ['a', 0], [keyEntryToDelete, keyEntryToDeleteValue], ['c', 3] ],
            priorityList = new PriorityList(mapFrom);

        it ('should delete unique key and return `self`.', function () {
            // Ensure has key entry to delete
            expect(priorityList.has(keyEntryToDelete)).to.equal(true);

            // Ensure method returns `self`
            expect(priorityList.delete(keyEntryToDelete)).to.equal(priorityList);

            // Ensure method deleted key entry
            expect(priorityList.has(keyEntryToDelete)).to.equal(false);
            expect(priorityList.itemsMap._values.some(function (item) {
                return item.value === keyEntryToDeleteValue;
            })).to.equal(false);
            expect(priorityList.itemsMap._keys.indexOf(keyEntryToDelete)).to.equal(-1);
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
            priorityList = new PriorityList(entries),
            iterator = priorityList.entries(),
            reversedEntries = entries.concat([]).sort(function (a, b) {
                return a[0] < b[0];
            }),
            value;
        // Validate
        it ('should work as an iterator with included extra functions (`valid`).', function () {
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.done).to.equal(false);
                expect(value.value[0]).to.equal(reversedEntries[iterator.pointer - 1][0]);
                expect(value.value[1]).to.equal(reversedEntries[iterator.pointer - 1][1]);
            }
        });
    });

    describe('#`PriorityList#forEach`', function () {
        var entries = [['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            reversedEntries = entries.concat([]).sort(function (a, b) {
                return a[0] < b[0];
            }),
            priorityList = new PriorityList(entries, true),
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
                priorityList = new PriorityList(entries, false),
                iterator = priorityList.keys(),
                reversedEntries = entries.concat([]).sort(function (a, b) {
                    return a[0] < b[0];
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
        it ('should return an iterable', function () {
            var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                    ['v4', 4], ['v5', 5], ['v6', 6],
                    ['v7', 5], ['v8', 4]],

                priorityList = new PriorityList(entries),
                reversedEntries = entries.concat([]).sort(function (a, b) {
                    return a[0] < b[0];
                }),
                iterator = priorityList.values(),
                value,
                index = 0;
            while (iterator.valid()) {
                value = iterator.next();
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
                expectedEntries = entries.concat(otherEntries).sort(function (a, b) {
                    a = parseInt(a[0].split('v')[1], 10);
                    b = parseInt(b[0].split('v')[1], 10);
                    return a > b ? -1 : ((a === b) ? 0 : 1);
                }),
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
        generalValidator = new StringLengthValidator();

    function repeatStr(str, times) {
        var out = '';
        while (out.length < times) {
            out += str;
        }
        return out;
    }

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
                [false, 'without', repeatStr('a', 56)],
                [false, 'without', repeatStr('b', 99)]
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

    describe ('Constructor', function () {

        it ('should extend `sjl.ns.validator.Validator', function () {
            expect((new ValidatorChain()) instanceof Validator).to.equal(true);
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

    });

    describe ('Properties', function () {
        describe ('#validators', function () {
            var validatorChain1 = new ValidatorChain();
            [
                ['breakChainOnFailure', Boolean],
                ['validators', Array]
            ]
                .forEach(function (args) {
                    it('should have an `' + args[0] + '` property with a default type of `' + args[1].name + '`.', function () {
                        var isValidProp = sjl.classOfIsMulti.apply(sjl, [validatorChain1[args[0]]].concat(args.slice(1)));
                        expect(isValidProp).to.equal(true);
                    });
                });

            it ('should be set to a new array when populated array is comming in.', function () {
                var validatorChain = new ValidatorChain(),
                    validators1 = [
                        new RegexValidator()
                    ],
                    validators2 = [
                        new RegexValidator(),
                        new AlnumValidator()
                    ];

                [validators1, validators2].forEach(function (validators) {
                    validatorChain.validators = validators;
                    expect(validatorChain.validators.length).to.equal(validators.length);
                    validators.forEach(function (validator, index) {
                        expect(validatorChain.validators[index]).to.equal(validator);
                    });
                });
            });
        });
    });

    describe ('Methods', function () {

        it('should have the appropriate interface', function () {
            var chain = new ValidatorChain(),
                methods = ['isValid', 'addValidator', 'addValidators'];
            methods.forEach(function (method) {
                expect(typeof chain[method]).to.equal('function');
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
});
