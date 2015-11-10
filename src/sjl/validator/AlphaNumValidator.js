/**
 * Created by Ely on 1/21/2015.
 */
/**
 * Created by Ely on 7/21/2014.
 * Initial idea copied from the Zend Framework 2's Between Validator
 */

'use strict';

(function () {

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        BaseValidator = sjl.package.validator.BaseValidator,
        AlphaNumValidator = function AlphaNumValidator (options) {

            // Set defaults and extend with Base validator
            BaseValidator.call(this, {
                messageTemplates: {
                    NOT_ALPHA_NUMERIC: function () {
                        return 'The input value is not alpha-numeric.  Value received: "' + this.getMin() + '" and "' + this.getMax() + '".';
                    }
                }
            });

            // Set options passed, if any
            this.setOptions(options);

        };

    AlphaNumValidator = BaseValidator.extend(AlphaNumValidator, {
        isValid: function (value) {
            var self = this,
                retVal = false;

            value = sjl.isset(value) ? value : self.getValue();

            if (!sjl.isset(value)) {
                self.addErrorByKey('NOT_ALPHA_NUMERIC');
                return retVal;
            }
            else if (!/^[\da-z]+$/i.test(value)) {
                self.addErrorByKey('NOT_ALPHA_NUMERIC');
            }
            else {
                retVal = true;
            }

            return retVal;
        }

    });

    if (isNodeEnv) {
        module.exports = AlphaNumValidator;
    }
    else {
        sjl.package('validator.AlphaNumValidator', AlphaNumValidator);
        if (window.__isAmd) {
            return AlphaNumValidator;
        }

    }

})();
