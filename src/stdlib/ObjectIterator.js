/**
 * Created by elydelacruz on 11/2/15.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Iterator = sjl.ns.stdlib.Iterator,
        moduleName = 'ObjectIterator',
        contextName = 'sjl.stdlib.' + moduleName,

    /**
     * @class module:sjl.stdlib.ObjectIterator
     * @extends sjl.stdlib.Iterator
     * @param keysOrObj {Array|Object} - Array of keys or object to create (object) iterator from.
     * @param values {Array|Undefined} - Array of values if first param is an array.
     */
    ObjectIterator = Iterator.extend({

        /**
         * Constructor.
         * @param keysOrObj {Array|Object} - Array of keys or object to create (object) iterator from.
         * @param values {Array|Undefined} - Array of values if first param is an array.
         * @constructor
         * @private
         */
        constructor: function ObjectIterator(keysOrObj, values) {
            var obj,
                classOfParam0 = sjl.classOf(keysOrObj),
                receivedParamTypesList,
                _values,
                _keys;

            // Constructor scenario 1 (if param `0` is of type `Object`)
            if (classOfParam0 === 'Object') {
                obj = keysOrObj;
                _keys = Object.keys(obj);
                _values = _keys.map(function (key) {
                    return obj[key];
                });
            }

            // Constructor scenario 2 (if param `0` is of type `Array`)
            else if (classOfParam0 === 'Array') {
                sjl.throwTypeErrorIfNotOfType(contextName, 'values', values, Array,
                    'With the previous param being an array `values` can only be an array in this scenario.');
                _keys = keysOrObj;
                _values = values;
            }

            // Else failed constructor scenario
            else {
                receivedParamTypesList = [classOfParam0, sjl.classOf(values)];
                throw new TypeError ('#`' + contextName + '` received incorrect parameter values.  The expected ' +
                    'parameter list should be one of two: [Object] or [Array, Array].  ' +
                    'Parameter list received: [' + receivedParamTypesList.join(', ') + '].');
            }

            // Extend #own properties with #Iterator's own properties
            Iterator.call(this, _values);

            // @note Defining member jsdoc blocks here since our members are defined using Object.defineProperties()
            //   and some IDEs don't handle this very well (E.g., WebStorm)

            /**
             * Object iterator keys.  Set on construction.
             * @member {Array<*>} sjl.stdlib.ObjectIterator#keys
             * @readonly
             */

            // Define other own propert(y|ies)
            Object.defineProperty(this, '_keys', { value: _keys });
        },

        /**
         * Returns the current key and value that `pointer` is pointing to as an array [key, value].
         * @method sjl.stdlib.ObjectIterator#current
         * @returns {{ done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        current: function () {
            var self = this,
                pointer = self.pointer;
            return self.valid() ? {
                done: false,
                value: [self._keys[pointer], self._values[pointer]]
            } : {
                done: true
            };
        },

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.stdlib.ObjectIterator#next
         * @returns {{done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        next: function () {
            var self = this,
                pointer = self.pointer,
                retVal = self.valid() ? {
                    done: false,
                    value: [self._keys[pointer], self._values[pointer]]
                } : {
                    done: true
                };
            self.pointer += 1;
            return retVal;
        },

        /**
         * Returns whether iterator has more items to return or not.
         * @method sjl.stdlib.ObjectIterator#valid
         * @returns {boolean}
         */
        valid: function () {
            var pointer = this.pointer;
            return pointer < this._values.length && pointer < this._keys.length;
        },

        /**
         * Iterates through all elements in iterator.  @note Delegates to it's values `forEach` method.
         * @param callback {Function}
         * @param context {Object}
         * @method sjl.stdlib.ObjectIterator#forEach
         * @returns {sjl.stdlib.Iterator}
         */
        forEach: function (callback, context) {
            var self = this,
                values = self._values;
            context = context || self;
            self._keys.forEach(function (key, index, keys) {
                callback.call(context, values[index], key, keys);
            });
            return this;
        }

    });

    if (isNodeEnv) {
        module.exports = ObjectIterator;
    }
    else {
        sjl.ns('stdlib.' + moduleName, ObjectIterator);
        if (sjl.isAmd) {
            return ObjectIterator;
        }
    }

}());
