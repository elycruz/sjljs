/**
 * Created by Ely on 8/6/2015.
 */
// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    require('./../../sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('SjlMap', function () {

    "use strict";

    describe('#`SjlMap Methods Existence`', function () {
        var sjlMap = new sjl.SjlMap(),
            methods = ['clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values', 'get', 'set', 'addFromArray', 'iterator'];
        it ('should have the following methods: [`' + methods.join('`, `') + '`]', function () {
            methods.forEach(function (method) {
                expect(typeof sjlMap[method]).to.equal('function');
            });
        });
    });

    describe('#`SjlMap#clear`', function () {
        var mapFrom = [ ['a', 0], ['b', 1], ['c', 3] ],
            sjlMap = new sjl.SjlMap(mapFrom);

        it ('should return `self`.', function () {
            expect(sjlMap.size).to.equal(mapFrom.length);
            // Ensure `clear` returns `self`
            expect(sjlMap.clear()).to.equal(sjlMap);
        });
        it ('should set `size` to `0` as a side effect.', function () {
            // Validate size of set
            expect(sjlMap.size).to.equal(0);
        });
    });

    describe('#`SjlMap#delete`', function () {
        var keyEntryToDelete = 'b',
            keyEntryToDeleteValue = 1,
            mapFrom = [ ['a', 0], [keyEntryToDelete, keyEntryToDeleteValue], ['c', 3] ],
            sjlMap = new sjl.SjlMap(mapFrom);

        it ('should delete unique key and return `self`.', function () {
            // Ensure method returns `self`
            expect(sjlMap.delete(keyEntryToDelete)).to.equal(sjlMap);

            // Ensure method deleted key entry
            expect(sjlMap.has(keyEntryToDelete)).to.equal(false);
            expect(sjlMap._values.indexOf(keyEntryToDeleteValue)).to.equal(-1);
            expect(sjlMap._keys.indexOf(keyEntryToDelete)).to.equal(-1);
        });

        it ('should set `size` to `size - 1` as a side effect.', function () {
            // Validate size of set
            expect(sjlMap.size).to.equal(mapFrom.length - 1);
        });
    });

    describe('#`SjlMap#entries`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4] ],
            sjlMap = new sjl.SjlMap(entries),
            iterator = sjlMap.entries(),
            value;

        it ('should have an `entries` function.', function () {
            expect(typeof sjlMap.entries).to.equal('function');
        });

        // Validate
        it ('should work as an iterator with included extra functions (`valid`).', function () {
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.done).to.equal(false);
                expect(value.value[0]).to.equal(entries[iterator.pointer() - 1][0]);
                expect(value.value[1]).to.equal(entries[iterator.pointer() - 1][1]);
            }
        });
    });

    describe('#`SjlMap#forEach`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4] ],
            sjlMap = new sjl.SjlMap(entries),
            exampleContext = {someProperty: 'someValue'},
            indexCount = 0;

        it ('should work as expected when no context is passed in.', function () {
            // Validate `forEach` method works as expected
            sjlMap.forEach(function (key, value) {
                expect(entries[indexCount][0]).to.equal(key);
                expect(entries[indexCount][1]).to.equal(value);
                expect(this).to.equal(undefined);
                indexCount += 1;
            });
        });

        it ('should work as expected when a context is passed in.', function () {
            // Reset index count
            indexCount = 0;

            // Validate `forEach` method works as expected
            sjlMap.forEach(function (key, value) {
                expect(entries[indexCount][0]).to.equal(key);
                expect(entries[indexCount][1]).to.equal(value);
                expect(this).to.equal(exampleContext);
                indexCount += 1;
            }, exampleContext);
        });
    });

    describe('#`SjlMap#has`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
            ['v4', 4], ['v5', 5], ['v6', 6],
            ['v7', 5], ['v8', 4], [5, 'five']],
            keyInMap = 5,
            keyNotInMap = 8,
            sjlMap = new sjl.SjlMap(entries);

        it ('should return `false` for keys not in set.', function () {
            expect(sjlMap.has(keyNotInMap)).to.equal(false);
        });

        it ('should return `true` for keys in set.', function () {
            expect(sjlMap.has(keyInMap)).to.equal(true);
        });
    });

    describe('#`SjlMap#keys`', function () {
        it ('should return an iterable object.', function () {
            var  entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                    ['v4', 4], ['v5', 5], ['v6', 6],
                    ['v7', 5], ['v8', 4], [5, 'five']],
                sjlMap = new sjl.SjlMap(entries),
                iterator = sjlMap.keys(),
                value,
                index = 0;
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value).to.equal(entries[index][0]);
                index += 1;
            }
        });
    });

    describe('#`SjlMap#values`', function () { });
    describe('#`SjlMap#get`', function () { });
    describe('#`SjlMap#set`', function () { });
    describe('#`SjlMap#addFromArray`', function () { });
    describe('#`SjlMap#iterator`', function () { });

});