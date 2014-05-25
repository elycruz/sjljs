/**
 * Created by Ely on 5/24/2014.
 */
(function (context) {

    if (typeof Function.prototype.extend === 'undefined') {
        /**
         * Make functions/constructors extendable
         * @param constructor {function}
         * @param methods {object} - optional
         * @param statics {mixed|object|null|undefined} - optional
         * @todo refactor this.  Figure out a way not to extend `Function`
         * @returns {*}
         */
        Function.prototype.extend = function (constructor, methods, statics) {
            return context.sjl.defineSubClass(this, constructor, methods, statics);
        };
    }

})(typeof window === 'undefined' ? global : window);
