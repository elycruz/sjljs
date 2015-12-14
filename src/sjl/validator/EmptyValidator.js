/**
 * Created by Ely on 7/21/2014.
 */

'use strict';

(function () {
    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        BaseValidator = sjl.ns.validator.BaseValidator,
        EmptyValidator = function EmptyValidator(options) {

            // Set defaults and extend with Base validator
            BaseValidator.call(this, {
                messageTemplates: {
                    EMPTY_NOT_ALLOWED: function () {
                        return 'Empty values are not allowed.';
                    }
                }
            });

            // Set options passed, if any
            this.setOptions(options);
        };

    EmptyValidator = BaseValidator.extend(EmptyValidator, {

        isValid: function (value) {
            var self = this,
                retVal = false;

            // Clear any existing messages
            self.clearMessages();

            // Set and get or get value (gets the set value if value is undefined
            value = self.getValue(value);

            // Run the test
            retVal = !sjl.empty(value);

            // If test failed
            if (retVal === false) {
                self.addErrorByKey('EMPTY_NOT_ALLOWED');
            }

            return retVal;
        }

    });

    if (isNodeEnv) {
        module.exports = EmptyValidator;
    }
    else {
        sjl.ns('validator.EmptyValidator', EmptyValidator);
        if (window.__isAmd) {
            return EmptyValidator;
        }
    }

})();
