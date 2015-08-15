/**
 * Created by Ely on 8/15/2015.
 * Navigation namespace
 */
(function (context) {

    var navigation = {};

    // Make navigation namespace read only
    Object.defineProperty(context.sjl, 'navigation', {
        get: function () { return navigation; },
        set: function () {}
    });

}(typeof window === 'undefined' ? global : window));
