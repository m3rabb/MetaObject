// Maurice Rabb
// <mr@mauricerabb.com>
// 2013

// Top
	
	// ### JS Hint global pragmas

	/* global 
		jasmine:false 
	*/
	/* jshint 
		maxerr:66, bitwise:true, curly:true, eqeqeq:true, forin:true, 
		plusplus:false, noarg:true, nonew:true, latedef:true, regexp:true, 
		noempty:false, lastsemic:true, immed:true, expr:true, 
		browser:true, jquery:true, devel:true, globalstrict:true, 
		smarttabs:true, trailing:false, newcap:false, undef:true, unused:false
	*/
	// validthis:true

(function () {
	"use strict";
	
	var RootOf, SpawnFrom, Constructor_PassRootIntoMethod, RandomIntMethod, NewUniqueIdMethod;
	var TopObject, Module, OBJECT_ROOT;
	var ZERO_PADDING, MAX_UNIQUE_ID_LENGTH;
	
	var Math_floor = Math.floor;
	var Math_random = Math.random;
	
	
	RootOf = Object.getPrototypeOf;
	OBJECT_ROOT = Object.prototype;
	
	SpawnFrom = Object.create;
	
	Constructor_PassRootIntoMethod = function passRootInto(rootExtensionAction_) { 
		rootExtensionAction_ && rootExtensionAction_.call(this.prototype);
		return this;
	};


	function AsSelectorList(stringOrArray) {
		return (typeof stringOrArray === "string") ? 
			(stringOrArray.match(/[\w\$!]+/gi) || []) : stringOrArray;
	}
	
	function ExtractParametersAsSelectors(func) {
		var source, parametersString, parameterNames;
		source = func.toString();
		parametersString = source.split(/\(|\)/)[1];
		parameterNames = AsSelectorList(parametersString);
		return parameterNames.map(function (name) {
			var selector, firstChar;
			selector = name.match(/([a-z0-9$_]+)?[a-z0-9$]/i)[0];
			firstChar = selector[0];
			return firstChar.toLowerCase() + selector.slice(1);
		});
	}
	
	function CreateConstructor() {
		return function aTopObject(SpecOrArgs) {
			var init, args;
			if (this == undefined) { 
				Top.signalError(aTopObject.Selector + " constructor called without new!");
				return null;
			}
			init = this.init;
			args = (typeof SpecOrArgs === "object" && RootOf(SpecOrArgs) === OBJECT_ROOT) ? 
				init.ParameterSelectors.map(function (selector) { return SpecOrArgs[selector]; }) : 
				arguments;
			init.apply(this, args);
		};
	}
	
	function NewConstructor(selector, parentConstructor) {
		var parentRoot, constructor, root;
		parentRoot = parentConstructor.prototype;
		
		constructor = CreateConstructor();
		constructor.Selector = selector;
		constructor.ParentConstructor = parentConstructor;
		constructor.passRootInto = Constructor_PassRootIntoMethod;
		
		root = SpawnFrom(parentRoot);
		root.constructor = constructor;
		// root.parentInit = parentRoot.init;
		
		constructor.prototype = root;
		return constructor;
	}

	
	function AsPrivateProperty(selector) {
		var firstChar = selector[0];
		return (firstChar === "_") ? selector : "_" + firstChar.toUpperCase() + selector.slice(1);
	}

	// function AsPrivateProperty(selector, propertyName_) {
	// 	var firstChar, propertyName;
	// 	firstChar = selector[0];
	// 	propertyName = (propertyName_ === undefined) ? selector : propertyName_;
	// 	return (firstChar === "_") ? propertyName : 
	// 		"_" + firstChar.asUpperCase() + propertyName.slice(1);
	// }

	function CreateInstanceVarAccessor(selector, PrivatePropertyName) {
		var accessor = function anInstanceVarAccessor(value_) {
			return arguments.length ? 
				(this[PrivatePropertyName] = value_, this) : this[PrivatePropertyName];
		};
		accessor.Selector = selector;
		return accessor;
	}

	function CreateClosuredAccessor(selector, PersistentValue) {
		var accessor = function aClosuredVarAccessor(value_) {
			return arguments.length ? (PersistentValue = value_, this) : PersistentValue;
		};
		accessor.Selector = selector;
		return accessor;
	}

	function CreateGetter(selector, PrivatePropertyName) {
		var getter = function anInstanceVarWriteOneGetter(oneTimeInitializationValue_) {
			if ( !arguments.length ) { return this[PrivatePropertyName]; }
			if (this.hasOwnProperty(PrivatePropertyName)) { 
				this.signalError("Getter property can only be used as a setter once!");
			} else {
				this[PrivatePropertyName] = oneTimeInitializationValue_;
			}
			return this;
		};
		getter.Selector = selector;
		return getter;
	}

	function OnSpecDo(target, spec, action) {
		var propertyName;
		for (propertyName in spec) {
			if (spec.hasOwnProperty(propertyName)) {
				action.call(target, spec[propertyName], propertyName);
			}
		}
	}
	
	RandomIntMethod = function randomInt(minInt_, maxInt) {
	    var min, max;
		if (arguments.length <= 1) {
			min = 0, max = minInt_;
		} else {
			min = minInt_, max = maxInt;
		}
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	
	ZERO_PADDING = "0000000000000000";
	MAX_UNIQUE_ID_LENGTH = (+new Date("2067-09-29") * 0xFFFFFFFFFFFF).toString(36).length;

	function NewUniqueId(prefix, seedDate, seedValue) {
	    var id = seedDate * seedValue;
	    id = id.toString(36);   //                                 
	    return prefix + ZERO_PADDING.slice(0, MAX_UNIQUE_ID_LENGTH - id.length) + id;
	}

	NewUniqueIdMethod = function newUniqueId(prefix_) {
	    var prefix = prefix_ || "";
	    return NewUniqueId(prefix, Date.now(), RandomIntMethod(0xFFFFFFFFFFFF));
	};

	function Yourself() { return this; }
	
	
	TopObject = NewConstructor("TopObject", Object);
		
	TopObject.passRootInto(function () {
		this.addMethod = function addMethod(func) {
			var selector = func.name;
			func.Selector = selector;
			if (selector === "init") { 
				func.ParameterSelectors = ExtractParametersAsSelectors(func);
				func.ParentInit = RootOf(this).init || Yourself;
			}
			this[selector] = func;
			return this;
		};

		this.addMethod(function addGetter(selector) {
			var propertyName = AsPrivateProperty(selector);
			this[selector] = CreateGetter(selector, propertyName);
			return this;
		});
		
		this.addMethod(function addAccessor(selector, closuredValue_) {
			var propertyName;
			if (arguments.length < 2) {
				propertyName = AsPrivateProperty(selector);
				this[selector] = CreateInstanceVarAccessor(selector, propertyName);
			} else {
				this[selector] = CreateClosuredAccessor(selector, closuredValue_);
			}
			return this;
		});
		
		this.addMethod(function addAccessors(selectors) {
			var selectorsList = AsSelectorList(selectors);
			selectorsList.forEach(function (selector) { 
				var length = selector.length;
				if (selector[length - 1] === "!") {
					this.addGetter(selector.slice(0, length - 1));
				} else {
					this.addAccessor(selector);
				}
			}, this);
			return this;
		});
		
		this.addMethod(function aliasMethod(aliasSelector, originalSelector) {
			this[aliasSelector] = this[originalSelector];
			return this;
		});
		
		this.addAccessors("id!");

		this.addMethod(function init(id_) {
			var prefix, id;
			prefix = this.constructorName() + "-";
			id = (id_ === undefined) ? NewUniqueIdMethod(prefix) : "" + id_;
			this.id(id); // The unique resource id
			return this;
		});


		this.addMethod(function root() { return RootOf(this); });
		
		this.addMethod(function constructorName() { 
			return this.constructor.Selector; 
		});
		
		this.addMethod(function passInto(extensionAction_) {
			extensionAction_ && extensionAction_.call(this);
			return this;
		});

		this.addMethod(function passRootInto(rootExtensionAction_) {
			rootExtensionAction_ && rootExtensionAction_.call(RootOf(this));
			return this;
		});

		this.addMethod(function name(name_) { 
			var currentName;
			if (arguments.length) { this._Name = name_; return this; }
			currentName = this._Name;
			return (currentName === undefined) ? this._Id : currentName;
		});

		this.addMethod(function toString() {
			var name = this._Name;
			return (name ? name + ":" : "") + this._Id;
		});
		

		this.addMethod(function setEach(spec) {
			OnSpecDo(this, spec, function (value, setter) { this[setter](value); });
			return this;
		});
		
		
		this.addMethod(function handlers() { 
			return this._Handlers || (this._Handlers = Top.newStash());
		});

		this.addMethod(function handlerFor(selector) {
		    var handlers = this.handlers();
			return handlers[selector] || 
				(handlers[selector] = Top.bind(this, this[selector]));
		});

		this.addMethod(function removeHandlerFor(selector) {
			var handlers, handler;
			if ((handlers = this._Handlers)) {
				handler = handlers[selector];
				handlers[selector] = null;
			}
			return handler;
		});

		this.addMethod(function signalError(message) {
			var error;
			if (Top.handleErrorsQuietly()) {return this;}
			error = new Error(message);
			error.name = this.constructorName() + "-Error";
			error.target = this;
			throw error;
		});

		this.addMethod(function notYetImplemented() {
			return this.signalError("Method not yet implemented!");
		});

		this.addMethod(function notYetTested() {
			return this.signalError("Method not yet tested!");
		});
	
	});
	

	Module = NewConstructor("Module", TopObject);

	Module.passRootInto(function () {
		this.addMethod(function init(name, parentContext_, extensionAction_) {
			var parentContext, extensionAction;
			init.ParentInit.call(this);
			
			if (typeof parentContext_ === "function") {
				extensionAction = parentContext_;
			} else {
				parentContext = parentContext_;
				extensionAction = extensionAction_;
			}
			
			this.parentContext(parentContext || null);
			this.name(name || this.id());
			return this.passInto(extensionAction);
		});
		
		this.addAccessors("parentContext!");
		
		this.addMethod(function name(name_) {
			var currentName, parentContext;
			currentName = this._Name;
			if (!arguments.length) { return currentName; }
			parentContext = this.parentContext();
			if (parentContext) {
				if (currentName !== undefined) { delete parentContext[this._Name]; }
				parentContext[name_] = this;
			}
			this._Name = name_;
			return this;
		});

		this.addMethod(function newType(typeName, rootExtensionAction_) {
			return this.newSubTypeFrom(typeName, TopObject, rootExtensionAction_);
		});

		this.addMethod(function newSubTypeFrom(typeName, parent, rootExtensionAction_) {
			var parentConstructor, constructor;
			this[typeName] && this.signalError("Type already in module!");
			switch (typeof parent) {
				case "function" : 
					parentConstructor = parent; 
					break;
				case "string"   : 
					parentConstructor = this[parent] || 
						this.signalError("Unknown parent constructor name!: " + parent); 
					break;
				default : this.signalError("Invalid parent argument!");
			}
			constructor = NewConstructor(typeName, parentConstructor);
			this[typeName] = constructor;
			return constructor.passRootInto(rootExtensionAction_);
		});
		
		this.addMethod(function newSubModule(moduleName, extensionAction_) {
			var module = SpawnFrom(this);
			module.init(moduleName, this);
			this[moduleName] = module;
			return module.passInto(extensionAction_);
		});
	});
	
	
	window.Top = new Module("Top", window, function () {
		var GUID_SEGMENTS, GUID_SEGMENTS_LENGTHS;
		
		this.Object = TopObject;
		this.Module = Module;
			
		this.addMethod(function bind(Target, Func) {
		    return function delegator(/* arguments */) {
		        return Func.apply(Target, arguments);
		    };
		});

		this.addMethod(RandomIntMethod);

		this.addMethod(NewUniqueIdMethod);
		

		GUID_SEGMENTS_LENGTHS = [8, 4, 4, 4, 6, 6];
		GUID_SEGMENTS = [0xFFFFFFFF, 0xFFFF, 0xFFF, 0x3FFF, 0xFFFFFF, 0xFFFFFF];
		GUID_SEGMENTS = GUID_SEGMENTS.map(function (segment) { return segment + 1; });

		this.addMethod(function isGUID(string) {
		    var match;
		    if (typeof string !== "string") { return false; }
		    match = string.match(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/gi);
		    return (match !== null) && (match.length === 1);
		});

		this.addMethod(function newGUID() { 
			// This newGUID4 from http://jsperf.com/guid-makers/3
			// http://en.wikipedia.org/wiki/Uuid#Version_4_.28random.29
			// xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx    y -> & 0x3 | 0x8;
			var index, seedValues, substrings, grouping, padding;;
			index = GUID_SEGMENTS.length;
			seedValues = [];
			while (index-- > 0) {
				seedValues[index] = Math_floor(Math_random() * GUID_SEGMENTS[index]);
			}
			substrings = [];
		    seedValues[2] += 0x4000;
		    seedValues[3] += 0x8000;
			index = 0;
		    while (index < 6) {
		        grouping = seedValues[index].toString(16);
		        padding = ZERO_PADDING.slice(0, GUID_SEGMENTS_LENGTHS[index] - grouping.length);
		        substrings.push(padding, grouping);
		        if (index++ < 4) { substrings.push("-"); }
		    }
		    return substrings.join("");
		});
		
		// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
		// http://frugalcoder.us/post/2012/01/13/javascript-guid-uuid-generator.aspx

		this.spawnFrom = SpawnFrom;

		this.addMethod(function newStash() { return this.spawnFrom(null); });

		this.addAccessor("handleErrorsQuietly", false);
		
		this.addMethod(function isTopObject(target) {
			switch (typeof target) {
				case "function" : return (target.passRootInto === Constructor_PassRootIntoMethod);
				case "object"   : return (target instanceof Top.Object);
			}
			return false;
		});
		
		this.addMethod(function asDate(dateValue_) {
			if (dateValue_ instanceof Date) { return dateValue_; }
			switch (typeof dateValue_) {
				case "undefined" : 
					return new Date();
				case "string" : 
				case "number" :
					return new Date(dateValue_);
			}
			return this.signalError("Argument cannot be converter to a date");
		});
		
	});
})();

