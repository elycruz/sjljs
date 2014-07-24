/**
 * Created by Ely on 7/24/2014.
 */
/**
 * Created by Ely on 7/21/2014.
 */
(function (context) {

    context.sjl = context.sjl || {};

    context.sjl['input-filter'].Input = context.sjl.Optionable.extend(
        function Input(options) {

            // Set defaults as options on this class
            context.sjl.Optionable.call(this, {
                allowEmpty: true,
                continueIfEmpty: false,
                breakOnFailure: false,
                fallbackValue: null,
                filterChain: null,
                name: null,
                required: true,
                validatorChain: null,
                value: null
            });

            this.setOptions(options);

        }, {

            /**
             * This is a crude implementation
             * @todo review if we really want to have fallback value
             *      functionality for javascript
             * @returns {boolean}
             */
            isValid: function () {

                var self = this,
                    validatorChain,
                    value,
                    retVal = false;

                if (!self.getContinueIfEmpty()) {
                    // inject non empty validator
                }

                validatorChain = self.getValidatorChain();
                value = self.getValue();
                retVal = validatorChain.isValid(value);

                // Fallback value
                if (retVal === false && self.hasFallbackValue()) {
                    self.setValue(self.getFallbackValue());
                    retVal = true;
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
                return this.getOption('validatorChain');
            },

            setValidatorChain: function (value) {
                this.options.validatorChain = value;
            },

            getName: function () {
                return this.getOption('name');
            },

            setName: function (value) {
                this.options.name = value;
            },

            getRawValue: function () {
                return this.options.rawValue;
            },

            setRawValue: function (value) {
                this.options.rawValue = value;
            },

            getValue: function (value) {
                return this.getOption('value');
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
                return !context.sjl.classOfIs(this.getFallbackValue(), 'Undefined');
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
                return this.options.breakOnFailure;
            },

            setContinueIfEmpty: function (value) {
                this.options.continueIfEmpty = value;
            }

        });

})(typeof window === 'undefined' ? global : window);
