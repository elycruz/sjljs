/**
 * Created by Ely on 7/24/2014.
 * This is a crude implementation
 * @todo review if we really want to have fallback value
 *      functionality for javascript
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        ValidatorChain = sjl.validator.ValidatorChain,
        FilterChain = sjl.filter.FilterChain,
        Extendable = sjl.stdlib.Extendable,
        contextName = 'sjl.input.Input',
        Input = function Input(options) {
            var _allowEmpty = false,
                _continueIfEmpty = true,
                _breakOnFailure = false,
                _fallbackValue,
                _filterChain = null,
                _alias = '',
                _required = true,
                _validatorChain = null,
                _value,
                _rawValue,
                _filteredValue,

                // Protect from adding programmatic validators, from within `isValid`, more than once
                _validationHasRun = false;

            Object.defineProperties(this, {
                allowEmpty: {
                    get: function () {
                        return _allowEmpty;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'allowEmpty', value, Boolean);
                        _allowEmpty = value;
                    }
                },
                continueIfEmpty: {
                    get: function () {
                        return _continueIfEmpty;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'continueIfEmpty', value, Boolean);
                        _continueIfEmpty = value;
                    }
                },
                breakOnFailure: {
                    get: function () {
                        return _breakOnFailure;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'breakOnFailure', value, Boolean);
                        _breakOnFailure = value;
                    }
                },
                fallbackValue: {
                    get: function () {
                        return _fallbackValue;
                    },
                    set: function (value) {
                        if (typeof value === 'undefined') {
                            throw new TypeError('Input.fallbackValue cannot be set to an undefined value.');
                        }
                        _fallbackValue = value;
                    }
                },
                filterChain: {
                    get: function () {
                        if (!sjl.isset(_filterChain)) {
                            _filterChain = new FilterChain();
                        }
                        return _filterChain;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'filterChain', value, FilterChain);
                        _filterChain = value;
                    }
                },
                validators: {
                    get: function () {
                        return this.validatorChain.validators;
                    },
                    set: function (value) {
                        this.validatorChain.addValidators(value);
                    }
                },
                filters: {
                    get: function () {
                        return this.filterChain.filters;
                    },
                    set: function (value) {
                        this.filterChain.addFilters(value);
                    }
                },
                alias: {
                    get: function () {
                        return _alias;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'alias', value, String);
                        _alias = value;
                    }
                },
                required: {
                    get: function () {
                        return _required;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'required', value, Boolean);
                        _required = value;
                    }
                },
                validatorChain: {
                    get: function () {
                        if (!sjl.isset(_validatorChain)) {
                            _validatorChain = new ValidatorChain();
                        }
                        return _validatorChain;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'validatorChain', value, ValidatorChain);
                        _validatorChain = value;
                    }
                },
                value: {
                    get: function () {
                        return _value;
                    },
                    set: function (value) {
                        if (sjl.isUndefined(value)) {
                            throw new TypeError('Input.value cannot be set to an undefined value.');
                        }
                        _value = value;
                    }
                },
                rawValue: {
                    get: function () {
                        return _rawValue;
                    },
                    set: function (value) {
                        if (typeof value === 'undefined') {
                            throw new TypeError('Input.rawValue cannot be set to an undefined value.');
                        }
                        _rawValue = value;
                    }
                },
                filteredValue: {
                    get: function () {
                        return _filteredValue;
                    },
                    set: function (value) {
                        if (sjl.isUndefined(value)) {
                            throw new TypeError(contextName + '.filteredValue doesn\'t allow `undefined` values.');
                        }
                        _filteredValue = value;
                    }
                },
                messages: {
                    get: function () {
                        return this.validatorChain.messages;
                    },
                    set: function (value) {
                        this.validatorChain.messages = value;
                    }
                },
                validationHasRun: {
                    get: function () {
                        return _validationHasRun;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'validationHasRun', value, Boolean);
                        _validationHasRun = value;
                    }
                },
            });

            if (sjl.classOfIs(options, String)) {
                this.alias = options;
            }
            else if (sjl.classOfIs(options, Object)) {
                sjl.extend(this, options);
            }

            // Set raw value
            if (this.value && sjl.isUndefined(this.rawValue)) {
                this.rawValue = this.value;
            }
        };

    Input = Extendable.extend(Input, {

        isValid: function (value) {

            var self = this,

                // Get the validator chain, value and validate
                validatorChain = self.validatorChain,
                valueToTest = this.resolveValueToTest(value),
                isValid,
                retVal;

            // Clear messages
            self.clearMessages();

            // Ensure raw value
            self.rawValue = valueToTest;

            // Check whether we need to add an empty validator
            if (!self.validationHasRun && self.continueIfEmpty) {
                validatorChain.addValidator(new sjl.validator.NotEmptyValidator());
            }

            // Get whether is valid or not
            isValid = validatorChain.isValid(valueToTest);

            // Run filter if valid
            if (isValid) {
                retVal = true;
                self.value =
                    self.filteredValue =
                        this.filter(valueToTest);
            }
            // Get fallback value if any
            else if (!isValid && self.hasFallbackValue()) {
                self.value = self.fallbackValue;
                retVal = true;
            }
            else {
                retVal = false;
            }

            // Protect from adding programmatic validators more than once..
            if (!self.validationHasRun) {
                self.validationHasRun = true;
            }

            return retVal;
        },

        validate: function (value) {
            return this.isValid.apply(this, arguments);
        },

        filter: function (value) {
            return this.filterChain.filter(sjl.isUndefined(value) ? this.rawValue : value);
        },

        resolveValueToTest: function (value) {
            return !sjl.isUndefined(value) ? value :
                (!sjl.isUndefined(this.rawValue) ? this.rawValue : this.value);
        },

        hasFallbackValue: function () {
            return typeof this.fallbackValue !== 'undefined';
        },

        clearMessages: function () {
            this.validatorChain.clearMessages();
            return this;
        },

        addValidators: function (validators) {
            this.validatorChain.addValidators(validators);
            return this;
        },

        addValidator: function (validator) {
            this.validatorChain.addValidator(validator);
            return this;
        },

        prependValidator: function (validator) {
            this.validatorChain.prependValidator(validator);
            return this;
        },

        mergeValidatorChain: function (validatorChain) {
            this.validatorChain.mergeValidatorChain(validatorChain);
            return this;
        },

        addFilters: function (filters) {
            this.filterChain.addFilters(filters);
            return this;
        },

        addFilter: function (filter) {
            this.filterChain.addFilter(filter);
            return this;
        },

        prependFilter: function (filter) {
            this.filterChain.prependFilter(filter);
            return this;
        },

        mergeFilterChain: function (filterChain) {
            this.filterChain.mergeFilterChain(filterChain);
            return this;
        }

    });

    if (isNodeEnv) {
        module.exports = Input;
    }
    else {
        sjl.ns('input.Input', Input);
        if (window.__isAmd) {
            return Input;
        }
    }

})();
