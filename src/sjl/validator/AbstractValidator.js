/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 */
(function (context) {

    context.sjl = context.sjl || {};
    context.sjl.validator = context.sjl.isset(context.sjl.validator) ? context.sjl.validator : {};

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

                // Merge custome templates in if they are set
                if (context.sjl.isset(options.customMessageTemplates)) {
                    customTemplates = options.customMessageTemplates;
                    options.customeMessageTemplates = null;
                    delete options.customeMessageTemplates;
                    self.setCustomMessageTemplates(customTemplates);
                }

                // Set passed in options if (any)
                self.setOptions(options);

            },
            {
                getMessagesMaxLength: function () {
                    var self = this,
                        maxMessageLen = self.getOption('maxMessagesLength');
                    return context.sjl.classOfIs(maxMessageLen, 'Number') ? maxMessageLen: -1;
                },

                getMessages: function () {
                    var self = this,
                        messages = self.getOption('messages');
                    return context.sjl.classOfIs(messages, 'Array') ? messages : [];
                },

                setMessages: function (messages) {
                    this.options.messages = context.sjl.classOfIs(messages, 'Array') ? messages : [];
                    return this;
                },

                clearMessages: function () {
                    this.options.messages = [];
                },

                isValid: function (value) {
                    throw Error("Can not instantiate `AbstractValidator` directly, all class named with " +
                        "a prefixed \"Abstract\" should not be instantiated.");
                },

                isValueObscured: function () {
                    var self = this,
                        valObscured = self.getOption('valueObscured');
                    return context.sjl.classOfIs(valObscured, 'Boolean') ? valObscured : false;
                },

                setValue: function (value) {
                    this.options.value = value;
                    this.options.messages = [];
                    return this;
                },

                getValue: function (value) {
                    var self = this;
                    return !context.sjl.classOfIs(value, 'Undefined') ? (function () {
                        self.setValue(value);
                        return value;
                    })() : this.getOption('value');
                },

                addErrorByKey: function (key) {
                    var self = this,
                        messageTemplate = self.getOption('messageTemplates'),
                        messages = self.getOption('messages');

                    // If key is string
                    if (context.sjl.classOfIs(key, 'String') &&
                        context.sjl.isset(messageTemplate[key])) {
                        if (typeof messageTemplate[key] === 'function') {
                            messages.push(messageTemplate[key].apply(self));
                        }
                        else if (context.sjl.classOfIs(messageTemplate[key], 'String')) {
                            messages.push(messageTemplate[key]);
                        }
                    }
                    else if (context.sjl.classOfIs(key, 'function')) {
                        messages.push(key.apply(self));
                    }
                    else {
                        messages.push(key);
                    }
                    return self;
                },

                getMessageTemplates: function () {
                    return this.options.messageTemplates;
                },

                setMessageTemplates: function (templates) {
                    if (!sjl.classOfIs(templates, 'Object')) {
                        throw new Error('`AddToBagModel.setMessageTemplates` ' +
                            'expects parameter 1 to be of type "Object".');
                    }
                    this.options.messagesTemplates = templates;
                    return this;
                },

                updateMessageTemplates: function (templates) {
                    var self = this;
                    if (!sjl.classOfIs(templates, 'Object')) {
                        throw new Error('`AddToBagModel.updateMessageTemplates` ' +
                            'expects parameter 1 to be of type "Object".');
                    }
                    self.options.messageTemplates = sjl.extend(self.getMessageTemplates(), templates);
                    return self;
                }

            });

})(typeof window === 'undefined' ? global : window);
