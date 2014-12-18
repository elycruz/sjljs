/**
 * Created by Ely on 7/21/2014.
 * @note `set` and `setOptions` are different from the `merge` function in that they force the use of legacy setters if they are available;  e.g., setName, setSomePropertyName, etc..
 */
(function (context) {

    context.sjl = context.sjl || {};

    /**
     * Optionable Constructor merges all objects passed in to it's `options` hash.
     * Also this class has convenience methods for querying it's `options` hash (see `get` and `set` methods.
     * @type {void|context.sjl.Optionable}
     */
    context.sjl.Optionable = context.sjl.Extendable.extend(function Optionable(options) {
            this.options = new context.sjl.Attributable();
            this.merge.apply(this, sjl.argsToArray(arguments));
        },
        {
            setOption: function (key, value) {
                context.sjl.setValueOnObj(key, value, this.options);
                return this;
            },

            setOptions: function (options) {
                if (context.sjl.classOfIs(options, 'Object')) {
                    this.options.attrs(options);
                }
                return this;
            },

            getOption: function (key) {
                return context.sjl.getValueFromObj(key, this.options);
            },

            getOptions: function (options) {
                return this.options.attrs(options);
            },

            /**
             * Gets one or many option values.
             * @param keyOrArray
             * @returns {*}
             */
            get: function (keyOrArray) {
                var retVal = null,
                    classOfKeyOrArray = sjl.classOf(keyOrArray);
                if (classOfKeyOrArray === 'String'
                    || classOfKeyOrArray === 'Array') {
                    retVal = this.getOptions(keyOrArray);
                }
                return retVal;
            },

            /**
             * Sets an option (key, value) or multiple options (Object) based on what's passed in.
             * @param0 {String|Object}
             * @param1 {*}
             * @returns {context.sjl.Optionable}
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
             * @param0-* {Object} - Any number of `Object`s passed in.
             * @lastParam {Object|Boolean} - If last param is a boolean then context.sjl.setValueOnObj will be used to
             *  merge each key=>value pair to `options`.
             * @returns {context.sjl.Optionable}
             */
            merge: function (options) {
                var args = sjl.argsToArray(arguments),
                    useLegacyGettersAndSetters = sjl.extractBoolFromArrayEnd(args),
                    tailConcat = args;
                if (useLegacyGettersAndSetters) {
                    tailConcat = args.concat([useLegacyGettersAndSetters]);
                }
                sjl.extend.apply(sjl, [true, this.options].concat(tailConcat));
                return this;
            }

        });

})(typeof window === 'undefined' ? global : window);
