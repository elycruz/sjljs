/**
 * Created by elyde on 1/11/2016.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('./../sjl.js') : window.sjl,
        ObjectIterator = sjl.stdlib.ObjectIterator,
        SjlMap = sjl.stdlib.SjlMap,
        Iterator = sjl.stdlib.Iterator,

        /**
         * PriorityList Constructor (internal docblock).
         * @param objOrArray {Object|Array}
         * @param LIFO {Boolean} - Default `false`.
         * @param wrapItems {Boolean} - Default `false`
         * @constructor
         * @private
         */
        PriorityList = function PriorityList (objOrArray, LIFO, wrapItems) {
            var _sorted = false,
                __internalPriorities = 0,
                __internalSerialNumbers = 0,
                _LIFO = sjl.isset(LIFO) ? LIFO : false,
                _itemWrapperConstructor = PriorityList.DefaultPriorityListItemConstructor,
                _wrapItems = sjl.isset(wrapItems) ? wrapItems : true,
                contextName = 'sjl.stdlib.PriorityList',
                classOfIterable = sjl.classOf(objOrArray);

            /**
             * Public property docs
             *----------------------------------------------------- */
            /**
             * itemWrapperConstructor {Function<key, value, priority, serial>} - Item Wrapper Constructor.
             * Default `sjl.stdlib.PriorityListItem`.
             * @name itemWrapperConstructor
             * @member {Function} sjl.stdlib.PriorityList#itemWrapperConstructor
             */
            /**
             * wrapItems {Boolean} - Wrap items flag.  Default `false`.
             * @name wrapItems
             * @member {Boolean} sjl.stdlib.PriorityList#wrapItems
             */
            /**
             * LIFO ("last in first out") flag - Default `false`.
             * @name LIFO
             * @member {Boolean} sjl.stdlib.PriorityList#LIFO
             */
            /**
             * _internalSerialNumbers {Number} - Internal serial numbers counter.
             * Not meant for public consumption.
             * @private
             * @name _internalSerialNumbers
             * @member {Boolean} sjl.stdlib.PriorityList#_internalSerialNumbers
             */
            /**
             * _internalPriorities {Number} - Internal priorities counter.
             * Not meant for public consumption.
             * @note May be removed later cause we can set all items with no priorities to `0` and allow
             * them to be sorted by `serial`.
             * @deprecated
             * @private
             * @name _internalPriorities
             * @member {Boolean} sjl.stdlib.PriorityList#_internalPriorities
             */
            /**
             * _LIFO_modifier {Number} - "last in first out" modifier - Returns -1 or 1 based on `LIFO` flag.
             * Not meant for public consumption.
             * @private
             * @name LIFO
             * @member {Boolean} sjl.stdlib.PriorityList#LIFO
             */
            /**
             * _sorted {Boolean} - Flag used internally to track when priority list needs to be sorted or not.
             * Not meant for public consumption.
             * @private
             * @name LIFO
             * @member {Boolean} sjl.stdlib.PriorityList#LIFO
             */

            Object.defineProperties(this, {
                itemWrapperConstructor: {
                    get: function () {
                        return _itemWrapperConstructor;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'itemWrapperConstructor', value, Function);
                        _itemWrapperConstructor = value;
                    },
                    enumerable: true
                },
                wrapItems: {
                    get: function () {
                        return _wrapItems;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'wrapItems', value, Boolean);
                        _wrapItems = value;
                    },
                    enumerable: true
                },
                LIFO: {
                    get: function () {
                        return _LIFO;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityList.name, 'LIFO', value, Boolean);
                        _LIFO = value;
                        this._sorted = false;
                    },
                    enumerable: true
                },
                _internalSerialNumbers: {
                    get: function () {
                        return __internalSerialNumbers;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, '__internalSerialNumbers', value, Number);
                        __internalSerialNumbers = value;
                    }
                },
                _internalPriorities: {
                    get: function () {
                        return __internalPriorities;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityList.name, '_internalPriorities', value, Number);
                        __internalPriorities = value;
                    }
                },
                _LIFO_modifier: {
                    get: function () {
                        return this.LIFO ? 1 : -1;
                    }
                },
                _sorted: {
                    get: function () {
                        return _sorted;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityList.name, '_sorted', value, Boolean);
                        _sorted = value;
                    }
                }
            });

            // Validate these via their setters
            this.LIFO = _LIFO;
            this.wrapItems = _wrapItems;

            // Extend instance properties
            SjlMap.call(this);
            Iterator.call(this, this._values);

            // Inject incoming iterable(s)
            if (classOfIterable === 'Object') {
                this.addFromObject(objOrArray);
            }
            else if (classOfIterable === 'Array') {
                this.addFromArray(objOrArray);
            }
        };

    /**
     * Allows the sorting of items based on priority (serial index (order items were entered in) is
     * also taken into account when items have the same priority).  This class also
     * implements the es6 `Map` interface and the es6 `Iterator` interface thereby making it
     * easily manageable and iterable.
     * @class sjl.stdlib.PriorityList
     * @extends sjl.stdlib.SjlMap
     * @extends sjl.stdlib.Iterator
     * @param objOrArray {Object|Array} - Required.
     * @param LIFO {Boolean} - "Last In First Out" flag.  Default false.
     * @param wrapItems {Boolean} - Whether items should be wrapped (internal priority list props set on outer wrapper)
     * or whether items should not be wrapped (internal priority list properties set directly on passed in objects) (internal props used
     * for sorting and other internal calculations).  Default false.
     */
    PriorityList = SjlMap.extend(PriorityList, {
        // Iterator interface
        // -------------------------------------------

        /**
         * Returns iterator result for item at pointer's current position.
         * @method sjl.stdlib.PriorityList#current
         * @method sjl.stdlib.PriorityList#current
         * @returns {{done: boolean, value: *}|{done: boolean}} - Returns `value` key in result only while `done` is `false`.
         */
        current: function () {
            var current = Iterator.prototype.current.call(this);
            if (!current.done && this.wrapItems) {
                current.value = current.value.value;
            }
            return current;
        },

        /**
         * Returns the next iterator result for item at own `pointer`'s current position.
         * @method sjl.stdlib.PriorityList#next
         * @overrides sjl.stdlib.Iterator#next
         * @returns {{done: boolean, value: *}|{done: boolean}} - Returns `value` key in result only while `done` is `false`.
         */
        next: function () {
            var next = Iterator.prototype.next.call(this);
            if (!next.done && this.wrapItems) {
                next.value = next.value.value;
            }
            return next;
        },

        /**
         * Returns a boolean indicating whether a valid iterator result object can be retrieved from
         * self or not.
         * @method sjl.stdlib.PriorityList#valid
         * @overrides sjl.stdlib.Iterator#valid
         * @returns {boolean}
         */
        valid: function () {
            return Iterator.prototype.valid.call(this);
        },

        /**
         * Set's pointer to `0`.
         * @method sjl.stdlib.PriorityList#rewind
         * @overrides sjl.stdlib.Iterator#rewind
         * @returns {sjl.stdlib.Iterator}
         */
        rewind: function () {
            return Iterator.prototype.rewind.call(this);
        },
        // forEach doesn't get added as SjlMap already has an implementation of it

        // Overridden Map functions
        // -------------------------------------------
        /**
         * Clears any stored priority items.  Also
         * internally sets `sorted` to `false`.
         * @method sjl.stdlib.PriorityList#clear
         * @overrides sjl.stdlib.SjlMap#clear
         * @returns {sjl.stdlib.PriorityList}
         */
        clear: function () {
            SjlMap.prototype.clear.call(this);
            this._sorted = false;
            return this;
        },

        /**
         * Returns a key-value es6 compliant iterator.
         * @method sjl.stdlib.ObjectIterator#entries
         * @overrides sjl.stdlib.SjlMap#entries
         * @returns {sjl.stdlib.ObjectIterator}
         */
        entries: function () {
            return this.sort().wrapItems ?
                new ObjectIterator(this._keys, this._values.map(function (item) {
                    return item.value;
                })) :
                new SjlMap.prototype.entries.call(this.sort());
        },

        /**
         * Allows you to loop through priority items in priority list.
         * Same function signature as Array.prorotype.forEach.
         * @param callback {Function} - Same signature as SjlMap.prorotype.forEach; I.e., {Function<value, key, obj>}.
         * @param context {undefined|*}
         * @method sjl.stdlib.PriorityList#forEach
         * @overrides sjl.stdlib.SjlMap#forEach
         * @returns {sjl.stdlib.PriorityList}
         */
        forEach: function (callback, context) {
            SjlMap.prototype.forEach.call(this.sort(), function (value, key, map) {
                callback.call(context, this.wrapItems ? value.value : value, key, map);
            }, this);
            return this;
        },

        /**
         * Returns an iterator for keys in this priority list.
         * @method sjl.stdlib.PriorityList#keys
         * @overrides sjl.stdlib.SjlMap#keys
         * @returns {sjl.stdlib.Iterator}
         */
        keys: function () {
            return SjlMap.prototype.keys.call(this.sort());
        },

        /**
         * Returns an iterator for values in this priority list.
         * @method sjl.stdlib.PriorityList#values
         * @overrides sjl.stdlib.SjlMap#values
         * @returns {sjl.stdlib.Iterator}
         */
        values: function () {
            if (this.wrapItems) {
                return new Iterator(this.sort()._values.map(function (item) {
                    return item.value;
                }));
            }
            return new SjlMap.prototype.values.call(this.sort());
        },

        /**
         * Fetches value for key (returns unwrapped value if `wrapItems` is `true`).
         * @param key {*}
         * @method sjl.stdlib.PriorityList#get
         * @overrides sjl.stdlib.SjlMap#get
         * @returns {*}
         */
        get: function (key) {
            var result = SjlMap.prototype.get.call(this, key);
            return this.wrapItems && result ? result.value : result;
        },

        /**
         * Sets an item onto Map at passed in priority.  If no
         * priority is passed in value is set at internally incremented
         * priority.
         * @param key {*}
         * @param value {*}
         * @param priority {Number}
         * @overrides sjl.stdlib.SjlMap#set
         * @method sjl.stdlib.PriorityList#set
         * @returns {sjl.stdlib.PriorityList}
         */
        set: function (key, value, priority) {
            SjlMap.prototype.set.call(this, key, this.resolveItemWrapping(key, value, priority));
            this._sorted = false;
            return this;
        },

        // Non api specific functions
        // -------------------------------------------
        // Own Api functions
        // -------------------------------------------

        /**
         * Sorts priority list items based on `LIFO` flag.
         * @method sjl.stdlib.PriorityList#sort
         * @returns {sjl.stdlib.PriorityList} - Returns self.
         */
        sort: function () {
            var self = this,
                LIFO_modifier = self._LIFO_modifier;

            // If already sorted return self
            if (self._sorted) {
                return self;
            }

            // Sort entries
            self._values.sort(function (a, b) {
                    var retVal;
                    if (a.priority === b.priority) {
                        retVal = a.serial > b.serial;
                    }
                    else {
                        retVal = a.priority > b.priority;
                    }
                    return (retVal ? -1 : 1) * LIFO_modifier;
                })
                .forEach(function (item, index) {
                    self._keys[index] = item.key;
                    item.serial = index;
                });

            // Set sorted to true and pointer to 0
            self._sorted = true;
            self.pointer = 0;
            return self;
        },

        /**
         * Ensures priority returned is a number or increments it's internal priority counter
         * and returns it.
         * @param priority {Number}
         * @method sjl.stdlib.PriorityList#normalizePriority
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
         * Used internally to get value either raw or wrapped as specified by the `wrapItems` flag.
         * @param key {*}
         * @param value {*}
         * @param priority {Number}
         * @method sjl.stdlib.PriorityList#resolveItemWrapping
         * @returns {*|PriorityListItem}
         */
        resolveItemWrapping: function (key, value, priority) {
            var normalizedPriority = this.normalizePriority(priority),
                serial = this._internalSerialNumbers++;
            if (this.wrapItems) {
                return new (this.itemWrapperConstructor) (key, value, normalizedPriority, serial);
            }
            try {
                value.key = key;
                value.priority = priority;
                value.serial = serial;
            }
            catch (e) {
                throw new TypeError('PriorityList can only work in "unwrapped" mode with values/objects' +
                    ' that can have properties created/set on them.  Type encountered: `' + sjl.classOf(value) + '`;' +
                    '  Original error: ' + e.message);
            }
            return value;
        },

        /**
         * Adds key-value array pairs in an array to this instance.
         * @overrides sjl.stdlib.SjlMap#addFromArray
         * @method sjl.stdlib.PriorityList#addFromArray
         * @param array {Array<Array<*, *>>} - Array of key-value array entries to parse.
         * @returns {PriorityList}
         */
        addFromArray: function (array) {
            this._sorted = false;
            return SjlMap.prototype.addFromArray.call(this, array);
        },

        /**
         * Add all the `object`'s instance's own property key-value pairs to this instance.
         * @overrides sjl.stdlib.SjlMap#addFromObject
         * @method sjl.stdlib.PriorityList#addFromObject
         * @param object {Object} - Object to operate on.
         * @returns {PriorityList}
         */
        addFromObject: function (object) {
            this._sorted = false;
            return SjlMap.prototype.addFromObject.call(this, object);
        }
    });

    Object.defineProperty(PriorityList, 'DefaultPriorityListItemConstructor', {
        value: sjl.stdlib.PriorityListItem,
        enumerable: true
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
