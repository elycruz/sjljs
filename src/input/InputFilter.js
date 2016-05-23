/**
 * Created by elydelacruz on 5/21/16.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Input = sjl.input.Input,
        contextName = 'sjl.input.InputFilter',
        validateNonEmptyKey = function (key, methodName, type) {
            sjl.throwTypeErrorIfEmpty(contextName + '.' + methodName, 'key', key, String);
        },
        InputFilter = function InputFilter(options) {
            var _data = {},
                _inputs = {},
                _invalidInputs = {},
                _validInputs = {},
                _validationGroup = {},
                _messages = {};

            Object.defineProperties(this, {
                data: {
                    get: function () {
                        return _data;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'data', value, Array);
                        _data = value;
                    }
                },
                inputs: {
                    get: function () {
                        return _inputs;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'inputs', value, Object);
                        _inputs = value;
                    }
                },
                invalidInputs: {
                    get: function () {
                        return _invalidInputs;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'invalidInputs', value, Object);
                        _invalidInputs = value;
                    }
                },
                validInputs: {
                    get: function () {
                        return _validInputs;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'validInputs', value, Object);
                        _validInputs = value;
                    }
                },
                validationGroup: {
                    get: function () {
                        return _validationGroup;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'validationGroup', value, String);
                        _validationGroup = value;
                    }
                },
                messages: {
                    get: function () {
                        return _messages;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'messages', value, Object);
                        _messages = value;
                    }
                }
            });

            if (sjl.isObject(options)) {
                sjl.extend(true, this, options);
            }
        };

    InputFilter = Optionable.extend(InputFilter, {
        add: function (value) {
            if (value instanceof Input) {
                this.inputs[value.getAlias()] = value;
            }
            return this;
        },

        get: function (key) {
            validateNonEmptyKey(key, 'get');
            return this.inputs[key];
        },

        has: function (key) {
            validateNonEmptyKey(key, 'get');
            return typeof this.inputs[key] !== 'undefind';
        },

        isValid: function () {
            var self = this,
                inputs = self.inputs,
                data = self.data;

            self.clearInvalidInputs()
                .clearValidInputs()
                .clearMessages();

            // Populate inputs with data
            self.setDataOnInputs();


            // If no data bail and throw an error
            if (sjl.empty(data)) {
                throw new Error('InputFilter->isValid could\'nt ' +
                    'find any data for validation.');
            }

            return self.validateInputs(inputs, data);
        },

        validateInput: function (input, dataMap) {
            var name = input.getAlias(),
                dataExists = sjl.isset(dataMap[name]),
                data = dataExists ? dataMap[name] : null,
                required = input.getRequired(),
                allowEmpty = input.getAllowEmpty(),
                continueIfEmpty = input.getContinueIfEmpty(),
                retVal = true;

            // If data doesn't exists and input is not required
            if (!dataExists && !required) {
                retVal = true;
            }

            // If data doesn't exist, input is required, and input allows empty value,
            // then input is valid only if continueIfEmpty is false;
            else if (!dataExists && required && allowEmpty && !continueIfEmpty) {
                retVal = true;
            }

            // If data exists, is empty, and not required
            else if (dataExists && sjl.empty(data) && !required) {
                retVal = true;
            }

            // If data exists, is empty, is required, and allows empty,
            // then input is valid if continue if empty is false
            else if (dataExists && sjl.empty(data) && required
                && allowEmpty && !continueIfEmpty) {
                retVal = true;
            }

            else if (!input.isValid()) {
                retVal = false;
            }

            return retVal;
        },

        validateInputs: function (inputs, data) {
            var self = this,
                validInputs = {},
                invalidInputs = {},
                retVal = true,

            // Input vars
                input, name;

            // Get inputs
            inputs = inputs || self.inputs;

            // Get data
            data = data || self.getRawValues();

            // Validate inputs
            for (input in inputs) {
                if (!inputs.hasOwnProperty(input)) {
                    continue;
                }
                name = input;
                input = inputs[input];

                // @todo Check that input has the required interface(?)
                if (self.validateInput(input, data)) {
                    validInputs[name] = input;
                }
                else {
                    invalidInputs[name] = input;
                }
            }

            // If no invalid inputs then validation passed
            if (sjl.empty(invalidInputs)) {
                retVal = true;
            }
            // else validation failed
            else {
                retVal = false;
            }

            // Set valid inputs
            self.setOption('validInputs', validInputs);

            // Set invalid inputs
            self.setOption('invalidInputs', invalidInputs);

            return retVal;
        },

        setInputs: function (inputs) {
            var self = this,
                input, name,
                validators;

            // Set default inputs value if inputs is not of type 'Object'
            if (!sjl.classOfIs(inputs, 'Object')) {
                self.inputs = inputs = {};
            }

            // Populate inputs
            for (input in inputs) {
                if (!inputs.hasOwnProperty(input)) {
                    continue;
                }

                name = input;

                validators = self._getValidatorsFromInputHash(inputs[input]);
                inputs[input].validators = null;
                delete inputs[input].validators;

                // Set name if it is not set
                if (!sjl.isset(inputs[input].alias)) {
                    inputs[input].alias = name;
                }

                // Create input
                input = new Input(inputs[input]);

                // Set input's validators
                input.getValidatorChain().addValidators(validators);

                // Save input
                self.inputs[input.getAlias()] = input;
            }

            return self;
        },

        remove: function (value) {
            var self = this,
                inputs = self.inputs;
            if (inputs.hasOwnProperty(value)) {
                inputs[value] = null;
                delete self.inputs[value];
            }
            return self;
        },

        setValidationGroup: function () {
        },

        getRawValues: function () {
            var self = this,
                rawValues = {},
                input,
                invalidInputs = self.invalidInputs;

            for (input in invalidInputs) {
                if (!invalidInputs.hasOwnProperty(input)) {
                    continue;
                }
                input = invalidInputs[input];
                rawValues[input.getAlias()] = input.getRawValue();
            }
            return rawValues;
        },

        getValues: function () {
            var self = this,
                values = {};
            sjl.forEachInObj(this.invalidInputs, function (input, key) {
                //if (sjl.isset(self.invalidInputs[key]))
                input = invalidInputs[input];
                values[input.getAlias()] = input.getValue();

            })
            return values;
        },

        getMessages: function () {
            var self = this,
                messages = self.messages;
            sjl.forEach(this.invalidInputs, function (input, key) {
                var messageItem;
                if (sjl.notEmptyAndOfType(input, Input)) {
                    messageItem = messages[input.alias];
                }
                if (sjl.isArray(messageItem)) {
                    messages[input.alias] = messageItem.concat(input.messages);
                }
                else {
                    messages[input.alias] = input.messages;
                }
            });
            return messages;
        },

        mergeMessages: function (messages) {
            sjl.throwTypeErrorIfNotOfType(contextName + '.mergeMessages', 'messages', messages, Object);
            Object.keys(messages).forEach(function (key) {
                this.messages[key] = messages[key].concat(sjl.isset(this.messages[key]) ? this.messages[key] : []);
            });
            return this;
        },

        clearMessages: function () {
            this.messages = {};
            return this;
        },

        setDataOnInputs: function (data) {
            Object.keys(data).forEach(function (key) {
                if (!sjl.isUndefined(data[key])) {
                    this.inputs[key].value = data[key];
                }
            }, this);
            return this;
        },

        clearValidInputs: function () {
            this.validInputs = {};
            return this;
        },

        clearInvalidInputs: function () {
            this.invalidInputs = {};
            return this;
        },

        _getValidatorsFromInputHash: function (inputHash) {
            return sjl.isset(inputHash.validators) ? inputHash.validators : null;
        }

    }, {

        factory: function (inputSpec) {
            if (!sjl.classOfIs(inputSpec, 'Object')
                || !sjl.isset(inputSpec.inputs)) {
                throw new Error('InputFilter class expects param 1 to be of type "Object".');
            }
            var inputFilter = new InputFilter();
            inputFilter.setInputs(inputSpec.inputs);
            return inputFilter;
        },

        VALIDATE_ALL: 0

    });

    if (isNodeEnv) {
        module.exports = InputFilter;
    }
    else {
        sjl.ns('input.InputFilter', InputFilter);
        if (window.__isAmd) {
            return InputFilter;
        }
    }

})();
