/**
 * Created by elydelacruz on 3/25/16.
 */


// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    var sjl = require('./../../src/sjl/sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('#defineSubClass', function () {
    'use strict';

    /**
     * Returns one array of all keys of objects passed in
     * @returns {Array<String>}
     */
    function concatKeys(/** ...objects **/) {
        return sjl.argsToArray(arguments).map(function (obj) {
                return Object.keys(obj);
            })
            .reduce(function (value1, value2) {
                return value1.concat(value2);
            });
    }

    var methods1 = {
            someMethod: function () {
                console.log('some method');
            }
        },
        statics1 = {
            someStaticProperty: 'some static property'
        },
        methods2 = {
            someOtherMethod: function () {
                console.log('some other method');
            }
        },
        statics2 = {
            someOtherStaticProperty: 'some other static property'
        },
        methods3 = {
            someOtherOtherMethod: function () {
                console.log('some other other method');
            }
        },
        statics3 = {
            someOtherOtherStaticProperty: 'some other other static property'
        };

    var Extendable = sjl.defineSubClass(Function, function Extendable() {}, methods1, statics1),
        SomeConstructor = sjl.defineSubClass(Extendable, function SomeConstructor() {}, methods2, statics2);

    it('should return a Constructor with all `statics` properties from parent.', function () {
        Object.keys(statics1).forEach(function (key) {
            expect(sjl.classOfIs(SomeConstructor[key], sjl.classOf(statics1[key]))).to.equal(true);
            expect(SomeConstructor[key]).to.equal(Extendable[key]);
        });
    });

    it('should return a Constructor with all `statics` passed in to inherit.', function () {
        Object.keys(statics2).forEach(function (key) {
            expect(sjl.classOfIs(SomeConstructor[key], sjl.classOf(statics2[key]))).to.equal(true);
            expect(SomeConstructor[key]).to.equal(statics2[key]);
        });
    });

    it('should return a Constructor with all `methods` from parent.', function () {
        Object.keys(methods1).forEach(function (key) {
            expect(SomeConstructor.prototype[key]).to.equal(Extendable.prototype[key]);
        });
    });

    it('should return a Constructor with all `methods` passed in to inherit.', function () {
        Object.keys(methods2).forEach(function (key) {
            expect(SomeConstructor.prototype[key]).to.equal(methods2[key]);
        });
    });

    it('should return a Constructor with a static `extend` method.', function () {
        expect(sjl.classOf(SomeConstructor.extend)).to.equal(Function.name);
    });

    describe('returned subclass via parent\'s static `extend` method', function () {

        // Subclass from extend method
        var SubClass = SomeConstructor.extend(function SubClass() {}, methods3, statics3);

        it('should have return subclass with statics of parent and those passed in to inherit', function () {
            var mergedProps = sjl.extend({}, statics1, statics2, statics3);
            concatKeys(statics1, statics2, statics3).forEach(function (key) {
                expect(sjl.classOfIs(SubClass[key], sjl.classOf(mergedProps[key]))).to.equal(true);
                expect(SubClass[key]).to.equal(mergedProps[key]);
            });
        });

        it('should return a subclass with methods of parent and those passed in to inherit.', function () {
            var mergedProps = sjl.extend({}, methods1, methods2, methods3);
            concatKeys(methods1, methods2, methods3).forEach(function (key) {
                expect(sjl.classOfIs(SubClass.prototype[key], Function)).to.equal(true);
                expect(SubClass.prototype[key]).to.equal(mergedProps[key]);
            });
        });

        it('should return a subclass with a static `extend` method.', function () {
            expect(sjl.classOf(SubClass.extend)).to.equal(Function.name);
        });
    });

    describe ('returned subclass via parent\'s `extend` method with constructor via `constructor` key', function () {

        // Subclass from extend method via with constructor via constructor key
        var SubClass = SomeConstructor.extend(sjl.extend({
                constructor: function SubClass() {}
            }, methods3), statics3);

        it('should have return subclass with statics of parent and those passed in to inherit', function () {
            var mergedProps = sjl.extend({}, statics1, statics2, statics3);
            concatKeys(statics1, statics2, statics3).forEach(function (key) {
                expect(sjl.classOfIs(SubClass[key], sjl.classOf(mergedProps[key]))).to.equal(true);
                expect(SubClass[key]).to.equal(mergedProps[key]);
            });
        });

        it('should return a subclass with methods of parent and those passed in to inherit.', function () {
            var mergedProps = sjl.extend({}, methods1, methods2, methods3);
            concatKeys(methods1, methods2, methods3).forEach(function (key) {
                expect(sjl.classOfIs(SubClass.prototype[key], Function)).to.equal(true);
                expect(SubClass.prototype[key]).to.equal(mergedProps[key]);
            });
        });

        it('should return a subclass with a static `extend` method.', function () {
            expect(sjl.classOf(SubClass.extend)).to.equal(Function.name);
        });
    });

});
