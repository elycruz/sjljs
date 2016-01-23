/**
 * Created by Ely on 1/21/2015.
 * Initial idea copied from the Zend Framework 2's Between Validator
 * @todo add `allowSigned` check(s).
 */
(function () {

    'use strict';

    /**
     * Container for defining/holding the result format of string validation operations within NumberValidator.
     * @param flag {Array<Number, String|Value>} - [-1, 0, 1] (operation state `-1` falied, `0` untouched, `1` value transformed).
     * @param value {String} - String value to be validated.
     * @constructor
     */
    function StringValidationOpResult (flag, value) {
        if (sjl.classOfIs(value, String)) {
            throw new Error(StringValidationOpResult.name + ' expects param 2 to be of type' +
                ' "String".  Type received: "' + sjl.classOf(value) + '".');
        }
        this[0] = flag;
        this[1] = value;
    }

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../../sjl.js') : window.sjl || {},
        Validator = sjl.ns.refactor.validator.Validator,
        contextName = 'sjl.ns.refactor.validator.NumberValidator',
        //InRangeValidator = sjl.ns.refactor.validator.InRangeValidator,
        NumberValidator = function NumberValidator(/** ...options {Object}**/) {
            // Apply Validator to self
            Validator.apply(this);

            var _messageTemplates = {
                    NOT_A_NUMBER: function () {
                        return 'The input value is not a number.  Value received: "' + this.value + '".';
                    },
                    NOT_IN_RANGE: function () {
                        return 'The number passed in is not within the specified '
                            + (this.get('inclusive') ? 'inclusive' : '') + ' range. ' +
                            ' Value received: "' + this.value + '".';
                    },
                    NO_FLOATS_ALLOWED: function () {
                        return 'No floats allowed.  ' +
                            'Value received: "' + this.value + '".';
                    },
                    NO_COMMAS_ALLOWED: function () {
                        return 'No commas allowed.  ' +
                            'Value received: "' + this.value + '".';
                    },
                    NO_SIGNED_ALLOWED: function () {
                        return 'No signed numbers allowed.  ' +
                            'Value received: "' + this.value + '".';
                    },
                    NOT_ALLOWED_HEX: function () {
                        return 'No hexadecimal numbers allowed.  ' +
                            'Value received: "' + this.value + '".';
                    },
                    NOT_ALLOWED_OCTAL: function () {
                        return 'No octal strings allowed.  ' +
                            'Value received: "' + this.value + '".';
                    },
                    NOT_ALLOWED_BINARY: function () {
                        return 'No binary strings allowed.  ' +
                            'Value received: "' + this.value + '".';
                    }
                },
                _regexForHex = /^(?:(?:\dx)|(?:\#))[\da-z]+$/i,
                _regexForOctal = /^0\d+?$/,
                _regexForBinary = /^\db[01]+$/i,
                _regexForScientific = /^(?:\-|\+)?\d+(?:\.\d+)?(?:e(?:\-|\+)?\d+(?:\.\d+)?)?$/i,
                _allowFloat = true,
                _allowCommas = false,
                _allowSigned = false,
                _allowBinary = false,
                _allowHex = false,
                _allowOctal = false,
                _allowScientific = false,
                _checkRange = false,
                _defaultRangeSettings = {
                    min: Number.NEGATIVE_INFINITY,
                    max: Number.POSITIVE_INFINITY,
                    inclusive: true
                },
                _min = Number.NEGATIVE_INFINITY,
                _max = Number.POSITIVE_INFINITY,
                _inclusive = true;

            Object.defineProperties(this, {
                regexForHex: {
                    get: function () {
                        return _regexForHex;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'regexForHex', value, RegExp);
                        _regexForHex = value;
                    },
                    enumerable: true
                },
                regexForOctal: {
                    get: function () {
                        return _regexForOctal;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'regexForOctal', value, RegExp);
                        _regexForOctal = value;
                    },
                    enumerable: true
                },
                regexForBinary: {
                    get: function () {
                        return _regexForBinary;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'regexForBinary', value, RegExp);
                        _regexForBinary = value;
                    },
                    enumerable: true
                },
                regexForScientific: {
                    get: function () {
                        return _regexForScientific;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'regexForScientific', value, RegExp);
                        _regexForScientific = value;
                    },
                    enumerable: true
                },
                allowFloat: {
                    get: function () {
                        return _allowFloat;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'allowFloat', value, Boolean);
                        _allowFloat = value;
                    },
                    enumerable: true
                },
                allowCommas: {
                    get: function () {
                        return _allowCommas;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'allowCommas', value, Boolean);
                        _allowCommas = value;
                    },
                    enumerable: true
                },
                allowSigned: {
                    get: function () {
                        return _allowSigned;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'allowSigned', value, Boolean);
                        _allowSigned = value;
                    },
                    enumerable: true
                },
                allowBinary: {
                    get: function () {
                        return _allowBinary;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'allowBinary', value, Boolean);
                        _allowBinary = value;
                    },
                    enumerable: true
                },
                allowHex: {
                    get: function () {
                        return _allowHex;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'allowHex', value, Boolean);
                        _allowHex = value;
                    },
                    enumerable: true
                },
                allowOctal: {
                    get: function () {
                        return _allowOctal;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'allowOctal', value, Boolean);
                        _allowOctal = value;
                    },
                    enumerable: true
                },
                allowScientific: {
                    get: function () {
                        return _allowScientific;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'allowScientific', value, Boolean);
                        _allowScientific = value;
                    },
                    enumerable: true
                },
                checkRange: {
                    get: function () {
                        return _checkRange;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'checkRange', value, Boolean);
                        _checkRange = value;
                    },
                    enumerable: true
                },
                defaultRangeSettings: {
                    get: function () {
                        return _defaultRangeSettings;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'defaultRangeSettings', value, Object);
                        sjl.extend(true, _defaultRangeSettings, value);
                    },
                    enumerable: true
                },
                min: {
                    get: function () {
                        return _min;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'min', value, Number);
                        _min = value;
                    },
                    enumerable: true
                },
                max: {
                    get: function () {
                        return _max;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'max', value, Number);
                        _max = value;
                    },
                    enumerable: true
                },
                inclusive: {
                    get: function () {
                        return _inclusive;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'inclusive', value, Boolean);
                        _inclusive = value;
                    },
                    enumerable: true
                }
            });

            // Set default min, max, and inclusive values
            sjl.extend.apply(sjl, [
                    true, this,
                    this.defaultRangeSettings,
                    {messageTemplates: _messageTemplates}
                ].concat(sjl.argsToArray(arguments))
            );
        };

    NumberValidator = Validator.extend(NumberValidator, {
        isValid: function (value) {
            var self = this,

                // Return value
                retVal = false,

                // Class of initial value
                classOfValue = sjl.classOf(value),

                // Check range `Boolean`
                checkRange = self.checkRange;

            // Get value
            value = classOfValue === 'Undefined' ? self.value : value;

            // If number return true
            if (classOfValue === 'Number') {
                retVal = true;
            }

            // If is string, ...
            else if (classOfValue === 'String') {
                // Lower case any alpha characters to make the value easier to validate
                value = this._validateStringValue(value.toLowerCase())[1];
            }

            // Else if 'Not a Number' add error message
            else {
                retVal = false;
                self.addErrorByKey('NOT_A_NUMBER');
            }

            // Check min and max if value is a `Number` (`classOfIs` differentiates between NaN and usable Number)
            if (retVal === true && checkRange && sjl.classOfIs(value, Number)) {
                // work here
            }

            return retVal;

        }, // End of `isValid` function

        /**
         * Returns the resulting of validating the passed in `value` via all it's internal string validation methods.
         * Validates through the different type of possible string representations of numbers and returns an
         * array [
         *      performedOpFlag {Number}, // [-1, 0, 1] - `-1` when `value` was a candidate for validation and failed validation.
         *      value {Number|String} // Untouched or transformed value that was passed (value gets transformed by some validation functions into an actual number who then pass the value along for validation outside of the string validation functions (as a number)).
         * ]
         * @param value {String}
         * @returns {Array<Number,String|Number>} - Element `0` is `performedOpFlag` [-1, 0, 1] and element [1] is the passed in value (transformed or not - look at element 0 to know (1 means transformed)).
         * @private
         */
        _validateStringValue: function (value) {
            var validationFuncs = ['_validateHex', '_validateSigned'],
                funcsLen = validationFuncs.length,
                resultSet,
                i;
            for (i = 0; i < funcsLen; i += 1) {
                resultSet = this[validationFuncs[i]](value);
                // If `value`'s validation failed exit the loop
                if (resultSet[0] === -1) {
                    break;
                }
                // If value (set[1]) was transformed set it as value
                if (resultSet[0] === 1) {
                    value = resultSet[1];
                }
            }
            return resultSet;
        },

        /**
         * Validates a hex string.  Returns
         * @param value {String}
         * @returns {Array<Number, String|Number>}
         * @private
         */
        _validateHex: function (value) {
            var retVal = [0, value],
                isHexString = value.length > 0 && value[1] === 'x',
                isValidFormat;
            if (isHexString) {
                if (this.allowHex) {
                    isValidFormat = this.regexForHex.test(value);
                    if (!isValidFormat) {
                        retVal[1] = -1;
                        this.addErrorByKey('NOT_ALLOWED_HEX');
                    }
                    else {
                        retVal[0] = 1;
                        retVal[1] = parseInt(value, 16);
                    }
                }
                else {
                    retVal[1] = -1;
                    this.addErrorByKey('NOT_ALLOWED_HEX');
                }
            }
            return retVal;
        },

        _validateSigned: function (value) {
            var retVal = [0, value];
            // If no signed numbers allowed add error if number has sign
            if (!this.allowSigned && /^(:?\-|\+)/.test(value)) {
                this.addErrorByKey('NO_SIGNED_ALLOWED');
                retVal[0] = -1;
            }
            return retVal;
        },

        _validateComma: function (value) {
            var out = [0, value],
                valueHasCommas = /,/.test(value),
                replacedString;
            if (valueHasCommas) {
                if (this.allowCommas) {
                    replacedString = value.replace(/,/g, '');
                    if (replacedString.length === 0) {
                        this.addErrorByKey('NOT_A_NUMBER');
                        out[0] = -1;
                    }
                    else {
                        out[1] = replacedString;
                        out[0] = 1;
                    }
                }
                else if (!this.allowCommas) {
                    this.addErrorByKey('NO_COMMAS_ALLOWED');
                    out[0] = -1;
                }
            }
            return out;
        },

        _validateFloat: function (value) {
            var out = [0, value];
            if (!this.allowFloat && /\.{1}/g.test(value)) {
                this.addErrorByKey('NO_FLOATS_ALLOWED');
                out[0] = -1;
            }
            return out;
        },

        _validateBinary: function (value) {
            var out = [0, value],
                possibleBinary = value.length > 0 && value[1] === 'b',
                isValidBinaryValue;
            if (possibleBinary) {
                if (this.allowBinary) {
                    isValidBinaryValue = this.regexForBinary.test(value);
                    if (isValidBinaryValue) {
                        out[0] = 1;
                        out[1] = Number(value);
                    }
                    else {
                        this.addErrorByKey('NOT_ALLOWED_BINARY');
                        out[0] = -1;
                    }
                }
                else {
                    this.addErrorByKey('NOT_ALLOWED_BINARY');
                    out[0] = -1;
                }
            }
            return out;
        },

        _validateOctal: function (value) {
            var out = [0, value],
                possibleOctal = /^0\d/.test(value),
                isValidOctalValue;
            if (possibleOctal) {
                if (this.allowOctal) {
                    isValidOctalValue = this.regexForOctal.test(value);
                    if (isValidOctalValue) {
                        out[0] = 1;
                        out[1] = parseInt(value, 8);
                    }
                    else {
                        this.addErrorByKey('NOT_ALLOWED_OCTAL');
                        out[0] = -1;
                    }
                }
                else {
                    this.addErrorByKey('NOT_ALLOWED_OCTAL');
                    out[0] = -1;
                }
            }
            return out;
        },

        _validateScientific: function (value) {
            // If scientific number ...
            //if (allowScientific) {
            //    retVal = regexForScientific.test(value);
            //    value = Number(value);
            //}
        },

        _validateRange: function (value) {
            // Create in range validator
            //inRangeValidator = new InRangeValidator({
            //    min: this.min,
            //    max: this.max,
            //    inclusive: this.inclusive
            //});
            //
            //// Check range
            //retVal = inRangeValidator.isValid(value);
            //
            //// If 'in range validator' failed set error message
            //if (!retVal) {
            //    self.addErrorByKey('NOT_IN_RANGE');
            //}
        },


    }); // End of `NumberValidator` declaration

    if (isNodeEnv) {
        module.exports = NumberValidator;
    }
    else {
        sjl.ns('refactor.validator.NumberValidator', NumberValidator);
        if (window.__isAmd) {
            return NumberValidator;
        }
    }

})();
