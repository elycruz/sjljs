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
            priorityList = new PriorityList(entries, true),
            iterator = priorityList.entries(),
            allEntries = entries.concat([]),
            reversedEntries = entries.concat([]).sort(function (a, b) {
                return a[0] < b[0];
            });

        it ('should return an iterator.', function () {
            expect(iterator).to.be.instanceOf(sjl.stdlib.Iterator);
        });

        it ('should have all values sorted when LIFO is true.', function () {
            while (iterator.valid()) {
                let value = iterator.next(),
                    originalEntry = reversedEntries[iterator.pointer - 1];
                console.log(value.value);
                expect(value.done).to.equal(false);
                expect(value.value[0]).to.equal(originalEntry[0]);
                expect(value.value[1].value).to.equal(originalEntry[1]);
            }
        });

        it ('should have all values sorted in reverse priority order when `LIFO` is `false`.', function () {
            while (iterator.valid()) {
                let value = iterator.next(),
                    originalEntry = allEntries[iterator.pointer - 1];
                expect(value.done).to.equal(false);
                expect(value.value[0]).to.equal(originalEntry[0]);
                expect(value.value[1]).to.equal(originalEntry[1]);
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
                expect(reversedEntries[indexCount][1]).to.equal(value.value);
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
                expect(reversedEntries[indexCount][1]).to.equal(value.value);
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
            expect(iterator).to.be.instanceOf(sjl.stdlib.Iterator);
        });

        it ('should return an iterator that contains all values in the expected order (FIFO by priority/serial).', function () {
            var index = 0,
                iterator = priorityList.values();
            while (iterator.valid()) {
                let value = iterator.next();
                expect(value.value.value).to.equal(entries[index][1]);
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
                let value = priorityList.next();
                expect(value.value.value).to.equal(reversedEntries[index][1]);
                index += 1;
            }
            console.log(reversedEntries);
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
                console.log(value.value);
                expect(value.value[0]).to.equal(expectedEntries[index][0]);
                expect(value.value[1].value).to.equal(expectedEntries[index][1]);
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
