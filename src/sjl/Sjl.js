/**
 * Created by Ely on 5/29/2015.
 */
(function (context) {

    'use strict';

    // Singleton instance
    var sjl = {};

    /**
     * @module sjl
     * @description Sjl object.
     * @type {Object}
     */
    Object.defineProperty(context, 'sjl', {
        get: function () {
            return sjl;
        }
    });

    context.sjl.defineProperty = typeof Object.defineProperty === 'function' ? Object.defineProperty : null;

}(typeof window === 'undefined' ? global : window));
