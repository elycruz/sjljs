/**
 * Created by Ely on 12/17/2014.
 */
describe('sjl.stdlib.Config', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var exampleObj = {
        'Null': null,
        'Array': ['hello-world'],
        'String': 'helloworld',
        'Function': function () {},
        'Object': {all: {your: {base: 'are.belong.to.us'}}},
        'Boolean': false
    },
        exampleObj2 = {
            eightiesSaying: {all: {your: {base: {are: {belong: {to: {us: 'All your base are belong to us'}}}}}}}
        },
        exampleObjKeys = Object.keys(exampleObj),
        exampleObj2Keys = Object.keys(exampleObj2),
        Config = sjl.ns.stdlib.Config;

    it ('should be an instance of `sjl.stdlib.Extendable`.', function () {
        expect(new Config()).to.be.instanceof(sjl.ns.stdlib.Extendable);
    });

    it ('should be able to set multiple properties from one object passed int to constructor.', function () {
        var config = new Config(exampleObj);
        exampleObjKeys.forEach(function (key) {
            expect(config[key]).to.equal(exampleObj[key]);
        });
    });

    it ('should be able to set multiple properties via multiple objects passed in via the constructor.', function () {
        var config = new Config(exampleObj, exampleObj2);
        exampleObjKeys.forEach(function (key) {
            expect(config[key]).to.equal(exampleObj[key]);
        });
        exampleObj2Keys.forEach(function (key) {
            expect(config[key]).to.equal(exampleObj2[key]);
        });
    });

    describe ('#set', function () {

        it ('should be able to set multiple properties from one object passed in and should return self when doing so.', function () {
            var config = new Config(),
                result = config.set(exampleObj);
            expect(result).to.equal(config);
            exampleObjKeys.forEach(function (key) {
                expect(config[key]).to.equal(exampleObj[key]);
            });
        });

        it ('should be able to set multiple properties via multiple objects passed in and should return self when doing so.', function () {
            var config = new Config(),
                result = config.set(exampleObj, exampleObj2);
            expect(result).to.equal(config);
            exampleObjKeys.forEach(function (key) {
                expect(config[key]).to.equal(exampleObj[key]);
            });
            exampleObj2Keys.forEach(function (key) {
                expect(config[key]).to.equal(exampleObj2[key]);
            });
        });

        it ('should be able to set one property via "key" and "value" parameters and return self when doing so.', function () {
            var config = new Config(),
                result = config.set('hello', 'world');
            expect(result).to.equal(config);
            expect(config.hello).to.equal('world');
        });

        it ('should be able to set a property via namespace string and value parameter and return itself after doing so.', function () {
            var config = new Config(exampleObj),
                result;
            expect(config.all).to.equal(exampleObj.all);
            result = config.set('all.your.base', exampleObj2.eightiesSaying.all.your.base);
            expect(result.all.your.base).to.equal(exampleObj2.eightiesSaying.all.your.base);
        });

        it ('should do nothing and return itself when no params are passed in.', function () {
            var config = new Config();
            expect(config.set()).to.equal(config);
            expect(Object.keys(config).length).to.equal(0);
        });

        it ('should throw a type error when param `0` is neither of type `String` or of type `Object`.', function () {
            var caughtError;
            try {
                (new Config()).set(function () {}, null);
            }
            catch (e) {
                caughtError = e;
            }
            try {
                (new Config()).set(['hello'], null);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    });

    describe ('#get', function () {

        it ('should be able to get a value by key.', function () {
            var config = new Config(exampleObj);
            exampleObjKeys.forEach(function (key) {
                expect(config.get(key)).to.equal(exampleObj[key]);
            });
        });

        it ('should be able to get a value by namespace key.', function () {
            expect((new Config(exampleObj)).get('Object.all.your.base')).to.equal(exampleObj.Object.all.your.base);
        });

        it ('should throw a type error when passed in key is not a string.', function () {
            var config = new Config(),
                caughtError;
            try {
                config.get(['hello']);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
            try {
                config.get(function () {});
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
            try {
                config.get();
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    });

    describe ('#has', function () {

        it ('should return true if config has a key with a value other than `null` or `undefined`.', function () {
            var config = new Config(exampleObj);
            exampleObjKeys.filter(function (key) {
                return sjl.isset(exampleObj[key]);
            }).forEach(function (key) {
                expect(config.has(key)).to.be.true();
            });
        });

        it ('should return false if config doesn\'t have a key or key value is `null`.', function () {
            var config = new Config(exampleObj2);
            exampleObjKeys.filter(function (key) {
                return sjl.isset(exampleObj[key]);
            }).forEach(function (key) {
                expect(config.has(key)).to.be.false();
            });
        });

        it ('should throw a type error when passed in key is not a string.', function () {
            var config = new Config(),
                caughtError;
            try {
                config.has(['hello']);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
            try {
                config.has(function () {});
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
            try {
                config.has();
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    });

}); // end of Test Suite
