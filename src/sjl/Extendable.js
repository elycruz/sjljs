/**
 * Created by Ely on 4/12/2014.
 * Code copy pasted from "Javascript the definitive guide"
 */
(function (context) {

    'use strict';

    /**
     * The `sjl.Extendable` constructor (a constructor that has a static `extend` method for easy extending).
     * @class module:sjl.Extendable
     * @name sjl.Extendable
     */
    context.sjl.Extendable = context.sjl.defineSubClass(Function, function Extendable() {});

    /**
     * Extends a new copy of self with passed in parameters.
     * @method sjl.Extendable.extend
     * @param constructor {Constructor} - Required.
     * @param methods {Object} - Optional.
     * @param statics {Object} - Static methods. Optional.
     */

})(typeof window === 'undefined' ? global : window);
