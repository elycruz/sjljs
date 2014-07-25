/**
 * Created by Ely on 7/21/2014.
 */
(function (context) {

    context.sjl = context.sjl || {};

    context.sjl.Optionable = context.sjl.Extendable.extend(function Optionable(options) {
            this.options = new context.sjl.Attributable();
            if (context.sjl.classOfIs(options, 'Object')) {
                this.setOptions(options);
            }
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
                var retVal = null;
                if (context.sjl.classOfIs(options, 'Array')) {
                    retVal = this.options.attrs(options);
                }
                return retVal;
            }
        });

})(typeof window === 'undefined' ? global : window);
