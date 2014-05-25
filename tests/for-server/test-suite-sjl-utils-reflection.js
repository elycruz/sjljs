// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    require('./../../sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl Reflection', function () {

    "use strict";

    describe('#`classOf`', function () {
        var valueMap = {
            'Array': [[], new Array()],
            'Boolean': [true, false],
            'Function': [function () {}, new Function()],
            'Null': null,
            'Number': [1, 0, -1, 12e+3],
            'Object': [{}, new Object()],
            'String': [new String('ola'), 'hello'],
            'Undefined': undefined
        };

        Object.keys(valueMap).forEach(function (x) {
            it('should return "' + x + '"', function () {
                var val = valueMap[x];

                // Loop through array of values and test each one with value
                // from value map
                if (Array.isArray(val)) {
                    val.forEach(function (y) {
                        expect(sjl.classOf(y)).to.equal(x);
                    });
                }
                else {
                    expect(sjl.classOf(val)).to.equal(x);
                }
            });
        });
    });

    describe('#`classOfIs`', function () {

        // Eval keys and pass them in for tests
        var dataTypeClassStrings = {
            "([])":         sjl.classOf( []        ),
            "(true)":       sjl.classOf( true      ),
            "(1)":          sjl.classOf( 1         ),
            "({})":         sjl.classOf( {}        ),
            "('')":         sjl.classOf( ''        ),
            "(null)":       sjl.classOf( null      ),
            "(undefined)":  sjl.classOf( undefined ),
            "(function hello () {})":   sjl.classOf( (function hello() {}) )
        };

        Object.keys(dataTypeClassStrings).forEach(function (x) {
            it('should return true for alias "' +
                dataTypeClassStrings[x] +
                '" when checking "' + x +'"', function () {
                expect(

                    sjl.classOfIs(eval(x), sjl.classOf(eval(x)))

                ).to.equal(true);
            });
        });

    });

});
