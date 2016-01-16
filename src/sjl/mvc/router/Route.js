/**
 * Created by elyde on 1/10/2016.
 */
(function () {

    'use strict';

    var //_undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        contextName = 'sjl.mvc.router.http.Route',
        Route = function Route (routeConfig) {};

    Route = sjl.Extendable.extend(Route, {
        assemble: function (params, routeConfig) {

        },
        match: function (browserLocation) {
            var routeMatch;
            routeMatch;
        }
    }, {
        factory: function (routeConfig) {
            var route;
            return route;
        }
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
