/**
 * Created by Ely on 3/26/2016.
 */

describe ('sjl.input.Input', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

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

    describe ('Constructor', function () {
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

    describe ('Interface', function () {
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

    describe ('Properties.', function () {
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

    describe ('#isValid, #validate', function () {
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

        // When `value` is set directly
        sjl.forEach(inputs, function (input, key) {
            inputValues[key].forEach(function (args) {
                var inputObj = new Input(input);
                it ('should return true when value is tested directly from `value`.', function () {
                    inputObj.value = args[0];
                    expect(inputObj.isValid()).to.equal(true);
                });
                it ('should set `value` to filtered value.', function () {
                    expect(inputObj.value).to.equal(args[1]);
                });
                it ('should have `rawValue` to the initial value to test.', function () {
                    expect(inputObj.rawValue).to.equal(args[0]);
                });
            });
        });

        // When `rawValue` is set directly
        sjl.forEach(inputs, function (input, key) {
            inputValues[key].forEach(function (args) {
                var inputObj = new Input(input);
                it ('should return true when value is tested directly from `rawValue`.', function () {
                    inputObj.rawValue = args[0];
                    expect(inputObj.isValid()).to.equal(true);
                });
                it ('should set `value` to filtered value.', function () {
                    expect(inputObj.value).to.equal(args[1]);
                });
                it ('should have `rawValue` to the initial value to test.', function () {
                    expect(inputObj.rawValue).to.equal(args[0]);
                });
            });
        });

        // When value to test is passed in
        sjl.forEach(inputs, function (input, key) {
            inputValues[key].forEach(function (args) {
                var inputObj = new Input(input);
                it ('should return true when value to is directly passed in and validates.', function () {
                    expect(inputObj.isValid(args[0])).to.equal(true);
                });
                it ('should set `value` to filtered value.', function () {
                    expect(inputObj.value).to.equal(args[1]);
                });
                it ('should have `rawValue` to the initial value to test.', function () {
                    expect(inputObj.rawValue).to.equal(args[0]);
                });
            });
        });
    });

    describe ('#filter', function () {
        var input = new Input({
                filters: [
                    new StringToLowerFilter(),
                    new StringTrimFilter()
                ]
            }),
            argsToTest = [
                [' Hello World ', 'hello world'],
                ['Hello World ', 'hello world'],
                [' Hello World', 'hello world'],
                ['Hello World', 'hello world'],
            ];
        argsToTest.forEach(function (args) {
            it ('should return expected filtered value for filter set.', function () {
                var result = input.filter(args[0]);
                expect(result).to.equal(args[1]);
            });
        });
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
