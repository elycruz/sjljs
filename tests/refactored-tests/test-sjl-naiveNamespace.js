/**
 * Created by elydelacruz on 4/16/16.
 */
// ~~~ STRIP ~~~
// This part gets stripped out when
// generating browser version of test(s).
var chai = require('chai'),
    sjl = require('./../../src/sjl'),
    expect = chai.expect;
// ~~~ /STRIP ~~~
describe('#sjl.naiveNamespace', function () {
    var argsForTests = [
        [{
            all: {your: {base: {are: {belong: {to: {us: false}}}}}},
            arrayProp1: [],
            arrayProp2: ["how are you"],
            booleanProp: true,
            functionProp: function () {},
            numberProp: 99,
            objectProp: {},
            stringProp: "Hello World"
        }]
    ],
    subject = argsForTests[0][0];

    it ('should be able to fetch any nested value within a nested object.', function () {
        expect(sjl.naiveNamespace('all', subject)).to.equal(subject.all);
        expect(sjl.naiveNamespace('all.your', subject)).to.equal(subject.all.your);
        expect(sjl.naiveNamespace('all.your.base', subject)).to.equal(subject.all.your.base);
    });

    it ('should be able to set a value within nested object.', function () {
        var replacementValue = 'are belong to us',
            oldValue = subject.all.your.base,
            result = sjl.naiveNamespace('all.your.base', subject, replacementValue),
            result2;

        // Replace value
        expect(subject.all.your.base).to.equal(replacementValue);

        // Re inject old value
        result2 = sjl.naiveNamespace('all.your.base', subject, oldValue);
        expect(subject.all.your.base).to.equal(oldValue);
    });

    it ('should be able to set a value on object.', function () {
        var replacementValue = 'your base are belong to us',
            oldValue = subject.all,
            result = sjl.naiveNamespace('all', subject, replacementValue),
            result2;

        // Replace value
        expect(subject.all).to.equal(replacementValue);

        // Re inject old value
        result2 = sjl.naiveNamespace('all', subject, oldValue);
        expect(subject.all).to.equal(oldValue);
    });

    it ('should throw a type error when second parameter isn\'t an object or an instance of `Function`.', function () {
        var caughtError;
        try {
            sjl.naiveNamespace('all', 99);
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

    it ('should throw a type error when no params are passed in.', function () {
        var caughtError;
        try {
            sjl.naiveNamespace();
        }
        catch (e) {
            caughtError = e;
        }
        expect(caughtError).to.be.instanceof(TypeError);
    });

});
