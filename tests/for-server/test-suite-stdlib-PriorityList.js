/**
 * Created by elyde on 1/12/2016.
 * @todo add tests iterator methods
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

describe('PriorityList', function () {

    "use strict";

    var PriorityList = sjl.ns.stdlib.PriorityList;

    describe('#`PriorityList Methods Existence`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            priorityList = new PriorityList([]),
            methods = ['clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values', 'get', 'set',
                'next', 'current', 'valid', 'rewind', 'addFromArray', 'addFromObject'];
        it ('should have the following methods: [`' + methods.join('`, `') + '`]', function () {
            methods.forEach(function (method) {
                expect(typeof priorityList[method]).to.equal('function');
            });
        });
    });

    describe('#`PriorityList#clear`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            priorityList = new PriorityList(entries);

        it ('should return `self`.', function () {
            expect(priorityList.size).to.equal(entries.length);
            // Ensure `clear` returns `self`
            expect(priorityList.clear()).to.equal(priorityList);
        });
        it ('should set `size` to `0` as a side effect.', function () {
            // Validate size of set
            expect(priorityList.size).to.equal(0);
        });
    });

    describe('#`PriorityList#delete`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            keyEntryToDelete = 'b',
            keyEntryToDeleteValue = 1,
            mapFrom = [ ['a', 0], [keyEntryToDelete, keyEntryToDeleteValue], ['c', 3] ],
            priorityList = new PriorityList(mapFrom);

        it ('should delete unique key and return `self`.', function () {
            // Ensure has key entry to delete
            expect(priorityList.has(keyEntryToDelete)).to.equal(true);

            // Ensure method returns `self`
            expect(priorityList.delete(keyEntryToDelete)).to.equal(priorityList);

            // Ensure method deleted key entry
            expect(priorityList.has(keyEntryToDelete)).to.equal(false);
            expect(priorityList.itemsMap._values.some(function (item) {
                return item.value === keyEntryToDeleteValue;
            })).to.equal(false);
            expect(priorityList.itemsMap._keys.indexOf(keyEntryToDelete)).to.equal(-1);
        });

        it ('should set `size` to `size - 1` as a side effect.', function () {
            // Validate size of set
            expect(priorityList.size).to.equal(mapFrom.length - 1);
        });
    });

    describe('#`PriorityList#entries`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            priorityList = new PriorityList(entries),
            iterator = priorityList.entries(),
            reversedEntries = entries.concat([]).sort(function (a, b) {
                return a[0] < b[0];
            }),
            value;
        // Validate
        it ('should work as an iterator with included extra functions (`valid`).', function () {
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.done).to.equal(false);
                expect(value.value[0]).to.equal(reversedEntries[iterator.pointer() - 1][0]);
                expect(value.value[1]).to.equal(reversedEntries[iterator.pointer() - 1][1]);
            }
        });
    });

    describe('#`PriorityList#forEach`', function () {
        var entries = [['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            reversedEntries = entries.concat([]).sort(function (a, b) {
                return a[0] < b[0];
            }),
            priorityList = new PriorityList(entries, true),
            exampleContext = {someProperty: 'someValue'},
            indexCount = 0;

        it ('should work as expected when no context is passed in.', function () {
            // Validate `forEach` method works as expected
            priorityList.forEach(function (value, key) {
                expect(reversedEntries[indexCount][0]).to.equal(key);
                expect(reversedEntries[indexCount][1]).to.equal(value);
                expect(this).to.equal(undefined);
                indexCount += 1;
            });
        });

        it ('should work as expected when a context is passed in.', function () {
            // Reset index count
            indexCount = 0;

            // Validate `forEach` method works as expected
            priorityList.forEach(function (value, key) {
                expect(reversedEntries[indexCount][0]).to.equal(key);
                expect(reversedEntries[indexCount][1]).to.equal(value);
                expect(this).to.equal(exampleContext);
                indexCount += 1;
            }, exampleContext);
        });
    });

    describe('#`PriorityList#has`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            keyInMap = 'v5',
            keyNotInMap = 'v9',
            priorityList = new PriorityList(entries);
        it ('should return `false` for keys not in set.', function () {
            expect(priorityList.has(keyNotInMap)).to.equal(false);
        });
        it ('should return `true` for keys in set.', function () {
            expect(priorityList.has(keyInMap)).to.equal(true);
        });
    });

    describe('#`PriorityList#keys`', function () {
        it ('should return an iterable object.', function () {
            var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                    ['v4', 4], ['v5', 5], ['v6', 6],
                    ['v7', 5], ['v8', 4]],
                priorityList = new PriorityList(entries, false),
                iterator = priorityList.keys(),
                reversedEntries = entries.concat([]).sort(function (a, b) {
                    return a[0] < b[0];
                }),
                value,
                index = 0;
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value).to.equal(reversedEntries[index][0]);
                index += 1;
            }
        });
    });

    describe('#`PriorityList#values`', function () {
        it ('should return an iterable', function () {
            var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                    ['v4', 4], ['v5', 5], ['v6', 6],
                    ['v7', 5], ['v8', 4]],

                priorityList = new PriorityList(entries),
                reversedEntries = entries.concat([]).sort(function (a, b) {
                    return a[0] < b[0];
                }),
                iterator = priorityList.values(),
                value,
                index = 0;
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value).to.equal(reversedEntries[index][1]);
                index += 1;
            }
        });
    });

    describe('#`PriorityList#get`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            priorityList = new PriorityList(entries);
        it ('should return the correct value for a given key.', function () {
            expect(priorityList.get('v1')).to.equal(1);
        });
        it ('should return undefined for for a given non-existent key entry.', function () {
            expect(priorityList.get('v9')).to.equal(undefined);
        });
    });

    describe('#`PriorityList#set`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            priorityList = new PriorityList(entries);
        it ('should return `self` when setting a key-value pair.', function () {
            expect(priorityList.has('v9')).to.equal(false);
            expect(priorityList.set('v9')).to.equal(priorityList);
            expect(priorityList.has('v9')).to.equal(true);
        });
        it ('should return undefined for for a given non-existent key entry.', function () {
            expect(priorityList.get('v10')).to.equal(undefined);
        });
    });

    describe('#`PriorityList#addFromArray`', function () {
        it ('should import unique values from an array.', function () {
            var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                    ['v4', 4], ['v5', 5], ['v6', 6],
                    ['v7', 5], ['v8', 4]],
                otherEntries = [['v10', 7], ['v11', 8], ['v12', 9]],
                expectedEntries = entries.concat(otherEntries).sort(function (a, b) {
                    a = parseInt(a[0].split('v')[1], 10);
                    b = parseInt(b[0].split('v')[1], 10);
                    return a > b ? -1 : ((a === b) ? 0 : 1);
                }),
                priorityList = new PriorityList(entries, true),
                value,
                index = 0,
                iterator;
            priorityList.addFromArray(otherEntries);
            iterator = priorityList.entries();
            expect(priorityList.size).to.equal(expectedEntries.length);
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value[0]).to.equal(expectedEntries[index][0]);
                expect(value.value[1]).to.equal(expectedEntries[index][1]);
                index += 1;
            }
        });
    });

    describe('#`PriorityList#addFromObject`', function () {
        it ('Should be able to populate itself from a value of type `Object`.', function () {
            var object = {
                    all: {your: {base: {are: {belong: {to: {us: true}}}}}},
                    someBooleanValue: false,
                    someNumberValue: 100,
                    objectValue: {someKey: 'some value'},
                    functionValue: function HelloWorld() {},
                    someStringValue: 'string value here',
                    someNullValue: null
                },
                priorityList = new PriorityList(object);
            Object.keys(object).forEach(function (key) {
                expect(object[key]).to.equal(priorityList.get(key));
            });
        });

    });
});
