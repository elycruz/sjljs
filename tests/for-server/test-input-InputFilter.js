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
                    result = inputFilter.addInputs(inputsHash);

                // Ensure `inputs` has no keys
                expect(Object.keys(inputFilter.inputs).length).to.equal(0);

                // Ensure operation returned owner
                expect(result).to.equal(inputFilter);



                // Ensure inputs were added
                Object.keys(inputsHash).forEach(function (key) {
                    debugger;
                    expect(inputFilter.inputs.hasOwnProperty(key)).to.equal(true);
                    expect(inputFilter.inputs[key]).to.be.instanceof(Input);
                });
            });
        });

        describe ('#addInputs', function () {

        });

        describe ('#hasInputs', function () {

        });

        describe ('#isInput', function () {

        });

        describe ('#removeInput', function () {

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

        describe ('#clearValidInputs', function () {

        });

        describe ('#clearInvalidInputs', function () {

        });

        describe ('#clearInvalidInputs', function () {

        });

    });

});
