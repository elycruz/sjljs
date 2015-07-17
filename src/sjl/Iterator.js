/**
 * Created by Ely on 4/12/2014.
 */
(function (context) {

    'use strict';

    var sjl = context.sjl;

    /**
     * Turns an array into an iterable.
     * @param array
     * @param pointer
     * @returns {*}
     * @deprecated
     */
    sjl.iterable = function (array, pointer) {
        array['@@iterator'] = function () {
            return sjl.Iterator(array, pointer);
        };
        return array;
    };

    /**
     * @class sjl.Iterator
     * @extends sjl.Extendable
     * @type {void|Object|*}
     * @deprecated
     */
    sjl.Iterator = sjl.Extendable.extend(
        function Iterator(values, pointer) {

            //
            if (!(this instanceof sjl.Iterator)) {
                return new sjl.Iterator(values, pointer);
            }

            // Internalize the collection and pointer here
            // to make this class more functional.
            this.internal = {
                collection: values || [],
                pointer: sjl.classOfIs(pointer, 'Number') ? pointer : 0
            };
        },
        {
            /**
             * Returns the current value that `pointer()` is pointing to.
             * @method sjl.Iterator#current
             * @returns {{done: boolean, value: *}}
             */
            current: function () {
                var self = this;
                return self.valid() ? {
                    done: false,
                    value: self.collection()[self.pointer()]
                } : {
                    done: true
                };
            },

            /**
             * Method which returns the current position in the iterator based on where the pointer is.
             * This method also increases the pointer after it is done fetching the value to return.
             * @method sjl.Iterator#next
             * @returns {{done: boolean, value: *}}
             */
            next: function () {
                var self = this,
                    pointer = self.pointer(),
                    retVal = self.valid() ? {
                        done: false,
                        value: self.collection()[pointer]
                    } : {
                        done: true
                    };
                self.pointer(pointer + 1);
                return retVal;
            },

            /**
             * Rewinds the iterator.
             * @method sjl.Iterator#rewind
             * @returns {sjl.Iterator}
             */
            rewind: function () {
                return this.pointer(0);
            },

            /**
             * Returns whether the iterator has reached it's end.
             * @method sjl.Iterator#valid
             * @returns {boolean}
             */
            valid: function () {
                return this.pointer() < this.collection().length;
            },

            /**
             * Overloaded method for fetching or setting the internal pointer value.
             * @method sjl.Iterator#pointer
             * @param pointer
             * @returns {sjl.Iterator|Number}
             */
            pointer: function (pointer) {
                var self = this,
                    isGetterCall = typeof pointer === 'undefined',
                    defaultNum = sjl.classOfIs(self.internal.pointer, 'Number')
                            ? self.internal.pointer : 0,
                    retVal = self;
                if (isGetterCall) {
                    retVal = defaultNum;
                }
                // Else set pointer
                else {
                    self.internal.pointer = sjl.classOfIs(pointer, 'Number') ? pointer : defaultNum;
                }
                return retVal;
            },

            /**
             * Overloaded method for fetching or setting the internal collection array.
             * @method sjl.Itertator#collection
             * @param collection {Array|undefined}
             * @returns {sjl.Iterator|Array}
             */
            collection: function (collection) {
                var isGetterCall = typeof collection === 'undefined',
                    retVal = this,
                    selfCollectionIsArray;
                if (isGetterCall) {
                    retVal = this.internal.collection;
                }
                else {
                    selfCollectionIsArray = sjl.classOfIs(this.internal.collection, 'Array');
                    // Set the internal collection to `collection` if `collection` is an array
                    // else if self internal collection is an array leave as is
                    // else set internal collection to an empty array
                    this.internal.collection =
                        sjl.classOfIs(collection, 'Array') ? collection :
                            (selfCollectionIsArray ? this.internal.collection : []);
                }
                return retVal;
            },

            /**
             * @method sjl.Iterator#getPointer
             * @deprecated Use self.pointer() instead
             * @returns {Number}
             */
            getPointer: function () {
                return this.pointer();
            },

            /**
             * @method sjl.Iterator#getCollection
             * @deprecated Use self.collection() instead
             * @returns {Array}
             */
            getCollection: function () {
                return this.collection();
            }

        });

})(typeof window === 'undefined' ? global : window);
