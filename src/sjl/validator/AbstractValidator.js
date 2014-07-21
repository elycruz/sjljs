/**
 * Created by Ely on 7/21/2014.
 */
(function (context) {

    context.sjl = context.sjl || {};

    context.sjl.AbstractValidator =
        context.sjl.Optionable.extend(function AbstractValidator(options) {
                var self = this;

                // Extend with optionable
                context.sjl.Optionable.apply(self, [self.defaults]);

                // Set passed in options if (any)
                self.setOptions(options);
            },
            {
                defaults: {
                    messages: [],
                    messageTemplates: [],
                    messageVariables: [],
                    messagesMaxLength: 100,
                    valueObscured: false,
                    value: null
                },

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

                },

                isValueObscured: function () {
                    var self = this;
                    return context.sjl.classOfIs(self.valueObscured, 'Boolean')
                        ? self.valueObscured : false;
                }

            });

})(typeof window === 'undefined' ? global : window);
