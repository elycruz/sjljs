/**
 * Created by Ely on 1/21/2015.
 * Initial idea copied from the Zend Framework 2's Between Validator
 * @todo add `allowSigned` check(s).
 */
(function () {

    'use strict';

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
                    }
                },
                _regexForHex = /^(?:(?:\dx)|(?:\#))[\da-z]+$/i,
                _regexForOctal = /^0\d+?$/,
                _regexForBinary = /^\db\d+$/i,
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
                value = this.validateStringValue(value.toLowerCase())[1];
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

        validateStringValue: function (value) {},

        _validateHex: function (value) {
            var retVal = [true, value],
                isHexString = value.length > 0 && value[1] === 'x',
                isValidFormat;
            if (isHexString) {
                if (this.allowHex) {
                    isValidFormat = this.regexForHex.test(value);
                    if (!isValidFormat) {
                        retVal[0] = false;
                        this.addErrorByKey('NOT_ALLOWED_HEX');
                    }
                    else {
                        retVal[1] = parseInt(value, 16);
                    }
                }
                else {
                    retVal[0] = false;
                    this.addErrorByKey('NOT_ALLOWED_HEX');
                }
            }
            return retVal;
        },

        validateSigned: function (value) {
            var retVal = [true, value];
            // If no signed numbers allowed add error if number has sign
            if (!this.allowSigned && /^(:?\-|\+)/.test(value)) {
                this.addErrorByKey('NO_SIGNED_ALLOWED');
                retVal[0] = false;
            }
            return retVal;
        },

        validateComma: function (value) {
            var out = [true, value],
                valueHasCommas = /,/.test(value),
                replacedString;
            if (valueHasCommas) {
                if (this.allowCommas) {
                    replacedString = value.replace(',', '');
                    if (replacedString.length === 0) {
                        this.addErrorByKey('NOT_A_NUMBER');
                        out[0] = false;
                    }
                    else {
                        out[1] = replacedString;
                    }
                }
                else if (!this.allowCommas) {
                    this.addErrorByKey('NO_COMMAS_ALLOWED');
                    out[0] = false;
                }
            }
            return out;
        },

        validateFloat: function (value) {
            var out = [true, value];
            if (!this.allowFloat && /\./.test(value)) {
                this.addErrorByKey('NO_FLOATS_ALLOWED');
                out[0] = false;
            }
            return out;
        },

        validateBinary: function (value) {
            var out = [true, value],
                possibleBinary = value.length > 0 && value[1] === 'b',
                isValidBinaryValue;
            if (possibleBinary) {
                if (this.allowBinary) {
                    isValidBinaryValue = regexForBinary.test(value);
                    if (isValidBinaryValue) {
                        out[1] = Number(value);
                    }
                    else {
                        this.addErrorByKey('NOT_ALLOWED_BINARY');
                        out[0] = false;
                    }
                }
                else {
                    this.addErrorByKey('NOT_ALLOWED_BINARY');
                    out[0] = false;
                }
            }
            return out;
        },

        validateOctal: function (value) {
            //if (this.allowOctal && /^0\d/.test(value)) {
            //    retVal = regexForOctal.test(value);
            //    value = parseInt(value, 8);
            //}
        },

        validateScientific: function (value) {
            // If scientific number ...
            //if (allowScientific) {
            //    retVal = regexForScientific.test(value);
            //    value = Number(value);
            //}
        },

        validateRange: function (value) {
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
