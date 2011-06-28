describe("Path", function() {
	var path;
	var points = [[0,0], [0,10], [0, 20]];
	var pathStr = "M 0 10 L 100 200 l 10 20 l 6 10 z";
	var halfPathStr = "M 0 5 L 50 100 l 5 10 l 3 5 z";
	var invalidPathString = "M 0 0 C 10 10";

	describe("#constructor", function(){
		it("should accept an array of points", function(){
			path = new Path(points)
		});
		
		it("should accept a simple SVG path string", function(){
			path = new Path(pathStr);
		});
		
		it("should reject advanced SVG path strings", function(){
			var throwy = function() {
				new Path(invalidPathString);
			}
			expect(throwy).toThrow("Invalid path " + invalidPathString);
		});
	});
	
	describe("extends Array", function(){
		it("should be an instance of Path", function(){
			expect(new Path(points)).toBePath();
		});
		
		it("should be an instance of Array", function(){
			expect(new Path(points)).toBeArray();
		});
	});
	
	it("should respond to #clone", function(){
			path = new Path(pathStr);
			var clone = path.clone();
			expect(clone).toEqual(path);
	});
	
	it("#map should return a new Path", function(){
		path = new Path(pathStr);
		var mapped = path.map(function(point){
			return [point[0] / 2, point[1] / 2]
		});
		expect(mapped).toBePath();
		expect(mapped).not.toEqual(path);
		expect(mapped.toString()).toEqual(new Path(halfPathStr).toString());
	});
	
	it("#filter should return a new Path", function(){
		path = new Path(pathStr);
		var filtered = path.filter(function(point){
			return (point[0] < 30) && (point[1] < 30)
		});
		expect(filtered).toBePath();
		expect(filtered).not.toEqual(path);
	});

   	it("#slice should return a new Path", function(){
		path = new Path(pathStr);
		var sliced = path.slice(2);
		expect(sliced).toBePath();
		expect(sliced.length).toEqual(2) // [[10,20],[6,10]]
		expect(sliced.commands.length).toEqual(3) // [l, l, z]		
	}); 
	
	it("#toString should return a SVG path string", function(){
		expect(new Path(pathStr).toString()).toEqual(pathStr);
	});  
});