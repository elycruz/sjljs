/**
 * Created by Ely on 6/21/2014.
 */
(function (isNodeEnv) {

    'use strict';

    var sjl = isNodeEnv ? require('../sjl.js') : (window.sjl || {});

    /**
     * @class sjl.Attributable
     * @extends sjl.Extendable
     * @param attributes {Object} - Attributes to set on instantiation of the Attributable.  Optional.
     * @type {void|Object|*}
     */
    class Attributable {
        constructor (attributes) {
            this.attrs(attributes);
        }

        /**
         * Gets or sets a collection of attributes.
         * @method sjl.Attributable#attrs
         * @param attrs {mixed|Array|Object} - Attributes to set or get from object
         * @todo add an `attr` function to this class
         * @returns {sjl.Attributable}
         */
        attrs (attrs) {
            var self = this,
                retVal = self;

            switch(sjl.classOf(attrs)) {
                // If is 'array' then is a getter
                case 'Array':
                    retVal = self._getAttribs(attrs);
                    break;

                // If is an 'object' then is a setter
                case 'Object':
                    sjl.extend(true, self, attrs, true);
                    break;

                // If is a 'string' then is a getter
                case 'String':
                    // Is setter
                    if (arguments.length >= 2) {
                        sjl.setValueOnObj(attrs, arguments[1], self);
                    }
                    // Is getter
                    else {
                        retVal = sjl.getValueFromObj(attrs, self);
                    }
                    break;
                default:
                    sjl.extend(true, self, attrs);
                    break;
            }

            return retVal;
        }

        /**
         * Setter and getter for attributes on self {Optionable}.
         * @param 0 {Object|String} - Key or object to set on self.
         * @param 1 {*} - Value to set when using function as a setter.
         * @returns {*|sjl.Attributable} - If setter returns self else returned mixed.
         */
        attr () {
            return this.attrs.apply(this, arguments);
        }

        /**
         * Gets a set of attributes hash for queried attributes.
         * @method sjl.Attributable#_getAttribs
         * @param attribsList {Array} - Attributes list to return
         * @returns {*}
         * @private
         */
        _getAttribs (attrsList) {
            var attrib,
                out = {},
                self = this;

            // Loop through attributes to get and set them for return
            for (attrib in attrsList) {
                attrib = attrsList[attrib];
                out[attrib] = typeof self[attrib] !== 'undefined'
                    ? sjl.getValueFromObj(attrib, self) : null;
            }

            // Return queried attributes
            return out;
        }
    }

    if (isNodeEnv) {
        module.exports = Attributable;
    }
    else {
        sjl.package('stdlib.Attributable', Attributable);
    }

})(typeof window === 'undefined');
