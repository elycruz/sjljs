// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    require('./../../sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe ('Sjl String', function () {

    'use strict';

    var funcToCaseAndResultMap = {
            lcaseFirst: {
                'LOWER-CASE-FIRST-':        'lOWER-CASE-FIRST-',
                '-LOWER-CASE-FIRST-':       '-lOWER-CASE-FIRST-',
                '->%^&*LOWER-CASE-FIRST':   '->%^&*lOWER-CASE-FIRST'
            },
            ucaseFirst: {
                'upper-case-first': 'Upper-case-first',
                '-upper-case-first': '-Upper-case-first',
                '-!@#$%^upper-case-first': '-!@#$%^Upper-case-first'
            },
            camelCase: {
                'to-camel-case1': 'toCamelCase1',
                '-to-camel-case-2': 'toCamelCase2',
                '-!@#$%^to-^&*camel)(*|}{-case$3#@!': 'toCamelCase3',
                'to-class-case1': 'ToClassCase1',
                '-to-class-case-2': 'ToClassCase2',
                '-!@#$%^to-^&*class)(*|}{-case$3#@!': 'ToClassCase3'
            }
    };

    describe('#`lcaseFirst`', function () {
        var map = funcToCaseAndResultMap.lcaseFirst;
        Object.keys(map).forEach(function (key) {
            it('should convert "' + key + '" ~~ to ~~ "' + map[key] + '"', function () {
                expect(sjl.lcaseFirst(key)).to.equal(map[key]);
            });
        });
    });

    describe('#`ucaseFirst`', function () {
        var map = funcToCaseAndResultMap.ucaseFirst;
        Object.keys(map).forEach(function (key) {
            it('should convert "' + key + '" ~~ to ~~ "' + map[key] + '"', function () {
                expect(sjl.ucaseFirst(key)).to.equal(map[key]);
            });
        });
    });

    describe('#`camelCase`', function () {
        var map = funcToCaseAndResultMap.camelCase;
        Object.keys(map).forEach(function (key) {
            it('should convert "' + key + '" ~~ to ~~ "' + map[key] + '"', function () {
                if (key.toLowerCase().indexOf('class') !== -1) {
                    expect(sjl.camelCase(key, true)).to.equal(map[key]);
                }
                else {
                    expect(sjl.camelCase(key)).to.equal(map[key]);
                }
            });
        });
    });

});