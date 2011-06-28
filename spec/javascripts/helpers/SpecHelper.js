beforeEach(function() {
  this.addMatchers({
    toBePath: function() {
		return (this.actual instanceof Path);
    },
    toBeArray: function() {
		return (this.actual instanceof Array);
    }
  })
});
