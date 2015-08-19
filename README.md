[![Build Status](https://travis-ci.org/elycruz/sjljs.png)](https://travis-ci.org/elycruz/sjljs) 
[![GitHub version](https://badge.fury.io/gh/elycruz%2Fsjljs.svg)](http://badge.fury.io/gh/elycruz%2Fsjljs) 
[![NPM version](https://badge.fury.io/js/sjljs.svg)](http://badge.fury.io/js/sjljs)
[![Dependencies](https://david-dm.org/elycruz/sjljs.png)](https://david-dm.org/elycruz/sjljs)
sjljs
=====

A library for building applications and building libraries from the ground up. 

Not meant to replace popular libraries (Backbone, Underscore, Jquery etc.)
only meant as a supplement to them.

## Sections in Readme:
- [Components Included](#components-included)
- [Tests](#tests)
- [Requirements](#requirements)
- [Supported Browsers](#supported-browsers)
- [Todos](#todos)
- [Notes](#notes)
- [License](#license)
- [Changelogs](#changelogs)

## Components included:
- [Classes/Constructors](#classesconstructors)
- [Utilities](#utilities)
- [Set Functions](#set-functions)
- [OOP Util Functions](#oop-util-functions)
- [Composition Helpers](#composition-helpers)

### Classes/Constructors

##### sjl.Attributable(attributes {Object|undefined}) :sjl.Attributable
A base attributable constructor which has two methods `attr` and `attrs` (for setting and getting multiple attributes 
jquery style).

##### sjl.Iterator(values {Array|undefined}, pointer {Number|undefined}) :sjl.Iterator (@deprecated)
A simple iterator constructor which mimicks the es6 iterator and the php `Iterator` class.
Can be called as a method and acts as a factory method in this case.

##### sjl.Extendable(constructor {String|Function}, methods {Object|undefined}, statics {Object|undefined}) :sjl.Extendable
A base extendable constructor with a static `extend` method that allows you to easily extend constructors; E.g.,

```
// SomeConstructor.js
// Using node, requirejs, browserify or some other AMD/UMD helper (here we'll use nodejs)

// Make `SomeConstructor` extendable
module.exports = sjl.Extendable.extend(function SomeConstructor () {}, {
     someMethod: function () {
         // Do something here
     }
 },
 {
     someStaticMethod: function () {
         // Do something here
     }
 });


// SomeSuperOtherConstructor.js

// Bring in 'SomeOtherConstructor'
var SomeOtherConstructor = require('SomeOtherConstructor');

// Inherits statics and prototype of SomeOtherConstructor and 
// is also extendable via the static method `extend` 
module.exports = SomeOtherConstructor.extend(function SomeSuperOtherConstructor () {
        SomeOtherConstructor.apply(this, arguments);
    }, {
        // methods
    });
```

##### sjl.Optionable(...obj {Object|undefined}) :sjl.Optionable
A simple Optionable class with `set`, `get`, `merge`, and `has` methods meant to be similiar to Backbone's Model constructor
but with some enhanced methods on it and without the ajax stuff (barebones object).

###### has (value {String}) :Boolean
Takes a regular string or a namespaced string to find out if value exists on the Optionable's object `options` object.

###### get (key {String}) :{null|*}
Takes a regular string or a namespaced one ('hello.world.some.key') and pulls out the value from Optionable's `options` object.
  Returns null if `key` cannot be found on Optionable.
 
###### set (key {String}, value {*}) :Optionable
Takes a key and a value param or an object (sets multiple key value pairs in this case).  
Key value can be a namespaced string.  Also if first value is an object then set uses `sjl.setValueOnObj` 
(see description of this method above) to set values on this Optionable.
    
###### merge (obj {Object}, ...obj {Object|undefined}, useLegacySetterAndGetters {Boolean|undefined}) :Optionable
Merges all `Object`s passed into it to Optionable's `options` object recursively (deeply).  If last param in arguments is a Boolean
    then checks, extracts this boolean and passes it on to `sjl.extend` (in an attempt to invoke `extend`'s 
    useLegacyGettersAndSetters` feature if the boolean is true and not invoke the feature to do the merge if the
     boolean is false).

### Utilities:

##### sjl.argsToArray(arguments {Arguments}) :Array
Converts arguments to an array;  E.g., 
`sjl.argsToArray(arguments);` -> returns arguments as an array.

##### sjl.restArgs(arguments {Arguments}, start {Number|undefined}, end {Number|undefined}) :Array
Returns the rest of the arguments from the given `start` to `end` (optional) positions, E.g.,
```
function someFunction (arg1, arg2, arg3) {
    var otherArgs = sjl.restArgs(arguments, 2); // Will give us everything after `arg2`
}

// This function will call will give us the array ['value3', 'value4', 'value5'] within `otherArgs`
someFunction ('value1', 'value2', 'valu3', 'value4', 'value5'); 
```

##### sjl.hasMethod (obj, methodName) :Boolean
Checks whether an `obj` has the given method/function defined on it.  E.g.,
```
var obj = {hello: function () {}, someNonFunctionValueKey: 'hello world'};
sjl.hasMethod(obj, 'hello');  // true.  Found key is of type 'Function'.
sjl.hasMethod(obj, 'someNonFunctionValueKey');  // false.  Found key is not of type 'Function'.
sjl.hasMethod(obj, 'someNonExistentMethod');    // false.
```

##### sjl.camelCase(str {String}, ucaseFirst {Boolean|undefined}) :String
Camel Cases a string;  
`sjl.camelCase('hello-world', boolean);` -> returns "helloWorld" if `boolean` is `false`
 else returns "HelloWorld" if `boolean` is `true`

##### sjl.classOf(obj {*}) :String
Gives you a String representation of the class of value;  E.g., 
```
sjl.classOf("hello") === 'String' // true
sjl.classOf(new Map()) === 'Map'  // true
// etc.
```

##### sjl.classOfIs(obj {*}, ...classTypeStr {String}) :Boolean
Checks whether `obj` is of one of the `classTypeStr`'s passed in;  E.g., 
```
sjl.classOfIs(0, 'String', 'Number') // true.  Matches 'Number'.
sjl.classOfIs([], 'Array') === true  // true
sjl.classOfIs([], 'Number', 'Array') // true.  Matches 'Array'.
```

##### sjl.empty(...value {*}) :Boolean
Opinionated `empty` check.  Checks if `false`, `0`, `null`, `undefined`, empty array, or empty object is true for one
 or one of many values.
```
sjl.empty(false); // true
sjl.empty(true);  // false
sjl.empty(0, false, null, undefined, [], {});    // true
sjl.empty(1, true, {prop: 'value'}, ['value']);  // false
```

##### sjl.extractBoolFromArrayEnd(list {Array}) :Boolean
Pops a boolean off of the end of an array and returns it.  
If no boolean is found there returns `false`.

##### sjl.extractBoolFromArrayStart(list {Array}) :Boolean
Shifts a boolean off of the beginning of an array and returns it.  
If no boolean is found at there returns `false`.

##### sjl.isset(...value {*}) :Boolean
Checks for a value that is not `null` or `undefined` and returns true if it finds one.  Works for one or one of many values.
```
sjl.isset(someUndefinedValue)           // false.  Value is not set.
sjl.isset(null, someUndefinedValue)     // false.  None of the values is set.
sjl.isset(null, 1, someUndefinedValue)  // true.   '1' is a non empty value.
```

##### sjl.issetAndOfType(value {*}, type {String|Array<String>}, ...type {String}) :Boolean
Checks to see if a value is set and is of given type(s).  E.g.,
```
sjl.issetAndOfType(someFunctionValue, 'Function')   // true.  Value is set and is of type of function.
sjl.issetAndOfType(someUndefinedValue, 'Function')  // false.  Value is not set.
sjl.issetAndOfType(someNumberValue, 'Function', 'String', 'Number')  // true.  Matches type 'Number'.
sjl.issetAndOfType(someNumberValue, ['String', 'Number', 'Function']) // true.  Matches type 'Number'.
```

##### sjl.issetObjKey (obj {*}, key {String}) :Boolean
Checks whether an object has own `key` and whether the value of found `key` is not `undefined` or not `null`.
```
var someObj = {hello: 'world', myNameIs: null};
// Check keys on `someObj`
sjl.issetObjKey(someObj, 'hello')       // true.  Key is set and not null or undefined.
sjl.issetObjKey(someObj, 'myNameIs')    // false.  Key exists on object but is null.
sjl.issetObjKey(someObj, 'nonExistentProperty')    // false.  Key does not exists on object.
```

##### issetObjKeyAndOfType (obj {*}, key {String}, ...type {String}) :Boolean
Does the same thing as `sjl.issetObjKey` but also checks if the found `key` matches one of the passed in types.
```
var someObj = {someNum: 100, someNullValue: null, someStringValue: 'hello world'};
// Check keys on `someObj`
sjl.issetObjKeyAndOfType(someObj, 'someNum', 'String', 'Number')  // true.  Key is set and matches the type 'Number'.
sjl.issetObjKey(someObj, 'someNullValue', 'String', 'Array')      // false.  Key exists on object but is null.
sjl.issetObjKey(someObj, 'nonExistentProperty')                   // false.  Key does not exists on object.
```

##### sjl.lcaseFirst(str {String}) :String
Lowercases the first character of a string;  E.g., 
`sjl.lcaseFirst ('Hello')` returns 'hello'.

##### sjl.namespace(key {String}, objToSearch {Object}, valueToSet {*|undefined}) :objToSearch
For getting and setting values on hash objects (allows deep searching by namespace string (`'all.your.base'`
 finds or sets `{all: {your: {base: ...}}}`).

##### sjl.isEmptyObjKey(obj {Object}, key {String}, ...type {String|undefined}) :Boolean
Does everything `sjl.issetObjKey` does.  In addition checks whether `obj[key]`'s value is empty ([0, null, undefined, [], {}, false]) or not.
and whether `obj[key]` is of one of the class strings passed in (`...type`).
```
sjl.isEmptyObjKey({hello: 'world'}, 'hello');   // false
sjl.isEmptyObjKey({hello: 100}, 'hello');       // false
sjl.isEmptyObjKey({hello: 'world'}, 'hello', 'Number');  // true 
sjl.isEmptyObjKey({hello: 'world'}, 'hello', 'Number', 'String');  // false 
```
**Note** - The use of checking types a in this method will be removed in the next major release of the library.
For checking whther a key on an object is empty and is of type use `sjl.isEmptyObjKeyAndOfType` instead.

##### sjl.isEmptyObjKeyOrNotOfType(obj {Object}, key {String}, ...type {String|undefined}) :Boolean
Does everything `sjl.issetObjKey` does.  In addition checks whether `obj[key]`'s value is empty ([0, null, undefined, [], {}, false]) or not.
and whether `obj[key]` is of one of the class strings passed in (`...type`).
```
sjl.isEmptyObjKeyOrNotOfType({hello: 'world'}, 'hello');   // false.  Found key is not empty.
sjl.isEmptyObjKeyOrNotOfType({hello: 100}, 'hello');       // false.  Found key is not empty.
sjl.isEmptyObjKeyOrNotOfType({hello: 'world'}, 'hello', 'Number');            // true.  Found key is not empty but is not of given type(s). 
sjl.isEmptyObjKeyOrNotOfType({hello: 'world'}, 'hello', 'Number', 'String');  // false.  Found key is not empty and is of given type.
```

##### sjl.jsonClone (obj {*}) :*
Clones an object using the JSON object.  E.g.,
```
// Does this `JSON.parse(JSON.stringify(obj));`

var obj = {hello: 'ola', world: 'mundo'};
sjl.jsonClone(obj); // Returns an object with the same properties as `obj` but the object is completely unique
```

##### sjl.clone (obj {*}) :*
Returns a new object with the properties from `obj`.

##### sjl.ucaseFirst(str {String}) :String
Uppercases the first character of a string;  E.g., `sjl.ucaseFirst('hello');`  returns 'Hello'.

### Set Functions:

##### sjl.extend(obj {Object|Boolean}, ...obj {Object|undefined}, useLegacyGettersAndSetters {Boolean|undefined}) : Object
Similiar to JQuery's `extend` method except with the following method signature: 
`extend((Boolean|*)[,obj, obj],[Boolean]) : Object`
- If the first param is a Boolean then the `deep` option is set (extends first object found from passed in params (arguments[1]) deeply)
- Where `*` is any type of object with type "Object".
- `obj` is any type of object of type "Object".
- and the last `[Boolean]` (optional boolean) is passed in to force
the extend method to use any composite styled set and get methods that may be available
for the key being merged on to the first object;  composite styled = `set{keyName}` | `setKeyName` or also
if `keyName` is a function on the object to extend then it gets called as a setter if `extend`'s last param is a Boolean.

This last item in the list above allows for interesting objects which inherit a waterfall
like property on instantiation (if you use the `extend` method to merge passed in options from within the constructor).

### OOP Util functions:

##### sjl.copyOfProto(prototype {Prototype|Object}) :Object|Prototype
Creates a copy of a prototype (backward compatible to older IEs).

##### sjl.defineSubClass(superclass {Function}, constructor {Function}, methods {Object}, statics {Object}) :Function
Creates a sub class of a constructor and makes it extendable via the static method `extend`;  E.g., pretty much 
creates `sjl.Extendable`.

##### sjl.throwNotOfTypeError(value {*}, paramName {String}, funcName {String}, expectedType {String}) :Void 
This method is used internally but is tentative and may be removed later.

#### Composition helpers:

##### sjl.getValueFromObj (key {String}, obj {Object}, args {*|undefined}, raw {Boolean|undefined}) :*
Allows getting value by namespace string (ex: `'some.object.deep'`) also if return value is a function automatically 
calls it and allows you to pass args to use with it also allows for fetching the function raw if `raw` is `true`.

##### sjl.setValueOnObj (key {String}, value {*}, obj {Object}) :{Object|*}
Allows setting a value on an object by namespace string or conjoined setter function (setPropertyName) or sets value 
directly if no setter or namespace string found/used.

### Tests:
- Tests for all components listed under "Utilities" above.
- Tests to be run on server.  See './tests/for-server'.
- Tests to be run in browser (requires running `bower install` in root directory).
See './tests/for-browser'.

## Requirements:
- Javascript versions ecmascript 3+

## Supported browsers:
- ie8+, and all other browsers

## Todos:

### MVP Todos:
- [X] - Write tests for:
    - [X] - `sjl.Optionable`.
    - [X] - `sjl.Attributable`.
    - [X] - `sjl.getValueFromObj`
    - [X] - `sjl.setValueOnObj`
    - [X] - `sjl.extend` (for new features)
    - [X] - `sjl.Iterator`

### Mvp for 0.4.9:
- [X] - Write tests for:
    - [X] - `sjl.issetAndOfType`
    - [X] - `sjl.issetObjKeyAndOfType`
    - [X] - `sjl.isEmptyObjKey`
    - [X] - `sjl.isEmptyObjKeyAndOfType`
    - [X] - `sjl.hasMethod`
    - [X] - ~~`sjl.hasGetterMethod`~~ Method has been replaced with `sjl.hasMethod`.
    - [X] - ~~`sjl.hasSetterMethod`~~ Method has been removed with `sjl.hasMethod`.
- [X] - Write doc sections in main readme for:
    - [X] - `sjl.issetAndOfType`
    - [X] - `sjl.issetObjKeyAndOfType`
    - [X] - `sjl.isEmptyObjKeyAndOfType`
    - [X] - `sjl.hasMethod`
    - [X] - ~~`sjl.hasGetterMethod`~~ Method has been removed.
    - [X] - ~~`sjl.hasSetterMethod`~~ Method has been removed.
- [X] - ~~Change `sjl.empty` to `sjl.isEmpty` (maybe for version 0.5.0)~~ Moved to version 0.5.0.
- [X] - ~~Change `sjl.getValueOnObj`'s `raw` param to have a default `true` (needs to be set to true by default cause
 right now it is not apparent to people that this is the default behaviour).~~  Moved to version 0.5.0.

### MVP for 0.5.0:
- [ ] - Write docs for all validator classes.
- [ ] - Write tests for:
    - [X] - `sjl.SjlMap`.
    - [X] - `sjl.SjlSet`.
    - [ ] - `sjl.package`
    - [ ] - Write tests for all validator classes:
        - [ ] - `sjl.NumberValidator`.
        - [ ] - `sjl.AlphaNumValidator`.
- [ ] - Write a filter chain class.
- [ ] - Change interface check to check for 'isValid' and 'message'
    properties on a 'AbstractValidator' class passed to a 'ValidatorChain' class.
- [ ] - Review entirety of library and look fgit or places that could be refactored.
- [ ] - Refactor the `input` package
- [ ] - Refactor the `validator` package
- [ ] - `sjl.empty` to `sjl.isEmpty` (maybe for version 0.5.0).
- [ ] - Change `sjl.getValueOnObj`'s `raw` param to have a default `true` (needs to be set to true by default cause
 right now it is not apparent to people that this is the default behaviour).
- [ ] - Remove `attrs` method from `sjl.Attributable`.
- [X] - Update readme to a more readable format.
- [X] - Optimize for file size (maybe put context.sjl into a variable so it can be further minified).
- [X] - Changelog.
- [ ] - Change the library from being a global for nodejs to being an exported package.
- [ ] - Set all components (constructors) of sjl to be exported when being used in nodejs.
- [ ] - Support for AMD if it is available when used on the frontend.
- [ ] - Remove use of eval option for `defineSubClass` (now `defineClass`).
- [ ] - Create docs for `sjl.package`.
- [ ] - Shim `sjl.forEach` and `sjl.indexOf`.
- [ ] - Make `sjl.package` work using node (dynamically load class in for every requested namespace/class 
instead of requiring global require).

### MVP for 0.5.1+
- [X] - Add changelog.md in main readme.

## License:
[GPL v2-3+](http://www.gnu.org/licenses/gpl-2.0.html "http://www.gnu.org/licenses/gpl-2.0.html") &
[MIT](http://opensource.org/licenses/MIT "http://opensource.org/licenses/MIT")

## Changelog

### Changelog for 04/23/2015:
- Updated tests for `sjl.PostCodeValidator`.

### Changelog for 05/29/2015:
- Updated main readme.md format.
- Removed notices from main readme.md.
- Added changelog task to gulpfile.
- Added jsdoc task to gulpfile.
- Updated commenting in ./src/**/*.js to use jsdoc3.
- Generated documentation using jsdoc.

### Changelog for 06/12/2015:
- Finished test for new version of `sjl.classOfIs`.
- Updated bower.json to include mocha (so we don't include node_modules/mocha/mocha.css for browser tests).
- Removed if statements before static function declarations on `sjl`.
- Added some new methods.
    - `sjl.issetAndOfType`
    - `sjl.issetObjKeyAndOfType`
    - `sjl.isEmptyObjKeyOrNotOfType`
    - `sjl.hasMethod`
    - `sjl.hasGetterMethod`
    - `sjl.hasSetterMethod`
- Started using new methods within sjl-util-* and main classes directly within ./src/sjl.
- Updated todos in main readme.
- Rebuilt jsdocs and readme.

### Changelog for 06/15/2015:
- Updated `sjl.getValueFromObj` to use legacy getter and/or overloaded getter methods if they are available (when searching on `obj`).
- Rebuilt jsdocs, changelog, readme.

### Changelog for 07/01/2015:
- Rebuilt jsdocs (they weren't rebuilt in last couple of commits).
- Updated ./README.md with details about recently added methods.
- Rebuilt sjl artifacts.
- Updated gulpfile to have a more robust 'watch' task.
- Added 'changelog' as a separate task in gulpfile.
- Added commenting to gulpfile (since the code there is growing).
- Updated gulpfile tasks dependencies for 'readme' task.

### Changelog for 07/16/2015:
- Updated jsdoc section in sjl-util-functions.js.
- Added filtering for 'for in' loops in sjl-util*.js.
- Simplified complex if checks in sjl-util*.js.
- Updated readme-fragment.md to reflect changes.
- Marked sjl.Iterator and sjl.iterator as deprecated.
- Rebuilt jsdocs.
- Rebuilt README.md.

### Changelog for 07/16/2015:
- Removed deprecation tag for sjl.Iterator.
- Added sjl.SjlSet (a more robust `Set` object for special cases). 
- Rebuilt jsdocs.
- Rebuilt README.md.

### Changelog for 08/16/2015:
- Added `sjl.package` method/function.
- Added `sjl.SjlMap`, `sjl.SjlSet` and their tests (several commits back).
- Added some scaffolding for 'sjl/mvc/router' and added scaffolding for 'sjl/navigation'.
- Rebuilt jsdocs.
- Rebuilt README.md.
