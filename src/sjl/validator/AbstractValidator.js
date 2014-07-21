/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 */
(function (context) {

    context.sjl = context.sjl || {};

    context.sjl.AbstractValidator =

        context.sjl.Optionable.extend(function AbstractValidator(options) {
                var self = this;

                // Extend with optionable and set preliminary defaults
                context.sjl.Optionable.call(self, {
                    messages: [],
                    messageTemplates: {},
                    messageVariables: {},
                    messagesMaxLength: 100,
                    valueObscured: false,
                    value: null
                });

                // Set passed in options if (any)
                self.setOptions(options);
            },
            {
                getMessagesMaxLength: function () {
                    var self = this;
                    return context.sjl.classOfIs(self.maxMessagesLength, 'Number')
                        ? self.maxMessagesLength : -1;
                },

                getMessages: function () {
                    var self = this;
                    return context.sjl.classOfIs(self.messages, 'Array')
                        ? self.messages : [];
                },

                isValid: function (value) {
                    throw Error("Can not instantiate `AbstractValidator` directly, all class named with " +
                        "a prefixed \"Abstract\" should not be instantiated.");
                },

                isValueObscured: function () {
                    var self = this;
                    return context.sjl.classOfIs(self.valueObscured, 'Boolean')
                        ? self.valueObscured : false;
                },

                setValue: function (value) {
                    this.options.value = value;
                    this.options.messages = [];
                    return this;
                },

                getValue: function () {
                    return this.getOption('value');
                }

            });

})(typeof window === 'undefined' ? global : window);
