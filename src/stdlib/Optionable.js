/**
 * Created by Ely on 7/21/2014.
 * @note `set` and `setOptions` are different from the `merge` function in
 *  that they force the use of legacy setters if they are available;
 *  e.g., setName, setSomePropertyName, etc..
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Optionable = function Optionable(/*[, options]*/) {
            this.options = new sjl.stdlib.Config();
            this.set.apply(this, arguments);
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
            return this.options.get(keyOrArray);
        },

        /**
         * Sets an option (key, value) or multiple options (Object)
         * based on what's passed in.
         * @method sjl.stdlib.Optionable#set
         * @param0 {String|Object}
         * @param1 {*}
         * @returns {sjl.stdlib.Optionable}
         */
        set: function () {
            this.options.set.apply(this.options, arguments);
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
            return this.options.has(nsString);
        }

    });

    if (isNodeEnv) {
        module.exports = Optionable;
    }
    else {
        sjl.ns('stdlib.Optionable', Optionable);
        sjl.defineEnumProp(sjl, 'Optionable', Optionable);
        if (window.__isAmd) {
            return Optionable;
        }
    }

})();
