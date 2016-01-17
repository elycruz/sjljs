/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../../sjl.js') : window.sjl || {},
        contextName = 'sjl.ns.validator.Validator',
        Validator = function Validator(/** ...options {Object} **/) {
            var _messages = {},
                _messagesMaxLength = 100,
                _messageTemplates = {},
                _valueObscured = false,
                _value = null;

            // Define public accessible properties
            Object.defineProperties(this, {
                messages: {
                    get: function () {
                        return _messages;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'messages', value, Array);
                        _messages = value;
                    }
                },
                messagesMaxLength: {
                    get: function () {
                        return _messagesMaxLength;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'messagesMaxLength', value, Number);
                        _messagesMaxLength = value;
                    }
                },
                messageTemplates: {
                    get: function () {
                        return _messageTemplates;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'messageTemplates', value, Object);
                        sjl.extend(true, _messageTemplates, value);
                    }
                },
                value: {
                    get: function () {
                        return _value;
                    },
                    set: function (value) {
                        _value = value;
                    }
                },
                valueObscured: {
                    get: function () {
                        return _valueObscured;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'valueObscured', value, Boolean);
                        _valueObscured = value;
                    }
                },
                _value: {
                    get: () => {
                        return _value;
                    },
                    set: (value) => {
                        _value = value;
                    }
                },
            });

            // Merge options in
            sjl.extend.apply(sjl, [true, this].concat(sjl.argsToArray(arguments)));
        };

    Validator = sjl.ns.stdlib.Extendable.extend(Validator, {

        addErrorByKey: function (key) {
            var self = this,
                messageTemplate = self.messageTemplates,
                messages = self.messages;

            // If key is string
            if (sjl.classOfIs(key, 'String') &&
                sjl.isset(messageTemplate[key])) {
                if (typeof messageTemplate[key] === 'function') {
                    messages.push(messageTemplate[key].apply(self));
                }
                else if (sjl.classOfIs(messageTemplate[key], 'String')) {
                    messages.push(messageTemplate[key]);
                }
            }
            else if (sjl.classOfIs(key, 'function')) {
                messages.push(key.apply(self));
            }
            else {
                messages.push(key);
            }
            return self;
        },

        clearMessages: function () {
            this.messages = [];
            return this;
        },

        validate: function (value) {
            return this.isValid(value);
        },

        isValid: function (value) {
            throw Error('Can not instantiate `Validator` directly, all class named with ' +
                'a prefixed "Base" should not be instantiated.');
        }

    });

    if (isNodeEnv) {
        module.exports = Validator;
    }
    else {
        sjl.ns('validator.Validator', Validator);
        if (window.__isAmd) {
            return Validator;
        }
    }

})();
