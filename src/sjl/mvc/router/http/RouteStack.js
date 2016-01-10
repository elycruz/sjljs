/**
 * Created by elyde on 1/10/2016.
 */
(function () {

    'use strict';

    var//_undefined = 'undefined',,
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        contextName = 'sjl.mvc.router.http',
        SjlMap = sjl.stdlib.SjlMap,
        RouteStack = function RouteStack () {
            SjlMap.apply(this, arguments);
        };

    RouteStack = SjlMap.extend(RouteStack, {
        addRoute: function (routeName, routeObj, priority) {
            return this;
        },
        addRoutes: function (routes) {
            return this;
        },
        removeRoute: function (route) {
            return this;
        },
        setRoutes: function (routes) {
            this.clear();
            return this;
        }
    });

    if (isNodeEnv) {
        module.exports = RouteStack;
    }
    else {
        sjl.ns('mvc.router.http.RouteStack', RouteStack);
        sjl.makeNotSettableProp(sjl, 'RouteStack');
        if (window.__isAmd) {
            return RouteStack;
        }
    }

}());