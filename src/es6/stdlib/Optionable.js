/**
 * Created by Ely on 7/21/2014.
 * @note `set` and `setOptions` are different from the `merge` function in
 *  that they force the use of legacy setters if they are available;
 *  e.g., setName, setSomePropertyName, etc..
 */
(function (isNodeEnv) {

    'use strict';

    var sjl = isNodeEnv ? require('../sjl.js') : (window.sjl || {});

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

        constructor (options) {
            this.options = new sjl.package.stdlib.Attributable();
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
         * Gets one or many option values.
         * @method sjl.Optionable#get
         * @param keyOrArray
         * @returns {*}
         */
        get (keyOrArray) {
            return this.getOptions(keyOrArray);
        }

        /**
         * Sets an option (key, value) or multiple options (Object)
         * based on what's passed in.
         * @method sjl.Optionable#set
         * @param0 {String|Object}
         * @param1 {*}
         * @returns {sjl.Optionable}
         */
        set () {
            var self = this,
                args = arguments,
                typeOfArgs0 = sjl.classOf(args[0]);
            if (typeOfArgs0 === 'String') {
                self.setOption(args[0], args[1]);
            }
            else if (typeOfArgs0 === 'Object') {
                self.setOptions(args[0]);
            }
            return self;
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

    if (isNodeEnv) {
        module.exports = Optionable;
    }
    else {
        sjl.package('stdlib.Optionable', Optionable);
    }

})(typeof window === 'undefined');
