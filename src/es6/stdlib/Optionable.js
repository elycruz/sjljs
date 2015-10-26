/**
 * Created by Ely on 7/21/2014.
 * @note `set` and `setOptions` are different from the `merge` function in
 *  that they force the use of legacy setters if they are available;
 *  e.g., setName, setSomePropertyName, etc..
 */
(function (isBrowser) {

    'use strict';

    var sjl = require('sjl');

    /**
     * Optionable Constructor merges all objects passed in to it's `options` hash.
     * Also this class has convenience methods for querying it's `options` hash (see `get` and `set` methods.
     * @note when using this class you shouldn't have a nested `options` attribute directly within options
     * as this will cause adverse effects when getting and setting properties via the given methods.
     * @class sjl.Optionable
     * @extends sjl.Extendable
     * @type {void|sjl.Optionable}
     */
    class Optionable {

        constructor (options = null) {
            this.options = new sjl.Attributable();
            this.merge.apply(this, arguments);
        }

        /**
         * Sets an option on Optionable's `options` using `sjl.setValueOnObj`;
         *  E.g., `optionable.options = value`;
         * @deprecated - Will be removed in version 1.0.0
         * @method sjl.Optionable#setOption
         * @param key
         * @param value
         * @returns {sjl.Optionable}
         */
        setOption (key, value) {
            sjl.setValueOnObj(key, value, this.options);
            return this;
        }

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
        setOptions (options) {
            if (sjl.classOfIs(options, 'Object')) {
                this.options.attrs(options);
            }
            return this;
        }

        /**
         * Gets an options value by key.
         * @deprecated - Slotted for removal in version 1.0.0
         * @method sjl.Optionable#getOption
         * @param key {String}
         * @returns {*}
         */
        getOption (key) {
            return sjl.getValueFromObj(key, this.options);
        }

        /**
         * Gets options by either array or just by key.
         * @deprecated - Slotted for removal in version 1.0.0
         * @method sjl.Optionable#getOptions
         * @param options {Array|String}
         * @returns {*}
         */
        getOptions (options) {
            var classOfOptions = sjl.classOf(options),
                retVal = this.options;
            if (classOfOptions === 'Array' || classOfOptions === 'String') {
                retVal = this.options.attrs(options);
            }
            return retVal;
        }

        /**
         * Checks a key/namespace string ('a.b.c') to see if `this.options`
         *  has a value (a non falsy value otherwise returns `false`).
         * @method sjl.Optionable#has
         * @param nsString - key or namespace string
         * @returns {Boolean}
         */
        has (nsString) {
            return sjl.isset(sjl.searchObj(nsString, this.options));
        }

        /**
         * Merges all objects passed in to `options`.
         * @method sjl.Optionable#merge
         * @param ...options {Object} - Any number of `Object`s passed in.
         * @param useLegacyGettersAndSetters {Object|Boolean|undefined}
         * @returns {sjl.Optionable}
         */
        merge (options) {
            sjl.extend(true, this.options, ...arguments);
            return this;
        }
    }

    if (!isBrowser) {
        module.exports = Optionable;
    }
    else {
        sjl.package('stdlib.Optionable', Optionable);
    }

})(typeof window === 'undefined');
