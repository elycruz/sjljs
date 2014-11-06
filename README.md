[![Build Status](https://travis-ci.org/elycruz/sjljs.png)](https://travis-ci.org/elycruz/sjljs) [![GitHub version](https://badge.fury.io/gh/elycruz%2Fsjljs.svg)](http://badge.fury.io/gh/elycruz%2Fsjljs) 
[![NPM version](https://badge.fury.io/js/sjljs.svg)](http://badge.fury.io/js/sjljs)
[![Dependencies](https://david-dm.org/elycruz/sjljs.png)](https://david-dm.org/elycruz/sjljs)
sjljs
=====

A Simple Javascript Library.

Not meant to replace popular libraries (Backbone, Underscore, Jquery etc.)
only meant as a supplement to them.

## Components included:

### Utilities:
- `sjl.argsToArray` - Converts arguments to an array.
- `sjl.camelCase` - Camel Cases a string.
- `sjl.classOf` - Gives you a String representation of the class of value;  e.g., `classOf("hello") === 'String'`.
- `sjl.classOfIs` - Checks that whether a value is of class type;  e.g., `clasOfIs(0, 'Number') === true`.
- `sjl.empty` - Opinionated `empty` check.  Checks if `false`, `0`, `null`, `undefined`, empty array, or empty object is true for one or one of many values.
- `sjl.extractBoolFromArrayEnd` - Extracts a boolean from the end of an array.  If no boolean is found there returns a boolean of value `false`.
- `sjl.extractBoolFromArrayStart` - Extracts a boolean from the beginning of an array.  If no boolean is found at the beginning of the array returns a boolean of value `false`.
- `sjl.isset` - Checks to see that a value(s) is not `null` or `undefined` for one or one of many values.
- `sjl.lcaseFirst` - Lowercases the first character of a string.
- `sjl.namespace` - For getting and setting values on hash objects (allows deep searching by namespace string (`'all.your.base'` finds or sets `{all: {your: {base: ...}}}`).
- `sjl.ucaseFirst` - Uppercases the first character of a string.

### Set functions (operations on objects):
- `getValueFromObj` - 
- `setValueOnObj` - 
- `extend` - 

### OOP Util functions:
- `copyOfProto` - 
- `defineSubClass` - 
- `throwNotOfTypeError` - 

### Shims:
- `Function.prototype.extend` - Defines this method on `Function.prototype` only if it is not already
defined; Proxy for `sjl.defineSubClass`.

### Tests:
- Tests for all components listed under "Utilities" above.
- Tests to run on server.
- Tests to run in browser (requires running `bower install` in root directory).

#### Composition helpers:
- `sjl.getValueFromObj` - Allows getting value by namespace string (ex: `'some.object.deep'`) 
also if value is a function automatically calls it and allows you to pass args to use with value if it is 
a function also allows for fetching the value raw if it s a function.
- `sjl.setValueOnObj` - Allows setting a value on an object by namespace string or conjoined setter 
function (setPropertyName) or sets value directly if no setter or namespace string found/used.

#### Classes/Constructors
- `sjl.Attributable` - A base attributable constructor which has one method attr (for setting and getting 
multiple attributes).
- `sjl.Extendable` - A base extendable constructor with an `extend`.
- `sjl.Iterator` - A simple iterator constructor which mimicks the es6 iterator (partially) and other 
iterator's from other languages (mainly the php `Iterator`) closely.

### Requirements:
- Javascript versions ecmascript 3+

### Supported browsers:
- ie8+, and all other browsers

## Todos:
- [ ] - Write tests for `sjl.Attributable`.
- [ ] - Write tests for `sjl.getValueFromObj`
- [ ] - Write tests for `sjl.setValueOnObj`
- [ ] - Write tests for `sjl.extend`'s new features

## License:
[GPL v2-3+](http://www.gnu.org/licenses/gpl-2.0.html "http://www.gnu.org/licenses/gpl-2.0.html") & [MIT](http://opensource.org/licenses/MIT "http://opensource.org/licenses/MIT")
