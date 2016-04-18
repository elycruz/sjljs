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
describe('#sjl.unset', function () {
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

    it ('should remove a property from an object.', function () {
        var helloWorld = {name: 'hello-world-object', message: 'hello-world'};
        expect(sjl.unset(helloWorld, 'message').hasOwnProperty('message')).to.be.false();
    });

    it ('should return true when the removal of the passed in proeprty was successful.', function () {
        var helloWorld = {name: 'hello-world-object', message: 'hello-world'};
        expect(sjl.unset(helloWorld, 'message')).to.be.true();
    });

});
