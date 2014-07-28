/**
 * Created by Ely on 7/24/2014.
 */
(function (context) {

    context.sjl = context.sjl || {};
    context.sjl.input = context.sjl.input || {};

    context.sjl.input.InputFilter = context.sjl.Optionable.extend(
        function InputFilter(options) {

            // Set defaults as options on this class
            context.sjl.Optionable.call(this, {
                data: [],
                inputs: {},
                invalidInputs: [],
                validInputs: [],
                validationGroup: null
            });

            this.setOptions(options);

        }, {

            // @todo beef up add, get, and has methods (do param type checking before using param)
            add: function (value) {
                this.getInputs()[value.getName()] = value;
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
                    data = self.getRawValues();

                // If no data bail and throw an error
                if (context.sjl.empty(data)) {
                    throw new Error("InputFilter->isValid could\'nt " +
                        "find any data for validation.");
                }

                return self.validateInputs(inputs, data);
            },

            validateInput: function (input, dataMap) {
                var dataExists = context.sjl.isset(dataMap[name]),
                    data = dataExists ? dataMap[name] : null,
                    required = input.getRequired(),
                    allowEmpty = input.getAllowEmpty(),
                    continueIfEmpty = input.getContinueIfEmpty(),
                    retVal = false;

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
                else if (dataExists && context.sjl.empty(data) && !required) {
                    retVal = true;
                }

                // If data exists, is empty, is required, and allows empty,
                // then input is valid if continue if empty is false
                else if (dataExists && context.sjl.empty(data) && required
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
                    name = input;
                    input = inputs[input];

                    // @todo Check that input has the required interface(?)
                    if (self.validateInput(input, data)) {
                        validInputs[name] = input;
                        retVal = true;
                    }
                    else {
                        invalidInputs[name] = input;
                        retVal = false;
                    }
                }

                return retVal;
            },

            setInputs: function (inputs) {
                var self = this,
                    input;

                // Set default inputs value if inputs is not of type "Object"
                if (!context.sjl.classOfIs(inputs, 'Object')) {
                    self.options.inputs = inputs = { };
                }

                // Populate inputs
                for (input in inputs) {
                    input = new context.sjl.input.Input(inputs[input]);
                    self.options.inputs[input.getName()] = input;
                }

                return self;
            },

            getInputs: function () {
                var self = this;
                if (!context.sjl.classOfIs(self.options.inputs, 'Object')) {
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

            setValidationGroup: function () {
            },

            getInvalidInputs: function () {
                if (!context.sjl.classOfIs(this.options.invalidInputs, 'Object')) {
                    this.options.invalidInputs = {};
                }
                return this.options.invalidInputs;
            },

            getValidInputs: function () {
                if (!context.sjl.classOfIs(this.options.validInputs, 'Object')) {
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
                    input = invalidInputs[input];
                    rawValues[input.getName()] = input.getRawValue();
                }
                return rawValues;
            },

            getValues: function () {
                var self = this,
                    values = {},
                    input,
                    invalidInputs = self.getInvalidInputs();

                for (input in invalidInputs) {
                    input = invalidInputs[input];
                    values[input.getName()] = input.getValue();
                }
                return values;
            },

            getMessages: function () {
                var self = this,
                    messages = {},
                    input,
                    invalidInputs = self.getInvalidInputs();

                for (input in invalidInputs) {
                    input = invalidInputs[input];
                    messages[input.getName()] = input.getMessages();
                }
                return messages;
            }

        }, {

            factory: function (inputSpec) {
                if (!context.sjl.classOfIs(inputSpec, 'Object')
                    || !context.sjl.isset(inputSepc.inputs)) {
                    throw new Error("InputFilter class expects param 1 to be of type \"Object\".");
                }
                return new context.sjl.input.InputFilter(inputSpec);
            },

            VALIDATE_ALL: 0

        });

})(typeof window === 'undefined' ? global : window);
