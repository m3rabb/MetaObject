beforeEach(function() {
	this.addMatchers({
		toBeReferencedFrom : function(object) {
			var target, propertyName;
			target = this.actual;
			for (propertyName in object) {
				if (object[propertyName] === target) { return true; }
			}
			return false;
		}
	});
});
