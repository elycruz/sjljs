/**
 * Created by Ely on 1/21/2015.
 */
/**
 * Created by Ely on 7/21/2014.
 * Initial idea copied from the Zend Framework 2's Between Validator
 */

'use strict';

(function (context) {

    context.sjl = context.sjl || {};

    context.sjl.AlphaNumValidator = context.sjl.AbstractValidator.extend(function AlphaNumValidator (options) {

        // Set defaults and extend with abstract validator
        context.sjl.AbstractValidator.call(this, {
            messageTemplates: {
                NOT_ALPHA_NUMERIC: function () {
                    return 'The input value is not alpha-numeric.  Value received: "' + this.getMin() + '" and "' + this.getMax() + '".';
                }
            }
        });

        // Set options passed, if any
        this.setOptions(options);

    }, {
        isValid: function (value) {
            var self = this,
                retVal = false;

            value = context.sjl.isset(value) ? value : self.getValue();

            if (!context.sjl.isset(value)) {
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

})(typeof window === 'undefined' ? global : window);
