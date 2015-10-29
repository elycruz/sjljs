/**
 * Created by elydelacruz on 10/28/15.
 */

(function (isNodeEnv) {

    var sjl,
        Iterator,
        ObjectIterator;

    if (isNodeEnv) {
        sjl = require('../sjl.js');
    }
    else {
        sjl = window.sjl || {};
    }

    Iterator = sjl.package.Iterator;
    ObjectIterator = sjl.package.ObjectIterator;

    /**
     * @class sjl.ObjectIterator
     * @extends sjl.Iterator
     * @type {Object|void|*}
     */
    class ObjectIterator extends Iterator {
        constructor(keys, values, pointer) {
            super(this, values, pointer);
            this.__internal.keys = keys;
        }

        /**
         * Returns the current key and value that `pointer()` is pointing to as an array [key, value].
         * @method sjl.Iterator#current
         * @returns {{ done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        current() {
            var self = this,
                pointer = self.pointer();
            return self.valid() ? {
                done: false,
                value: [self.keys()[pointer], self.values()[pointer]]
            } : {
                done: true
            };
        }

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.Iterator#next
         * @returns {{done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        next() {
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
        }

        valid() {
            var pointer = this.pointer();
            return pointer < this.values().length && pointer < this.keys().length;
        }

        /**
         * Overloaded getter/setter method for internal `keys` property.
         * @returns {sjl.ObjectIterator|Array<*>}
         */
        keys(keys) {
            var isGetterCall = typeof keys === 'undefined',
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
    }

}(typeof window === 'undefined'));