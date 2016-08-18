/**
 * Created by elydelacruz on 3/25/16.
 */
(function () {

    'use strict';

    var isNodeJs = typeof window === 'undefined',
        sjl = isNodeJs ? require('./../../src/sjl') : window.sjl,
        contextName = 'sjl.filter.StripTagsFilter',
        StripTagsFilter = sjl.filter.Filter.extend({
            constructor: function StripTagsFilter(value, options) {
                if (!sjl.isset(this)) {
                    return StripTagsFilter.filter.apply(null, arguments);
                }
                var _tags,
                    _stripComments = false,
                    _attribs;
                Object.defineProperties(this, {
                    tags: {
                        get: function () {
                            return _tags;
                        },
                        set: function (value) {
                            sjl.throwTypeErrorIfNotOfType(contextName, 'tags', value, Array);
                            _tags = value;
                        }
                    },
                    stripComments: {
                        get: function () {
                            return _stripComments;
                        },
                        set: function (value) {
                            sjl.throwTypeErrorIfNotOfType(contextName, 'stripComments', value, Boolean);
                            _stripComments = value;
                        }
                    },
                    attribs: {
                        get: function () {
                            return _attribs;
                        },
                        set: function (value) {
                            sjl.throwTypeErrorIfNotOfType(contextName, 'attribs', value, Array);
                            _attribs = value;
                        }
                    }
                });
                if (sjl.classOfIs(options, Object)) {
                    sjl.extend(this, options);
                }
            },
            filter: function (value) {
                return StripTagsFilter.filter(
                    value,
                    this.tags,
                    this.attribs,
                    this.stripComments
                );
            }
        });

    function validateTagName (tag) {
        return /^[a-z][a-z\d\-]{0,21}$/i.test(tag);
    }

    function validateTagNames (tags) {
        return !tags.some(function (tag) {
                return !validateTagName(tag);
            });
    }

    function validateAttrib (attrib) {
        return validateTagName(attrib);
    }

    function validateAttribs (attribs) {
        return !attribs.some(function (attrib) {
            return !validateAttrib(attrib);
        });
    }

    function stripComments (value) {
        return value.replace(/<\!\-\-[\t\n\r]*.+[\t\n\r]*\-\->/gm, '');
    }

    function createTagRegexPartial (tag) {
        var spacePartial = StripTagsFilter.SPACE_REGEX_PARTIAL;
        return '(<(' + tag + ')' +
        '(?:' + StripTagsFilter.ATTRIB_REGEX_PARTIAL + ')*' + spacePartial + '>' +
            '.*' +
        '<\/' + spacePartial + '\\2' + spacePartial + '>)';
    }

    function stripTags (value, tags) {
        if (sjl.isEmptyOrNotOfType(tags, Array)) {
            return value;
        }
        else if (!sjl.isString(value)) {
            return value;
        }
        else if (!validateTagNames(tags)) {
            throw new Error (contextName + ' `_stripTags` ' +
                'Only valid html tag names allowed in `tags` list.  ' +
                'Tags received: "' + tags + '".');
        }
        var out = value;
        tags.forEach(function (tag) {
            var regex = new RegExp(createTagRegexPartial(tag), 'gim');
            out = out.replace(regex, '');
        });
        return out;
    }

    function stripAttribs (value, attribs) {
        if (!sjl.isset(attribs)) {
            return value;
        }
        else if (!validateAttribs(attribs)) {
            throw new Error ('Attribs mismatch');
        }
        var out = value;
        attribs.forEach(function (attrib) {
            var regex = new RegExp(
                        '([\\n\\r\\t\\s]*' + attrib + '=\\"[^\\"]*\\")',
                    'gim'
                );
            out = out.replace(regex, '');
        });
        return out;
    }

    Object.defineProperties(StripTagsFilter, {
        SPACE_REGEX_PARTIAL:  {value:'[\\n\\r\\t\\s]*', enumerable: true},
        NAME_REGEX_PARTIAL:   {value:'[a-z][a-z\\-\\d]*', enumerable: true},
        ATTRIB_REGEX_PARTIAL: {value:'[\\n\\r\\t\\s]*[a-z][a-z\\-\\d]*=\\"[^\\"]*\\"', enumerable: true},
        filter: {
            value: function (value, tags, attribs, removeComments) {
                var out = stripTags(removeComments ? stripComments(value) : value, tags, attribs);
                return sjl.isEmptyOrNotOfType(attribs, Array) ? out :
                    stripAttribs(out, attribs);
            },
            enumerable: true
        }
    });

    if (!isNodeJs) {
        sjl.ns('filter.StripTagsFilter', StripTagsFilter);
        return StripTagsFilter;
    }
    else {
        module.exports = StripTagsFilter;
    }

}());

