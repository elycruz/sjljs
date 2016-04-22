/**
 * Created by Ely on 6/21/2014.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Attributable = function Attributable(attributes) {
            this.attr(attributes);
        };

    /**
     * @class Attributable
     * @extends sjl.ns.stdlib.Extendable
     * @memberof module:sjl.ns.stdlib
     * @param attributes {Object} - Attributes to set on instantiation of the Attributable.  Optional.
     * @deprecated This class is going to be removed for version `0.6.0`.
     * @type {void|Object|*}
     */
    Attributable = sjl.ns.stdlib.Extendable.extend(Attributable, {

        /**
         * Gets or sets a collection of attributes.
         * @method sjl.ns.stdlib.Attributable#attr
         * @param attr {mixed|Array|Object} - Attributes to set or get from object
         * @returns {sjl.ns.stdlib.Attributable}
         */
        attr: function (attr) {
            var self = this,
                retVal = self;

            switch (sjl.classOf(attr)) {
                // If is 'array' then is a getter
                case 'Array':
                    retVal = self._getAttribs(attr);
                    break;

                // If is an 'object' then is a setter
                case 'Object':
                    sjl.extend(true, self, attr, true);
                    break;

                // If is a 'string' then is a getter
                case 'String':
                    // Is setter
                    if (arguments.length >= 2) {
                        sjl.setValueOnObj(attr, arguments[1], self);
                    }
                    // Is getter
                    else {
                        retVal = sjl.getValueFromObj(attr, self);
                    }
                    break;
                default:
                    sjl.extend(true, self, attr);
                    break;
            }

            return retVal;
        },

        /**
         * Gets a set of attributes hash for queried attributes.
         * @method sjl.ns.stdlib.Attributable#_getAttribs
         * @param attribsList {Array} - Attributes list to return
         * @returns {*}
         * @private
         */
        _getAttribs: function (attrList) {
            var out = {},
                self = this;

            // Loop through attributes to get and set them for return
            attrList.forEach(function (attrib) {
                out[attrib] = typeof self[attrib] !== _undefined
                    ? sjl.getValueFromObj(attrib, self) : null;
            });

            // Return queried attributes
            return out;
        }

    });

    if (isNodeEnv) {
        module.exports = Attributable;
    }
    else {
        sjl.ns('stdlib.Attributable', Attributable);
        sjl.defineEnumProp(sjl, 'Attributable', Attributable);
        if (window.__isAmd) {
            return Attributable;
        }
    }

})();
