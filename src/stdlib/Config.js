/**
 * Created by elydelacruz on 4/22/16.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        contextName = 'sjl.stdlib.Config',

        /**
         * Constructor takes one or more config objects to set onto `Config`.
         * @class sjl.stdlib.Config
         * @extends sjl.stdlib.Extendable
         */
        Config = sjl.stdlib.Extendable.extend({

            constructor: function Config () {
                if (arguments.length > 0) {
                    this.set.apply(this, arguments);
                }
            },

            /**
             * Gets any value from config by key (key can be a namespace string).
             * @method sjl.stdlib.Config#get
             * @param keyOrNsKey {String}
             * @throws {TypeError} - Throws type error if keyOrNsKey is not a string.
             * @returns {*} - Found value.
             */
            get: function (keyOrNsKey) {
                sjl.throwTypeErrorIfNotOfType(contextName + '.get', 'keyOrNsKey', keyOrNsKey, String,
                    'Also `undefined` or `null` are allowed (used when wanting the object as JSON).');
                return sjl.searchObj(keyOrNsKey, this);
            },

            /**
             * Sets any value on config by key or namespace key.
             * @method sjl.stdlib.Config#set
             * @param keyOrNsKey {String}
             * @param value {*}
             * @returns {sjl.stdlib.Config} - Returns self.
             */
            set: function (keyOrNsKey, value) {
                var self = this;
                if (sjl.isObject(keyOrNsKey)) {
                    sjl.extend.apply(sjl, [true, self].concat(sjl.argsToArray(arguments)));
                }
                else if (sjl.isString(keyOrNsKey)) {
                    sjl.autoNamespace(keyOrNsKey, self, value);
                }
                else if (sjl.isset(keyOrNsKey)) {
                    throw new TypeError(contextName + '.set only allows strings or objects as it\'s first parameter.  ' +
                        'Param type received: `' + sjl.classOf(keyOrNsKey) + '`.');
                }
                return self;
            },

            /**
             * Checks if a defined value exists for key (or namespace key) and returns it.
             * If no value is found (key/ns-key is undefined) then returns undefined.
             * @method sjl.stdlib.Config#has
             * @param keyOrNsString {String}
             * @returns {*|undefined}
             */
            has: function (keyOrNsString/*, type{String|Function}...*/) {
                sjl.throwTypeErrorIfNotOfType(contextName + '.has', 'keyOrNsString', keyOrNsString, String);
                var searchResult = sjl.searchObj(keyOrNsString, this);
                return arguments.length === 1 ?
                    sjl.isset(searchResult) :
                    sjl.issetAndOfType.apply(sjl, [searchResult].concat(sjl.restArgs(1)));
            },

            /**
             * toJSON of its own properties or properties found at key/key-namespace-string.
             * @method sjl.stdlib.Config#toJSON
             * @param keyOrNsString {String} - Optional.
             * @returns {JSON}
             */
            toJSON: function (keyOrNsString) {
                return sjl.jsonClone(
                    sjl.notEmptyAndOfType(keyOrNsString, String) ?
                       sjl.searchObj(keyOrNsString, this) : this
                );
            }
        });

    if (isNodeEnv) {
        module.exports = Config;
    }
    else {
        sjl.ns('stdlib.Config', Config);
        if (sjl.__isAmd) {
            return Config;
        }
    }

}());
