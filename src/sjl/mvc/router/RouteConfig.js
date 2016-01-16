/**
 * Created by Ely on 1/15/2016.
 */
(function () {
    var _undefined = 'undefined',

        isNodeEnv = typeof window === _undefined,

        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},

        contextName = 'sjl.mvc.router.http.Route',

        RouteConfig = function RouteConfig() {
            var _routeName,
                _constraints,
                _defaults;
            Object.defineProperties(this, {
                route: {
                    get: () => {
                        return _route;
                    },
                    set: (value) => {
                        sjl.throwTypeErrorIfNotOfType(RouteConfig.name, 'route', value, String);
                        _route = value;
                    }
                },
                route_name: {
                    get: () => {
                        return _routeName;
                    },
                    set: (value) => {
                        sjl.throwTypeErrorIfNotOfType(RouteConfig.name, 'routeName', value, String);
                        _routeName = value;
                    }
                },
                constraints: {
                    get: () => {
                        return _constraints;
                    },
                    set: (value) => {
                        sjl.throwTypeErrorIfNotOfType(RouteConfig.name, 'constraints', value, Object);
                        _constraints = value;
                    }
                },
                defaults: {
                    get: () => {
                        return _defaults;
                    },
                    set: (value) => {
                        sjl.throwTypeErrorIfNotOfType(RouteConfig.name, 'defaults', value, Object);
                        _defaults = value;
                    }
                },
                child_routes: {
                    get: () => {
                        return _childRoutes;
                    },
                    set: (value) => {
                        sjl.throwTypeErrorIfNotOfType(RouteConfig.name, 'childRoutes', value, Object);
                        _defaults = value;
                    }
                },
            });
        };
    RouteConfig = sjl.Extendable.extend(RouteConfig);
}());
