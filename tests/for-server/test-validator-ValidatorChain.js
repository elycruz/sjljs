/**
 * Created by edelacruz on 7/28/2014.
 */

describe('sjl.validator.ValidatorChain', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

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
