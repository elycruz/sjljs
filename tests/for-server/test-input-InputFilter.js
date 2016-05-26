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
