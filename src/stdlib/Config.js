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
                return sjl.getValueFromObj(keyOrNsKey, this, true, true);
            },

            set: function (keyOrNsKey, value) {
                var classOfKey = sjl.classOf(keyOrNsKey),
                    self = this;
                if (isObject(keyOrNsKey)) {
                    sjl.extend.apply(sjl, [true, self].concat(sjl.argsToArray(arguments)));
                }
                else if (sjl.isset(keyOrNsKey)) {
                    sjl.throwTypeErrorIfNotOfType(contextName, 'set(keyOrNsKey, value)', keyOrNsKey, String);
                    sjl.setValueOnObj(keyOrNsKey, value, self, true);
                }
                return self;
            },

            has: function (keyOrNsString/*, type*/) {
                return sjl.isset(sjl.searchObj(keyOrNsString, this));
            },

            /**
             * toJSON of its own properties or properties found at key/key-namespace-string.
             * @param keyOrNsString {String} - Optional.
             * @returns {*|Config}
             */
            toJSON: function (keyOrNsString) {
                return sjl.isEmptyOrNotOfType(keyOrNsString, String) ?
                    this : sjl.clone(sjl.getValueFromObj(keyOrNsString, this));
            }
        });

    if (isNodeEnv) {
        module.exports = Config;
    }
    else {
        sjl.ns('stdlib.Config', Config);
        sjl.defineEnumProp(sjl, 'Config', Config);
        if (window.__isAmd) {
            return Config;
        }
    }

}());