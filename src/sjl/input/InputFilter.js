/**
 * Created by Ely on 7/24/2014.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Optionable = sjl.package.stdlib.Optionable,
        InputFilter = function InputFilter(options) {

            // Set defaults as options on this class
            Optionable.call(this, {
                data: [],
                inputs: {},
                invalidInputs: [],
                validInputs: [],
                validationGroup: null,
                messages: {}
            });

            sjl.extend(true, this.options, options);

        };

    InputFilter = Optionable.extend(InputFilter, {

        // @todo beef up add, get, and has methods (do param type checking before using param)
        add: function (value) {
            if (value instanceof sjl.Input) {
                this.getInputs()[value.getAlias()] = value;
            }

            return this;
        },

        get: function (value) {
            return this.getInputs()[value];
        },

        has: function (value) {
            return this.getInputs().hasOwnProperty(value);
        },

        isValid: function () {
            var self = this,
                inputs = self.getInputs(),
                data = self.getData();

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
            inputs = inputs || self.getInputs();

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
                self.options.inputs = inputs = {};
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
                input = new sjl.Input(inputs[input]);

                // Set input's validators
                input.getValidatorChain().addValidators(validators);

                // Save input
                self.options.inputs[input.getAlias()] = input;
            }

            return self;
        },

        getInputs: function () {
            var self = this;
            if (!sjl.classOfIs(self.options.inputs, 'Object')) {
                self.options.inputs = {};
            }
            return self.options.inputs;
        },

        remove: function (value) {
            var self = this,
                inputs = self.options.inputs;
            if (inputs.hasOwnProperty(value)) {
                inputs[value] = null;
                delete self.options.inputs[value];
            }
            return self;
        },

        setData: function (data) {
            var self = this;
            self.options.data = data;
            return self;
        },

        getData: function () {
            return this.options.data;
        },

        setValidationGroup: function () {
        },

        getInvalidInputs: function () {
            if (!sjl.classOfIs(this.options.invalidInputs, 'Object')) {
                this.options.invalidInputs = {};
            }
            return this.options.invalidInputs;
        },

        getValidInputs: function () {
            if (!sjl.classOfIs(this.options.validInputs, 'Object')) {
                this.options.validInputs = {};
            }
            return this.options.validInputs;
        },

        getRawValues: function () {
            var self = this,
                rawValues = {},
                input,
                invalidInputs = self.getInvalidInputs();

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
                values = {},
                input,
                invalidInputs = self.getInvalidInputs();

            for (input in invalidInputs) {
                if (!invalidInputs.hasOwnProperty(input)) {
                    continue;
                }
                input = invalidInputs[input];
                values[input.getAlias()] = input.getValue();
            }
            return values;
        },

        getMessages: function () {
            var self = this,
                messages = self.options.messages,
                input, key,
                invalidInputs = self.getInvalidInputs(),
                messageItem;

            for (key in invalidInputs) {
                if (!invalidInputs.hasOwnProperty(key)) {
                    continue;
                }
                input = invalidInputs[key];
                if (sjl.empty())
                    messageItem = messages[input.getAlias()];
                if (sjl.classOfIs(messageItem, 'Array')) {
                    messages[input.getAlias()] = messageItem.concat(input.getMessages());
                }
                else {
                    messages[input.getAlias()] = input.getMessages();
                }
            }
            return messages;
        },

        mergeMessages: function (messages) {
            if (!messages) {
                throw new Error('`InputFilter.mergeMessages` requires a "messages" hash parameter.');
            }
            var currentMessages = this.options.messages,
                key;
            for (key in messages) {
                if (messages.hasOwnProperty(key)) {
                    currentMessages[key] = messages[key].concat(currentMessages.hasOwnProperty(key) ? currentMessages[key] : []);
                }
            }
            return this;
        },

        clearMessages: function () {
            this.options.messages = {};
        },

        setDataOnInputs: function (data) {
            var self = this,
                inputs = self.getInputs(),
                key;

            data = data || self.getData();

            for (key in data) {
                if (!data.hasOwnProperty(key)
                    || !sjl.isset(inputs[key])
                    || !sjl.isset(data[key])) {
                    continue;
                }
                inputs[key].setValue(data[key]);
            }
        },

        clearValidInputs: function () {
            this.setOption('validInputs', {});
            return this;
        },

        clearInvalidInputs: function () {
            this.setOption('invalidInputs', {});
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
            var inputFilter = new sjl.InputFilter();
            inputFilter.setInputs(inputSpec.inputs);
            return inputFilter;
        },

        VALIDATE_ALL: 0

    });

    if (isNodeEnv) {
        module.exports = InputFilter;
    }
    else {
        sjl.package('input.InputFilter', InputFilter);
    }

})();
