/**
 * Created by Ely on 7/24/2014.
 */
(function (context) {

    context.sjl = context.sjl || {};

    context.sjl.InputFilter = context.sjl.Optionable.extend(

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
                if (value instanceof context.sjl.Input) {
                    this.getInputs()[value.getName()] = value;
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

                self.clearInvalidInputs();
                self.clearValidInputs();

                // Populate inputs with data
                self.setDataOnInputs();


                // If no data bail and throw an error
                if (context.sjl.empty(data)) {
                    throw new Error("InputFilter->isValid could\'nt " +
                        "find any data for validation.");
                }

                return self.validateInputs(inputs, data);
            },

            validateInput: function (input, dataMap) {
                var name = input.getName(),
                    dataExists = context.sjl.isset(dataMap[name]),
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
                    }
                    else {
                        invalidInputs[name] = input;
                    }
                }

                // If no invalid inputs then validation passed
                if (context.sjl.empty(invalidInputs)) {
                    retVal = true;
                }
                // else validtion failed
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

                // Set default inputs value if inputs is not of type "Object"
                if (!context.sjl.classOfIs(inputs, 'Object')) {
                    self.options.inputs = inputs = {};
                }

                // Populate inputs
                for (input in inputs) {
                    name = input;

                    validators = self._getValidatorsFromInputHash(inputs[input]);
                    inputs[input].validators = null;
                    delete inputs[input].validators;

                    // Set name if it is not set
                    if (!context.sjl.isset(inputs[input].name)) {
                      inputs[input].name = name;
                    }

                    // Create input
                    input = new context.sjl.Input(inputs[input]);

                    // Set input's validators
                    input.getValidatorChain().addValidators(validators);

                    // Save input
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
                    input, key,
                    invalidInputs = self.getInvalidInputs();

                for (key in invalidInputs) {
                    input = invalidInputs[key];
                    messages[input.getName()] = input.getMessages();
                }
                return messages;
            },

            setDataOnInputs: function (data) {
                var self = this,
                    inputs = self.getInputs(),
                    key;

                data = data || self.getData();

                for (key in data) {
                    if (!context.sjl.isset(inputs[key])
                         || !context.sjl.isset(data[key])) {
                        continue;
                    }
                    inputs[key].setValue(data[key]);
                }
            },

            clearValidInputs: function () {
                this.setOption('validInputs', {});
            },

            clearInvalidInputs: function () {
                this.setOption('invalidInputs', {});
            },

            _getValidatorsFromInputHash: function (inputHash) {
                return context.sjl.isset(inputHash.validators) ? inputHash.validators : null;
            }

        }, {

            factory: function (inputSpec) {
                if (!context.sjl.classOfIs(inputSpec, 'Object')
                    || !context.sjl.isset(inputSpec.inputs)) {
                    throw new Error("InputFilter class expects param 1 to be of type \"Object\".");
                }
                var inputFilter = new context.sjl.InputFilter();
                inputFilter.setInputs(inputSpec.inputs);
                return inputFilter;
            },

            VALIDATE_ALL: 0

        });

})(typeof window === 'undefined' ? global : window);
