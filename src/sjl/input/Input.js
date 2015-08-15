/**
 * Created by Ely on 7/24/2014.
 */
/**
 * Created by Ely on 7/21/2014.
 */

'use strict';

(function (context) {

    context.sjl.Input = context.sjl.Optionable.extend(
        function Input(options) {
            var alias = null;

            if (context.sjl.classOfIs(options, 'String')) {
                alias = options;
            }

            // Set defaults as options on this class
            context.sjl.Optionable.call(this, {
                allowEmpty: false,
                continueIfEmpty: true,
                breakOnFailure: false,
                fallbackValue: null,
                filterChain: null,
                alias: alias,
                required: true,
                validatorChain: null,
                value: null,
                messages: []
            });

            if (!context.sjl.empty(options)) {
                this.setOptions(options);
            }

            // Protect from adding programmatic validators, from within `isValid`, more than once
            this.options.isValidHasRun = false;

            // Only functions on objects;  Will
            // ignore options if it is a string
            //if (context.sjl.classOfIs(options, 'Object')) {
            //    sjl.extend(true, this.options, options, true);
            //}

        }, {

            /**
             * This is a crude implementation
             * @todo review if we really want to have fallback value
             *      functionality for javascript
             * @returns {Boolean}
             */
            isValid: function (value) {

                var self = this,

                    // Get the validator chain, value and validate
                    validatorChain = self.getValidatorChain(),

                    retVal = false;

                // Clear messages
                self.clearMessages();

                // Check whether we need to add an empty validator
                if (!self.options.isValidHasRun && !self.getContinueIfEmpty()) {
                    validatorChain.addValidator(new context.sjl.EmptyValidator());
                }

                value = value || self.getValue();
                retVal = validatorChain.isValid(value);

                // Fallback value
                if (retVal === false && self.hasFallbackValue()) {
                    self.setValue(self.getFallbackValue());
                    retVal = true;
                }

                // Set messages internally
                self.setMessages();

                // Protect from adding programmatic validators more than once..
                if (!self.options.isValidHasRun) {
                    self.options.isValidHasRun= true;
                }

                return retVal;
            },

            getInputFilter: function () {
                return this.options.inputFilter;
            },

            setInputFilter: function (value) {
                this.options.inputFilter = value;
            },

            getFilterChain: function () {
                return this.options.filterChain;
            },

            setFilterChain: function (value) {
                this.options.filterChain = value;
            },

            getValidatorChain: function () {
                var self = this;
                if (!context.sjl.isset(self.options.validatorChain)) {
                    self.options.validatorChain = new context.sjl.ValidatorChain({
                        breakOnFailure: self.getBreakOnFailure()
                    });
                }
                return self.options.validatorChain;
            },

            setValidatorChain: function (value) {
                if (context.sjl.classOfIs(value, 'Object')
                    && context.sjl.isset(value.validators)) {
                    this.getValidatorChain().setOption('validators', value.validators);
                }
                else {
                    this.options.validatorChain = value;
                }
                return this;
            },

            getAlias: function () {
                return this.options.alias;
            },

            setAlias: function (value) {
                this.options.alias = value;
            },

            getRawValue: function () {
                return this.options.rawValue;
            },

            setRawValue: function (value) {
                this.options.rawValue = value;
            },

            getValue: function (value) {
                return this.options.value;
            },

            setValue: function (value) {
                this.options.value =
                    this.options.rawValue = value;
            },

            getFallbackValue: function () {
                return this.options.fallbackValue;
            },

            setFallbackValue: function (value) {
                this.options.fallbackValue = value;
            },

            hasFallbackValue: function () {
                return !context.sjl.classOfIs(this.getFallbackValue(), 'Undefined') &&
                    !context.sjl.classOfIs(this.getFallbackValue(), 'Null');
            },

            getRequired: function () {
                return this.options.required;
            },

            setRequired: function (value) {
                this.options.required = value;
            },

            getAllowEmpty: function () {
                return this.options.allowEmpty;
            },

            setAllowEmpty: function (value) {
                this.options.allowEmpty = value;
            },

            getBreakOnFailure: function () {
                return this.options.breakOnFailure;
            },

            setBreakOnFailure: function (value) {
                this.options.breakOnFailure = value;
            },

            getContinueIfEmpty: function () {
                return this.options.continueIfEmpty;
            },

            setContinueIfEmpty: function (value) {
                this.options.continueIfEmpty = value;
            },

            clearMessages: function () {
                this.options.messages = [];
            },

            setMessages: function (messages) {
                var self = this;
                if (context.sjl.classOfIs(messages, 'Array')) {
                    self.options.messages = messages;
                }
                else {
                    self.options.messages = self.getValidatorChain().getMessages();
                }
                return self;
            },

            getMessages: function () {
                var self = this;
                if (!context.sjl.isset(self.options.messages)) {
                    self.options.messages = [];
                }
                return self.options.messages;
            }
        });

})(typeof window === 'undefined' ? global : window);
