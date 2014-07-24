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
            isValid: function () {

            },

            getInputFilter: function () {},
            setInputFilter: function (value) {
                this.options.inputFilter = value;
            },

            getFilterChain: function () {},
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

            getValue: function (value) {
                return this.getOption('value');
            },
            setValue: function (value) {
                this.options.value = value;
            },

            getFallbackValue: function () {},
            setFallbackValue: function (value) {
                this.options.fallbackValue = value;
            },

            getRequired: function () {},
            setRequired: function (value) {
                this.options.required = value;
            },

            getAllowEmpty: function () {},
            setAllowEmpty: function (value) {
                this.options.allowEmpty = value;
            },

            getBreakOnFailure: function () {},
            setBreakOnFailure: function (value) {
                this.options.breakOnFailure = value;
            },

            getContinueIfEmpty: function () {},
            setContinueIfEmpty: function (value) {
                this.options.continueIfEmpty = value;
            }

        });

})(typeof window === 'undefined' ? global : window);
