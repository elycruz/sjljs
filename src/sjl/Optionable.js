/**
 * Created by Ely on 7/21/2014.
 * @note `set` and `setOptions` are different from the `merge` function in
 *  that they force the use of legacy setters if they are available;
 *  e.g., setName, setSomePropertyName, etc..
 */
(function (context) {

    'use strict';

    var sjl = context.sjl;

    /**
     * Optionable Constructor merges all objects passed in to it's `options` hash.
     * Also this class has convenience methods for querying it's `options` hash (see `get` and `set` methods.
     * @note when using this class you shouldn't have a nested `options` attribute directly within options
     * as this will cause adverse effects when getting and setting properties via the given methods.
     * @class sjl.Optionable
     * @extends sjl.Extendable
     * @type {void|sjl.Optionable}
     */
    sjl.Optionable = sjl.Extendable.extend(function Optionable(/*[, options]*/) {
            this.options = new sjl.Attributable();
            this.merge.apply(this, arguments);
        },
        {
            /**
             * Sets an option on Optionable's `options` using `sjl.setValueOnObj`;
             *  E.g., `optionable.options = value`;
             * @deprecated - Will be removed in version 1.0.0
             * @method sjl.Optionable#setOption
             * @param key
             * @param value
             * @returns {sjl.Optionable}
             */
            setOption: function (key, value) {
                sjl.setValueOnObj(key, value, this.options);
                return this;
            },

            /**
             * Sets each key value pair to  Optionable's `options` using
             *  `sjl.Attributable`'s `attrs` function;
             *  E.g., `optionable.options.attrs(Object);
             * @deprecated - Will be removed in version 1.0.0
             * @method sjl.Optionable#setOptions
             * @param key {String}
             * @param value {Object}
             * @returns {sjl.Optionable}
             */
            setOptions: function (options) {
                if (sjl.classOfIs(options, 'Object')) {
                    this.options.attrs(options);
                }
                return this;
            },

            /**
             * Gets an options value by key.
             * @deprecated - Slotted for removal in version 1.0.0
             * @method sjl.Optionable#getOption
             * @param key {String}
             * @returns {*}
             */
            getOption: function (key) {
                return sjl.getValueFromObj(key, this.options);
            },

            /**
             * Gets options by either array or just by key.
             * @deprecated - Slotted for removal in version 1.0.0
             * @method sjl.Optionable#getOptions
             * @param options {Array|String}
             * @returns {*}
             */
            getOptions: function (options) {
                var classOfOptions = sjl.classOf(options),
                    retVal = this.options;
                if (classOfOptions === 'Array' || classOfOptions === 'String') {
                    retVal = this.options.attrs(options);
                }
                return retVal;
            },

            /**
             * Gets one or many option values.
             * @method sjl.Optionable#get
             * @param keyOrArray
             * @returns {*}
             */
            get: function (keyOrArray) {
                return this.getOptions(keyOrArray);
            },

            /**
             * Sets an option (key, value) or multiple options (Object)
             * based on what's passed in.
             * @method sjl.Optionable#set
             * @param0 {String|Object}
             * @param1 {*}
             * @returns {sjl.Optionable}
             */
            set: function () {
                var self = this,
                    args = sjl.argsToArray(arguments),
                    typeOfArgs0 = sjl.classOf(args[0]);
                if (typeOfArgs0 === 'String') {
                    self.setOption(args[0], args[1]);
                }
                else if (typeOfArgs0 === 'Object') {
                    self.setOptions(args[0]);
                }
                return self;
            },

            /**
             * Checks a key/namespace string ('a.b.c') to see if `this.options`
             *  has a value (a non falsy value otherwise returns `false`).
             * @method sjl.Optionable#has
             * @param nsString - key or namespace string
             * @returns {Boolean}
             */
            has: function (nsString) {
                var parts = nsString.split('.'),
                    i, nsStr, retVal = false;
                if (parts.length > 1) {
                    nsStr = parts.shift();
                    for (i = 0; i <= parts.length; i += 1) {
                        retVal = !sjl.empty(sjl.namespace(nsStr, this.options));
                        if (!retVal) {
                            break;
                        }
                        nsStr += '.' + parts[i];
                    }
                }
                else {
                    retVal = !sjl.empty(sjl.namespace(nsString, this.options));
                }
                return retVal;
            },

            /**
             * Merges all objects passed in to `options`.
             * @method sjl.Optionable#merge
             * @param ...options {Object} - Any number of `Object`s passed in.
             * @param useLegacyGettersAndSetters {Object|Boolean|undefined}
             * @returns {sjl.Optionable}
             */
            merge: function (options) {
                sjl.extend.apply(sjl, [true, this.options].concat(sjl.argsToArray(arguments)));
                return this;
            }

        });

})(typeof window === 'undefined' ? global : window);
