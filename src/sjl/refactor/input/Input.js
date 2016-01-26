/**
 * Created by Ely on 7/24/2014.
 * This is a crude implementation
 * @todo review if we really want to have fallback value
 *      functionality for javascript
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../../sjl.js') : window.sjl || {},
        ValidatorChain = sjl.ns.refactor.validator.ValidatorChain,
        Input = function Input(options) {
            var _allowEmpty = false,
                _continueIfEmpty = false,
                _breakOnFailure = false,
                _fallbackValue = false,
                _filterChain = null,
                _alias = '',
                _required = true,
                _validatorChain = null,
                _value = null,
                _messages = null,

                // Protect from adding programmatic validators, from within `isValid`, more than once
                _validHasRun = false;

            Object.defineProperties(this, {

            });

            if (sjl.classOfIs(options, 'String')) {
                this.alias = options;
            }
        };

    Input = Optionable.extend(Input, {

        /**
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
                validatorChain.addValidator(new sjl.EmptyValidator());
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
                self.options.isValidHasRun = true;
            }

            return retVal;
        },

        hasFallbackValue: function () {
            return typeof this.fallbackValue !== 'undefined';
        },

        clearMessages: function () {
            this.messages = [];
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
