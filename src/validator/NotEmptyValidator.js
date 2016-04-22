/**
 * Created by Ely on 7/21/2014.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        Validator = sjl.ns.validator.Validator,
        NotEmptyValidator = function NotEmptyValidator() {
            // Set defaults and extend with Base validator
            Validator.apply(this, [{
                messageTemplates: {
                    EMPTY_NOT_ALLOWED: function () {
                        return 'Empty values are not allowed.';
                    }
                }
            }].concat(sjl.argsToArray(arguments)));
        };

    NotEmptyValidator = Validator.extend(NotEmptyValidator, {

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
        module.exports = NotEmptyValidator;
    }
    else {
        sjl.ns('validator.NotEmptyValidator', NotEmptyValidator);
        if (window.__isAmd) {
            return NotEmptyValidator;
        }
    }

})();
