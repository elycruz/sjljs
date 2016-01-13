/**
 * Created by elyde on 1/10/2016.
 */
(function () {

    'use strict';

    var//_undefined = 'undefined',,
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        contextName = 'sjl.mvc.router.http.RouteStack',
        PriorityList = sjl.stdlib.PriorityList,
        RouteStack = function RouteStack (iterable, LIFO) {
            PriorityList.apply(this, arguments);
        };

    RouteStack = PriorityList.extend(RouteStack, {
        addRoute: function (routeName, routeObj, priority) {
            return this.set(routeName, routeObj, priority);
        },
        addRoutes: function (routes) {
            var classOfRoutes = sjl.classOf(routes);
            if (classOfRoutes === Object.name) {
                this.addFromObject(routes);
            }
            else if (classOfRoutes === Array.name) {
                this.addFromArray(routes);
            }
            else {
                throw new Error('`' + contextName + '.setRoutes` only ' +
                    'accepts an array or an object.  Type recieved: "' + classOfRoutes + '".');
            }
            return this;
        },
        removeRoute: function (route) {
            return this.delete(route);
        },
        setRoutes: function (routes) {
            return this.clear().addRoutes(routes);
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