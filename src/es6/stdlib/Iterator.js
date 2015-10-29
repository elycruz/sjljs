/**
 * Created by Ely on 4/12/2014.
 */
(function (isNodeEnv) {

    'use strict';

    var sjl = isNodeEnv ? require('../sjl.js') : (window.sjl || {}),
        iteratorKey = Symbol.iterator;

    /**
     * @class sjl.Iterator
     * @extends sjl.Extendable
     * @type {void|Object|*}
     */
    class Iterator {

        constructor(values, pointer) {
            // Internalize the `values` collection and pointer here
            // to make this class more functional.
            this.__internal = {
                values: values || [],
                pointer: sjl.classOfIs(pointer, 'Number') ? pointer : 0
            };
        }

        /**
         * Returns the current value that `pointer()` is pointing to.
         * @method sjl.Iterator#current
         * @returns {{done: boolean, value: *}}
         */
        current() {
            var self = this;
            return self.valid() ? {
                done: false,
                value: self.values()[self.pointer()]
            } : {
                done: true
            };
        }

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.Iterator#next
         * @returns {{done: boolean, value: *}}
         */
        next() {
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
        }

        /**
         * Rewinds the iterator.
         * @method sjl.Iterator#rewind
         * @returns {sjl.Iterator}
         */
        rewind() {
            return this.pointer(0);
        }

        /**
         * Returns whether the iterator has reached it's end.
         * @method sjl.Iterator#valid
         * @returns {boolean}
         */
        valid() {
            return this.pointer() < this.values().length;
        }

        /**
         * Overloaded method for fetching or setting the internal pointer value.
         * @method sjl.Iterator#pointer
         * @param pointer {Number|undefined}
         * @returns {sjl.Iterator|Number}
         */
        pointer(pointer) {
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
        }

        /**
         * Overloaded method for fetching or setting the internal values array.
         * @method sjl.Itertator#values
         * @param values {Array|undefined}
         * @returns {sjl.Iterator|Array}
         */
        values(values) {
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
    }

    if (isNodeEnv) {
        module.exports = Iterator;
    }
    else {
        sjl.package('stdlib.Iterator', Iterator);
    }


})(typeof window === 'undefined');
