### (m) sjl._

This is a place holder member.  It is an immutable value that can be used to represent a placeholder other than null;
E.g., used by `sjl.curry` and `sjl.curryN` to allow curry functions and using place holders for values 
you're not ready to passed in;  E.g.,
```
var slice = Array.prototype.slice,
 add = function () {...}, // recursively adds
 multiply = function () {...}; // recursively multiplies

sjl.curry(add, __, __, __)(1, 2, 3, 4, 5) === 15 // `true`
sjl.curry(multiply, __, 2, __)(2, 2) === Math.pow(2, 3) // `true`
sjl.curry(divide, __, 625, __)(3125, 5)

```

[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)
