/**
 * Created by elydelacruz on 3/25/16.
 * @todo finish the class (BooleanFilter).
 */
(function () {

    'use strict';

    var isNodeJs = typeof window === 'undefined',
        sjl = isNodeJs ? require('./../../src/sjl') : window.sjl,
        contextName = 'sjl.filter.Filter',
        Filter = sjl.filter.Filter,

        BooleanFilter = Filter.extend({
            constructor: function BooleanFilter(valueOrOptions) {
                if (!sjl.isset(this)) {
                    return BooleanFilter.filter(valueOrOptions);
                }
                var _allowCasting = true,       // Boolean
                    _translations = {},         // Object<String, Boolean>
                    _conversionRules = 'all';      // Array<String>
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
                            if (value === 'all' && sjl.isEmptyOrNotOfType(value, Array)) {
                                throw new TypeError (contextName + '.conversionRules must be either equal to ' +
                                    'string "all" or an of array of string rule names.' +
                                    '  Type Received:' + sjl.classOf(value) + ';  Value received: ' + value);
                            }
                            _conversionRules = value;
                        }
                    }
                });
                Filter.apply(this, arguments);
            },
            filter: function (value) {
                return BooleanFilter.filter(value, this.allowCasting, this.conversionRules, this.translations);
            }
        });

    function loopThroughTranslations(value, translations) {
        var retVal,
            translationKeys = Object.keys(translations),
            keysLen = translationKeys.length,
            i, key;
        for (i = 0; i < keysLen; i += 1) {
            key = translationKeys[i];
            if (value.toLowerCase() === key.toLowerCase()) {
                retVal = translations[key];
                break;
            }
        }
        return retVal;
    }

    function normalizeConversionRules (rules) {
        var conversionRuleKeys,
            conversionRules;

        // If 'all' was passed in
        if ((sjl.isArray(rules) && rules.indexOf('all') > -1) ||
            (sjl.isString(rules) && rules.toLowerCase() === 'all')) {
            conversionRuleKeys = Object.keys(BooleanFilter.castingRules);
            conversionRules = (new sjl.stdlib.SjlSet(conversionRuleKeys)).delete('byNative').toJSON();
        }
        return conversionRules || rules;
    }

    function loopThroughConversionRules (value, conversionRules, translations) {
        var retVal,
            result, i, rule,
            rulesLength,
            rules = normalizeConversionRules(conversionRules);

        // If conversion rules are empty validate by native cast
        if (sjl.empty(rules)) {
            retVal = castByNative(value);
        }
        else {
            rulesLength = rules.length;
            for (i = 0; i < rulesLength; i += 1) {
                rule = rules[i];
                if (rule in BooleanFilter.castingRules === false) {
                    continue;
                }
                result = BooleanFilter.castingRules[rule].apply(BooleanFilter, [value, translations]);
                if (sjl.issetAndOfType(result, Boolean)) {
                    retVal = result;
                    break;
                }
            }
        }
        return sjl.issetAndOfType(retVal, Boolean) ? retVal : false;
    }

    function castValue(value, allowCasting, conversionRules, translations) {
        var retVal;
        if (sjl.isBoolean(value)) {
            retVal = value;
        }
        else if (sjl.isBoolean(allowCasting) && !allowCasting) {
            retVal = value;
        }
        else if (arguments.length === 1) {
            retVal = castByNative(value);
        }
        else if (conversionRules === 'all' || sjl.notEmptyAndOfType(conversionRules, Array)) {
            retVal = loopThroughConversionRules(value, conversionRules, translations);
        }
        return retVal;
    }

    function castBoolean(value) {
        return sjl.isBoolean(value) ? value : undefined;
    }

    function castInteger(value) {
        return sjl.isNumber(value) ? value !== 0 : undefined;
    }

    function castFloat(value) {
        return sjl.isNumber(value) ? Number(value.toFixed(1)) !== 0.0 : undefined;
    }

    function castString(value, translations) {
        var retVal;
        if (sjl.notEmptyAndOfType(value, String) &&
            sjl.notEmptyAndOfType(translations, Object)) {
            retVal = loopThroughTranslations(value, translations);
        }
        return retVal;
    }

    function castNull (value) {
        return value === null ? false : undefined;
    }

    function castArray (value) {
        var retVal;
        if (Array.isArray(value)) {
            retVal = value.length !== 0;
        }
        return retVal;
    }

    function castObject (value) {
        var retVal;
        if (sjl.isObject(value)) {
            retVal = Object.keys(value).length !== 0;
        }
        return retVal;
    }

    function castByNative (value) {
        return Boolean(value);
    }

    function castFalseString (value) {
        var retVal;
        if (sjl.notEmptyAndOfType(value, String)) {
            retVal = ['null', 'false', 'undefined', '0', '[]', '{}'].indexOf(value) === -1;
        }
        return retVal;
    }

    function castYesNo (value, translations) {
        var retVal,
            defaultTrans = {yes: true, no: false};
        if (sjl.notEmptyAndOfType(value, String)) {
            retVal = loopThroughTranslations(value, sjl.extend(defaultTrans, translations));
        }
        return retVal;
    }

    Object.defineProperties(BooleanFilter, {
        castingRules: {
            value: {
                boolean: castBoolean,
                integer: castInteger,
                float: castFloat,
                string: castString,
                null: castNull,
                array: castArray,
                object: castObject,
                byNative: castByNative,
                falseString: castFalseString,
                yesNo: castYesNo
            }
        },
        filter: {
            value: function filter (value, allowCastring, conversionRules, translations) {
                return castValue(value, allowCastring, conversionRules, translations);
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
