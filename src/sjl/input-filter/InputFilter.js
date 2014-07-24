/**
 * Created by Ely on 7/24/2014.
 */
(function (context) {

    context.sjl = context.sjl || {};

    context.sjl['input-filter'].InputFilter = context.sjl.Optionable.extend(
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

            add: function (value) {
                this.inputs[value.name] = value;
                return this;
            },

            get: function (value) {
                return this.inputs[value];
            },

            has: function (value) {
                return this.inputs.hasOwnProperty(value);
            },

            isValid: function () {},

            remove: function () {
                var self = this;
                if (self.inputs.hasOwnProperty(value)) {
                    self.inputs[value] = null;
                    delete self.inputs[value];
                }
                return self;
            },

            setData: function (data) {
                var self = this;
                self.options.data = data;
                return self;
            },

            setValidationGroup: function () {},

            getInvalidInputs: function () {},

            getValidInputs: function (value) {},

            getRawValue: function (value) {},

            getValues: function (value) {},

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

            VALIDATE_ALL: 0

        });

})(typeof window === 'undefined' ? global : window);
