/**
 * Created by Ely on 8/15/2015.
 */
(function () {

    var BasePage = sjl.Extendable.extend(function BasePage () {
        this._internal = {
            label: null,
            fragment: null,
            htmlAttrib: {
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
        htmlAttrib: function (attribs) {
            var self = this,
                isGetterCall = typeof attribs === 'undefined',
                retVal = self;
            if (isGetterCall) {
                if (self._internal.htmlAttrib === null) {
                    self._internal.htmlAttrib = new sjl.SjlMap();
                }
                retVal = self._internal.htmlAttrib;
            }
            else {
                self._internal.htmlAttrib = attribs;
            }
            return retVal;
        },
        addHtmlAttrib: function (attribName, attribValue) {
            return this.htmlAttrib().set(attribName, attribValue);
        },
        addHtmlAttribs: function (attribsObj) {
            var self = this;
            sjl.iterable(attribsObj)[sjl.Symbol.iterator].forEach(function (key, value) {
                self.addHtmlAttrib(key, value);
            });
            return self;
        },
        rel: function (rel) {
            var self = this,
                isGetterCall = typeof rel === 'undefined',
                retVal = self;
            if (isGetterCall) {
                if (self._internal.htmlAttrib.rel === null) {
                    self._internal.htmlAttrib.rel = new sjl.SjlSet();
                }
                retVal = self._internal.htmlAttrib.rel;
            }
            else {
                self._internal.htmlAttrib.rel = rel;
            }
            return retVal;
        },
        rev: function (rev) {
            var self = this,
                isGetterCall = typeof rev === 'undefined',
                retVal = self;
            if (isGetterCall) {
                if (self._internal.htmlAttrib.rev === null) {
                    self._internal.htmlAttrib.rev = new sjl.SjlSet();
                }
                retVal = self._internal.htmlAttrib.rev;
            }
            else {
                self._internal.htmlAttrib.rev = rev;
            }
            return retVal;
        },
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