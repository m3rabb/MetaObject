describe("Top library", function() {
	var topModule = Top;
	
	describe("when instantiating the library", function() {
		it("sets up a Top module with Object and Module ", function() {
			expect( topModule instanceof Top.Module ).toBe( true );
			expect( typeof Top.Module ).toBe( "function" );
			expect( Top.isTopObject(Top.Module) ).toBe( true );
			expect( typeof Top.Object ).toBe( "function" );
			expect( Top.isTopObject(Top.Object) ).toBe( true );
		});
	});
	
	describe("utility methods", function() {
		describe("#bind - binds a function to a target object", function() {
			it("answers a function that binds a target object as 'this' within a function", 
			function() {
				var dog, bound_answerer, bound_setter;
				
				function answerer() {return this;}
				function setter(arg) {this.NickName = arg;}
				
				expect( typeof Top.bind ).toBe( "function" );
				expect( Top.bind.Selector ).toBe( "bind" );
				
				dog = {};
				bound_answerer = Top.bind(dog, answerer);
				bound_setter   = Top.bind(dog, setter);
				
				expect( answerer() ).toBe( window );
				expect( bound_answerer() ).toBe( dog );
				
				setter("Little tiny dog");
				expect( window.NickName ).toBe( "Little tiny dog" );
				expect( "NickName" in dog ).toBe( false );
				
				delete window.NickName;
				bound_setter("Very noisy dog");
				expect( "NickName" in window ).toBe( false );
				expect( dog.NickName ).toBe( "Very noisy dog" );
			});
		});
		
		xdescribe("#randomInt - generates a random integer within a range", function() {
			
		});
		
		describe("#newUniqueId - generates a unique id string", function() {
			describe("when called with no args", function() {
				it("answers a unique id string", function() {
					var id1, id2;
					id1 = Top.newUniqueId();
					id2 = Top.newUniqueId();
					expect( typeof id1 ).toBe( "string" );
					expect( id1 ).not.toBe( id2 );
					expect( id1.length ).toBe( 18 );
				});
			});
			
			describe("when called with a prefix", function() {
				it("answers a prefixed unique id string", function() {
					var id = Top.newUniqueId("ID:");
					expect( typeof id ).toBe( "string" );
					expect( id ).toMatch( /^ID:/ );
				});
			});
		});
		
		describe("#isGUID", function() {
			it("answers whether or not the arg is a properly formatted GUID string", function() {
				expect( Top.isGUID({}) ).toBe( false );
				expect( Top.isGUID("") ).toBe( false );
				expect( Top.isGUID("3945a6bf-b0d6-4c6e-bc39-eb25d17fccd7") ).toBe( true );
				expect( Top.isGUID("3945a6bfb0d64c6ebc39eb25d17fccd7") ).toBe( false );
			});
		});
		
		describe("#newGUID", function() {
			it("answers a new GUID string", function() {
				var guid = Top.newGUID();
				expect( typeof guid ).toBe( "string" );
				expect( guid.length ).toBe( 36 );
				expect( guid[14] ).toBe( "4" );
			});
		});
		
		describe("#newStash - makes a truly empty object", function() {
			it("answers a new object with no proto and no properties", function() {
				var stash, count, propertyName;
				stash = Top.newStash();
				
				expect( stash ).toBeDefined();
				expect( Object.getPrototypeOf(stash) ).toBe( null );
				
				count = 0;
				for (propertyName in stash) {count++};
				expect( count ).toBe( 0 );
			});
		});
		
		describe("#handleErrorsQuietly", function() {
			describe("when first run, by default", function() {
				it("doesn't handle errors quietly", function() {
					expect( Top.handleErrorsQuietly() ).toBe( false );
				});
			});

			describe("when called with an arg", function() {
				it("sets the handling state, and answers the Colum module", function() {
					expect( Top.handleErrorsQuietly(true) ).toBe( Top );
					expect( Top.handleErrorsQuietly() ).toBe( true );
				});
			});

			describe("when called with no args", function() {
				it("answers whether or not is handles errors quietly", function() {
					var isQuietly = Top.handleErrorsQuietly();
					isQuietly = !isQuietly;
					Top.handleErrorsQuietly( isQuietly );
					expect( Top.handleErrorsQuietly() ).toBe( isQuietly );
				});
			});

		});
		
		describe("#isTopObject", function() {
			var Testing, constructor, Pot, pot, pan;
			
			Testing = Top.newSubModule("Testing");
			Pot = Testing.newType("Pot");
			pot = new Pot();
			function Pan() {}

			it("answers true when passed a Top object", function() {
				expect( Top.isTopObject(Top) ).toBe( true );
				expect( Top.isTopObject(pot) ).toBe( true );
			});
			it("answers true when passed a Top constructor", function() {
				expect( Top.isTopObject(Pot) ).toBe( true );
			});
			it("answers false when passed anything else", function() {
				expect( Top.isTopObject(pan) ).toBe( false );
				expect( Top.isTopObject({}) ).toBe( false );
				expect( Top.isTopObject(123) ).toBe( false );
			});
		});
	});
});