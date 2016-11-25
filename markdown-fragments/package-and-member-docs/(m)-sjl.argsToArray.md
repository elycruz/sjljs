### (m) sjl.argsToArray

Same as Array.prototype.slice but neatly packaged for reuse;  Also essentially used to convert an `arguments` object
to an actual array.

E.g.,
```
function someFunction () {
    // `arguments` gets returned as an actual array here.
    return sjl.argsToArray(arguments).map( arg => someProcess(arg) );
}
```

[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)
