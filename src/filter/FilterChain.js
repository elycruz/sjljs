/**
 * Created by Ely on 7/21/2014.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        contextName = 'sjl.filter.FilterChain',
        ObjectIterator = sjl.stdlib.ObjectIterator,
        Filter = sjl.filter.Filter,
        FilterChain = function FilterChain(/*...options {Object}*/) {
            var _filters = [];
            Object.defineProperties(this, {
                filters: {
                    get: function () {
                        return _filters;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'filters', value, Array);
                        _filters = value;
                    }
                }
            });
        };

    FilterChain = sjl.stdlib.Extendable.extend(FilterChain, {

        filter: function (value) {
            return [value].concat(this.filters).reduce(function (_value, filter) {
                return filter.filter(_value)
            });
        },

        isFilter: function (filter) {
            return filter instanceof Filter;
        },

        isFilterChain: function (filterChain) {
            return filterChain instanceof FilterChain;
        },

        addFilter: function (filter) {
            var self = this;
            if (this.isFilter(filter)) {
                self.filters.push(filter);
            }
            else {
                this._throwTypeError('addFilter', Filter, filter);
            }
            return self;
        },

        addFilters: function (filters) {
            if (sjl.classOfIs(filters, 'Array')) {
                filters.forEach(function (filter) {
                    this.addFilter(filter);
                }, this);
            }
            else if (sjl.classOfIs(filters, 'Object')) {
                var iterator = new ObjectIterator(filters);
                iterator.forEach(function (value, key) {
                    this.addFilter(value);
                }, this);
            }
            else {
                throw new TypeError('`' + contextName + '.addFilters` only accepts Arrays or Objects. ' +
                    ' Type Received: "' + sjl.classOf(filters) + '".');
            }
            return this;
        },

        prependFilter: function (filter) {
            if (!this.isFilter(filter)) {
                this._throwTypeError('prependFilter', Filter, filter);
            }
            this.filters = [filter].concat(this.filters);
            return this;
        },

        mergeFilterChain: function (filterChain) {
            if (!this.isFilterChain(filterChain)) {
                this._throwTypeError('mergeFilterChain', FilterChain, filterChain);
            }
            this.breakChainOnFailure = filterChain.breakChainOnFailure;
            return this.addFilters(filterChain.filters);
        },

        _throwTypeError: function (funcName, expectedType, value) {
            throw new TypeError('`' + contextName + '.' + funcName + '` only accepts subclasses/types of ' +
                '`' + expectedType.name + '`.  Type received: "' + sjl.classOf(value) + '".');
        }
    });

    if (isNodeEnv) {
        module.exports = FilterChain;
    }
    else {
        sjl.ns('filter.FilterChain', FilterChain);
        if (window._isAmd) {
            return FilterChain;
        }
    }

})();

