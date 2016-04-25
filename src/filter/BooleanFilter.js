/**
 * Created by elydelacruz on 3/25/16.
 */
(function () {

    'use strict';

    var isNodeJs = typeof window === 'undefined',
        sjl = isNodeJs ? require('./../../src/sjl') : window.sjl,
        Filter = sjl.filter.Filter,

        BooleanFilter = Filter.extend({
            constructor: function BooleanFilter(valueOrOptions) {
                if (!sjl.isset(this)) {
                    return BooleanFilter.filter(valueOrOptions);
                }
                var _allowCasting = true,
                    _translations = {}, // Object<String, Boolean>
                    _conversionRules = []; // Array<String>
                Object.defineProperties(this, {
                    allowCasting: {
                        get: function () {
                            return _allowCasting;
                        },
                        set: function (value) {
                            sjl.throwTypeErrorIfNotOfType(contextName, 'allowCasting', value, Boolean);
                            _allowCasting = value;
                        }
                    },
                    translations: {
                        get: function () {
                            return _translations;
                        },
                        set: function (value) {
                            sjl.throwTypeErrorIfNotOfType(contextName, 'translations', value, Object);
                            _translations = value;
                        }
                    },
                    conversionRules: {
                        get: function () {
                            return _conversionRules;
                        },
                        set: function (value) {
                            sjl.throwTypeErrorIfNotOfType(contextName, 'conversionRules', value, Array);
                            _conversionRules = value;
                        }
                    }
                });
                Filter.apply(this, arguments);
            },
            filter: function (value) {
                return BooleanFilter.filter(value);
            }
        });

    function castValue(value, castingRules) {
        var out;
        castingRules.forEach(function (rule) {
            if (rule in BooleanFilter.castingRules) {
                BooleanFilter.castingRules['cast' + sjl.ucaseFirst(rule)](value);
            }
        });
        return out;
    }

    function castBoolean(value) {
        if (sjl.classOfIs(value, Boolean)) {
            return value;
        }
    }

    function castInteger(value) {
        if (sjl.classOfIs(value, Number)) {
            return value !== 0;
        }
    }

    function castFloat(value) {
        if (sjl.classOfIs(value, Number)) {
            return value !== 0.0;
        }
    }

    function castString(value, someValue ) {
        if (!sjl.classOfIs(value, 'String')) {
            return;
        }
        if (!sjl.isEmptyOrNotOfType(translations, Object)) {
            Object.keys(translations).some(function (key) {
            })
        }
    }

    function castNull (value) {

    }

    function castEmptyArray (value) {

    }
    function castEmptyObject () {}
    function castByJavascriptCast () {}
    function castFalseString () {}
    function castYesNo () {}

    Object.defineProperties(BooleanFilter, {
        castingRules: {
            value: {
                castBoolean: castBoolean,
                castInteger: castInteger,
                castFloat: castFloat,
                castString: castString,
                castNull: castNull,
                castEmptyArray: castEmptyArray,
                castEmptyObject: castEmptyObject,
                castByJavascriptCast: castByJavascriptCast,
                castFalseString: castFalseString,
                castYesNo: castYesNo,
            }
        },
        filter: {
            value: function (value) {
                sjl.throwTypeErrorIfNotOfType('sjl.filter.BooleanFilter', 'value', value, String);
                return value.toLowerCase();
            },
            enumerable: true
        }
    });

    if (!isNodeJs) {
        sjl.ns('filter.BooleanFilter', BooleanFilter);
        return BooleanFilter;
    }
    else {
        module.exports = BooleanFilter;
    }

}());
