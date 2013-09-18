"use strict";

describe("Top.Object", function() {
	var TopObject = Top.Object;
	var topModule = Top;
	var TopObjectRoot = TopObject.prototype; 
	var answer, InnerThis;
	var Testing = Top.newSubModule("Testing");

	var Thing = Testing.newType("Thing");
	var thingRoot = Thing.prototype;

	describe("when adding methods", function() {
		var thing = new Thing();
		
		describe("#addMethod", function() {
			answer = thingRoot.addMethod(function talk() { return "Yaaaahh!"; });
			
			it("adds a named function to the receiver", function() {
				expect( thingRoot.talk() ).toBe( "Yaaaahh!" );
			});
			it("adds a Selector property to the function", function() {
				expect( thingRoot.talk.Selector ).toBe( "talk" );
			});
			it("answers the receiver", function() {
				expect( answer ).toBe( thingRoot );
			});
			describe("when the function is named 'init'", function() {
				var Thang, thang, Thingy, thingy;
				it("add a ParameterSelectors property to the function", function() {
					Thang = Testing.newType("Thang");
					thang = new Thang();
					answer = thang.root().addMethod(function init(First, second_) {});
					expect( thang.init.ParameterSelectors ).toEqual( ["first", "second"] );
				});
				it("answers a reference to its parent function", function() {
					expect( thang.init.ParentInit ).toBe( TopObjectRoot.init );
				});
				describe("when init has no parameters", function() {
					it("should have an empty ParameterSelectors", function() {
						Thingy = Testing.newType("Thingy");
						thingy = new Thingy();
						answer = thingy.root().addMethod(function init() {});
						expect( thingy.init.ParameterSelectors ).toEqual( [] );
					});
				});
			});
		});
		
		describe("#addGetter", function() {
			var answer = thingRoot.addGetter("legs");
			
			it("adds a named method to the receiver", function() {
				expect( typeof thingRoot.legs ).toBe( "function" );
			});
			it("adds a Selector property to the function", function() {
				expect( thingRoot.legs.Selector ).toBe( "legs" );
			});
			it("answers the receiver", function() {
				expect( answer ).toBe( thingRoot );
			});
			describe("getter behavior", function() {
				var answer;
				describe("when the property has yet to be set", function() {
					it("has no private property yet", function() {
						expect( thing.hasOwnProperty("_Legs") ).toBe( false );
					});
					describe("when called as a getter", function() {
						it("answers undefined", function() {
							expect( thing.legs() ).toBe( undefined );
						});
						it("has no private property yet", function() {
							expect( thing.hasOwnProperty("_Legs") ).toBe( false );
						});
					});
					describe("when called as a setter", function() {
						it("creates a private property", function() {
							answer = thing.legs(12);
							expect( thing.hasOwnProperty("_Legs") ).toBe( true );
						});
						it("sets the value", function() {
							expect( thing._Legs ).toBe( 12 );
						});
						it("answers the receiver", function() {
							expect( answer ).toBe( thing );
						});
					});
				});
				describe("when the property has been set", function() {
					describe("when called as a getter", function() {
						it("answers the property", function() {
							expect( thing.legs() ).toBe( 12 );
						});
					});
					describe("when called as a setter", function() {
						it("throws an error", function() {
							expect( function () { thing.legs(13) } )
								.toThrow( "Getter property can only be used as a setter once!" );
						});
					});
					describe("when called as a setter with handleErorsQuietly", function() {
						var legs;
						it("doesn't throw an error", function() {
							legs = thing.legs();
							Top.handleErrorsQuietly(true);
							expect( function () { answer = thing.legs(44); } ).not.toThrow();
						});
						it("doesn't affect the prior value", function() {
							expect( thing.legs() ).toBe( legs );
						});
						it("answers the receiver", function() {
							expect( answer ).toBe( thing );
							Top.handleErrorsQuietly(false);
						});
					});
				});
			});
			
		});
		
		describe("#addAccessor", function() {
			describe("when called with just accessor name", function() {
				var answer = thingRoot.addAccessor("wings");
				
				it("adds a named method to the receiver", function() {
					expect( typeof thingRoot.wings ).toBe( "function" );
				});
				it("adds a Selector property to the function", function() {
					expect( thingRoot.wings.Selector ).toBe( "wings" );
				});
				it("answers the receiver", function() {
					expect( answer ).toBe( thingRoot );
				});
				describe("accessor behavior", function() {
					describe("when called with one args", function() {
						var result;
						it("adds an properly named ivar to the receiver", function() {
							expect( thing.hasOwnProperty("_Wings") ).toBe( false );
							result = thing.wings(8);
							expect( thing.hasOwnProperty("_Wings") ).toBe( true );
						});
						it("acts as a setter", function() {
							expect( thing._Wings ).toBe( 8 );
						});
						it("answers the receiver", function() {
							expect( result ).toBe( thing );
						});
					});
					describe("when called with no args", function() {
						it("acts as a getter", function() {
							expect( thing.wings() ).toBe( 8 );
						});
					});
				});				
			});
			
			describe("when called with an optional closure variable", function() {
				var answer;
				var sharedProperties0, properties0, privateProperties0;
				var sharedProperties1, properties1, privateProperties1;
				var sharedProperties2, properties2, privateProperties2;
				
				function IsPrivateSelector(name) { return name[0] === "_"; }
				
				it("adds a named method to the receiver", function() {
					sharedProperties0 = Object.keys(thingRoot);
					properties0 = Object.keys(thing);
					privateProperties0 = properties0.filter(IsPrivateSelector);
					answer = thingRoot.addAccessor("teeth", 32);
					sharedProperties1 = Object.keys(thingRoot);
					properties1 = Object.keys(thing);
					privateProperties1 = properties1.filter(IsPrivateSelector);
					
					expect( typeof thingRoot.teeth ).toBe( "function" );
					expect( sharedProperties1.length ).toBe( sharedProperties0.length + 1 );
					expect( properties1.length ).toBe( properties0.length );
				});
				it("doesn't add any ivar properties to the receiver", function() {
					expect( thingRoot.hasOwnProperty("_Teeth") ).toBe( false );
					expect( privateProperties1.length ).toBe( privateProperties0.length );
				});
				it("adds a Selector property to the function", function() {
					expect( thingRoot.teeth.Selector ).toBe( "teeth" );
				});
				it("answers the receiver", function() {
					expect( answer ).toBe( thingRoot );
				});
				
				describe("accessor behavior", function() {
					describe("when called with one args", function() {
						var result;
						it("doesn't add any ivar properties to the receiver", function() {
							result = thing.teeth(60);
							sharedProperties2 = Object.keys(thingRoot);
							properties2 = Object.keys(thing);
							privateProperties2 = properties2.filter(IsPrivateSelector);
							expect( sharedProperties2.length ).toBe( sharedProperties1.length );
							expect( properties2.length ).toBe( properties1.length );
							expect( privateProperties2.length ).toBe( privateProperties1.length );
						});
						it("answers the receiver", function() {
							expect( result ).toBe( thing );
						});
					});
					describe("when called with no args", function() {
						it("acts as a getter", function() {
							expect( thing.teeth() ).toBe( 60 );
						});
					});
				});
			});	
		});
		
		describe("#addAccessors", function() {
			it("adds one or more accessors/getters from a delimited string", function() {
				thing.addAccessors("aaa bbb!   Ccc");
				expect( thing.aaa.name ).toBe( "anInstanceVarAccessor" );
				expect( thing.bbb.name ).toBe( "anInstanceVarWriteOneGetter" );
				expect( thing.Ccc.name ).toBe( "anInstanceVarAccessor" );
			});
			it("adds one or more accessors/getters from a delimited string", function() {
				thing.addAccessors("dd,ee ,ff! , gg");
				expect( thing.dd.name ).toBe( "anInstanceVarAccessor" );
				expect( thing.ee.name ).toBe( "anInstanceVarAccessor" );
				expect( thing.ff.name ).toBe( "anInstanceVarWriteOneGetter" );
				expect( thing.gg.name ).toBe( "anInstanceVarAccessor" );
			});
		});
		
		describe("#aliasMethod", function() {
			var answer = thingRoot.aliasMethod("speak", "talk");
			it("adds a ref to an existing method under a new name", function() {
				expect( thingRoot.speak ).toBe( thingRoot.talk );
				expect( thingRoot.speak.Selector ).toBe( "talk" );
			});
		});
	});
	
	describe("when instantiating", function() {
		var obj;
		
		describe("when called without 'new'", function() {
			describe("when not handling errors quietly", function() {
				it("throws an error", function() {
					expect( function () { Thing(); })
						.toThrow( "Thing constructor called without new!" );
				});
			});
			describe("when handling errors quietly", function() {
				it("answers null", function() {
					Top.handleErrorsQuietly(true);
					expect( Thing() ).toBe( null );
					Top.handleErrorsQuietly(false);
				});
			});
		});
		
		describe("when Object constructor is called with no args", function() {
			it("calls #init internally", function() {
				spyOn( TopObjectRoot, "init" ).andCallThrough();
				obj = new TopObject();
				expect( obj.init ).toHaveBeenCalled();
			});
			
			it("assigns a generated id prefixed with the type name", function() {
				var id = obj.id();
				expect( typeof id ).toBe( "string" );
				expect( id.indexOf("TopObject-") ).toBe( 0 );
				expect( id.length ).toBe( "TopObject-".length + 18 );
			});
			
			it("answers a new Object", function() {
				expect( obj.constructorName() ).toBe( "TopObject" );
			});
		});
		
		describe("when Object constructor is called with one args", function() {
			it("calls #init internally", function() {
				spyOn(TopObjectRoot, "init").andCallThrough();
				obj = new TopObject("Big Bad Wolf");
				expect( obj.init ).toHaveBeenCalledWith( "Big Bad Wolf" );
			});
			it("assigns the provided id", function() {
				expect( obj.id() ).toBe( "Big Bad Wolf" );
			});
			it("answers a new Object", function() {
				expect( obj.constructorName() ).toBe( "TopObject" );
			});
			
			describe("when called with a number", function() {
				it("converts the to a string for the id", function() {
					obj = new TopObject(1234);
					expect( obj.id() ).toBe( "1234" );
				});
			});
			
			describe("when it's called with a spec", function() {
				it("retrieved the id from the spec", function() {
					obj = new TopObject({id : 123});
					expect( obj.id() ).toBe( "123" );
				});
				it("doesn't act on spec properties not name in the function parameters list",
				function() {
					obj = new TopObject({id : 123, name : "Tony"});
					expect( obj.name() ).not.toBe( "Tony" );
					expect( obj.name() ).toBe( "123" );
				});
			});
		});
		
	});
		
	describe("when accessing", function() {
		var something = new Thing("My Big ID");
		
		describe("#root", function() {
			it("answers the receiver's shared root object", function() {
				expect( topModule.root() ).toBe( Object.getPrototypeOf(topModule) );
			});
		});
		
		describe("#constructorName", function() {
			it("answers the name of its receiver's constructor function", function() {
				expect( topModule.constructorName() ).toBe( "Module" );
			});
			it("is different from its 'actual' JavaScript constructor name", function() {
				expect( topModule.constructor.name ).toBe( "aTopObject" );
				expect( topModule.constructor.Selector ).toBe( "Module" );
			});
		});
		
		describe("#passInto", function() {
			it("passes its receiver as 'this' into the function arg", function() {
				answer = topModule.passInto(function () {InnerThis = this; return 123;});
				expect( InnerThis ).toBe( topModule );
			});
			it("answers its receiver", function() {
				expect( answer ).toBe( topModule );
			});
			describe("when the function is missing", function() {
				it("does nothing, answering the receiver", function() {
					expect( topModule.passInto(null) ).toBe( topModule );
				});
			});
		});
		
		describe("#passRootInto", function() {
			it("passes its receiver's root as 'this' into the function arg", function() {
				answer = topModule.passRootInto(function () {InnerThis = this; return 123;});
				expect( InnerThis ).toBe( topModule.root() );
			});
			it("answers its receiver", function() {
				expect( answer ).toBe( topModule );
			});
			describe("when the function is missing", function() {
				it("does nothing, answering the receiver", function() {
					expect( topModule.passRootInto(null) ).toBe( topModule );
				});
			});
		});
		
		describe("#id", function() {
			it("answers the receiver's id", function() {
				expect( something.id() ).toBe( "My Big ID" );
			});
		});
		
		describe("#name", function() {
			describe("when called as a setter", function() {
				var answer;
				it("sets the receiver's name", function() {
					answer = something.name("Isis");
					expect( something._Name ).toBe( "Isis" );
				});
				it("answers the receiver", function() {
					expect( answer ).toBe( something );
				});
			});
			describe("when called as a getter", function() {
				it("answers its name", function() {
					expect( something.name() ).toBe( "Isis" );
				});
				describe("unless the receiver's name is undefined", function() {
					it("answers its id instead", function() {
						something.name(undefined);
						expect( something.name() ).toBe( "My Big ID" );
					});
				});
			});	
		});
		
		describe("#toString", function() {
			it("answers a the receiver with an identifying string", function() {
				var thing1, thing2, id1, id2;
				thing1 = new Thing("My ID");
				thing2 = new Thing();
				thing2.name("Carol");
				id1 = thing1.id();
				id2 = thing2.id();
				expect( thing1.toString() ).toBe( thing1.id() );
				expect( thing2.toString() ).toBe( "Carol:" + thing2.id() );
			});
		});
		
		describe("#setEach", function() {
			var thing, answer;
			it("uses the named accessors to set the values from a spec object", function() {
				thing = new Thing();
				thing.addAccessors("height weight age");
				answer = thing.setEach({age : 22, height : 300 , weight : 145});
				expect( thing.age() ).toBe( 22 );
				expect( thing.height() ).toBe( 300 );
				expect( thing.weight() ).toBe( 145 );
			});
			it("answers the receiver", function() {
				expect( answer ).toBe( thing );
			});
			describe("when a property is not already defined", function() {
				it("doesn't work", function() {
					expect( function () { thing.setEach({density : 1.1}) } ).toThrow();
				});
			});
		});
	});
	
	describe("Managing handlers", function() {
		var Person = Testing.newType("Person");
		var bobby, handler;
		bobby = new Person("Bobby");
		
		describe("when instantiated", function() {
			it("by default, it has no handlers", function() {
				expect( Object.keys(bobby.handlers()).length ).toBe( 0 );
			});
		});
		describe("#handlerFor", function() {
			describe("when there isn't a handler for its method", function() {
				it("creates a handler for the method", function() {
					handler = bobby.handlerFor("name");
					expect( typeof handler ).toBe( "function" );
					expect( bobby.handlers()["name"] ).toBe( handler );
					expect( handler ).not.toBe( bobby.name );
					expect( handler() ).toBe( "Bobby" );
					expect( handler("Bob") ).toBe( bobby );
					expect( bobby.name() ).toBe( "Bob" );
				});
			});
			describe("when there's already a handler for the method", function() {
				it("answers the existing handler", function() {
					expect( bobby.handlerFor("name") ).toBe( handler );
				});
			});
		});
		describe("#removeHandlerFor", function() {
			describe("when the handler exist", function() {
				it("removes and answers the handler", function() {
					expect( bobby.removeHandlerFor("name") ).toBe( handler );
					expect( bobby.handlers()["name"] ).toBe( null );
				});
			});
			describe("when the handler doesn't exist", function() {
				it("answers null", function() {
					expect( bobby.removeHandlerFor("name") ).toBe( null );
					expect( Object.keys(bobby.handlers()).length ).toBe( 1 );
				});
			});
			describe("when there were never any handlers", function() {
				it("answers undefined", function() {
					bobby = new Person("Bobbi");
					expect( bobby.removeHandlerFor("name") ).toBe( undefined );
					expect( Object.keys(bobby.handlers()).length ).toBe( 0 );
				});
			});
		});
	});
	
	
	describe("when error handling", function() {
		describe("#signalError", function() {
			describe("when handling errors quietly", function() {
				it("answers undefined, without throwing an error", function() {
					var answer;
					Top.handleErrorsQuietly(true);
					expect( function () {answer = topModule.signalError()} ).not.toThrow();
					expect( answer ).toBe( topModule );
				});
			});
			
			describe("when not handling errors quietly", function() {
				it("throws an error with a message", function() {
					var exception;
					try {
						Top.handleErrorsQuietly(false);
						topModule.signalError("Bad stuff happened!");
					} catch (e) {
						exception = e;
					}
					expect( exception.toString() ).toBe( "Module-Error: Bad stuff happened!" );
					expect( exception.target ).toBe( topModule );
				});
			});
		});
				
		describe("#notYetImplemented - used as a placeholder", function() {
			it("throws an error when called", function() {
				var exception;
				try {
					topModule.notYetImplemented();
				} catch (e) {
					exception = e;
				}
				expect( exception.name ).toBe( "Module-Error" );
				expect( exception.message ).toBe( "Method not yet implemented!" );
			});
		});
		
	});
});
	