/**
 * Created by elyde on 1/12/2016.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        contextName = 'sjl.mvc.router.TreeRouteStack',
        PriorityList = sjl.stdlib.PriorityList,
        TreeRouteStack = function TreeRouteStack (iterable, LIFO) {
            var _baseUrl = '',
                _requestUri = '';
            Object.defineProperties(this, {
                baseUrl: {
                    get: function () {
                        return _baseUrl;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(TreeRouteStack.name, 'baseUrl', value, String);
                        _baseUrl = value;
                    }
                },
                requestUri: {
                    get: function () {
                        return _requestUri;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(TreeRouteStack.name, 'requestUri', value, String);
                        _requestUri = value;
                    }
                },
                defaultParams: {
                    value: {}
                }
            });
            PriorityList.apply(this, arguments);
        };

    TreeRouteStack = PriorityList.extend(TreeRouteStack, {
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
                retVal

            if (this.baseUrl.length === 0 && request.baseUrl) {
                this.baseUrl = request.baseUrl;
            }

            if (this.requestUri.length === 0 && request.requestUri) {
                this.requestUri = request.requestUri;
            }

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
            var names = options.names.split('/'),
                route = this.routes.get(names[0]);

        }
    }, {
        factory: function () {}
    });

    if (isNodeEnv) {
        module.exports = TreeRouteStack;
    }
    else {
        sjl.ns('mvc.router.http.TreeRouteStack', TreeRouteStack);
        sjl.makeNotSettableProp(sjl, 'TreeRouteStack');
        if (window.__isAmd) {
            return TreeRouteStack;
        }
    }

}());
