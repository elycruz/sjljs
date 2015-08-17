/**
 * Created by Ely on 8/15/2015.
 */
(function () {

    var BasePage = sjl.Extendable.extend(function BasePage () {
        this._internal = {
            label: null,
            fragment: null,
            //id: null,
            //class: null,
            //title: null,
            //target: null,
            //rel: null,
            //rev: null,
            htmlAttribs: {
                id: null,
                class: null,
                title: null,
                target: null,
                rel: null,
                rev: null
            },
            order: 0,
            resource: null,
            privilege: null,
            permission: null,
            textDomain: null,
            active: false,
            visible: true,
            parent: null,
            properties: null,
            factories: null
        };
    }, {
        label: function (label) {
            var self = this,
                isGetterCall = typeof label === 'undefined',
                retVal = self;
            if (isGetterCall) {
                retVal = self._internal.label;
            }
            else {
                self._internal.label = label;
            }
            return retVal;
        },
        fragment: function (fragment) {
            var self = this,
                isGetterCall = typeof fragment === 'undefined',
                retVal = self;
            if (isGetterCall) {
                retVal = self._internal.fragment;
            }
            else {
                self._internal.fragment = fragment;
            }
            return retVal;
        },
        htmlAttribs: function (attribs) {
            var self = this,
                isGetterCall = typeof attribs === 'undefined',
                retVal = self;
            if (isGetterCall) {
                retVal = self._internal.htmlAttribs;
            }
            else {
                self._internal.htmlAttribs = attribs;
            }
            return retVal;
        },
        id: function (id) { return this._internal[key]; },
        class: function (value) { return this._internal[key]; },
        title: function (value) { return this._internal[key]; },
        target: function (value) { return this._internal[key]; },
        rel: function (value) { return this._internal[key]; },
        rev: function (value) { return this._internal[key]; },
        order: function (value) { return 0; },
        resource: function (value) { return this._internal[key]; },
        privilege: function (value) { return this._internal[key]; },
        permission: function (value) { return this._internal[key]; },
        textDomain: function (value) { return this._internal[key]; },
        active: function (value) { return false; },
        visible: function (value) { return true; },
        parent: function (value) { return this._internal[key]; },
        properties: function (value) { return this._internal[key]; },
        factories: function (value) { return this._internal[key]; },
        href: function () {/** Abstract Public Method **/}
    })
}());