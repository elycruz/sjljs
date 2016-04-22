/**
 * Created by Ely on 1/21/2015.
 */

(function () {

    'use strict';

    function throwErrorIfNotPositiveNumber (contextName_, valueName_, value_) {
        if (value_ < 0) {
            throw new Error(contextName_ + '.' + valueName_ + ' must be a positive number.');
        }
    }

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        Validator = sjl.validator.Validator,
        contextName = 'sjl.validator.StringLength',
        StringLengthValidator = function StringLengthValidator (/**...options {Object}**/) {
            var _min = 0,
                _max = Number.POSITIVE_INFINITY; // inifinite
            Object.defineProperties(this, {
                min: {
                    get: function () {
                        return _min;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'min', value, Number);
                        throwErrorIfNotPositiveNumber(contextName, 'min', value);
                        _min = value;
                    }
                },
                max: {
                    get: function () {
                        return _max;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'max', value, Number);
                        throwErrorIfNotPositiveNumber(contextName, 'max', value);
                        _max = value;
                    }
                }
            });

            // Set defaults and extend with Base validator
            Validator.apply(this, [{
                messageTemplates: {
                    NOT_OF_CORRECT_TYPE: function (value) {
                        return 'Value is not a String.  ' +
                            'Value type received: ' + sjl.classOf(value) + '.  ' +
                            'Value received: "' + value + '".';
                    },
                    GREATER_THAN_MAX_LENGTH: function (value) {
                        return 'Value is greater than maximum length of "' + this.max + '".  ' +
                            'Value length: "' + value.length + '".' +
                            'Value received: "' + value + '".';
                    },
                    LESS_THAN_MIN_LENGTH: function (value) {
                        return 'Value is less than minimum length of "' + this.min + '".  ' +
                            'Value length: "' + value.length + '".' +
                            'Value received: "' + value + '".';
                    }
                }
            }].concat(sjl.argsToArray(arguments)));
        };

    StringLengthValidator = Validator.extend(StringLengthValidator, {
        isValid: function (value) {
            var self = this,
                retVal,
                classOfValue;

            // Get value
            value = this.value = sjl.isset(value) ? value : self.value;
            classOfValue = sjl.classOf(value);

            // Test value type
            if (classOfValue !== String.name) {
                self.addErrorByKey('NOT_OF_CORRECT_TYPE');
                retVal = false;
            }
            // Test value max length
            else if (value.length > this.max) {
                self.addErrorByKey('GREATER_THAN_MAX_LENGTH');
                retVal = false;
            }
            // Test value min length
            else if (value.length < this.min) {
                self.addErrorByKey('LESS_THAN_MIN_LENGTH');
                retVal = false;
            }
            // Else is within allotted string length
            else {
                retVal = true;
            }
            return retVal;
        }

    });

    if (isNodeEnv) {
        module.exports = StringLengthValidator;
    }
    else {
        sjl.ns('validator.StringLengthValidator', StringLengthValidator);
        if (window.__isAmd) {
            return StringLengthValidator;
        }
    }

})();
