/**
 * Created by Ely on 7/21/2014.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Optionable = function Optionable(/*[, options]*/) {
            var arg0 = arguments[0],
                _optionsKeyname = '_options';

            // If options key name is set set it
            if (sjl.isObject(arg0) && sjl.issetAndOfType(arg0.optionsKeyName, String)) {
                _optionsKeyname = arg0.optionsKeyName + '';
                sjl.unset(arg0, 'optionsKeyName');
            }

            // Define options key name property
            Object.defineProperty(this, 'optionsKeyName', {value: _optionsKeyname});

            // Define "options" property
            sjl.defineEnumProp(this, this.optionsKeyName, new sjl.stdlib.Config());

            /**
             * Options key name.  Set when constructing an Optionable instance via the
             * options hash passed in.
             * Default value: '_options'
             * @note The value of this property is set as the key for the options storage internally;
             * @example
             *
             * var model = new sjl.stdlib.Optionable({optionsKeyName: 'options'});
             * model.options instanceof sjl.stdlib.Config === true // true;
             *
             * var model2 = new sjl.stdlib.Optionable(); // Uses default key name '_options' in this case scenario
             * model2._options instanceof sjl.stdlib.Config === true // true;
             *
             * var model3 = new sjl.stdlib.Optionable({optionsKeyName: '_attributes'});
             * model3._attributes instanceof sjl.stdlib.Config === true // true;
             *
             * @readonly
             * @member sjl.stdlib.Optionable#optionsKeyName {String}
             */

            // Merge all options in to options store
            if (arguments.length > 0) {
                this.set.apply(this, arguments);
            }
        };

    /**
     * Optionable Constructor merges all objects passed in to it's `options` hash.
     * Also this class has convenience methods for querying it's `options` hash (see `get` and `set` methods.
     * @note when using this class you shouldn't have a nested `options` attribute directly within options
     * as this will cause adverse effects when getting and setting properties via the given methods.
     * @class sjl.stdlib.Optionable
     * @extends sjl.stdlib.Extendable
     * @type {void|sjl.stdlib.Optionable}
     */
    Optionable = sjl.stdlib.Extendable.extend(Optionable, {
        /**
         * Gets one or many option values.
         * @method sjl.stdlib.Optionable#get
         * @param keyOrArray
         * @returns {*}
         */
        get: function (keyOrArray) {
            return this.getStoreHash().get(keyOrArray);
        },

        /**
         * Sets an option (key, value) or multiple options (Object)
         * based on what's passed in.
         * @method sjl.stdlib.Optionable#set
         * @param0 {String|Object}
         * @param1 {*} - One or more objects to merge in if `param0` is an `Object`.  Else it is the value you want
         * to set the `param0` key to;  E.g., optionable.set('someKey', 'some-value-here');.
         * @returns {sjl.stdlib.Optionable}
         */
        set: function () {
            var options = this.getStoreHash();
            options.set.apply(options, arguments);
            return this;
        },

        /**
         * Checks a key/namespace string ('a.b.c') to see if `this.options`
         *  has a value (a non falsy value otherwise returns `false`).
         * @method sjl.stdlib.Optionable#has
         * @param nsString - key or namespace string
         * @returns {Boolean}
         */
        has: function (nsString) {
            return this.getStoreHash().has(nsString);
        },

        getStoreHash: function () {
            return this[this.optionsKeyName];
        }

    });

    if (isNodeEnv) {
        module.exports = Optionable;
    }
    else {
        sjl.ns('stdlib.Optionable', Optionable);
        if (sjl.__isAmd) {
            return Optionable;
        }
    }

})();
