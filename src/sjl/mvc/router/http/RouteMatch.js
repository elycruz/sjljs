/**
 * Created by elyde on 1/10/2016.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        contextName = 'sjl.mvc.router.http.RouteMatch',
        RouteMatch = function RouteMatch () {
            var _length = 0,
                _matchedRouteName = '',
                _matchedRouteNameSeparator = '/',
                _params = {};
            Object.defineProperties(this, {
                _length: {
                    get: function () {
                        return _length;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(RouteMatch.name, '_length', value, Number);
                        _length = value;
                    }
                },
                _matchedRouteName: {
                    get: function () {
                        return _matchedRouteName;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(RouteMatch.name, '_matchedRouteName', value, String);
                        _matchedRouteName = value;
                    }
                },
                _matchedRouteNameSeparator: {
                    get: function () {
                        return _matchedRouteNameSeparator;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(RouteMatch.name, '_matchedRouteNameSeparator', value, String);
                        _matchedRouteNameSeparator = value.length > 0 ? value : '/';
                    }
                },
                _params: {
                    get: function () {
                        return _params;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(RouteMatch.name, '_params', value, Object);
                        _params = value;
                    }
                }
            });
        };

    RouteMatch = sjl.Extendable.extend(RouteMatch, {

        param: function (key, defaultValue, setValue) {
            defaultValue = typeof defaultValue !== _undefined ? defaultValue : null;
            var hasParam = typeof this._params[key] !== _undefined,
                shouldSetValue = sjl.classOfIs(setValue, Boolean) ? setValue : false,
                retVal = this;
            if (!hasParam) {
                if (shouldSetValue) {
                    this._params[key] = defaultValue;
                }
                retVal = defaultValue;
            }
            else {
                retVal = this._params[key];
            }
            return retVal;
        },

        params: function (params, mergeParamsBln) {
            var isGetterCall = typeof keyOrObj === _undefined,
                retVal = this;
            if (isGetterCall) {
                retVal = this._params;
            }
            else if (mergeParamsBln) {
                sjl.extend(true, this._params, params);
            }
            else {
                this._params = params;
            }
            return retVal;
        },

        length: function (length) {
            var isGetterCall = typeof length === _undefined,
                retVal;
            if (isGetterCall) {
                retVal = this._length;
            }
            else {
                this._length = length;
                retVal = this;
            }
            return retVal;
        },

        matchedRouteName: function (matchedRouteName) {
            var isGetterCall = typeof matchedRouteName === _undefined,
                retVal = this;
            if (isGetterCall) {
                retVal = this._matchedRouteName;
            }
            else {
                this._matchedRouteName = matchedRouteName;
            }
            return retVal;
        },

        mergeRouteMatch: function (routeMatch) {
            return this.params(routeMatch.params, true)
                .length(this.length() + routeMatch.length)
                .matchedRouteName(routeMatch.getMatchedRouteName());
        }
    }, {
    });

    if (isNodeEnv) {
        module.exports = RouteMatch;
    }
    else {
        sjl.ns('mvc.router.http.RouteMatch', RouteMatch);
        sjl.makeNotSettableProp(sjl, 'RouteMatch');
        if (window.__isAmd) {
            return RouteMatch;
        }
    }

}());