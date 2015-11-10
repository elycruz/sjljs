/**
 * Created by Ely on 1/21/2015.
 * Initial idea copied from the Zend Framework 2's Between Validator
 * @todo add `allowSigned` check(s).
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        BaseValidator = sjl.package.validator.BaseValidator,
        NumberValidator = function NumberValidator(options) {

            // Set defaults and extend with Base validator
            BaseValidator.call(this, {
                messageTemplates: {
                    NOT_A_NUMBER: function () {
                        return 'The input value is not a number.  Value received: "' + this.getValue() + '".';
                    },
                    NOT_IN_RANGE: function () {
                        return 'The number passed in is not within the specified '
                            + (this.get('inclusive') ? 'inclusive' : '') + ' range. ' +
                            ' Value received: "' + this.getValue() + '".';
                    },
                    NO_FLOATS_ALLOWED: function () {
                        return 'No floats allowed.  ' +
                            'Value received: "' + this.getValue() + '".';
                    },
                    NO_COMMAS_ALLOWED: function () {
                        return 'No commas allowed.  ' +
                            'Value received: "' + this.getValue() + '".';
                    }
                },
                regexForHex: /^(?:(?:\dx)|(?:\#))[\da-z]+$/i,
                regexForOctal: /^0\d+?$/,
                regexForBinary: /^\db\d+$/i,
                regexForScientific: /^(?:\-|\+)?\d+(?:\.\d+)?(?:e(?:\-|\+)?\d+(?:\.\d+)?)?$/i,
                allowFloat: true,
                allowCommas: false,
                allowSigned: false,
                allowBinary: false,
                allowHex: false,
                allowOctal: false,
                allowScientific: false,
                checkRange: false,
                defaultRangeSettings: {
                    min: Number.NEGATIVE_INFINITY,
                    max: Number.POSITIVE_INFINITY,
                    inclusive: true
                },
                min: Number.NEGATIVE_INFINITY,
                max: Number.POSITIVE_INFINITY,
                inclusive: true
            });

            // Set options passed, if any
            this.setOptions(options);

        };

    NumberValidator = BaseValidator.extend(NumberValidator, {
        isValid: function (value) {
            var self = this,
                retVal = false,

                originalValue = value,

            // Booleans
                allowFloat = self.get('allowFloat'),
                allowCommas = self.get('allowCommas'),
            //allowSigned =  self.get('allowSigned'),
                allowBinary = self.get('allowBinary'),
                allowHex = self.get('allowHex'),
                allowOctal = self.get('allowOctal'),
                allowScientific = self.get('allowScientific'),

            // Regexes'
                regexForHex = self.get('regexForHex'),
                regexForOctal = self.get('regexForOctal'),
                regexForBinary = self.get('regexForBinary'),
                regexForScientific = self.get('regexForScientific'),

            // Class of initial value
                classOfValue = sjl.classOf(value),

            // Check range `Boolean`
                checkRange = self.get('checkRange'),

            // Used if `checkRange` is true
                inRangeValidator;

            // Get value
            value = sjl.isset(value) ? value : self.getValue();

            // If number return true
            if (classOfValue === 'Number') {
                retVal = true;
            }

            // If is string, ...
            else if (classOfValue === 'String') {

                // Lower case any alpha characters to make the value easier to validate
                value = value.toLowerCase();

                // If allow commas, remove them
                if (allowCommas) {
                    value = value.replace(',', '');
                }

                // If hex ...
                if (allowHex && value.indexOf('x') > -1) {
                    retVal = regexForHex.test(value);
                    value = parseInt(value, 16);
                }

                // If octal ...
                else if (allowOctal && value.indexOf('0') === 0) {
                    retVal = regexForOctal.test(value);
                    value = parseInt(value, 8);
                }

                // If binary ...
                else if (allowBinary && value.indexOf('b') > -1) {
                    retVal = regexForBinary.test(value);
                    value = Number(value);
                }

                // If normal number (scientific numbers are considered normal (@todo should we have a flag for scientific numbers(?)) ...
                else if (allowScientific) {
                    retVal = regexForScientific.test(value);
                    value = Number(value);
                }

            } // End of 'If string ...'

            // Add error message if not a number

            // If no floats are allowed, add error message
            if (!allowFloat && /\./.test(value)) {
                self.addErrorByKey('NO_FLOATS_ALLOWED');
                retVal = false;
            }

            // If no commas allowed, add error message
            else if (!allowCommas && /\,/.test(originalValue)) {
                self.addErrorByKey('NO_COMMAS_ALLOWED');
                retVal = false;
            }

            // Else if 'Not a Number' add error message
            else if (!retVal) {
                self.addErrorByKey('NOT_A_NUMBER');
            }

            // Check min and max if necessary or if 'Class of value is a `Number`' (pretty much a solid NaN check)
            else if (retVal === true && (checkRange || classOfValue === 'Number')) {

                // If not check range and value is a number set the defaults so we can check for `NaN`
                if (!checkRange && classOfValue === 'Number') {
                    self.set(self.get('defaultRangeSettings'));
                }

                // Run validator
                inRangeValidator = new NumberValidator(self.get(['min', 'max', 'inclusive']));
                inRangeValidator.setValue(value);
                retVal = inRangeValidator.isValid();

                // If validator failed set error message
                if (!retVal) {

                    // If `NaN`
                    if (!checkRange && classOfValue === 'Number') {
                        self.addErrorByKey('NOT_A_NUMBER');
                    }

                    // Else 'Not in Range' message
                    else {
                        self.addErrorByKey('NOT_IN_RANGE');
                    }

                } // End of 'If error message'

            } // End of 'If `Number` class or check range'

            return retVal;

        } // End of `isValid` function

    }); // End of `NumberValidator` declaration

    if (isNodeEnv) {
        module.exports = NumberValidator;
    }
    else {
        sjl.package('validator.NumberValidator', NumberValidator);
        if (window.__isAmd) {
            return NumberValidator;
        }
    }

})();
