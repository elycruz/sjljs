/**
 * Created by elyde on 11/19/2016.
 */

describe ('sjl.classOf', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    let path = require('path'),
        chai = require('chai'),
        sjl = require('../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    // Do not run these tests for the browser
    if (!sjl.isNodeEnv) {
        return;
    }

    let Namespace = sjl.ns.nodejs.Namespace,
        ns = new Namespace(path.join(__dirname, './../../src'));

    it ('should generate a namespace object that has the contents of the "./src/version.js" file.', function () {
        if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'dev') {
            console.log('---------------- From Tests ------------------');
            console.log('Generated Namespace Obj: ', ns);
            console.log('----------------------------------------------');
            console.log('\n');
        }
        expect(ns.version === sjl.version).to.equal(true);
    });

});
