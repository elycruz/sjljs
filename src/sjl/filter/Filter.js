/**
 * Created by Ely on 11/7/2015.
 */
(function () {
    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl,
        Optionable = sjl.ns.stdlib.Optionable,
        Filter = function Filter () {
            Optionable.apply(this, arguments);
        };

    Filter = Optionable.extend(Filter, {
        filter: function (value) {
            return value; // filtered
        }
    });

}());
