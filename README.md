sjljs
=====

A Simple Javascript Library.

Not meant to replace popular libraries (Backbone, Underscore, Jquery etc.)
only meant as a supplement to them.

Includes
- `sjl.empty` - Opinionated `empty` check.  Checks if `false`, `0`, `null`, `undefined`, empty array, or empty object is true for one or one of many values.
- `sjl.isset` - Checks to see that a value(s) is not `null` or `undefined` for one or one of many values.
- `sjl.classOf` - Gives you a String representation of the class of value;  e.g., `classOf("hello") === 'String'`.
- `sjl.classOfIs` - Checks that whether a value is of class type;  e.g., `clasOfIs(0, 'Number') === true`.
- `sjl.ucaseFirst` - Uppercases the first character of a string.
- `sjl.lcaseFirst` - Lowercases the first character of a string.
- `sjl.camelCase` - Camel Cases a string.

WIPs
- `sjl.Extendable` - A base extendable constructor which includes base goodeis (`extend` and `namespace` (so far)).
- `sjl.Iterator` - A simple iterator constructor which mimicks the es6 iterator (partially) and other iterator's from other languages (mainly the php `Iterator`) closely.

