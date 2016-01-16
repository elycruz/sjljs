/**
 * Created by elyde on 1/10/2016.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        contextName = 'sjl.mvc.router.RouteStack',
        PriorityList = sjl.stdlib.PriorityList,
        RouteStack = function RouteStack (iterable, LIFO) {
            Object.defineProperties(this, {
                defaultParams: {
                    value: {}
                }
            });
            PriorityList.apply(this, arguments);
        };

    RouteStack = PriorityList.extend(RouteStack, {
        factory: function () {},
        set: function (routeNameOrRoutes, routeObj, priority) {
            var classOfRouteName = sjl.classOf(routeName);
            if (classOfRouteName !== String.name) {
                if (classOfRouteName === Object.name) {
                    this.addFromObject(routeNameOrRoutes);
                }
                else if (classOfRouteName === Array.name) {
                    this.addFromArray(routeNameOrRoutes);
                }
                else {
                    throw new Error('`' + contextName + '.setRoutes` only ' +
                        'accepts an array or an object.  Type recieved: "' + classOfRoutes + '".');
                }
                return this;
            }
            if (!sjl.isset(priority) && sjl.isset(routeObj.priority)) {
                priority = routeObj.priority;
            }
            return PriorityList.prototype.set
                .call(this, routeNameOrRoutes, routeObj, priority);
        },
        match: function (request) {
            var route,
                match,
                iterator = this.entries(),
                retVal;
            while (iterator.valid()) {
                route = iterator.next();
                match = route.match(request);
                if (!match) { continue; }
                match.params = sjl.extend(
                    true, {}, this.defaultParams, match.params);
                retVal = match;
                break;
            }
            return retVal;
        },
        assemble: function (params, options) {

        }
    }, {
        factory: function () {}
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