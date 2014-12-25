/**
 * Created by Ely on 6/21/2014.
 */
(function (context) {

    'use strict';

    context.sjl = context.sjl || {};

    context.sjl.Attributable = context.sjl.Extendable.extend(function Attributable () {},{

        /**
         * Gets or sets a collection of attributes.
         * @param attrs {mixed|Array|Object} - Attributes to set or get from object
         * @todo add an `attr` function to this class
         * @returns {context.sjl.Attributable}
         */
        attrs: function (attrs) {
            var self = this,
                retVal = self;
            switch(context.sjl.classOf(attrs)) {
                case 'Array':
                    retVal = self._getAttribs(attrs);
                    break;
                case 'Object':
                    context.sjl.extend(true, self, attrs, true);
                    break;
                case 'String':
                    retVal = context.sjl.getValueFromObj(attrs, self);
                    break;
                default:
                    retVal = self._getAttribs(attrs);
                    break;
            }
            return retVal;
        },

        attr: function (attrs) {
            return this.attrs(attrs);
        },

        /**
         * Gets a set of attributes hash for queried attributes.
         * @param attribsList {Array} - Attributes list to return
         * @returns {*}
         * @private
         */
        _getAttribs: function (attrsList) {
            var attrib,
                out = {},
                self = this;

            // If attribute list is not an array
            if (!context.sjl.classOfIs(attrsList, 'Array')) {
                return;
            }

            // Loop through attributes to get and set them for return
            for (attrib in attrsList) {
                attrib = attrsList[attrib];
                out[attrib] = typeof self[attrib] !== 'undefined'
                    ? context.sjl.getValueFromObj(attrib, self) : null;
            }

            // Return queried attributes
            return out;
        }

    });
})(typeof window === 'undefined' ? global : window);
