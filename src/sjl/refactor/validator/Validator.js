/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../../sjl.js') : window.sjl || {},
        contextName = 'sjl.ns.validator.Validator',
        Validator = function Validator() {
            var _messages = {},
                _messagesMaxLength = 100,
                _messageTemplates = {},
                _valueObscured = false,
                _value = null;

            Object.defineProperties(this, {
                _messages: {
                    get: function () {
                        return _messages;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, '_messages', value, Array);
                        _messages = value;
                    }
                },
                _messagesMaxLength: {
                    get: function () {
                        return _messagesMaxLength;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, '_messagesMaxLength', value, Number);
                        _messagesMaxLength = value;
                    }
                },
                _messageTemplates: {
                    get: function () {
                        return _messageTemplates;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, '_messageTemplates', value, Object);
                        _messageTemplates = value;
                    }
                },
                _valueObscured: {
                    get: function () {
                        return _valueObscured;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, '_valueObscured', value, Boolean);
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
            sjl.extend.apply(sjl, [true, this].concat(sjl.argsToArray(arguments), [true]));
        };

    Validator = sjl.ns.stdlib.Extendable.extend(Validator, {

        messages: function (messages) {
            var isGetterCall = typeof messages === 'undefined',
                retVal;
            if (isGetterCall) {
                retVal = this._messages;
            }
            else {
                this._messages = messages;
                retVal = this;
            }
            return retVal;
        },

        messagesMaxLength: function (messagesMaxLength) {
            var isGetterCall = typeof messagesMaxLength === 'undefined',
                retVal;
            if (isGetterCall) {
                retVal = this._messagesMaxLength;
            }
            else {
                this._messagesMaxLength = messagesMaxLength;
                retVal = this;
            }
            return retVal;
        },

        messageTemplates: function (messageTemplates, merge) {
            var isGetterCall = typeof messageTemplates === 'undefined',
                retVal;
            if (isGetterCall) {
                retVal = this._messageTemplates;
            }
            else {
                this._messageTemplates = messageTemplates;
                retVal = this;
            }
            return retVal;
        },

        value: function (value) {
            var isGetterCall = typeof value === 'undefined',
                retVal = this;
            if (isGetterCall) {
                retVal = retVal._value;
            }
            else {
                retVal._value = value;
                retVal._value = value;
                retVal._messages = [];
            }
            return retVal;
        },

        valueObscured: function (valueObscured) {
            var isGetterCall = typeof valueObscured === 'undefined',
                retVal;
            if (isGetterCall) {
                retVal = this._valueObscured;
            }
            else {
                this._valueObscured = valueObscured;
                retVal = this;
            }
            return retVal;
        },

        addErrorByKey: function (key) {
            var self = this,
                messageTemplate = self._messageTemplates,
                messages = self._messages;

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
            this._messages = [];
            return this;
        },

        validate: function (value) {
            return this.isValid(value);
        },

        isValid: function (value) {
            throw Error('Can not instantiate `Validator` directly, all class named with ' +
                'a prefixed "Base" should not be instantiated.');
        },

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
