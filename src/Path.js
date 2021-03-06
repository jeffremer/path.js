// Path.js - simle SVG Path representation in JavaScript

// Copyright 2011 Jeff Remer - MIT Licensed, see [LICENSE](https://github.com/jeffremer/path.js/blob/master/LICENSE).

// Source available on [Github](https://github.com/jeffremer/path.js).

(function(){
	// Path
	// ====
	// 
	// Contructor accepts an array of points or a string representing
	// part of an SVG Path data attribute, for example:
	//
	//		var path = new Path([[0,0], [0,10], [0, 20]])
	//
	//		var path = new Path("M 0 10 L 100 200 l 10 20 l 6 10 z")
	function Path() {
		// The constructor starts with a array object to subclass
		var arr = [];
		// Parse the path, if it's an array it just returns back the same data
		var path = parsePath(arguments[0])
		// If there are commands they'll come back as an option
		var commands = path.commands;
		// Store the points on the array itself.
		arr.push.apply(arr, path.points);

		// Make sure that the top level prototype is the Path object
		// To the prototype chain it'll look like Array subclasses Path
		arr.__proto__ = Path.prototype;
		// Assign the commands array or add a blank one.
		arr.commands = commands || [];
		
		return arr;
	}
	// Add the rest of the Array methods to the Path class.
	Path.prototype = new Array;
	
	// toString
	// ========
	//
	// Returns a string representation of a SVG Path data attribute.
	// It zips the commands in with the points if they exist, otherwise
	// It assumes the first point is a moveto and the rest are absolute
	// lineto commands.
	// 
	// The closePath parameter it ensures that the last command closes the path.
	Path.prototype.toString = function(closePath) {
		var str = [];
		for(var ix = 0, lx = this.length; ix < lx; ix++) {
			var command = this.commands[ix] || (ix === 0 ? 'M' : 'L');
			var point = this[ix].join(' ');
			var instruction = command === 'z' ? command : [command, point].join(' ');
			str.push(instruction);		
		}
		if(closePath && command !== 'z') str.push('z');
		return str.join(' ')
	};
    
	// clone
	// =====
	//
	// Creates a new copy of this path.
	Path.prototype.clone = function() {
		var path = new Path(this);
		path.commands = this.commands;
		return path;
	};

	var nativeMap = Array.prototype.map;
    
	// map
	// ===
	//
	// Iterate all the points in the Path and return a new
	// path with the transformed points and the commands.
	Path.prototype.map = function(iterator, context) {
		var result = [];
		if(nativeMap) {
			result = nativeMap.apply((context||this), [iterator, (context||this)]);
		} else {
			for(var ix = 0, lx = this.length; ix < lx; ix++) {
				result.push(iterator.call((context||this), this[ix]))
			}			
		}
		var path = new Path(result);
		path.commands = this.commands;
		return path;	
	};
    
	// filter
	// ===
	//
	// Iterate all the points in the Path and return a new
	// path with the points that fast the filter test and the original
	// commands the corresponded with the passing points.
	Path.prototype.filter = function(iterator, context) {
		var result = [];
		var commands = [];
		for(var ix = 0, lx = this.length; ix < lx; ix++) {
			if(iterator.call((context||this), this[ix])) {
				result.push(this[ix]);
				commands.push(this.commands[ix]);
			}
		}
		var path = new Path(result);
		path.commands = commands;
		return path;
	};
	
	// slice
	// =====	
	//
	// Slice returns a sub-path consisting of a slice of the points
	// and corresponding slice of the commands if they exist.
	Path.prototype.slice = function(begin, end) {
		var args = [begin];
		if(end) args.push(end);
		var result = Array.prototype.slice.apply(this, args);
		var commands = Array.prototype.slice.apply(this.commands, args);
		var path = new Path(result);
		path.commands = commands;
		return path;
	}	
    
	// parsePath
	// ---------
	//
	// Private parsePath implementation parses String paths
	function parsePath(pathString) {
		// If the path is already an array just return it back.
		if(pathString instanceof Array) return {points: pathString}
		// Match all the instructions
	    var matches = pathString.match(/[MLlz]\s*((\d+|\d+\.\d*|\.\d+)(\s*|\s+?\s*)?)*/g);
		// Only M L l z commands are accepted.
	    if (pathString.match(/[^MLlz\d\s]/g)) throw new Error("Invalid path " + pathString);
		if (pathString.match(/z.+/)) throw new Error("Closepath may only appear at the end of a path")

		var commands = [], commandArgs = [];
		// Iterate all the instructions, match the arguments to each command and populate the
		// points and the commands.
	    for(var ix = 0; ix < matches.length; ix++) {
	        var part = matches[ix],
	        	command = part.charAt(0),
	        	args = part.match(/[+\-]?(\.\d+|\d+\.\d*|\d+)([Ee][+\-]?\d+)?/g) || [],
	        	values = [];
	
			if(command === 'M' && ix > 0) throw new Error("Moveto may only appear at the beginning of a path");

            for(var jx = 0, ljx = args.length; jx < ljx; jx++) values[jx] = Number(args[jx]);

			commands.push(command);

			if(values.length == 2) commandArgs.push(values);
	    }
		return {points: commandArgs, commands: commands};
	}
	
	// Make it so.
	typeof exports != 'undefined' ? exports.Path = Path : this.Path = Path;
})();
