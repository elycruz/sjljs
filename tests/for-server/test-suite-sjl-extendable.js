(function () {

// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    require('./../../sjl.js');
}

var expect = chai.expect;

describe('Sjl Extendable', function () {

    "use strict";

    it ('should create an extendable class', function () {
        var extendable = new sjl.Extendable();
        expect(extendable instanceof sjl.Extendable).to.equal(true);
    });

    it ('should have an `extend` function', function () {
        var extendable = new sjl.Extendable();
        expect(typeof extendable.extend).to.equal('function');
    });

    it ('should be extendable', function () {
        // sjl.Iterator extends sjl.Extendable
        var iterator = new sjl.Iterator();
        expect(iterator instanceof sjl.Iterator).to.equal(true);
    });

    it ('it\'s extended family should be extendable', function () {
        // New Iterator
        var NewIterator = sjl.Iterator.extend(function NewIterator() {}, {somemethod: function () {}});
        var newIterator = new NewIterator();

        // New New Iterator
        var NewNewIterator = NewIterator.extend(function NewNewIterator() {}, {somemethod: function () {}});
        var newNewIterator = new NewNewIterator();

        // Test new classes
        expect(newIterator instanceof NewIterator).to.equal(true);
        expect(newNewIterator instanceof NewNewIterator).to.equal(true);
    });

});

});
