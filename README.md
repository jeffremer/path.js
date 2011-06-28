Path.js
========

This is a simple implementation of a JavaScript representation of
SVG Path objects. It satisfies these requirements:

* Subclasses Array and array methods work as expected on the path points
* The constructor accepts an array of points ([x,y]) or a simplified SVG Path string 
* `clone`, `map`, `filter`, `slice` all return new Path objects, not Arrays
* `toString` returns the SVG Path as expected in a Path data attribute
* Moveto may only appear at the beginning and closepath may optionally only appear at the end of a path


Documentation
==============

See this `README` or the [project page](http://jeffremer.com/path.js) for documentation.

Run `rake rocco` to generate source documentation under `docs`.

Usage
======

See the [project page documentation](http://jeffremer.com/path.js) for examples.

Otherwise:

```javascript
var path = new Path("M 1 2 L 3 4 l 1 2 z");
// Behaves like an array
path.pop() // [1,2]
// Also has a commands property
path.commands // [M, L, l, z]
...
```

Compatability
==============

Node.js/CommonJS compatible. For example:

```javascript
var Path = require('./path.js').Path;
var path = new Path("M 1 2 L 3 4 l 1 2 z");
...
```

Tests
=======

Run `rake jasmine` from the project root and navigate to `http://localhost:8888`.

License
========

MIT License, see `LICENSE`.