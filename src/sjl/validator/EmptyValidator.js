/**
 * Created by Ely on 7/21/2014.
 */

'use strict';

(function (context) {

    context.sjl = context.sjl || {};

    context.sjl.EmptyValidator = context.sjl.AbstractValidator.extend(
        function EmptyValidator(options) {

            // Set defaults and extend with abstract validator
            context.sjl.AbstractValidator.call(this, {
                messageTemplates: {
                    EMPTY_NOT_ALLOWED: function () {
                        return 'Empty values are not allowed.';
                    }
                }
            });

            // Set options passed, if any
            this.setOptions(options);

        }, {

            isValid: function (value) {
                var self = this,
                    retVal = false;

                // Clear any existing messages
                self.clearMessages();

                // Set and get or get value (gets the set value if value is undefined
                value = self.getValue(value);

                // Run the test
                retVal = !context.sjl.empty(value);

                // If test failed
                if (retVal === false) {
                    self.addErrorByKey('EMPTY_NOT_ALLOWED');
                }

                return retVal;
            }

        });

})(typeof window === 'undefined' ? global : window);
