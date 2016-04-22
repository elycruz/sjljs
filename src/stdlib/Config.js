/**
 * Created by elydelacruz on 4/22/16.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        contextName = 'sjl.stdlib.Config',
        Config = sjl.stdlib.Extendable.extend({
            constructor: function () {
                this.set.apply(this, arguments);
            },

            get: function (keyOrNsKey) {
                if (!sjl.isset(keyOrNsKey)) {
                    return this;
                }
                sjl.throwTypeErrorIfNotOfType(contextName, 'get(keyOrNsKey)', keyOrNsKey, String);
                return sjl.searchObj(keyOrNsKey, this);
            },

            set: function (keyOrNsKey, value) {
                var self = this;
                if (isObject(keyOrNsKey)) {
                    sjl.extend.apply(sjl, [true, self].concat(sjl.argsToArray(arguments)));
                }
                else if (isString(keyOrNsKey)) {
                    sjl.autoNamespace(keyOrNsKey, self, value);
                }
                else {
                    throw new TypeError(contextName + '.set only allows strings or objects as it\'s first parameter.  ' +
                        'Param type received: `' + sjl.classOf(keyOrNsKey) + '`.');
                }
                return self;
            },

            has: function (keyOrNsString/*, type{String|Function}...*/) {
                var searchResult = sjl.searchObj(keyOrNsString, this);
                return arguments.length > 1 ?
                    sjl.isset(searchResult) :
                    sjl.issetAndOfType.apply(sjl, [searchResult].concat(sjl.restArgs(1)));
            },

            /**
             * toJSON of its own properties or properties found at key/key-namespace-string.
             * @param keyOrNsString {String} - Optional.
             * @returns {*|Config}
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
        if (window.__isAmd) {
            return Config;
        }
    }

}());