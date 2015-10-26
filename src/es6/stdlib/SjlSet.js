/**
 * Created by Ely on 7/17/2015.
 */
(function (isNodeEnv) {

    'use strict';

    var sjl = isNodeEnv ? require('sjljs') : (window.sjl || {});

    /**
     * SjlSet constructor.  This object has the same interface as the es6 `Set`
     * object.  The only difference is this one uses a more sugery iterator which
     * has, in addition to the `next` method, `current`, `iterator`, `pointer`, `rewind`, and
     * `valid` methods (@see sjl.Iterator)
     * @class sjl.SjlSet
     * @extends sjl.Extendable
     * @param iterable {Array}
     */
    class SjlSet {

        constructor(iterable) {
            var self = this;
            self._values = [];
            self.size = 0;

            // If an array was passed in inject values
            if (sjl.classOfIs(iterable, 'Array')) {
                self.addFromArray(iterable);
            }

            // If anything other than an array is passed in throw an Error
            else if (typeof iterable !== 'undefined') {
                throw new Error('Type Error: sjl.SjlSet takes only iterable objects as it\'s first parameter. ' +
                    ' Parameter received: ', iterable);
            }

            // Make our `_values` array inherit our special iterator
            sjl.iterable(self._values, 0);

            // Set custom iterator function on `this`
            self[Symbol.iterator] = function () {
                return sjl.ObjectIterator(self._values, self._values, 0);
            };

            // Set flag to remember that original iterator was overridden
            self._iteratorOverridden = true;
        }

        add(value) {
            if (!this.has(value)) {
                this._values.push(value);
                this.size += 1;
            }
            return this;
        }

        clear() {
            while (this._values.length > 0) {
                this._values.pop();
            }
            this.size = 0;
            return this;
        }

        delete(value) {
            var _index = sjl.indexOf(value, this._values);
            if (_index > -1) {
                delete this._values[_index];
                this.size -= 1;
                this.size = this.size < 0 ? 1 : 0;
            }
            return this;
        }

        entries() {
            return sjl.ObjectIterator(this._values, this._values, 0);
        }

        forEach(callback, context) {
            sjl.forEach(this._values, callback, context);
            return this;
        }

        has(value) {
            return sjl.indexOf(this._values, value) > -1 ? true : false;
        }

        keys() {
            return this._values[Symbol.iterator]();
        }

        values() {
            return this._values[Symbol.iterator]();
        }

        /**************************************************
         * METHODS NOT PART OF THE `Set` spec for ES6:
         **************************************************/

        addFromArray(value) {
            // Iterate through the passed in iterable and add all values to `_values`
            var iterator = sjl.iterable(value, 0)[Symbol.iterator]();

            // Loop through values and add them
            while (iterator.valid()) {
                this.add(iterator.next().value);
            }
            iterator = null;
            return this;
        }

        iterator() {
            return this._values[Symbol.iterator]();
        }

        toJSON() {
            return this._values;
        }
    }

    if (isNodeEnv) {
        modules.export = SjlSet;
    }
    else {
        sjl.package('stdlib.SjlSet', SjlSet);
    }

})(typeof window === 'undefined');
