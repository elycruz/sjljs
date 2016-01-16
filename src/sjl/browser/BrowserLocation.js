/**
 * Created by Ely on 1/15/2016.
 */
(function () {
    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl,
        Extendable = sjl.ns.stdlib.Extendable,
        LocationMeta = function LocationMeta () {
            Object.defineProperties(this, {

            });
        };

    if (isNodeEnv) {
        module.exports = LocationMeta;
    }
    else {
        // Export class to namespace
        sjl.ns('stdlib.LocationMeta', LocationMeta);

        // Set shortcut to class on `sjl`
        sjl.makeNotSettableProp(sjl, 'LocationMeta', LocationMeta);

        // If `Amd` return the class
        if (window.__isAmd) {
            return LocationMeta;
        }
    }
}());
