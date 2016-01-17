/**
 * Created by Ely on 7/21/2014.
 */

'use strict';

(function () {

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../../sjl.js') : window.sjl || {},
        contextName = 'sjl.ns.refactor.validator.RegexValidator',
        Validator = sjl.ns.refactor.validator.Validator,
        RegexValidator = function RegexValidator(/** ...options {Object} **/) {
            var _pattern = null;
            Object.defineProperties(this, {
                pattern: {
                    get: function () {
                        return _pattern;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'pattern', value, RegExp);
                        _pattern = value;
                    }
                }
            });

            // Set defaults and extend with Base validator
            Validator.call(this, {
                pattern: /./,
                messageTemplates: {
                    DOES_NOT_MATCH_PATTERN: function () {
                        return 'The value passed in does not match pattern"'
                            + this.getPattern() + '".  Value passed in: "'
                            + this.getValue() + '".';
                    }
                }
            });
        };

    RegexValidator = Validator.extend(RegexValidator, {
        isValid: function (value) {
            var self = this,
                retVal = false;

            // Clear any existing messages
            self.clearMessages();

            // Set and get or get value (gets the set value if value is undefined
            value = typeof value === 'undefined' ? this.value : value;

            // Run the test
            retVal = self.pattern.test(value);

            // Clear messages before checking validity
            if (self.messages.length > 0) {
                self.clearMessages();
            }

            // If test failed
            if (retVal === false) {
                self.addErrorByKey('DOES_NOT_MATCH_PATTERN');
            }

            return retVal;
        }

    });

    if (isNodeEnv) {
        module.exports = RegexValidator;
    }
    else {
        sjl.ns('validator.RegexValidator', RegexValidator);
        if (window.__isAmd) {
            return RegexValidator;
        }
    }

})();
