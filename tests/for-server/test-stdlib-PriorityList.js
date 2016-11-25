/**
 * Created by elyde on 1/12/2016.
 * @todo add tests iterator methods
 */

describe('sjl.stdlib.PriorityList', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var PriorityList = sjl.ns.stdlib.PriorityList;

    function priorityListEntriesObjValues (startIndice, numObjs) {
        var out = [];
        for (var i = startIndice; i < numObjs; i += 1) {
            out.push([
                'item' + i,
                {randomNumber: Math.round(Math.random() * numObjs)}
            ]);
        }
        return out;
    }

    describe('#`PriorityList Methods Existence`', function () {
            var priorityList = new PriorityList(),
            methods = ['clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values', 'get', 'set',
                'next', 'current', 'valid', 'rewind', 'addFromArray', 'addFromObject'];
        it ('should have the following methods: [`' + methods.join('`, `') + '`]', function () {
            methods.forEach(function (method) {
                expect(typeof priorityList[method]).to.equal('function');
            });
        });
    });

    describe('#`PriorityList#current', function () {
        var entries = priorityListEntriesObjValues(0, 8),
            priorityList = new PriorityList(entries);
        it ('should return the item at internal `pointer` position when `wrapItems` is false.', function () {
            var currentItem = entries[0][1];
            expect(priorityList.pointer).to.equal(0);
            expect(priorityList.current().value).to.equal(currentItem);
        });
    });
    describe('#`PriorityList#next', function () {
        var entries = priorityListEntriesObjValues(0, 8),
            priorityList = new PriorityList(entries);
        it ('should return the next item in the list starting with the first item.', function () {
            expect(priorityList.pointer).to.equal(0);
            expect(priorityList.next().value).to.equal(entries[0][1]);
            expect(priorityList.next().value).to.equal(entries[1][1]);
            expect(priorityList.next().value).to.equal(entries[2][1]);
        });
    });

    describe('#`PriorityList#rewind', function () {
        var entries = priorityListEntriesObjValues(0, 8),
            priorityList = new PriorityList(entries),
            listEnd = entries.length - 1;
        priorityList.pointer = listEnd;
        it ('should return self and set pointer to `0`.', function () {
            expect(priorityList.pointer).to.equal(listEnd);
            expect(priorityList.rewind()).to.equal(priorityList);
            expect(priorityList.pointer).to.equal(0);
        });
    });

    describe('#`PriorityList#valid', function () {
        var entries = priorityListEntriesObjValues(0, 8),
            priorityList = new PriorityList(entries);
        it ('should return the true while pointer is not at end of list.', function () {
            expect(priorityList.pointer).to.equal(0);
            expect(priorityList.valid()).to.equal(true);
        });
        it ('should return false when pointer is at end of list.', function () {
            priorityList.pointer = entries.length;
            expect(priorityList.pointer).to.equal(entries.length);
            expect(priorityList.valid()).to.equal(false);
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
        it ('should return `0` from `size` as a side effect.', function () {
            // Validate size of set
            expect(priorityList.size).to.equal(0);
        });
    });

    describe('#`PriorityList#delete`', function () {
        var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                ['v4', 4], ['v5', 5], ['v6', 6],
                ['v7', 5], ['v8', 4]],
            keyEntryToDelete = 'b',
            keyEntryToDeleteValue = Math.random() * 1000 + 500,
            mapFrom = [ ['a', 0], [keyEntryToDelete, keyEntryToDeleteValue], ['c', 3] ].concat(entries),
            priorityList = new PriorityList(mapFrom);

        it ('should delete unique key and return `self`.', function () {
            // Ensure has key entry to delete
            expect(priorityList.has(keyEntryToDelete)).to.equal(true);

            // Ensure method returns `self`
            expect(priorityList.delete(keyEntryToDelete)).to.equal(priorityList);

            // Ensure method deleted key entry
            expect(priorityList.has(keyEntryToDelete)).to.equal(false);
            expect(priorityList._values.some(function (item) {
                return item.value === keyEntryToDeleteValue;
            })).to.equal(false);
            expect(priorityList._keys.indexOf(keyEntryToDelete)).to.equal(-1);
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
            allEntries = entries.concat([]),
            reversedEntries = entries.concat([]).sort(function (a, b) {
                return a[0] < b[0];
            });

        it ('should return an iterator.', function () {
            var priorityList = new PriorityList(entries, true),
                iterator = priorityList.entries();
                expect(iterator).to.be.instanceOf(sjl.ns.stdlib.Iterator);
        });

        it ('should have all values sorted when LIFO is true.', function () {
            var priorityList = new PriorityList(entries, true),
                iterator = priorityList.entries();
            while (iterator.valid()) {
                var value = iterator.next(),
                    originalEntry = reversedEntries[iterator.pointer - 1];
                expect(value.done).to.equal(false);
                expect(value.value[0]).to.equal(originalEntry[0]);
                expect(value.value[1]).to.equal(originalEntry[1]);
            }
        });

        it ('should have all values sorted in reverse priority order when `LIFO` is `false`.', function () {
            var priorityList = new PriorityList(entries, false),
                iterator = priorityList.entries();
            while (iterator.valid()) {
                var value = iterator.next(),
                    originalEntry = allEntries[iterator.pointer - 1];
                expect(value.done).to.equal(false);
                expect(value.value[0]).to.equal(originalEntry[0]);
                expect(value.value[1]).to.equal(originalEntry[1]);
            }
        });
    });

    describe('#`PriorityList#forEach`', function () {
        var entries = [
                ['v1', {valor: 1}],
                ['v2', {valor: 2}],
                ['v3', {valor: 3}],
                ['v4', {valor: 4}],
                ['v5', {valor: 5}],
                ['v6', {valor: 6}],
                ['v7', {valor: 7}],
                ['v8', {valor: 8}],
            ],
            reversedEntries = entries.concat([]).sort(function (a, b) {
                return a[0] < b[0];
            }),
            priorityList = new PriorityList(entries, true, false),
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
                priorityList = new PriorityList(entries),
                iterator = priorityList.keys(),
                reversedEntries = entries.concat([]).sort(function (a, b) {
                    return a[0] > b[0];
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
            var entries = [ ['v1', 1], ['v2', 2], ['v3', 3],
                    ['v4', 4], ['v5', 5], ['v6', 6],
                    ['v7', 5], ['v8', 4]],

                priorityList = new PriorityList(entries);

        it ('should return an iterable', function () {
            var iterator = priorityList.values();
            expect(iterator).to.be.instanceOf(sjl.ns.stdlib.Iterator);
        });

        it ('should return an iterator that contains all values in the expected order (FIFO by priority/serial).', function () {
            var index = 0,
                iterator = priorityList.values();
            while (iterator.valid()) {
                var value = iterator.next();
                expect(value.value).to.equal(entries[index][1]);
                index += 1;
            }
        });

        it ('should return an iterator that contains all values in the expected order (FIFO by priority/serial).', function () {
            priorityList.LIFO = true;
            var index = 0,
                reversedEntries = entries.sort(function (a, b) {
                    return a[0] > b[0];
                });
            while (priorityList.valid()) {
                var value = priorityList.next();
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
                expectedEntries = entries.concat(otherEntries).reverse(),
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
