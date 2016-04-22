/**
 * Created by Ely on 1/21/2015.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        Validator = sjl.ns.validator.Validator,
        AlnumValidator = function AlnumValidator (/**...options {Object}**/) {

            // Set defaults and extend with Base validator
            Validator.apply(this, [{
                messageTemplates: {
                    NOT_ALPHA_NUMERIC: function (value) {
                        return 'Value is not alpha-numeric.  Value received: "' + value + '".';
                    }
                }
            }].concat(sjl.argsToArray(arguments)));
        };

    AlnumValidator = Validator.extend(AlnumValidator, {
        isValid: function (value) {
            var self = this,
                retVal = false;

            // Get value
            value = this.value = sjl.isset(value) ? value : self.value;

            // Bail if no value
            if (!sjl.isset(value)) {
                self.addErrorByKey('NOT_ALPHA_NUMERIC');
                return retVal;
            }

            // Test value
            else if (!/^[\da-z]+$/i.test(value)) {
                self.addErrorByKey('NOT_ALPHA_NUMERIC');
            }

            // Else is 'alnum'
            else {
                retVal = true;
            }

            return retVal;
        }

    });

    if (isNodeEnv) {
        module.exports = AlnumValidator;
    }
    else {
        sjl.ns('validator.AlnumValidator', AlnumValidator);
        if (window.__isAmd) {
            return AlnumValidator;
        }
    }

})();
