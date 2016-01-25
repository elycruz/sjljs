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
                    NOT_A_NUMBER: function (value, validator) {
                        return 'The input value is not a number.  Value received: "' + value + '".';
                    },
                    NOT_IN_RANGE: function (value, validator) {
                        return 'The number passed in is not ' + (validator.inclusive ? 'inclusive' : '')
                            + 'ly within the specified '  + ' range. ' +
                            ' Value received: "' + value + '".';
                    },
                    NOT_ALLOWED_FLOAT: function (value, validator) {
                        return 'No floats allowed.  ' +
                            'Value received: "' + value + '".';
                    },
                    NOT_ALLOWED_COMMA: function (value, validator) {
                        return 'No commas allowed.  ' +
                            'Value received: "' + value + '".';
                    },
                    NOT_ALLOWED_SIGNED: function (value, validator) {
                        return 'No signed numbers allowed.  ' +
                            'Value received: "' + value + '".';
                    },
                    NOT_ALLOWED_HEX: function (value, validator) {
                        return 'No hexadecimal numbers allowed.  ' +
                            'Value received: "' + value + '".';
                    },
                    NOT_ALLOWED_OCTAL: function (value, validator) {
                        return 'No octal strings allowed.  ' +
                            'Value received: "' + value + '".';
                    },
                    NOT_ALLOWED_BINARY: function (value, validator) {
                        return 'No binary strings allowed.  ' +
                            'Value received: "' + value + '".';
                    },
                    NOT_ALLOWED_SCIENTIFIC: function (value, validator) {
                        return 'No scientific number strings allowed.  ' +
                            'Value received: "' + value + '".';
                    },
                    INVALID_HEX: function (value, validator) {},
                    INVALID_OCTAL: function (value, validator) {},
                    INVALID_BINARY: function (value, validator) {},
                    INVALID_SCIENTIFIC: function (value, validator) {},
                },
                _regexForHex = /^(?:(?:0x)|(?:\#))[\da-z]+$/i,
                _regexForOctal = /^0\d+$/,
                _regexForBinary = /^0b[01]+$/i,
                _regexForScientific = /^(?:\-|\+)?\d+(?:\.\d+)?(?:e(?:\-|\+)?\d+)?$/i,
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
                retVal,

                // Class of initial value
                classOfValue = sjl.classOf(value),

                // A place to hold sub validation results
                parsedValidationResult,

                // Transformed value
                parsedValue;

            // Get value
            value = classOfValue === 'Undefined' ? self.value : value;

            // If number return true
            if (classOfValue === 'Number') {
                retVal = true;
            }

            // If is string, ...
            else if (classOfValue === 'String') {
                // Lower case any alpha characters to make the value easier to validate
                parsedValidationResult = this._parseValidationFunctions([
                    '_validateComma', '_validateBinary', '_validateHex',
                    '_validateOctal', '_validateScientific'
                ], value.toLowerCase());

                // Get validation result
                retVal = parsedValidationResult[0] === -1 ? false : true;

                // possibly transformed value (to number) depends on what we set `retVal` to above.
                parsedValue = parsedValidationResult[1];
            }

            // Else if 'Not a Number' add error message
            else {
                retVal = false;
                self.addErrorByKey('NOT_A_NUMBER');
            }

            // If value is a `Number` so far
            if (retVal) {
                parsedValidationResult =
                    this._parseValidationFunctions(
                            ['_validateSigned', '_validateFloat', '_validateRange'],
                            sjl.classOfIs(parsedValue, 'Number') ? parsedValue : value
                        );
                retVal = parsedValidationResult[0] === -1 ? false : true;
            }

            return retVal;
        },

        _parseValidationFunctions: function (functions, value) {
            var funcsLen = functions.length,
                resultSet,
                i;
            for (i = 0; i < funcsLen; i += 1) {
                resultSet = this[functions[i]](value);
                // If `value`'s validation failed exit the loop
                if (resultSet[0] === -1 || resultSet[0] === 1) {
                    break;
                }
            }
            return resultSet;
        },

        _validateHex: function (value) {
            var retVal = [0, value],
                isHexString = value[1] === 'x',
                isValidFormat;
            if (isHexString) {
                if (this.allowHex) {
                    isValidFormat = this.regexForHex.test(value);
                    if (!isValidFormat) {
                        retVal[1] = -1;
                        this.addErrorByKey('INVALID_HEX');
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
                this.addErrorByKey('NOT_ALLOWED_SIGNED');
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
                    this.addErrorByKey('NOT_ALLOWED_COMMA');
                    out[0] = -1;
                }
            }
            return out;
        },

        _validateFloat: function (value) {
            var out = [0, value];
            if (!this.allowFloat && /\.{1}/g.test(value)) {
                this.addErrorByKey('NOT_ALLOWED_FLOAT');
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
                        this.addErrorByKey('INVALID_BINARY');
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
                    this.addErrorByKey('INVALID_OCTAL');
                    out[0] = -1;
                }
            }
            return out;
        },

        _validateScientific: function (value) {
            var out = [0, value],
                possibleScientific = /\de/.test(value),
                isValidScientificValue;
            if (possibleScientific) {
                if (this.allowScientific) {
                    isValidScientificValue = this.regexForScientific.test(value);
                    if (isValidScientificValue) {
                        out[0] = 1;
                        out[1] = Number(value);
                    }
                    else {
                        this.addErrorByKey('INVALID_SCIENTIFIC');
                        out[0] = -1;
                    }
                }
                else {
                    this.addErrorByKey('NOT_ALLOWED_SCIENTIFIC');
                    out[0] = -1;
                }
            }
            return out;
        },

        _validateRange: function (value) {
            var out = [0, value];
            if (this.checkRange) {
                if (this.inclusive && (value < this.min || value > this.max)) {
                    out[0] = -1;
                }
                else if (!this.inclusive && (value <= this.min || value >= this.max)) {
                    out[0] = -1;
                }
                else {
                    out[0] = 1;
                }
            }
            return out;
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
