/**
 * Created by elyde on 1/11/2016.
 */
(function () {

    'use strict';

    function priorityListItemsToObj (items) {
        return items.reduce(function (a1, a2) {
            var out = a1;
            if (a1 instanceof PriorityListItem) {
                out = {};
                out[a1.key] = a1.value;
                console.log(a1.key, a1.value);
            }
            if (a2) {
                out[a2.key] = a2.value;
                console.log(a2.key, a2.value);
            }
            return out;
        });
    }

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('./../sjl.js') : window.sjl,
        Extendable = sjl.stdlib.Extendable,
        ObjectIterator = sjl.stdlib.ObjectIterator,
        SjlMap = sjl.stdlib.SjlMap,
        priorityItemSerial = 0,
        PriorityListItem = function PriorityListItem (key, value, priority) {
            var _priority;
            Object.defineProperties(this, {
                key: {
                    value: key
                },
                serial: {
                    value: +priorityItemSerial
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
                        _priority = value;
                    }
                }
            });
            this.priority = priority;
            priorityItemSerial += 1;
        },
        PriorityList = function PriorityList (objOrArray, LIFO) {
            var _sorted = false,
                _internalPriorities = 0,
                _LIFO = sjl.classOfIs(LIFO, Boolean) ? LIFO : false,
                _LIFO_modifier,
                _itemWrapperConstructor = PriorityListItem,
                _itemsMap = new SjlMap(),
                contextName = 'sjl.stdlib.PriorityList',
                classOfIterable = sjl.classOf(objOrArray);

            Object.defineProperties(this, {
                originallyPassedInIterableType: {
                    value: classOfIterable
                },
                itemWrapperConstructor: {
                    get: function () {
                        return _itemWrapperConstructor;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'itemWrapperConstructor', value, Function);
                        _itemWrapperConstructor = value;
                    }
                },
                itemsMap: {
                    get: function () {
                        return _itemsMap;
                    },
                    set: function (value) {
                        if (!sjl.classOfIsMulti(value, 'Map', 'SjlMap')) {
                            throw new TypeError('sjl.stdlib.SjlMap.itemsMap can only be of type `Map` or `SjlMap`.  ' +
                                'Type received: "' + sjl.classOf(value) + '".');
                        }
                        _itemsMap = value;
                    }
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
                LIFO: {
                    get: function () {
                        return _LIFO;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityList.name, 'LIFO', value, Boolean);
                        _LIFO = value;
                        this.sorted = false;
                    }
                },
                LIFO_modifier: {
                    get: function () {
                        return this.LIFO ? 1 : -1;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityList.name, 'LIFO_modifier', value, Number);
                        _LIFO_modifier = value;
                        this.sorted = false;
                    }
                },
                pointer: {
                    get: function () {
                        return this.itemsMap.pointer;
                    },
                    set: function (value) {
                        this.itemsMap.pointer = value; // itemsMap validates pointer for us
                    }
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
        // Iterator functions
        // -------------------------------------------
        /**
         * Returns the current key and value that `pointer` is pointing to as an array [key, value].
         * @method sjl.stdlib.PriorityList#current
         * @returns {{ done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        current: function () {
            return this.itemsMap.current();
        },

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.stdlib.PriorityList#next
         * @returns {{done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        next: function () {
            return this.itemsMap.next();
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
         * @method sjl.stdlib.PriorityList#rewind
         * @returns {sjl.stdlib.PriorityList}
         */
        rewind: function () {
            this.itemsMap.rewind();
            return this;
        },

        // Map functions
        // -------------------------------------------
        clear: function () {
            this.pointer = 0;
            this.itemsMap.clear();
            this.sorted = false;
            return this;
        },
        entries: function () {
            return this.sort().itemsMap.entries();
        },
        forEach: function (callback, context) {
            this.sort().itemsMap.forEach(callback, context);
            return this;
        },
        has: function (key) {
            return this.itemsMap.has(key);
        },
        keys: function () {
            return this.sort().itemsMap.keys();
        },
        values: function () {
            return this.sort().itemsMap.values();
        },
        get: function (key) {
            return this.itemsMap.get(key);
        },
        set: function (key, value, priority) {
            this.itemsMap.set(key, new (this.itemWrapperConstructor) (key, value, this.normalizePriority(priority)));
            this.sorted = false;
            return this;
        },
        delete: function (key) {
            this.itemsMap.delete(key);
            return this;
        },

        // Non api specific functions
        // -------------------------------------------
        // Own Api functions
        // -------------------------------------------
        sort: function () {
            var self = this,
                LIFO_modifier = self.LIFO_modifier,
                sortedEntries;
            if (self.sorted) {
                return self;
            }
            sortedEntries = [].concat(self.itemsMap._values).sort(function (a, b) {
                var retVal;
                if (a.priority === b.priority) {
                    retVal = a.serial > b.serial;
                }
                else {
                    retVal = a.priority > b.priority;
                }
                return (retVal ? -1 : 1) * LIFO_modifier;
            }, self);

            // Create new map with sorted items (items sorted based on this.LIFO_modifier)
            self.itemsMap = new SjlMap();
            self.addFromObject(priorityListItemsToObj(sortedEntries));
            self.sorted = true;
            self.pointer = 0;
            return self;
        },

        /**
         * Ensures priority returned is a number or increments it's internal priority counter
         * and returns it.
         * @param priority {Number}
         * @returns {Number}
         */
        normalizePriority: function (priority) {
            var retVal;
            if (sjl.classOfIs(priority, Number)) {
                retVal = priority;
            }
            else {
                this._internalPriorities += 1;
                retVal = +this._internalPriorities;
            }
            return retVal;
        },

        /**
         * Adds key-value array pairs in an array to this instance.
         * @method sjl.stdlib.PriorityList#addFromArray
         * @param array {Array<Array<*, *>>} - Array of key-value array entries to parse.
         * @returns {PriorityList}
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
            return this;
        },

        /**
         * Add all the `object`'s instance's own property key-value pairs to this instance.
         * @method sjl.stdlib.PriorityList#addFromObject
         * @param object {Object} - Object to operate on.
         * @returns {PriorityList}
         */
        addFromObject: function (object) {
            sjl.throwTypeErrorIfNotOfType(PriorityList.name, 'object', object, 'Object',
                'Only `Object` types allowed.');
            var self = this,
                entry,
                objectIt = new ObjectIterator(object);
            while (objectIt.valid()) {
                entry = objectIt.next();
                self.set(entry.value[0], entry.value[1]);
            }
            return self; //.sort();
        },

        /**
         * Returns a valid es6 iterator to iterate over key-value pair entries of this instance.
         *  (same as `PriorityList#entries`).
         * @method sjl.stdlib.PriorityList#iterator
         * @returns {sjl.stdlib.ObjectIterator}
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

        // If `Amd` return the class
        if (window.__isAmd) {
            return PriorityList;
        }
    }

})();
