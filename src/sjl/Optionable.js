/**
 * Created by Ely on 7/21/2014.
 */
(function (context) {

    context.sjl = context.sjl || {};

    context.sjl.Optionable = context.sjl.Extendable.extend(function Optionable(options) {
            this.options = new context.sjl.Attributable();
            this.mergeOptions.apply(this, sjl.argsToArray(arguments));
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
                var retVal = this.options;
                if (context.sjl.classOfIs(options, 'Array')) {
                    retVal = this.options.attrs(options);
                }
                return retVal;
            },

            mergeOptions: function (options) {
                sjl.extend.apply(sjl, [this.options].concat(sjl.argsToArray(arguments)));
            }

        });

})(typeof window === 'undefined' ? global : window);
