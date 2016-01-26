/**
 * Created by Ely on 7/21/2014.
 * @todo work in progress port of Zend\Validator\EmailAddress.php (massive undertaking!)
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../src/sjl/sjl.js') : window.sjl || {},
        RegexValidator = sjl.ns.refactor.validator.RegexValidator,
        EmailValidator = function EmailValidator(/**...options {Object}**/) {

            var _checkMx = false,
                _checkMxDeep = false,
                _checkDomain = false,
                _hostnameValidator,
                _strict = true,
                _allow = true
                ;
            Object.defineProperties(this, {
                checkMx: {
                    get: function () {
                        return _checkMx;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextNamae, 'checkMx', value, Boolean);
                        _checkMx = value;
                    }
                },
                checkMxDeep: {
                    get: function () {
                        return _checkMxDeep;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextNamae, 'checkMxDeep', value, Boolean);
                        _checkMxDeep = value;
                    }
                },
                checkDomain: {
                    get: function () {
                        return _checkDomain;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextNamae, 'checkDomain', value, Boolean);
                        _checkDomain = value;
                    }
                },
                hostnameValidator: {
                    get: function () {
                        return _hostnameValidator;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextNamae, 'hostnameValidator', value, Validator);
                        _hostnameValidator = value;
                    }
                }
            });

            // Set defaults and extend with Base validator
            Validator.apply(this, [{

            }].concat(sjl.argsToArray(arguments)));
        };

    EmailValidator = RegexValidator.extend(EmailValidator, {

        isValid: function (value) {
            var self = this,
                retVal;

            // Clear any existing messages
            self.clearMessages();

            // Set and get or get value (gets the set value if value is undefined
            value = typeof value !== 'undefined' ? value : self.value;

            // Run the test
            retVal = self.pattern.test(value);

            // If test failed
            if (retVal === false) {
                self.addErrorByKey('INVALID_EMAIL');
            }

            return retVal;
        }

    });

    if (isNodeEnv) {
        module.exports = EmailValidator;
    }
    else {
        sjl.ns('refactor.validator.EmailValidator', EmailValidator);
        if (window.__isAmd) {
            return EmailValidator;
        }
    }

})();
