/**
 * Created by Ely on 4/21/2014.
 */
var chai = require('chai'),
    expect = chai.expect;

require('./../sjl.js');

describe ('Sjl String', function () {

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
        it('should convert first character of a string to lower case', function () {

        });
    });

    describe('#`ucaseFirst`', function () {
        it('should convert first character of a string to upper case', function () {

        });
    });

    describe('#`camelCase`', function () {
        it('should convert a string to camel case with a lower case first character', function () {

        });

        it('should convert a string to camel case with an upper case first character', function () {

        });
    });

});