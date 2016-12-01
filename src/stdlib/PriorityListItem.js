/**
 * Created by elydelacruz on 8/22/16.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../sjl.js') : window.sjl,
        Extendable = sjl.ns.stdlib.Extendable,

    /**
     * Used as default constructor for wrapping items in when `wrapItems` is set to `true` on
     * `sjl.stdlib.PriorityList`.
     * @class module:sjl.stdlib.PriorityListItem
     * @extends sjl.stdlib.Extendable
     * @param key {*}
     * @param value {*}
     * @param priority {Number}
     * @param serial {Number}
     */
    PriorityListItem = Extendable.extend({

        /**
         * Priority List Item Constructor (internal docblock).
         * @constructor
         * @param key {*}
         * @param value {*}
         * @param priority {Number}
         * @param serial {Number}
         * @private
         */
        constructor: function PriorityListItem (key, value, priority, serial) {
            var _priority,
                _serial,
                contextName = 'sjl.stdlib.PriorityListItem';
            /**
             * Key name.  Set on construction.
             * @member sjl.stdlib.PriorityListItem#key {String}
             * @readonly
             */
            /**
             * Value name.  Set on construction.
             * @member sjl.stdlib.PriorityListItem#value {*}
             * @readonly
             */
            /**
             * Serial index.
             * @member sjl.stdlib.PriorityListItem#serial {Number}
             * @readonly
             */
            /**
             * Priority.
             * @member sjl.stdlib.PriorityListItem#priority {Number}
             * @readonly
             */
            Object.defineProperties(this, {
                key: {
                    value: key,
                    enumerable: true
                },
                serial: {
                    get: function () {
                        return _serial;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'serial', value, Number);
                        _serial = value;
                    },
                    enumerable: true
                },
                value: {
                    value: value,
                    enumerable: true
                },
                priority: {
                    get: function () {
                        return _priority;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'priority', value, Number);
                        _priority = value;
                    },
                    enumerable: true
                }
            });
            this.priority = priority;
            this.serial = serial;
        }
    });

    if (isNodeEnv) {
        module.exports = PriorityListItem;
    }
    else {
        // Export class to namespace
        sjl.ns('stdlib.PriorityListItem', PriorityListItem);

        // If `Amd` return the class
        if (sjl.isAmd) {
            return PriorityListItem;
        }
    }

}());
