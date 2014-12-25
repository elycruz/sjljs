/**
 * Created by Ely on 4/12/2014.
 * Code copy pasted from "Javascript the definitive guide"
 */
(function (context) {

    'use strict';

    /**
     * The `Extendable` constructor
     * @constructor
     */
    context.sjl.Extendable = context.sjl.defineSubClass(Function, function Extendable() {});

})(typeof window === 'undefined' ? global : window);
