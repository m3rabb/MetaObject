describe("Top.Module", function() {
	var topModule;
	
	topModule = Top;
	
	// var Zoo, Sports, _Bi, _Animal_root;
	// 
	// function Animal() {};
	// function Bird() {};
	// 
	// function Athlete() {};
	// 
	// Zoo = Colum.newModule("Zoo");
	// Zoo.from_addSubType(Animal, Bird);
	// 
	// Sports = Colum.newModule("Sports");
	// Sports.addType(Athlete);
	
	describe("when instantiating", function() {
		var module, id;
		describe("when Module constructor is called with no args", function() {
			it("answers a new default named module", function() {
				module = new Top.Module();
				expect( module.constructorName() ).toBe( "Module" );
				expect( module.name() ).toBe( module.id() );
				expect( module.name().indexOf("Module-") ).toBe( 0 );
			});
			it("has no parent context", function() {
				expect( module.parentContext() ).toBe( null );
			});
			it("doesn't impact the global name space", function() {
				expect( window[module.id()] ).toBe( undefined );
			});
		});
		
		describe("when called with just the module name", function() {
			it("answers a new named module", function() {
				module = new Top.Module("Box");
				expect( module.constructorName() ).toBe( "Module" );
				expect( module.name() ).toBe( "Box" );
			});
			it("has no parent context", function() {
				expect( module.parentContext() ).toBe( null );
			});
			it("doesn't impact the global name space", function() {
				expect( window.Box ).toBe( undefined );
			});
			it("has a default id", function() {
				id = module.id();
				expect( id.indexOf("Module-") ).toBe( 0 );
				expect( id.length ).toBe( "Module-".length + 18 );
			});
		});
		
		describe("when called with 'window' as the parent context", function() {
			it("adds the new module as a global var", function() {
				module = new Top.Module("Box", window);
				expect( window.Box ).toBe( module );
				expect( window[module.name()] ).toBe( module );
			});
			it("has the 'window' as its parent context", function() {
				expect( module.parentContext() ).toBe( window );
			});
		});
		
		describe("when called with another module as the parent context", function() {
			var outerModule = new Top.Module("OuterBox");
			var innerModule = new Top.Module("InnerBox", outerModule);
			it("adds the new module as a property of the existing module", function() {
				expect( outerModule.InnerBox ).toBe( innerModule );
			});
			it("has the existing module as its parent context", function() {
				expect( innerModule.parentContext() ).toBe( outerModule );
			});
		});
		
		describe("when called with an extension action", function() {
			var module;
			it("calls the extension function using the new module as 'this'", function() {
				module = new Top.Module("World", function () {
					InnerThis = this;
				});
				expect( InnerThis ).toBe( module );
			});
			it("answers a new Module", function() {
				expect( module.constructorName() ).toBe( "Module" );
				expect( module.name() ).toBe( "World" );
				expect( module.parentContext() ).toBe( null );
			});
		});
		
		describe("when called with a parent context and an extension action", function() { 
			var module;
			it("sets the parent context of the new module", function() {
				module = new Top.Module("World", window, function () {
					InnerThis = this;
				});
				expect( module.parentContext() ).toBe( window );
			});
			it("calls the extension function using the new module as 'this'", function() {
				expect( InnerThis ).toBe( module );
			});
			it("answers a new Module", function() {
				expect( module.constructorName() ).toBe( "Module" );
				expect( module.name() ).toBe( "World" );
			});
		});
	});

	describe("#name", function() {
		describe("when called as a getter", function() {
			it("answers the receiver's name", function() {
				expect( topModule.name() ).toBe( "Top" );
			});
		});
		
		describe("when called as a setter", function() {
			module = new Top.Module("First");
			existingName = module.name();
			it("replaces the existing name with a new name", function() {
				expect( existingName ).toBe( "First" );
				module.name("Second");
				expect( module.name() ).toBe( "Second" );
			});
			it("answers the receiver", function() {
				expect( module.name("Third") ).toBe( module );
			});
		});
	});
	
	describe("#newSubModule", function() {
		var submodule, InnerThis, InnerObject;
				
		it("answers a new named submodule from the receiver module", function() {
			submodule = Top.newSubModule("Testing", function (module) {
				InnerThis = this;
                InnerObject = module;
				return 123;
			});
			expect( submodule.constructorName() ).toBe( "Module" );
			expect( submodule.name() ).toBe( "Testing" );
			expect(	submodule.parentContext() ).toBe( Top );
		});
		it("sets the new submodule to inherit from the receiver", function() {
			expect( submodule.root() ).toBe( Top );
		});
		it("includes a named reference from the receiver to the new module", function() {
			expect( Top.Testing ).toBe( submodule );
		});
		describe("when called with an extension action", function() {
			it("passes in the receiver", function() {
				expect( InnerThis ).toBe( submodule );
			});
		});
		
	});

	describe("building a module hierarchy with new vs newSubModule", function() {
		describe("when building a hierarchy using 'new Module()'", function() {
			var outerModule = new Top.Module("OuterBox");
			var innerModule = new Top.Module("InnerBox", outerModule);
			
			it("adds the inner module as a property of the outer module", function() {
				expect( outerModule.InnerBox ).toBe( innerModule );
			});
			it("has the outer module as the inner's parent context", function() {
				expect( innerModule.parentContext() ).toBe( outerModule );
			});
			it("however, the inner modules don't descend from the outer module", function() {
				expect( innerModule.root() ).not.toBe( outerModule );
				expect( innerModule.root() ).toBe( Top.Module.prototype );
			});
			it("the inner modules don't have implicit access to the outer's properties", 
			function() {
				var hotDog = outerModule.newType("HotDog");
				var hamburger = innerModule.newType("Hamburger");
				expect( outerModule.HotDog ).toBe( hotDog );
				expect( innerModule.HotDog ).toBe( undefined );
				expect( innerModule.Hamburger ).toBe( hamburger );
			});
		});
		
		describe("when building a hierarchy using 'newSubModule'", function() {
			var outerModule = new Top.Module("OuterBox");
			var innerModule = outerModule.newSubModule("InnerBox");
			
			it("adds the inner module as a property of the outer module", function() {
				expect( outerModule.InnerBox ).toBe( innerModule );
			});
			it("has the outer module as the inner's parent context", function() {
				expect( innerModule.parentContext() ).toBe( outerModule );
			});
			it("however, the inner modules don't descend from the outer module", function() {
				expect( innerModule.root() ).toBe( outerModule );
			});
			it("the inner modules has implicit access to the outer's properties", 
			function() {
				var hotDog = outerModule.newType("HotDog");
				var hamburger = innerModule.newType("Hamburger");
				expect( outerModule.HotDog ).toBe( hotDog );
				expect( innerModule.HotDog ).toBe( hotDog );
				expect( innerModule.Hamburger ).toBe( hamburger );
			});
		});
		
	});
	
	describe("#newSubTypeFrom", function() {
		var Testing, constructor;
		Testing = Top.newSubModule("Testing");
		
		it("answers a new constructor subtyped from a parent constructor", function() {
			constructor = Testing.newSubTypeFrom("Animal", Top.Object);
			expect( typeof constructor ).toBe( "function" );
			expect( constructor.name ).toBe( "aTopObject" );
			expect( constructor.Selector ).toBe( "Animal" );
			expect( constructor.ParentConstructor ).toBe( Top.Object );
		});
		it("adds a reference to the constructor referenced in the receiver module", function() {
			expect( constructor ).toBe( Testing.Animal );
		});
		describe("when the parent is a string", function() {
			it("looks up the parent in the receiver module", function() {
				constructor = Testing.newSubTypeFrom("Bird", "Animal");
				expect( constructor.ParentConstructor ).toBe( Testing.Animal );
			});
			describe("when there's no such type name in the receiver module", function() {
				it("looks up the parent type by traversing the module hierarchy", function() {
					constructor = Testing.newSubTypeFrom("Car", "Object");
					expect( constructor.ParentConstructor ).toBe( Top.Object );
				});
			});
		});
		describe("when called with an extension action", function() {
			it("passes into the extension function the instance root of the new constructor as 'instanceRoot'", function() {
				constructor = Testing.newSubTypeFrom("Person", "Object", function (instanceRoot) {
					InnerThis = this;
                    InnerInstanceRoot = instanceRoot;
					return 123;
				});
				expect( InnerThis ).toBe( constructor );
                expect( InnerInstanceRoot ).toBe( constructor.prototype );
			});
			it("answers the new constructor", function() {
				expect( constructor.Selector ).toBe( "Person" );
			});
		});
	});
	
	describe("#newType", function() {
		var Testing, constructor, InnerThis, InnerInstanceRoot;
		Testing = Top.newSubModule("Testing");
		
		it("answers a new constructor subtyped from the Top.Object", function() {
			constructor = Testing.newType("Vehicle", function (instanceRoot) {
				InnerThis = this;
                InnerInstanceRoot = instanceRoot;
				return 123;
			});
			expect( typeof constructor ).toBe( "function" );
			expect( constructor.name ).toBe( "aTopObject" );
			expect( constructor.Selector ).toBe( "Vehicle" );
			expect( constructor.ParentConstructor ).toBe( Top.Object );
		});
		it("adds a reference to the constructor referenced in the receiver module", function() {
			expect( constructor ).toBe( Testing.Vehicle );
		});
		describe("when called with an extension action", function() {
			it("passes in the receiver's root", function() {
				expect( InnerThis ).toBe( constructor );
                expect( InnerInstanceRoot).toBe( constructor.prototype );
			});
		});
	});
	
	describe("when a new constructor is made", function() {
		var Sandwich = Top.newType("Sandwich");
		
		it("has a selector name", function() {
			expect( Sandwich.name ).toBe( "aTopObject" );
			expect( Sandwich.Selector ).toBe( "Sandwich" );
		});
		it("has a reference to its parent contructor", function() {
			expect( Sandwich.ParentConstructor ).toBe( Top.Object );
		});
		it("has a prototype that descends from it parent's prototype", function() {
			expect( Object.getPrototypeOf(Sandwich.prototype) ).toBe( Top.Object.prototype );
		});
		it("the prototype has ref back to the Sandwich", function() {
			expect( Sandwich.prototype.constructor ).toBe( Sandwich );
		});
		it("the constructor has a method #passRootInto to access its prototype", function() {
			var InnerThis, InnerInstanceRoot, sandwich;
			sandwich = new Sandwich();
			Sandwich.passInstanceRootInto(function (instanceRoot) {
				InnerThis = this;
                InnerInstanceRoot = instanceRoot;
				instanceRoot.addMethod(function calories() { return 1234; });
			});
			expect( InnerThis ).toBe( Sandwich );
            expect( InnerInstanceRoot ).toBe( Sandwich.prototype );
			expect( sandwich.calories() ).toBe( 1234 );
		});
	});
	
});
