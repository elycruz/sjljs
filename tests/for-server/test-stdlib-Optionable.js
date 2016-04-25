/**
 * Created by Ely on 12/17/2014.
 */
describe('Sjl Optionable', function () {

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
        Optionable = sjl.stdlib.Optionable;

    it ('should be an instance of `sjl.stdlib.Extendable`.', function () {
        expect(new sjl.stdlib.Optionable()).to.be.instanceof(sjl.stdlib.Extendable);
    });

    it ('should be able to set multiple properties from one object passed int to constructor.', function () {
        var optionable = new Optionable(exampleObj),
            options = optionable.getStoreHash();
        exampleObjKeys.forEach(function (key) {
            expect(options[key]).to.equal(exampleObj[key]);
        });
    });

    it ('should be able to set multiple properties via multiple objects passed in via the constructor.', function () {
        var optionable = new Optionable(exampleObj, exampleObj2),
            options = optionable.getStoreHash();
        exampleObjKeys.forEach(function (key) {
            expect(options[key]).to.equal(exampleObj[key]);
        });
        exampleObj2Keys.forEach(function (key) {
            expect(options[key]).to.equal(exampleObj2[key]);
        });
    });

    describe ('#set', function () {

        it ('should be able to set multiple properties from one object passed in and should return self when doing so.', function () {
            var optionable = new Optionable(),
                result = optionable.set(exampleObj);
            expect(result).to.equal(optionable);
            exampleObjKeys.forEach(function (key) {
                expect(optionable.getStoreHash()[key]).to.equal(exampleObj[key]);
            });
        });

        it ('should be able to set multiple properties via multiple objects passed in and should return self when doing so.', function () {
            var optionable = new Optionable(),
                result = optionable.set(exampleObj, exampleObj2),
                resultOptions = result.getStoreHash();
            expect(result).to.equal(optionable);
            exampleObjKeys.forEach(function (key) {
                expect(resultOptions[key]).to.equal(exampleObj[key]);
            });
            exampleObj2Keys.forEach(function (key) {
                expect(resultOptions[key]).to.equal(exampleObj2[key]);
            });
        });

        it ('should be able to set one property via "key" and "value" parameters and return self when doing so.', function () {
            var optionable = new Optionable(),
                result = optionable.set('hello', 'world'),
                resultOptions = result.getStoreHash();
            expect(result).to.equal(optionable);
            expect(resultOptions.hello).to.equal('world');
        });

        it ('should be able to set a property via namespace string and value parameter and return itself after doing so.', function () {
            var optionable = new Optionable(exampleObj),
                result,
                resultOptions;
            expect(optionable.all).to.equal(exampleObj.all);
            result = optionable.set('all.your.base', exampleObj2.eightiesSaying.all.your.base);
            resultOptions = result.getStoreHash();
            expect(resultOptions.all.your.base).to.equal(exampleObj2.eightiesSaying.all.your.base);
        });

        it ('should do nothing and return itself when no params are passed in.', function () {
            var optionable = new Optionable();
            expect(optionable.set()).to.equal(optionable);
            expect(Object.keys(optionable.getStoreHash()).length).to.equal(0);
        });

        it ('should throw a type error when param `0` is neither of type `String` or of type `Object`.', function () {
            var caughtError;
            try {
                (new Optionable()).set(function () {}, null);
            }
            catch (e) {
                caughtError = e;
            }
            try {
                (new Optionable()).set(['hello'], null);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    });

    describe ('#get', function () {

        it ('should be able to get a value by key.', function () {
            var optionable = new Optionable(exampleObj);
            exampleObjKeys.forEach(function (key) {
                expect(optionable.get(key)).to.equal(exampleObj[key]);
            });
        });

        it ('should be able to get a value by namespace key.', function () {
            expect((new Optionable(exampleObj)).get('Object.all.your.base')).to.equal(exampleObj.Object.all.your.base);
        });

        it ('should throw a type error when passed in key is not a string.', function () {
            var optionable = new Optionable(),
                caughtError;
            try {
                optionable.get(['hello']);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
            try {
                optionable.get(function () {});
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
            try {
                optionable.get();
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    });

    describe ('#has', function () {

        it ('should return true if optionable has a key with a value other than `null` or `undefined`.', function () {
            var optionable = new Optionable(exampleObj);
            exampleObjKeys.filter(function (key) {
                return sjl.isset(exampleObj[key]);
            }).forEach(function (key) {
                expect(optionable.has(key)).to.be.true();
            });
        });

        it ('should return false if optionable doesn\'t have a key or key value is `null`.', function () {
            var optionable = new Optionable(exampleObj2);
            exampleObjKeys.filter(function (key) {
                return sjl.isset(exampleObj[key]);
            }).forEach(function (key) {
                expect(optionable.has(key)).to.be.false();
            });
        });

        it ('should throw a type error when passed in key is not a string.', function () {
            var optionable = new Optionable(),
                caughtError;
            try {
                optionable.has(['hello']);
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
            try {
                optionable.has(function () {});
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
            try {
                optionable.has();
            }
            catch (e) {
                caughtError = e;
            }
            expect(caughtError).to.be.instanceof(TypeError);
        });

    });

    describe ('#getStoreHash', function () {
        it ('should be a method.', function () {
            var optionable = new Optionable();
            expect(optionable.getStoreHash).to.be.instanceof(Function);
        });
        it ('should return the options store which should be an instance of `sjl.stdlib.Config`.', function () {
            var optionable = new Optionable();
            expect(optionable.getStoreHash).to.be.instanceof(Function);
            expect(optionable.getStoreHash()).to.be.instanceof(sjl.stdlib.Config);
        });
    });

}); // end of Test Suite
