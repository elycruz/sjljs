/**
 * Created by Ely on 8/6/2015.
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

describe('SjlMap', function () {

    "use strict";

    var SjlMap = sjl.ns.stdlib.SjlMap;

    describe('#`SjlMap Methods Existence`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
            ['v4', 4], ['v5', 5], ['v6', 6],
            ['v7', 5], ['v8', 4]],
            sjlMap = new SjlMap([]),
            methods = ['clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values', 'get', 'set', 'addFromArray', 'iterator'];
        it ('should have the following methods: [`' + methods.join('`, `') + '`]', function () {
            methods.forEach(function (method) {
                expect(typeof sjlMap[method]).to.equal('function');
            });
        });
    });

    describe('#`SjlMap#clear`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
            ['v4', 4], ['v5', 5], ['v6', 6],
            ['v7', 5], ['v8', 4]],
            sjlMap = new SjlMap(entries);

        it ('should return `self`.', function () {
            expect(sjlMap.size).to.equal(entries.length);
            // Ensure `clear` returns `self`
            expect(sjlMap.clear()).to.equal(sjlMap);
        });
        it ('should set `size` to `0` as a side effect.', function () {
            // Validate size of set
            expect(sjlMap.size).to.equal(0);
        });
    });

    describe('#`SjlMap#delete`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            keyEntryToDelete = 'b',
            keyEntryToDeleteValue = 1,
            mapFrom = [ ['a', 0], [keyEntryToDelete, keyEntryToDeleteValue], ['c', 3] ],
            sjlMap = new SjlMap(mapFrom);

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
                ['v7', 5], ['v8', 4]],
            sjlMap = new SjlMap(entries),
            iterator = sjlMap.entries(),
            value;

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
                ['v7', 5], ['v8', 4]],
            sjlMap = new SjlMap(entries),
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
                ['v7', 5], ['v8', 4]],
            keyInMap = 'v5',
            keyNotInMap = 'v9',
            sjlMap = new SjlMap(entries);
        it ('should return `false` for keys not in set.', function () {
            expect(sjlMap.has(keyNotInMap)).to.equal(false);
        });
        it ('should return `true` for keys in set.', function () {
            expect(sjlMap.has(keyInMap)).to.equal(true);
        });
    });

    describe('#`SjlMap#keys`', function () {
        it ('should return an iterable object.', function () {
            var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                    ['v4', 4], ['v5', 5], ['v6', 6],
                    ['v7', 5], ['v8', 4]],
                sjlMap = new SjlMap(entries),
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

    describe('#`SjlMap#values`', function () {
        it ('should return an iterable', function () {
            var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                    ['v4', 4], ['v5', 5], ['v6', 6],
                    ['v7', 5], ['v8', 4]],
                sjlMap = new SjlMap(entries),
                iterator = sjlMap.values(),
                value,
                index = 0;
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value).to.equal(entries[index][1]);
                index += 1;
            }
        });
    });

    describe('#`SjlMap#get`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
            ['v4', 4], ['v5', 5], ['v6', 6],
            ['v7', 5], ['v8', 4]],
            sjlMap = new SjlMap(entries);
        it ('should return the correct value for a given key.', function () {
            expect(sjlMap.get('v1')).to.equal(1);
        });

        it ('should return undefined for for a given non-existent key entry.', function () {
            expect(sjlMap.get('v9')).to.equal(undefined);
        });
    });

    describe('#`SjlMap#set`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
            ['v4', 4], ['v5', 5], ['v6', 6],
            ['v7', 5], ['v8', 4]],
            sjlMap = new SjlMap(entries);
        it ('should return `self` when setting a key-value pair.', function () {
            expect(sjlMap.has('v9')).to.equal(false);
            expect(sjlMap.set('v9')).to.equal(sjlMap);
            expect(sjlMap.has('v9')).to.equal(true);
        });

        it ('should return undefined for for a given non-existent key entry.', function () {
            expect(sjlMap.get('v10')).to.equal(undefined);
        });
    });

    describe('#`SjlMap#addFromArray`', function () {
        it ('should import unique values from an array.', function () {
            var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                    ['v4', 4], ['v5', 5], ['v6', 6],
                    ['v7', 5], ['v8', 4]],
                otherEntries = [['v10', 7], ['v11', 8], ['v12', 9]],
                expectedEntries = entries.concat(otherEntries),
                sjlMap = new SjlMap(entries),
                value,
                index = 0,
                iterator;
            //console.log(sjlMap.iterator());
            sjlMap.addFromArray(otherEntries);
            iterator = sjlMap.entries();
            expect(sjlMap.size).to.equal(expectedEntries.length);
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value[0]).to.equal(expectedEntries[index][0]);
                expect(value.value[1]).to.equal(expectedEntries[index][1]);
                index += 1;
            }
        });
    });

    describe('#`SjlMap#iterator`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            sjlMap = new SjlMap(entries),
            iterator = sjlMap.iterator(),
            value;

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

});
