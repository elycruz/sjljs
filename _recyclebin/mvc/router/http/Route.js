/**
 * Created by elyde on 1/10/2016.
 */
(function () {

    'use strict';

    var //_undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        contextName = 'sjl.mvc.router.http',
        Route = function Route () {};

    Route = sjl.Extendable.extend(Route, {
        assemble: function (params, routeConfig) {},
        factory: function (routeConfig) {},
        match: function (request) {}
    }, {
        factory: function (routeConfig) {}
    });

    if (isNodeEnv) {
        module.exports = Route;
    }
    else {
        sjl.ns('mvc.router.http.Route', Route);
        sjl.makeNotSettableProp(sjl, 'Route');
        if (window.__isAmd) {
            return Route;
        }
    }

}());