/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 */

'use strict';

(function (isNodeEnv) {

    class AbstractValidator extends Optionable {
        constructor(options) {
            var self = this,
                customTemplates;

            // Extend with optionable and set preliminary defaults
            super({
                messages: [],
                messageTemplates: {},
                messageVariables: {},
                messagesMaxLength: 100,
                valueObscured: false,
                value: null
            });

            // Merge custom templates in if they are set
            if (context.sjl.isset(options.customMessageTemplates)) {
                customTemplates = options.customMessageTemplates;
                options.customeMessageTemplates = null;
                delete options.customeMessageTemplates;
                self.setCustomMessageTemplates(customTemplates);
            }

            // Set passed in options if (any)
            self.setOptions(options);

        }

        getMessagesMaxLength() {
            var self = this,
                maxMessageLen = self.getOption('maxMessagesLength');
            return context.sjl.classOfIs(maxMessageLen, 'Number') ? maxMessageLen : -1;
        }

        getMessages() {
            var self = this,
                messages = self.getOption('messages');
            return context.sjl.classOfIs(messages, 'Array') ? messages : [];
        }

        setMessages(messages) {
            this.options.messages = context.sjl.classOfIs(messages, 'Array') ? messages : [];
            return this;
        }

        clearMessages() {
            this.options.messages = [];
        }

        isValid(value) {
            throw Error('Can not instantiate `AbstractValidator` directly, all class named with ' +
                'a prefixed "Abstract" should not be instantiated.');
        }

        isValueObscured() {
            var self = this,
                valObscured = self.getOption('valueObscured');
            return context.sjl.classOfIs(valObscured, 'Boolean') ? valObscured : false;
        }

        setValue(value) {
            this.options.value = value;
            this.options.messages = [];
            return this;
        }

        getValue(value) {
            var self = this;
            return !context.sjl.classOfIs(value, 'Undefined') ? (function () {
                self.setValue(value);
                return value;
            })() : this.getOption('value');
        }

        value(value) {
            var classOfValue = sjl.classOf(value),
                retVal = this.get('value');
            if (classOfValue !== 'Undefined') {
                this.options.value = value;
                retVal = this;
            }
            return retVal;
        }

        addErrorByKey(key) {
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
        }

        getMessageTemplates() {
            return this.options.messageTemplates;
        }

        setMessageTemplates(templates) {
            if (!sjl.classOfIs(templates, 'Object')) {
                throw new Error('`AddToBagModel.setMessageTemplates` ' +
                    'expects parameter 1 to be of type "Object".');
            }
            this.options.messagesTemplates = templates;
            return this;
        }

        updateMessageTemplates(templates) {
            var self = this;
            if (!sjl.classOfIs(templates, 'Object')) {
                throw new Error('`AddToBagModel.updateMessageTemplates` ' +
                    'expects parameter 1 to be of type "Object".');
            }
            self.options.messageTemplates = sjl.extend(true, self.getMessageTemplates(), templates);
            return self;
        }

    }

})(typeof window === 'undefined');
