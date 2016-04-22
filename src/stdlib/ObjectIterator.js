/**
 * Created by elydelacruz on 11/2/15.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Iterator = sjl.stdlib.Iterator,
        contextName = 'sjl.stdlib.ObjectIterator',

        /**
         * Constructor for ObjectIterator.
         * @param keysOrObj {Array|Object}
         * @param valuesOrPointer {Array|Number} - Array of values if first param is an array of keys.  Else the
         *  value would be used as the iterator's pointer in which case it would be optional.
         * @param pointer {Number} - Optional.
         */
        ObjectIterator = function ObjectIterator(keysOrObj, valuesOrPointer, pointer) {
            var obj, values,
                classOfParam1 = sjl.classOf(keysOrObj),
                receivedParamTypesList,
                _keys;

            // If called with obj as first param
            if (classOfParam1 === 'Object') {
                obj = keysOrObj;
                _keys = Object.keys(obj);
                pointer = valuesOrPointer;
                values = _keys.map(function (key) {
                    return obj[key];
                });
            }
            else if (classOfParam1 === 'Array') {
                _keys = keysOrObj;
                sjl.throwTypeErrorIfNotOfType(contextName, 'valuesOrPointer', valuesOrPointer, Array,
                    'With the previous param being an array `valuesOrPointer` can only be an array in this scenario.');
                values = valuesOrPointer;
                pointer = pointer || 0;
            }
            else {
                receivedParamTypesList = [sjl.classOf(keysOrObj), sjl.classOf(valuesOrPointer), sjl.classOf(pointer)];
                throw new TypeError ('#`' + contextName + '` recieved incorrect parameter values.  The expected ' +
                    'parameter list should one of two: [Object, Number] or [Array, Array, Number].  ' +
                    'Parameter list recieved: [' + receivedParamTypesList.join(', ') + '].');
            }

            // Extend #own properties with #Iterator's own properties
            Iterator.call(this, values, pointer);

            // Define other own properties
            Object.defineProperties(this, {
                _keys: {
                    get: function () {
                        return _keys;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType('ObjectIterator.keys', 'keys', value, Array);
                        _keys = value;
                    }
                }
            });
        };

    /**
     * @class sjl.stdlib.ObjectIterator
     * @extends sjl.stdlib.Iterator
     * @name ObjectIterator
     * @param keysOrObj {Array|Object} - Array of keys or object to create (object) iterator from.
     * @param valuesOrPointer {Array|Number} - Array of values if first param is an array of keys.  Else pointer.
     * @param pointer {Number} - Optional.
     * @type {sjl.stdlib.ObjectIterator}
     */
    ObjectIterator = Iterator.extend(ObjectIterator, {
        /**
         * Returns the current key and value that `pointer()` is pointing to as an array [key, value].
         * @method sjl.stdlib.Iterator#current
         * @returns {{ done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        current: function () {
            var self = this,
                pointer = self.pointer();
            return self.valid() ? {
                done: false,
                value: [self._keys[pointer], self.values[pointer]]
            } : {
                done: true
            };
        },

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.stdlib.Iterator#next
         * @returns {{done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        next: function () {
            var self = this,
                pointer = self.pointer(),
                retVal = self.valid() ? {
                    done: false,
                    value: [self._keys[pointer], self._values[pointer]]
                } : {
                    done: true
                };
            self.pointer(pointer + 1);
            return retVal;
        },

        valid: function () {
            var pointer = this._pointer;
            return pointer < this._values.length && pointer < this._keys.length;
        },

        /**
         * Overloaded getter/setter method for internal `keys` property.
         * @returns {sjl.stdlib.ObjectIterator|Array<*>}
         */
        keys: function (keys) {
            var retVal = this;
            if (typeof keys === _undefined) {
                retVal = this._keys;
            }
            else {
                // Type validated by property definition `this._keys`
                this._keys = keys;
            }
            return retVal;
        },

        /**
         * Iterates through all elements in iterator.  @note Delegates to it's values `forEach` method.
         * @param callback {Function}
         * @param context {Object}
         * @returns {sjl.stdlib.Iterator}
         */
        forEach: function (callback, context) {
            var self = this,
                values = self._values;
            context = context || self;
            self._keys.forEach(function (key, index, keys) {
                callback.call(context, values[index], key, self);
            });
            return this;
        }

    });

    if (isNodeEnv) {
        module.exports = ObjectIterator;
    }
    else {
        sjl.ns('stdlib.ObjectIterator', ObjectIterator);
        sjl.defineEnumProp(sjl, 'ObjectIterator', ObjectIterator);
        if (window.__isAmd) {
            return ObjectIterator;
        }
    }


}());
