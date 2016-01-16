/**
 * Created by Ely on 7/21/2014.
 */

'use strict';

(function () {
    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../../sjl.js') : window.sjl || {},
        Validator = sjl.ns.refactor.validator.Validator,
        EmptyValidator = function EmptyValidator() {
            // Set defaults and extend with Base validator
            Validator.apply(this, [{
                messageTemplates: {
                    EMPTY_NOT_ALLOWED: function () {
                        return 'Empty values are not allowed.';
                    }
                }
            }].concat(sjl.argsToArray(arguments)));
        };

    EmptyValidator = Validator.extend(EmptyValidator, {

        isValid: function (value) {
            var self = this,
                retVal = false;

            // Clear any existing messages
            self.clearMessages();

            // Set and get or get value (gets the set value if value is undefined
            value = typeof value === 'undefined' ? this.value : value;

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
