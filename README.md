[![Build Status](https://travis-ci.org/elycruz/sjljs.png)](https://travis-ci.org/elycruz/sjljs) 
[![GitHub version](https://badge.fury.io/gh/elycruz%2Fsjljs.svg)](http://badge.fury.io/gh/elycruz%2Fsjljs) 
[![NPM version](https://badge.fury.io/js/sjljs.svg)](http://badge.fury.io/js/sjljs)
[![Dependencies](https://david-dm.org/elycruz/sjljs.png)](https://david-dm.org/elycruz/sjljs)
sjljs
=====

A library for building applications and building libraries from the ground up. 

Not meant to replace popular libraries (Backbone, Underscore, Jquery etc.)
only meant as a supplement to them.

**Note** 
~~Version 0.5+ removes some backward compatibility.  Namely 
all classes that were included on `sjl` before our now included 
via a `sjl.package` and it's alias `sjl.ns`;  E.g.,
`sjl.Extendable` is now accessible via `sjl.ns.stdlib.Extendable`
 Also all classes that were available in the root level are 
now available in the `sjl.ns.stdlib` package.  Also all `sjl.ns.stdlib` classes can also be found at `sjl.{className}` 
(only when used in browser, for nodejs old functionality remains the same and the only option 
for dynamically loaded classes).~~
Classes on `sjl.ns.stdlib.*` are now also available on `sjl.*` on both nodejs and in browsers!

See release notes for release 0.5.0.

## Sections in Readme:
- [Getting Started](#getting-started)
- [Components Included](#components-included)
- [Tests](#tests)
- [Requirements](#requirements)
- [Supported Browsers](#supported-browsers)
- [Todos](#todos)
- [Notes](#notes)
- [License](#license)
- [Changelogs](#changelogs)

## Getting Started:
Include either the full library './sjl[.min].js' or the minimal version './sjl-minimal[.min].js' (the minimal version
only includes the core and no classes or constructors from it's other packages).

## Components included:
- [Classes/Constructors](#classesconstructors)
- [Utilities](#utilities)
- [Set Functions](#set-functions)
- [OOP Util Functions](#oop-util-functions)
- [Composition Helpers](#composition-helpers)

### Classes/Constructors

##### sjl.Attributable(attributes {Object|undefined}) :sjl.ns.stdlib.Attributable
A base attributable constructor which has two methods `attr` and `attrs`
(for setting and getting multiple attributes jquery style).
Class also available at **`sjl.ns.stdlib.Attributable`**.

##### sjl.Iterator(values {Array<*>|undefined}, pointer {Number|undefined}) :sjl.ns.stdlib.Iterator
A simple iterator constructor which implements the es6 iterator and
the php `Iterator` classes.
Class also available at **`sjl.ns.stdlib.Iterator`**.

##### sjl.ObjectIterator(object {Object}, pointer {Number|undefined}) :sjl.ns.stdlib.ObjectIterator
One of two constructors calls available for `ObjectIterator`.
See next section for description object and alternate constructor call.
Class also available at **`sjl.ns.stdlib.ObjectIterator`**.

##### sjl.ObjectIterator(keys{Array<*>, values {Array<*>|undefined}, pointer {Number|undefined}) :sjl.ns.stdlib.ObjectIterator
An object iterator;  Iterates similarly to Iterator but takes a set of
keys and values on construction. Implements the es6 iterator and the php
`Iterator` classes.
Class also available at **`sjl.ns.stdlib.ObjectIterator`**.

##### sjl.Extendable(constructor {String|Function}, methods {Object|undefined}, statics {Object|undefined}) :sjl.Extendable
A base extendable constructor with a static `extend` method that allows
 you to easily extend constructors/classes; E.g.,

```
// SomeConstructor.js
// Using node, requirejs, browserify or some 
// other AMD/UMD helper (here we'll use nodejs)

var SomeConstructor = function SomeConstructor () {};

// Make `SomeConstructor` extendable
module.exports = sjl.ns.stdlib.Extendable.extend(SomeConstructor, {
     someMethod: function () {
         // Do something here
     }
 },
 {
     someStaticMethod: function () {
         // Do something here
     }
 });

// SomeOtherSubClass.js

// Bring in 'SomeOtherConstructor'
var SomeOtherConstructor = require('SomeOtherConstructor'),
    SomeOtherSubClass = function SomeOtherSubClass () {
        SomeOtherConstructor.apply(this, arguments);
    };

// Inherits statics and prototype of SomeOtherConstructor and 
// is also extendable via the static method `extend` 
module.exports = SomeOtherConstructor.extend(SomeOtherSubClass, {
        // methods
    });
```

Class also available at **`sjl.ns.stdlib.Extendable`**.

##### sjl.SjlSet(Array<*>) :sjl.ns.stdlib.SjlSet
A set object that acts just like the es6 `Set` object with two additional convenience methods.
- `addFromArray(Array<*>) :sjl.ns.stdlib.SjlSet`
- `iterator() :iterable`

Class also available at **`sjl.ns.stdlib.SjlSet`**.

##### sjl.SjlMap(Array<Array>) :sjl.ns.stdlib.SjlMap
A map that acts just like the es6 `Map` object with two additional convenience methods:
- `addFromArray(Array<*>) :sjl.ns.stdlib.SjlMap`
- `iterator() :iterable`

Class also available at **`sjl.ns.stdlib.SjlMap`**.

##### sjl.Optionable(...obj {Object|undefined}) :sjl.Optionable
A simple Optionable class with `set`, `get`, `merge`, and `has` methods meant to be similiar to Backbone's Model constructor
but with some enhanced methods on it and without the ajax stuff (barebones object).
Class also available at **`sjl.ns.stdlib.Optionable`**.

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
    // Will give us everything after `arg2`
    var otherArgs = sjl.restArgs(arguments, 2);
}

// This function will call will give us the array
// ['value3', 'value4', 'value5'] within `otherArgs`
someFunction ('value1', 'value2', 'valu3', 'value4', 'value5'); 
```

##### sjl.hasMethod (method) :Boolean
~~This function has been removed in sjljs-0.5.7.
Use `sjl.issetAndOfType(obj[method], Function)` instead.~~
This functions been re-added officially as of sjljs-0.5.31.

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

##### sjl.classOfIs(obj {*}, classTypeStrOrConstructor {String|Function}) :Boolean
Checks whether `obj` is of `classTypeStrOrConstructor` or Constructor passed in;  E.g.,
```
sjl.classOfIs(0, 'Number') // true.  Matches 'Number'.
sjl.classOfIs([], Array) === true  // true (checks passed in constructors `name` property) 
sjl.classOfIs([], 'Array') // true.  Matches 'Array'.
sjl.classOfIs([], Array) // true.  Matches 'Array' (checks passed in constructors `name` property).
```

##### sjl.empty(value {*}) :Boolean
Opinionated `empty` check.  Checks if `false`, `0`, `null`, `undefined`,
empty array, or empty object is true for passed in object (singular) (this method doesn't handle multiple object checking
anymore and will have a sibling function take careof that instead in later release (candidate method name `sjl.emptyMulti`)).
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

##### sjl.isset(value {*}) :Boolean
Checks to see if value is not `null` or `undefined` and returns a boolean on whether the value is set or not.
```
// Note `someUndefinedValue` must be declared somewhere (E.g., as a function parameter etc.) or you'll
// get a javascript error for trying to access a doubly undefined and undeclared variable.
// You're allowed to check for undefined properties on objects via `sjl.isset` because objects
// are passed in by reference and you can check for properties on them via `typeof` without causing
// any javascript errors but when checking for a local variable that exists on it's own you will get a javascript
// for trying to access an undefined property.

function hello (someUndefinedValue) {
    return sjl.isset(someUndefinedValue);
}

hello(); // returns `false`

sjl.isset(null) // false.  `null` is not a set value.

// `Error` is thrown before `sjl.isset` recieves the `helloWorld` variable because
// `helloWorld` isn't declared anywhere.
sjl.isset(helloWorld);

```

##### sjl.issetAndOfType(value {*}, type {String|Function}) :Boolean
Checks to see if a value is set and is of given type name or constructor.  
**Note** This method does not check whether value is an instance of a subclass of `type` instead it checks that it is of type `type`.
E.g.,
```
sjl.issetAndOfType(someFunctionValue, 'Function')
// true.  Value is set and is of type of function.
 
sjl.issetAndOfType(someUndefinedValue, 'Function')
// false.  Value is not set.

sjl.issetAndOfType(someNumberValue, 'Number')
// true.  Matches type 'Number'.

sjl.issetAndOfType(someNumberValue, 'Number'])
// true.  Matches type 'Number'.
```

##### sjl.unset (key {String}, value {*}): Boolean
Sets and object's `key` to `null` then removes references to it if possible (calls `delete` on property).
```
var object = {g: 'hello'};
sjl.unset(object, 'g');

console.log(object.g);  // `undefined`
console.log(object.hasOwnProperty('g')); // `false`
```

##### sjl.lcaseFirst(str {String}) :String
Lowercases the first character of a string;  E.g., 
`sjl.lcaseFirst ('Hello')` returns 'hello'.

##### sjl.namespace(key {String}, objToSearch {Object}, valueToSet {*|undefined}) :objToSearch
For getting and setting values on hash objects (allows deep searching by namespace string (`'all.your.base'`
 finds or sets `{all: {your: {base: ...}}}`).

##### ~~sjl.isEmptyObjKey(obj {Object}, key {String}, type {String|undefined}) :Boolean~~
This method has been removed as of sjljs-0.5.7.

##### sjl.isEmptyOrNotOfType(value{*}, type {String|Function|undefined}) :Boolean

```
sjl.isEmptyNotOfType(({hello: 'world'}).hello);
// false.  Found key is not empty.

sjl.isEmptyOrNotOfType(({hello: 100}).hello);
// false.  Found key is not empty.

sjl.isEmptyOrNotOfType(({hello: 'world'}).hello, 'Number');
// true.  Found key is not empty but is not of given type(s). 

sjl.isEmptyOrNotOfType(({hello: 'world'}).hello, 'String');
// false.  Found key is not empty and is of given type.
```

##### sjl.jsonClone (obj {*}) :*
Clones an object using the JSON object.  E.g.,
```
// Does this `JSON.parse(JSON.stringify(obj));`

var obj = {hello: 'ola', world: 'mundo'};
sjl.jsonClone(obj); 
// Returns an object with the same properties as
// `obj` but the object is completely unique
```

##### sjl.clone (obj {*}) :*
Returns a new object with the properties from `obj` (does a deep copy).

##### sjl.ucaseFirst(str {String}) :String
Uppercases the first character of a string;  E.g., `sjl.ucaseFirst('hello');`  returns 'Hello'.

##### sjl.implode(list {Array|Set|SjlSet}, separator {String}) :String
Implodes an `Array`, `Set`, or `SjlSet` into a string using `separator`.
calls `join` with `separator` on value if it is an array.

##### sjl.searchObj(nsString {String}, objToSearch {*}) :{Null|*}
Searches object using a namespace string and if final property in namespace
string chain is found then returns that properties value else 
it returns null.

##### sjl.createTopLevelPackage (obj {Object}, packageKey {String|undefined}, altFuncKey {String|undefined}, dirPath {String|undefined}) :obj
Creates a top level `package` on an object that allows you to set members on it which become un-overwrittable (members can be edited but not overwritten)
 when working on the frontend and when the library is being used within nodejs, this function creates a lazy loader 
 for loading class member *.js and *.json files;  E.g.,

(ignore whitespace formatting for examples (trying to make examples fit without
  having the browsers generate scrollbars on github))

```
// FRONTEND USAGE
// -------------------------------------------------

// -------------------------------------------------
// somePackage/myObject.js
// -------------------------------------------------
// Create top level frontend package
var myObject = Object.defineProperty(window, 'myObject', {});

// Create top level package functionality on `myObject`
// (note this method also returns passed in object
sjl.createTopLevelPackage(myObject, 'package', 'ns');

// -------------------------------------------------
// somePackage/someClass.js
// -------------------------------------------------
(function () {
    // Declare some class
    function SomeClass () {};
    
    // Export some class
    window.myObject.package('somePackage.SomeClass', SomeClass);
}());

// -------------------------------------------------
// somePackage/someProcess.js 
// -------------------------------------------------
var SomeClass = myObject.package.somePackage.SomeClass;
// you case use the alias for package
// here as well, in this case it is `ns`

```

```
// NODEJS USAGE
// -------------------------------------------------

// -------------------------------------------------
// somePackage/myObject.js
// -------------------------------------------------
// Create top level frontend package
var myObject = Object.defineProperty(window, 'myObject', {});

// Create top level package functionality on `myObject`
// (note this method also returns passed in object)
sjl.createTopLevelPackage(myObject, 'package', 'ns', __dirname);

// -------------------------------------------------
// somePackage/someClass.js
// -------------------------------------------------
(function () {
    // Include your object
    var myObject = require('somePackage/myObject.js');

    // Declare some class
    function SomeClass () {};

    // Export some class
    module.exports = SomeClass;
}());

// -------------------------------------------------
// somePackage/someProcess.js
// -------------------------------------------------
// Fetch your exported class using namespaces:
var SomeClass = myObject.package.somePackage.SomeClass;
// you case use the alias for package
// here as well, in this case it is `ns`

```


```
// FRONTEND AND NODEJS USAGE TOGETHER "EXAMPLE"
// -------------------------------------------------

// -------------------------------------------------
// somePackage/myObject.js
// -------------------------------------------------
(function () {
    var isNodeEnv = typeof window === 'undefined';

    // Create top level frontend package
    var myObject = {};

    if (isNodeEnv) {
        module.exports = myObject;
    }
    else {
        Object.defineProperty(window, 'myObject', {});
    }

    // Create top level package functionality on `myObject`
    // (note this method also returns passed in object
    sjl.createTopLevelPackage(
        myObject, 'package', 'ns', isNodeEnv ? __dirname : null);

}()):

// -------------------------------------------------
// somePackage/someClass.js
// -------------------------------------------------
(function () {

    var isNodeEnv = typeof window === 'undefined',
        myObject = isNodeEnv ? require('somePackage/myObject.js')
            : window.myObject || {};

    // Declare some class
    function SomeClass () {};

    // Export some class
    if (isNodeEnv) {
        module.exports = SomeClass;
    }
    else {
        myObject.package('somePackage.SomeClass', SomeClass);
    }

}());

// -------------------------------------------------
// somePackage/someProcess.js
// -------------------------------------------------
// Use your exported class via namespaces
(function () {

    var isNodeEnv = typeof window === 'undefined',
        myObject = isNodeEnv ? require('somePackage/myObject.js')
            : window.myObject || {},
        SomeClass = myObject.package.somePackage.SomeClass;
        // you case use the alias for package
        // here as well, in this case it is `ns`

}());

```


**Note**:
- This is called on the `sjl` object to allow access to its class members easily in nodejs and on the frontend.
- For frontend end you have to include the file for the class you want to access unless you are using './sjl[.min].js' (which includes all classes).

##### sjl.package
Created using `sjl.createTopLevelPackage` and is available for accessing sjl package members (for, current, packages 'stdlib', 'input', and 'validator').
The package key is `package` and the alias for it is `ns`.

##### sjl.ns 
Same as `sjl.package`.

### Set Functions:

##### sjl.extend(obj {Object|Boolean}, ...obj {Object|undefined} [,hydrateViaMethods {Boolean|undefined}]) : Object
Similar to JQuery's `extend` method except properties only get copied over to the first object.  Also the signature 
 for the method allows for one more optional boolean which allows values to get pulled and pusehd via any found 
 composite styled getter and setter methods or overloaded methods when merging values over to the first object: E.g.,
```
var obj_1 = {
    _value: 'some-value',
    _otherValue: 'some-other-value',
    all: {your: {base: '...'}, otherValue: 'hello'},
    getValue: function () { return this._value; }
    setValue: function (value) { this._value = value; return this; }
    otherValue: function (value) {
        var retVal;
        if (typeof value === 'undefined') {
            retVal = this._otherValue; 
        } 
        else { /** or if value is of some type **/
            this._otherValue = value;
            retVal = this;
        }
        return retVal;
    },
    obj_2 = {
        value: 'helloWorld',
        otherValue: 29,  // if this was an overloaded or composite-getter/setter method ...  
        all: {your: {base: {are: 'belong to us'}}}
    };
    
    // Extend obj_1 with obj_2 and use any [composite/overloaded]-[getter/setter] methods that may be found 
    // for push-pull else just set value(s));
    sjl.extend(true, obj_1, obj_2, true);
    
    // Test merge
    console.log(obj_1.getValue() === obj_2.value); // true
    console.log(obj_1._otherValue === obj_2._otherValue); // true
    console.log(obj_1.all.your.base.are === obj_2.all.your.base.are); // true
    console.log(obj_1.otherValue === 'hello'); // true
```

### OOP Util functions:

##### sjl.defineSubClass(superclass {Function}, methodsAndConstructor {Object}, statics {Object}) :Function
Alternate signature for `defineSubClass` though the second parameter here requires a `constructor` property with a 
named function set to it (a named function should be used for best effect though an anonymous function also works).
 
##### sjl.defineSubClass(superclass {Function}, constructor {Function}, methods {Object}, statics {Object}) :Function
Creates a sub class of a constructor and makes it extendable via the static method `extend`;  E.g., pretty much 
creates `sjl.Extendable`.

#### Composition helpers:

##### sjl.getValueFromObj (key {String}, obj {Object}, args {*|undefined}, raw {Boolean|undefined}) :*
Allows getting value by namespace string (ex: `'some.object.deep'`) also if return value is a function allows 
it to automatically be called via the `raw` params (optionally with `args` if they are set.

##### sjl.setValueOnObj (key {String}, value {*}, obj {Object}) :{Object|*}
Allows setting a value on an object by namespace string, composite setter function (setPropertyName), 
 overloaded setter function (function of same name as the `key` passed), or sets the value 
directly if none of the above are found.

### Tests:
1.)  Run `npm install` in project root.
- Tests for all components listed under "Utilities" above.
- Tests to be run on server.  See './tests/for-server'.
- Tests to be run in browser (requires running `bower install` in root directory of this project).
See './tests/for-browser'.

## Requirements:
- Javascript versions ecmascript 5+

## Supported browsers:
- ~~ie8+~~ (IE8 support was dropped in version 0.5.0) IE9+, and all other modern day browsers.

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
- [X] - Change `sjl.getValueOnObj`'s `raw` param to have a default `true` (needs to be set to true by default cause
 right now it is not apparent to people that this is the default behaviour).  Moved to version 0.5.0.

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
- [ ] - Change interface check to check for 'isValid' and 'messages'
    properties on a 'AbstractValidator' class passed to a 'ValidatorChain' class.
- [ ] - Review entirety of library and look for places that could be refactored.
- [ ] - Refactor the `input` package
- [ ] - Refactor the `validator` package
- [ ] - `sjl.empty` to `sjl.isempty` (maybe for version 0.5.50).
- [X] - Change `sjl.getValueOnObj`'s `raw` param to have a default `true` (needs to be set to true by default cause
 right now it is not apparent to people that this is the default behaviour).
- [X] - Remove `attrs` method from `sjl.Attributable`.
- [X] - Update readme to a more readable format.
- [X] - Optimize for file size (maybe put context.sjl into a variable so it can be further minified).
- [X] - Changelog.
- [X] - Change the library from being a global for nodejs to being an exported package.
- [X] - Set all components (constructors) of sjl to be exported when being used in nodejs.
- [X] - Support for AMD if it is available when used on the frontend.
- [X] - Remove use of eval option for `defineSubClass`.
- [X] - Create docs for `sjl.package`.
- [X] - ~~Shim `sjl.forEach` and `sjl.indexOf`.~~  Removed in version 0.5.4.
- [X] - Make `sjl.package` work using node (dynamically load class in for every requested namespace/class
instead of requiring global require).
- [ ] - Include all sub items for components included as sub nav in readme.
- [X] - Remove checking against multiple values for util functions (isset, classOfIs, etc. (maybe not classOfIs (have to evaluate common use cases further))).
- [X] - Change `value !== undefined` check to use typeof instead (safe way for browsers (current check fails in browsers)).

### MVP for 0.5.1+
- [X] - Add changelog.md in main readme.
- [X] - Remove all shimming of es5 features and support for older browsers (IE8 etc.).
    - [ ] - Some features had to remain due to incomplete support of es5 in IE9.  List those features here:
- [ ] - Update all classes to use Object.defineProperty and Object.defineProperties internally for
their properties to eliminate alternate schemes to hide access to their internal properties also to make them more functional.
- [X] - ~~Remove all overloaded methods in exchange for Object.defineProperty and Object.defineProperties getters and setters.~~
Overloaded methods will remain on the classes that have them inorder to not break backward functionality which isn't browser specific.
- [X] - Add file hashes to minified files and add a unix time stamp instead of a utc time stamp to the file.
- [ ] - Define all methods on `sjl` directly in it's object definition when it is defined instead of define every property separately;  
    E.g., `sjl = {prop1: ..., prop2: ..., etc.} /** instead of **/ sjl.prop1 = ...; sjl.prop2 = ...;, etc.`;  Also this'll save a couple o' bytes haha!!!
- [X] - Either remove changelog functionality or generate it correctly (in descending order (from actual commit logs 2x thumbsup)
 (to eliminate having to write double commit messages (one in the changelog and one in the commit blarghhh)).
    - **Update**:  Changelog is temporarily not going to be included in as part of the readme.  If you would like to see
    the old changelogs look at './changelog.md'.  Also if you want to see the latest changes/changelog like summaries 
    view the release notes as they are provided.
     
### MVP for 0.6.0
- [ ] - Remove use of `eval` from tests.
- [ ] - Cleanup all jsdocs and ensure all library members are listed there and showing their docs properly/clearly.
    - @note jsdoc is currently undergoing a refactor by the jsdoc folks.  It is currently in alpha.

## License:
[GPL v2+](http://www.gnu.org/licenses/gpl-2.0.html "http://www.gnu.org/licenses/gpl-2.0.html") AND
[MIT](http://opensource.org/licenses/MIT "http://opensource.org/licenses/MIT")
