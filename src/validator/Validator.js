/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        contextName = 'sjl.validator.Validator',
        Validator = function Validator(/** ...options {Object} **/) {
            var _messages = [],
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
                    },
                    enumerable: true
                },
                messagesMaxLength: {
                    get: function () {
                        return _messagesMaxLength;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'messagesMaxLength', value, Number);
                        _messagesMaxLength = value;
                    },
                    enumerable: true
                },
                messageTemplates: {
                    get: function () {
                        return _messageTemplates;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'messageTemplates', value, Object);
                        sjl.extend(true, _messageTemplates, value);
                    },
                    enumerable: true
                },
                value: {
                    get: function () {
                        return _value;
                    },
                    set: function (value) {
                        _value = value;
                    },
                    enumerable: true
                },
                valueObscured: {
                    get: function () {
                        return _valueObscured;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'valueObscured', value, Boolean);
                        _valueObscured = value;
                    },
                    enumerable: true
                }
            });

            // Merge options in
            sjl.extend.apply(sjl, [true, this].concat(sjl.argsToArray(arguments)));
        };

    Validator = sjl.stdlib.Extendable.extend(Validator, {

        /**
         * @todo change this method name to `addErrorByKeyOrCallback` or just add `addErrorByCallback` method
         * @param key {String|Function} - Key for add error by or callback to generate error string from.
         * @param value {*|undefined} - Value to pass into the error callback.
         * @method sjl.validator.Validator#addErrorByKey
         * @returns {Validator}
         */
        addErrorByKey: function (key, value) {
            value = typeof value !== 'undefined' ? value : this.value;
            var self = this,
                messageTemplate = self.messageTemplates,
                messages = self.messages;

            // If key is string
            if (sjl.classOfIs(key, 'String') &&
                sjl.isset(messageTemplate[key])) {
                if (typeof messageTemplate[key] === 'function') {
                    messages.push(messageTemplate[key].call(self, value, self)); // @todo should change this to just call values as functions directly
                }
                else if (sjl.classOfIs(messageTemplate[key], 'String')) {
                    messages.push(messageTemplate[key]);
                }
            }
            else if (sjl.classOfIs(key, 'Function')) {
                messages.push(key.call(self, value, self));
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
