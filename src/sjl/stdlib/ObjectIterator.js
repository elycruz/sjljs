/**
 * Created by elydelacruz on 11/2/15.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Iterator = sjl.package.stdlib.Iterator,
        ObjectIterator = function ObjectIterator(keys, values, pointer) {
            // Allow Iterator to be called as a function
            if (!(this instanceof ObjectIterator)) {
                return new ObjectIterator(keys, values, pointer);
            }
            Iterator.call(this, values, pointer);
            this.__internal.keys = keys;
        };

    /**
     * @class sjl.package.stdlib.ObjectIterator
     * @extends sjl.package.stdlib.Iterator
     * @type {Object|void|*}
     */
    ObjectIterator = Iterator.extend(ObjectIterator, {
        /**
         * Returns the current key and value that `pointer()` is pointing to as an array [key, value].
         * @method sjl.package.stdlib.Iterator#current
         * @returns {{ done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        current: function () {
            var self = this,
                pointer = self.pointer();
            return self.valid() ? {
                done: false,
                value: [self.keys()[pointer], self.values()[pointer]]
            } : {
                done: true
            };
        },

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.package.stdlib.Iterator#next
         * @returns {{done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        next: function () {
            var self = this,
                pointer = self.pointer(),
                retVal = self.valid() ? {
                    done: false,
                    value: [self.keys()[pointer], self.values()[pointer]]
                } : {
                    done: true
                };
            self.pointer(pointer + 1);
            return retVal;
        },

        valid: function () {
            var pointer = this.pointer();
            return pointer < this.values().length && pointer < this.keys().length;
        },

        /**
         * Overloaded getter/setter method for internal `keys` property.
         * @returns {sjl.package.stdlib.ObjectIterator|Array<*>}
         */
        keys: function (keys) {
            var isGetterCall = typeof keys === _undefined,
                retVal = this,
                selfCollectionIsArray;
            if (isGetterCall) {
                retVal = this.__internal.keys;
            }
            else {
                selfCollectionIsArray = sjl.classOfIs(this.__internal.keys, 'Array');
                // Set the internal keys collection to `keys` if `keys` is an array
                // else if self internal keys is an array leave as is
                // else set internal keys to an empty array
                this.__internal.keys =
                    sjl.classOfIs(keys, 'Array') ? keys :
                        (selfCollectionIsArray ? this.__internal.keys : []);
            }
            return retVal;
        }

    });

    if (isNodeEnv) {
        module.exports = ObjectIterator;
    }
    else {
        sjl.package('stdlib.ObjectIterator', ObjectIterator);
        if (window.__isAmd) {
            return ObjectIterator;
        }
    }

}());