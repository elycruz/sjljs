/**
 * Created by Ely on 5/29/2015.
 */
(function (context) {

    'use strict';

    /**
     * @module sjl
     * @description Sjl object.
     * @type {Object}
     */
    context.sjl = !context.hasOwnProperty('sjl')
        || Object.prototype.toString.apply(context.sjl)
            .indexOf('Object') === -1 ? {} : context.sjl;

    context.sjl.defineProperty = typeof Object.defineProperty === 'function' ? Object.defineProperty : null;

}(typeof window === 'undefined' ? global : window));
