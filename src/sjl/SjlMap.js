/**
 * Created by Ely on 7/17/2015.
 */
(function (context) {

    'use strict';

    var sjl = context.sjl;

    sjl.Extendable.extend(function SjlMap (iterable) {
        this._values = [];
        this._entries = [];
    }, {
        size: function () {},
        clear: function () {},
        delete: function () {},
        entries: function () {},
        forEach: function () {},
        get: function () {},
        has: function () {},
        set: function () {},
        keys: function () {},
        values: function () {},
    });

})(typeof window === 'undefined' ? global : window);