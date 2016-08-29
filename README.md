[![Build Status](https://travis-ci.org/elycruz/sjljs.png)](https://travis-ci.org/elycruz/sjljs) 
[![GitHub version](https://badge.fury.io/gh/elycruz%2Fsjljs.svg)](http://badge.fury.io/gh/elycruz%2Fsjljs) 
[![NPM version](https://badge.fury.io/js/sjljs.svg)](http://badge.fury.io/js/sjljs)
[![Dependencies](https://david-dm.org/elycruz/sjljs.png)](https://david-dm.org/elycruz/sjljs)
sjljs
=====

A library for writing strongly typed javascript and solid classical oop.  Also for making your applications, components,
and libraries more concise. 

Not meant to replace popular libraries like Backbone, Underscore, or Jquery etc..  Only meant as a supplement to them 
or as a supplement to applications requiring quick ramp up.

### Jsdocs
Api for current version:

- [6.1.x] (http://sjljs.elycruz.com/6.1.x/jsdocs)

#### Docs for previous versions:
- [6.0.x (under construction)] (http://sjljs.elycruz.com/6.0.x/jsdocs)
- [5.6.34 (view readme in branch)] (https://github.com/elycruz/sjljs/tree/5.6.0-alpha)
- [5.0.x (view readme in branch)] (https://github.com/elycruz/sjljs/tree/5.0.XX)
- [0.5.x (view readme in branch)] (https://github.com/elycruz/sjljs/tree/0.5.x)

## Sections in Readme:
- [Getting Started](#getting-started)
- [Unit Tests](#unit-tests)
- [Requirements](#requirements)
- [Supported Platforms](#supported-platforms)
- [Todos](#todos)
- [License](#license)

## Getting Started:
Include either the full library './sjl[.min].js' or the minimal version './sjl-minimal[.min].js' (the minimal version
only includes the core and no classes or constructors from it's other packages).

## Unit Tests:
To run unit tests:

1.)  First do an `npm install` in project root.

2.)  For running tests with node:
Run one of the following from your terminal:
 - `$ gulp tests`, 
 - `$ mocha tests/for-server`, or 
 - `$ npm tests` 
 
3.)  For running tests in the browser:
- Launch './tests/for-browser/index.html'
- **Note** `npm install` has to be run prior to running the aforementioned file.
- **Alternately** You can check the tests for this version of the library here:
[6.1.x] (http://sjljs.elycruz.com/6.1.x/tests/for-browser)
[6.0.x] (http://sjljs.elycruz.com/6.0.x/tests/for-browser)
[5.6.34] (http://sjljs.elycruz.com/5.6.34/tests/for-browser)
[5.6.0] (http://sjljs.elycruz.com/5.6.0/tests/for-browser)
[0.5.18] (http://sjljs.elycruz.com/0.5.18/tests/for-browser)
[0.5.17] (http://sjljs.elycruz.com/0.5.17/tests/for-browser)
[0.5.15] (http://sjljs.elycruz.com/0.5.15/tests/for-browser)

## Requirements:
- Javascript versions ecmascript 5+

## Supported Platforms:

### Browsers
- IE9+, and all other modern day browsers.

### NodeJs
- 4.0.0+

## Todos:
### MVP for 6.1.0
- [X] - ~~@todo Include all sub items for components included as sub nav in readme.~~ All docs will now be included in api docs
instead (generated with jsdocs).
- [X] - @todo Cleanup all jsdocs and ensure all library members are listed there and showing their docs properly/clearly.
- [ ] - @todo Ensure all existing constructors and library members have a test file for theirselves.

## License:
[GPL v2+](http://www.gnu.org/licenses/gpl-2.0.html "http://www.gnu.org/licenses/gpl-2.0.html") AND
[MIT](http://opensource.org/licenses/MIT "http://opensource.org/licenses/MIT")
