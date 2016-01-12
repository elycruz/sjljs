/**
 * Created by elyde on 1/11/2016.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Extendable = sjl.ns.stdlib.Extendable,
        SjlMap = sjl.ns.stdlib.SjlMap,
        priorityItemSerial = 0,
        PriorityListItem = function PriorityListItem (key, value, priority) {
            var _priority;
            Object.defineProperties(this, {
                key: {
                    value: key
                },
                serial: {
                    value: priorityItemSerial++
                },
                value: {
                    value: value
                },
                priority: {
                    get: function () {
                        return _priority;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityListItem.name, 'priority', value, Number);
                        _priority = priority;
                    }
                }
            });
            this.priority = priority;
        },
        PriorityList = function PriorityList (objOrArray, LIFO) {
            LIFO = sjl.classOfIs(LIFO, Boolean) ? LIFO : false;
            var _sorted = false,
                _internalPriorities = 0,
                classOfIterable = sjl.classOf(objOrArray);
            Object.defineProperties(this, {
                originallyPassedInIterableType: {
                    value: classOfIterable
                },
                _internalPriorities: {
                    get: function () {
                        return _internalPriorities;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityList.name, '_internalPriorities', value, Number);
                        _internalPriorities = value;
                    }
                },
                itemsMap: {
                    value: new SjlMap()
                },
                LIFO: {
                    value: LIFO ? 1 : -1
                },
                sorted: {
                    get: function () {
                        return _sorted;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityList.name, 'sorted', value, Boolean);
                        _sorted = value;
                    }
                },
                size: {
                    get: function () {
                        return this.itemsMap.size;
                    }
                }
            });
            if (classOfIterable === 'Object') {
                this.addFromObject(objOrArray);
            }
            else if (classOfIterable === 'Array') {
                this.addFromArray(objOrArray);
            }
        };

    PriorityListItem = Extendable.extend(PriorityListItem);

    PriorityList = Extendable.extend(PriorityList, {
        // Own Api functions
        // -------------------------------------------
        sort: function () {
            var retVal = this,
                sortedValues,
                sortedKeys;
            if (this.sorted) {
                return retVal;
            }
            sortedValues = [].concat(this.itemsMap._values).sort(function (a, b) {
                return (a.priority === b.priority) ? (a.serial > b.serial ? -1 : 1) * retVal.LIFO
                    : (a.priority > a.priority ? -1 : 1);
            }, this);
            sortedKeys = sortedValues.map(function (item) {
                return item.key;
            });
            this.itemsMap._keys = sortedKeys;
            this.itemsMap._values = sortedValues.map(function (item) {
                return item.value;
            });
            this.sorted = true;
            return this.pointer(0);
        },

        normalizePriority: function (priority) {
            var retVal;
            if (sjl.classOfIs(priority, Number)) {
                retVal = priority;
            } else {
                this._internalPriorities += 1;
                retVal = +this._internalPriorities;
            };
            return retVal;
        },

        isLIFO: function () {
            return this.LIFO === 1;
        },

        // Iterator functions
        // -------------------------------------------
        /**
         * Returns the current key and value that `pointer()` is pointing to as an array [key, value].
         * @method sjl.ns.stdlib.SjlMap#current
         * @returns {{ done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        current: function () {
            var current = this.itemsMap.current();
            return !current.done ? current.value.value : current;
        },

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.ns.stdlib.SjlMap#next
         * @returns {{done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        next: function () {
            var next = this.itemsMap.next();
            return !next.done ? next.value.value : next;
        },

        /**
         * Returns whether the pointer hasn't reached the end of the list or not
         * @returns {boolean}
         */
        valid: function () {
            return this.itemsMap.valid();
        },

        /**
         * Rewinds the iterator.
         * @method sjl.ns.stdlib.SjlMap#rewind
         * @returns {sjl.ns.stdlib.SjlMap}
         */
        rewind: function () {
            this.itemsMap.rewind();
            return this;
        },

        /**
         * Overloaded getter and setter for internal maps `_pointer` property.
         * @param pointer {Number|undefined} - If undefined then method is a getter call else it is a setter call.
         * @returns {sjl.ns.stdlib.PriorityList}
         * @throws {TypeError} - If `pointer` is set and is not of type `Number`.
         */
        pointer: function (pointer) {
            var retVal = this;
            // If is a getter call get the value
            if (typeof pointer === _undefined) {
                retVal = this.itemsMap._pointer;
            }
            // If is a setter call
            else {
                // Set and validate pointer (validated via `_pointer` getter property definition)
                this.itemsMap._pointer = pointer;
            }
            return retVal;
        },

        // Map functions
        // -------------------------------------------
        clear: function () {
            this.pointer(0).itemsMap.clear();
            this.sorted = false;
            return this;
        },
        entries: function () {
            this.sort();
            var keys = this.itemsMap._keys.concat([]),
                values = this.itemsMap._values.concat([]);
            return new sjl.ns.stdlib.ObjectIterator(keys, values);
        },
        forEach: function (callback, context) {
            return this.sort().itemsMap.forEach(callback, context);
        },
        has: function (key) {
            return this.itemsMap.has(key);
        },
        keys: function () {
            return this.sort().itemsMap.keys();
        },
        values: function () {
            var out = [];
            this.sort().itemsMap.forEach(function (key, value) {
                out.push(value);
            });
            return new sjl.ns.stdlib.Iterator(out);
        },
        get: function (key) {
            var item = this.itemsMap.get(key);
            return sjl.classOfIs(item, PriorityListItem) ? item.value : item;
        },
        set: function (key, value, priority) {
            this.sorted = false;
            this.itemsMap.set(key, new PriorityListItem(key, value, this.normalizePriority(priority)));
            return this;
        },
        delete: function (key) {
            this.itemsMap.delete(key);
            return this;
        },

        // Non api specific functions
        // -------------------------------------------

        /**
         * Adds key-value array pairs in an array to this instance.
         * @method sjl.ns.stdlib.SjlMap#addFromArray
         * @param array {Array<Array<*, *>>} - Array of key-value array entries to parse.
         * @returns {SjlMap}
         */
        addFromArray: function (array) {
            // Iterate through the passed in iterable and add all values to `_values`
            var iterator = sjl.iterable(array, 0)[sjl.Symbol.iterator](),
                entry;

            // Loop through values and add them
            while (iterator.valid()) {
                entry = iterator.next();
                this.set(entry.value[0], entry.value[1]);
            }
            iterator = null;
            entry = null;
            return this;
        },

        /**
         * Add all the `object`'s instance's own property key-value pairs to this instance.
         * @method sjl.ns.stdlib.SjlMap#addFromObject
         * @param object {Object} - Object to operate on.
         * @returns {SjlMap}
         */
        addFromObject: function (object) {
            sjl.throwTypeErrorIfNotOfType(SjlMap.name, 'object', object, 'Object',
                'Only `Object` types allowed.');
            var self = this,
                entry,
                objectIt = new ObjectIterator(object);
            while (objectIt.valid()) {
                entry = objectIt.next();
                self.set(entry.value[0], entry.value[1]);
            }
            return self;
        },

        /**
         * Returns a valid es6 iterator to iterate over key-value pair entries of this instance.
         *  (same as `SjlMap#entries`).
         * @method sjl.ns.stdlib.SjlMap#iterator
         * @returns {sjl.ns.stdlib.ObjectIterator}
         */
        iterator: function () {
            return this.entries();
        },

        toJSON: function () {}
    });

    if (isNodeEnv) {
        module.exports = PriorityList;
    }
    else {
        // Export class to namespace
        sjl.ns('stdlib.PriorityList', PriorityList);

        // Set shortcut to class on `sjl`
        sjl.makeNotSettableProp(sjl, 'PriorityList', PriorityList);

        // If `Amd` return the class
        if (window.__isAmd) {
            return PriorityList;
        }
    }

})();
