/**
 * Created by Ely on 7/21/2014.
 */
(function (context) {

    context.sjl = context.sjl || {};

    context.sjl.validator.RegexValidator = context.sjl.validator.AbstractValidator.extend(
        function RegexValidator(options) {

            // Set defaults and extend with abstract validator
            context.sjl.validator.AbstractValidator.call(this, {
                pattern: /./,
                messageTemplates: {
                    DOES_NOT_MATCH_PATTERN: function () {
                        return 'The value passed in does not match pattern"'
                            + this.getPattern() + '".  Value passed in: "'
                            + this.getValue() + '".';
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
                retVal = self.getPattern().test(value);

                // Clear messages before checking validity
                if (self.getMessages().length > 0) {
                    self.clearMessages();
                }

                // If test failed
                if (retVal === false) {
                    self.addErrorByKey('DOES_NOT_MATCH_PATTERN');
                }

                return retVal;
            },

            getPattern: function () {
                return this.options.pattern;
            },

            setPattern: function (pattern) {
                if (context.sjl.classOfIs(pattern, 'RegExp')) {
                    this.clearMessages();
                    return this.options.pattern = pattern;
                }
                throw new Error('RegexValidator.setPattern expects `pattern` ' +
                    'to be of type "RegExp".  Type and value recieved: type: "' +
                    context.sjl.classOf(pattern) + '"; value: "' + pattern + '"');
            }

        });

})(typeof window === 'undefined' ? global : window);
