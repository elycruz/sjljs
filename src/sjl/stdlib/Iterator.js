/**
 * Created by Ely on 4/12/2014.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Iterator = function Iterator(values, pointer) {
            // Allow Iterator to be called as a function
            if (!(this instanceof Iterator)) {
                return new Iterator(values, pointer);
            }

            // Internalize the `values` collection and pointer here
            // to make this class more functional.
            this.__internal = {
                values: values || [],
                pointer: sjl.classOfIs(pointer, 'Number') ? pointer : 0
            };
        };

    /**
     * @class sjl.package.stdlib.Iterator
     * @extends sjl.package.stdlib.Extendable
     * @type {void|Object|*}
     */
    Iterator = sjl.package.stdlib.Extendable.extend(Iterator, {
        /**
         * Returns the current value that `pointer()` is pointing to.
         * @method sjl.package.stdlib.Iterator#current
         * @returns {{done: boolean, value: *}}
         */
        current: function () {
            var self = this;
            return self.valid() ? {
                done: false,
                value: self.values()[self.pointer()]
            } : {
                done: true
            };
        },

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.package.stdlib.Iterator#next
         * @returns {{done: boolean, value: *}}
         */
        next: function () {
            var self = this,
                pointer = self.pointer(),
                retVal = self.valid() ? {
                    done: false,
                    value: self.values()[pointer]
                } : {
                    done: true
                };
            self.pointer(pointer + 1);
            return retVal;
        },

        /**
         * Rewinds the iterator.
         * @method sjl.package.stdlib.Iterator#rewind
         * @returns {sjl.package.stdlib.Iterator}
         */
        rewind: function () {
            return this.pointer(0);
        },

        /**
         * Returns whether the iterator has reached it's end.
         * @method sjl.package.stdlib.Iterator#valid
         * @returns {boolean}
         */
        valid: function () {
            return this.pointer() < this.values().length;
        },

        /**
         * Overloaded method for fetching or setting the internal pointer value.
         * @method sjl.package.stdlib.Iterator#pointer
         * @param pointer {Number|undefined}
         * @returns {sjl.package.stdlib.Iterator|Number}
         */
        pointer: function (pointer) {
            var self = this,
                isGetterCall = typeof pointer === 'undefined',
                defaultNum = sjl.classOfIs(self.__internal.pointer, 'Number')
                    ? self.__internal.pointer : 0,
                retVal = self;
            if (isGetterCall) {
                retVal = defaultNum;
            }
            // Else set pointer
            else {
                self.__internal.pointer = sjl.classOfIs(pointer, 'Number') ? pointer : defaultNum;
            }
            return retVal;
        },

        /**
         * Overloaded method for fetching or setting the internal values array.
         * @method sjl.Itertator#values
         * @param values {Array|undefined}
         * @returns {sjl.package.stdlib.Iterator|Array}
         */
        values: function (values) {
            var isGetterCall = typeof values === 'undefined',
                retVal = this,
                selfCollectionIsArray;
            if (isGetterCall) {
                retVal = this.__internal.values;
            }
            else {
                selfCollectionIsArray = sjl.classOfIs(this.__internal.values, 'Array');
                // Set the internal values collection to `values` if `values` is an array
                // else if self internal values is an array leave as is
                // else set internal values to an empty array
                this.__internal.values =
                    sjl.classOfIs(values, 'Array') ? values :
                        (selfCollectionIsArray ? this.__internal.values : []);
            }
            return retVal;
        }
    });

    if (isNodeEnv) {
        module.exports = Iterator;
    }
    else {
        sjl.package('stdlib.Iterator', Iterator);
    }

}());
