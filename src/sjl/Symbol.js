/**
 * Created by Ely on 7/17/2015.
 */
(function (context) {

    'use strict';

    var sjl = context.sjl;

    if (typeof Symbol === 'undefined') {
        sjl.Symbol = {
            iterator: '@@iterator'
        };
    }
    else {
        sjl.Symbol = Symbol;
    }

})(typeof window === 'undefined' ? global : window);