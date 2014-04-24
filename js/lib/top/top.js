
// Lead Developer: Maurice Rabb <mr@mauricerabb.com>
// Contributing Developer: Tyler Camp <tyler.camp@loop.colum.edu>



//## Intro
//  Top promotes a modified understanding of JavaScript's prototypical inheritance model. JS object programming is
//  instead introduced in the form of Constructors, Roots, and Instances. Overall, constructors create instances
//  from the instance root (prototype) that they maintain internally. A constructor has two types of roots - its own
//  'constructor' root, and the root that is used to create an instance when it is invoked with 'new'. The
//  instance root can be modified to expand the instances created by the constructor.
//
//  Top also provides architectural design tools, based on the Top object model, for creating 'modules'. These provide
//  you with methods for creating new types, which are invoked via i.e.: `new Top.MyModule.SomeType(...)`.
//
//  Many functions and tools are provided to create natural separation and organization of your code, all the while
//  maintaining expressivity in the API. If JavaScript has good parts, then code architecting does too. Top attempts
//  to keep you in the good parts by giving more expressive ways to define your architecture and excluding features
//  that commonly lead to code smell.
//
//  Top also provides various convenience functions, such as:
//
//- Automated accessors
//- GUID utilities
//- Simplified error reporting

(function () {
	"use strict";
    // ## Architectural Tools
    // Sets up the functions used for manipulating/generating the Top object model.

    // ### Low-level JavaScript Object Manipulation

    var RootOf, SpawnFrom, Constructor_PassInstanceRootIntoMethod;

    // Instantiates a new Top Constructor, boostrapping the 'init' function to be called upon object instantiation.
    //  Helper function, only used by function `NewConstructor()`
    function CreateConstructor() {
        return function aTopObject(SpecOrArgs) {
            var init, args;
            /* Prevent the use of a Constructor without instantiation of an object (a good rule and
             *  prevention of a common pitfall)
             */
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

    //  Creates a new Top object constructor and configures it with the given properties.
    //  Every constructor gets a passInstanceRootInto method, which is used to expand the root
    //  of the instances that the constructor will generate. This method is added both to
    //  all Top constructors and all Top objects.
    function NewConstructor(selector, parentConstructor) {
        var parentRoot, constructor, root;
        parentRoot = parentConstructor.prototype;

        constructor = CreateConstructor();
        constructor.Selector = selector;
        constructor.ParentConstructor = parentConstructor;

        /* Bootstrapping of passInstanceRootInto */
        constructor.passInstanceRootInto = Constructor_PassInstanceRootIntoMethod;

        root = SpawnFrom(parentRoot);
        root.constructor = constructor;

        constructor.prototype = root;
        return constructor;
    }

    //  `Yourself()` is used in TopObject.addMethod as a default init() function when the current instance root
    //      doesn't have a parent init. Defined in Top-global scope for reuse.
    function Yourself() { return this; }


    // Takes the selector string and returns a transformed version of the string, as would be appropriate for
    //  marking a selector private. The current implementation simply prefixes an '_' to denote private selectors.
    function AsPrivateProperty(selector) {
        var firstChar = selector[0];
        return (firstChar === "_") ? selector : "_" + firstChar.toUpperCase() + selector.slice(1);
    }

	// `RootOf()` obtains the root of the specified object; its implementation as getPrototypeOf is based on how
    //  the 'root' of any object is its prototype.
	RootOf = Object.getPrototypeOf;


    // `SpawnFrom()` instantiates an object using the _root_ that is passed to it. Bootstrapped into `Top`.
	SpawnFrom = Object.create;

    //  `passInstanceRootInto()` is a public-facing API that is accessible within all Top-created constructors. The
    //      function is bootstrapped to new constructors during the creation process in function `NewConstructor()`.
    Constructor_PassInstanceRootIntoMethod = function passInstanceRootInto(rootExtensionAction) {
        rootExtensionAction && rootExtensionAction.call(this, this.prototype);
        return this;
    };

    // ### Accessor Generation Tools
    // Top provides a variety of utilities for automatic generation of getter/setter functions. Putting aside JS
    //  native getters/setters (performance, compatibility), a getter/setter is a single normal function within
    //  an object. An accessor is a single behavior that acts as both a setter and a getter.

    // These internal functions are bootstrapped into TopObject later on.

    // Creates an accessor that is mapped to an existing internal property.
    function CreateInstanceVarAccessor(selector, privatePropertyName) {
        var accessor = function anInstanceVarAccessor(value_) {
            return arguments.length ?
                (this[privatePropertyName] = value_, this) : this[privatePropertyName];
        };
        accessor.Selector = selector;
        return accessor;
    }

    // A Custom accessor allows you to provide your own setter/getter functions if you want to customize a
    // getter/setter behavior. Bootstrapped into TopObject as `TODO: FILL`
    function CreateCustomVarAccessor(selector, setter, getter) {
        var accessor = function aCustomVarAccessor(value_) {
            if (value_ === undefined) {
                if (getter !== undefined && getter !== null)
                    return getter.call(this);
                else {
                    if (this !== undefined)
                        this.signalError("Attempted to access custom getter for '" + selector + "' but no getter was defined");
                }
            }
            else {
                if (setter !== undefined && setter !== null)
                    setter.call(this, value_);
                else {
                    if (this !== undefined)
                        this.signalError("Attempted to access custom setter for '" + selector + "' but no setter was defined");
                }

                return this;
            }
        };
        accessor.Selector = selector;
        return accessor;
    }

    // A closured accessor is used for maintaining a value that does not exist in the object that the accessor
    //  is bound to. The accessor does not map to an internal value.
    function CreateClosuredAccessor(selector, persistentValue) {
        var accessor = function aClosuredVarAccessor(value_) {
            return arguments.length ? (persistentValue = value_, this) : persistentValue;
        };
        accessor.Selector = selector;
        return accessor;
    }

    // A getter is called without any parameters to return an internal value. This value is assigned by
    //  calling the getter with the value as a parameter. The getter can't be called in that fashion again after the
    //  first assignment.
    function CreateGetter(selector, privatePropertyName) {
        var getter = function anInstanceVarWriteOneGetter(oneTimeInitializationValue_) {
            if ( !arguments.length ) { return this[privatePropertyName]; }
            if (this.hasOwnProperty(privatePropertyName)) {
                this.signalError("Getter property can only be used as a setter once!");
            } else {
                this[privatePropertyName] = oneTimeInitializationValue_;
            }
            return this;
        };
        getter.Selector = selector;
        return getter;
    }

    var ACCESSOR_GETTER = 1, ACCESSOR_SETTER = 2, ACCESSOR_NOT_FUNCTION = 3, ACCESSOR_UNKNOWN = -1;
    function GetAccessorType(accessorFunction) {
        if (typeof (accessorFunction) != 'function')
            return ACCESSOR_NOT_FUNCTION;

        switch (accessorFunction.length) {
            case (0): return ACCESSOR_GETTER;
            case (1): return ACCESSOR_SETTER;
            default: return ACCESSOR_UNKNOWN;
        }
    }




    // ## Utility Methods

    // ##### Object-Selector Bridging
    //  Various functions for extracting relevant data from JavaScript objects/functions.

    /*  TODO: Double-check this documentation */
    //  Extracts the parameters of the given function and returns an array of strings that represents the
    //      names of each parameter.
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

    // `AsSelectorList` extracts whitespace-separated words from the given string, effectively returning an
    //  array of strings that are suitable for being selectors. String arrays are simply returned.
    /* TODO: Some parsing should be done to verify that the strings in an array input are suitable as selectors */
    function AsSelectorList(stringOrStringArray) {
        return (typeof stringOrStringArray === "string") ?
            (stringOrStringArray.match(/[\w\$!]+/gi) || []) : stringOrStringArray;
    }

    //  Calls the given action on all properties in the specifier for the given target. 'this' is bound
    //      to the object being iterated over.
    /* TODO: OnSpecDo should be updated to pass the target as a parameter instead of binding as 'this' */
    function OnSpecDo(target, spec, action) {
        var propertyName;
        for (propertyName in spec) {
            if (spec.hasOwnProperty(propertyName)) {
                action.call(target, spec[propertyName], propertyName);
            }
        }
    }

    // #### Random Number Generation
    //  Primarily for convenience, this type of randomInt function is commonly needed throughout projects in general.
    // Indirection for bootstrapping.
    RandomIntMethod = function randomInt(minInt_, maxInt) {
        var min, max;
        if (arguments.length <= 1) {
            min = 0, max = minInt_;
        } else {
            min = minInt_, max = maxInt;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /* NOTE TO MAURICE: I noticed that the Math_floor and Math_random methods weren't doing anything and have
     *  them left out for now. I'm not sure what their intent was; I replaced their 1 usage with direct calls.  */

    // #### 128-bit ID Generation Functions
    var ZERO_PADDING, MAX_UNIQUE_ID_LENGTH, RandomIntMethod, NewUniqueIdMethod;

    ZERO_PADDING = "0000000000000000";
	MAX_UNIQUE_ID_LENGTH = (+new Date("2067-09-29") * 0xFFFFFFFFFFFF).toString(36).length;

	function NewUniqueId(prefix, seedDate, seedValue) {
	    var id = seedDate * seedValue;
	    id = id.toString(36);   //
	    return prefix + ZERO_PADDING.slice(0, MAX_UNIQUE_ID_LENGTH - id.length) + id;
	}

    //  The API-facing generation function, separated out for testing purposes. Bootstrapped to Top.
	NewUniqueIdMethod = function newUniqueId(prefix_) {
	    var prefix = prefix_ || "";
	    return NewUniqueId(prefix, Date.now(), RandomIntMethod(0xFFFFFFFFFFFF));
	};

    // ## Base Object Types
    var TopObject, Module, OBJECT_ROOT;
    OBJECT_ROOT = Object.prototype;

    // # TopObject
    // Any object instantiated through Top inherits from TopObject. TopObject provides most root-level manipulation
    //  functions, error reporting, accessors, naming, and others.
    TopObject = NewConstructor("TopObject", Object);

    // TopObject is a Constructor, and a Constructor maintains a root for the instances that it creates. This use
    //  of passInstanceRootInto shows that, when using the method, the instance root is passed as a parameter
    //  to the extension method, which is then expanded upon to define the root for instantiated objects.
	TopObject.passInstanceRootInto(function (instanceRoot) {
        //  `TopObject.addMethod()` is a very commonly used method that is intended to be the way that a root is
        //      expanded. The given function is added to the instance root, and the function's name is used as
        //      the name of the new member.
        instanceRoot.addMethod = function addMethod(func) {
            if (func === undefined)
                func = {};
			var selector = func.name;
			func.Selector = selector;
			if (selector === "init") {
				func.ParameterSelectors = ExtractParametersAsSelectors(func);
				func.ParentInit = RootOf(this).init || Yourself;
			}
			this[selector] = func;
			return this;
		};

        // Accessor methods whose general functionalities were previously outlined in the global scope.
        instanceRoot.addMethod(function addGetter(selector) {
			var propertyName = AsPrivateProperty(selector);
			this[selector] = CreateGetter(selector, propertyName);
			return this;
		});

        instanceRoot.addMethod(function addAccessor(selector, closuredValue_) {
			var propertyName;
			if (arguments.length < 2) {
				propertyName = AsPrivateProperty(selector);
				this[selector] = CreateInstanceVarAccessor(selector, propertyName);
			} else {
				this[selector] = CreateClosuredAccessor(selector, closuredValue_);
			}
			return this;
		});

        //  Adds a list of accessors to the current TopObject. 'selectors' is a whitespace-separated string of selectors
        //  that will be used as the names of the generated accessors. Any accessor that ends in a "!" is interpreted as
        //      being getter-only.
        instanceRoot.addMethod(function addAccessors(selectors) {
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

        //  When defining a custom accessor, you must define at least a setter or a getter. Ordering is arbitrary.
        instanceRoot.addMethod(function addCustomAccessor(selector, setterOrGetter1_, setterOrGetter2_) {
            var getter = null, setter = null;
            var firstType, secondType;
            firstType = GetAccessorType(setterOrGetter1_);
            secondType = GetAccessorType(setterOrGetter2_);

            switch (firstType) {
                case (ACCESSOR_GETTER): getter = setterOrGetter1_; break;
                case (ACCESSOR_SETTER): setter = setterOrGetter1_; break;
                case (ACCESSOR_UNKNOWN): this.signalError("Unable to deduce accessor type for first setterOrGetter");
            }

            switch (secondType) {
                case (ACCESSOR_GETTER): getter = setterOrGetter2_; break;
                case (ACCESSOR_SETTER): setter = setterOrGetter2_; break;
                case (ACCESSOR_UNKNOWN): this.signalError("Unable to deduce accessor type for second setterOrGetter");
            }

            this[selector] = CreateCustomVarAccessor(selector, setter, getter);
            return this;
        });

        // `aliasMethod` provides a more expressive way to create method aliases than simple assignment.
        instanceRoot.addMethod(function aliasMethod(aliasSelector, originalSelector) {
			this[aliasSelector] = this[originalSelector];
			return this;
		});

        instanceRoot.addAccessors("id!");

        //  `init` is the Top way of defining a constructor. In a subtype, simply create another `init` via
        //  `TopObject.addMethod`. Invoke `this.ParentInit.init(...)` to begin the constructor chain. `this` will
        //  be the `init` function that you've defined, and `ParentInit` will be the `init` of the parent type.
        //  `ParentInit` is created under a special condition in `addMethod`, which is followed when adding a method
        //  with the name `init`.
        instanceRoot.addMethod(function init(id_) {
			var prefix, id;
			prefix = this.constructorName() + "-";
			id = (id_ === undefined) ? NewUniqueIdMethod(prefix) : "" + id_;
			this.id(id); // The unique resource id
			return this;
		});

        //  Gets the root of the given TopObject.
        instanceRoot.addMethod(function root() { return RootOf(this); });

        instanceRoot.addMethod(function constructorName() {
			return this.constructor.Selector;
		});

        //  `passInto` calls the extension action with the invokee as the parameter, and with the invokee bound
        //  as 'this'. It is one of the core functions that encourages code segmentation. Generally used to expand upon
        //  an object, use of this function also helps prevent dependent data from leaking into outer scopes.
        instanceRoot.addMethod(function passInto(extensionAction) {
            extensionAction && extensionAction.call(this, this);
            return this;
        });

        //  `passRootInto` is the other segmentation function and is used to expand upon root objects.
        instanceRoot.addMethod(function passRootInto(rootExtensionAction) {
			rootExtensionAction && rootExtensionAction.call(this, RootOf(this));
			return this;
		});

        //  A setter/getter for the Top-determined name of this instance. If this property
        //  has not been specified by the user, the instance ID is returned by default.
        instanceRoot.addMethod(function name(name_) {
			var currentName;
			if (arguments.length) { this._Name = name_; return this; }
			currentName = this._Name;
			return (currentName === undefined) ? this._Id : currentName;
		});

        //  Creates a human-readable string that identifies a specific Top object
        instanceRoot.addMethod(function toString() {
			var name = this._Name;
			return (name ? name + ":" : "") + this._Id;
		});

        /* TODO: Not sure of what this is supposed to do? */
        instanceRoot.addMethod(function setEach(spec) {
			OnSpecDo(this, spec, function (value, setter) { this[setter](value); });
			return this;
		});

        /* TODO: Handlers? */
        instanceRoot.addMethod(function handlers() {
			return this._Handlers || (this._Handlers = Top.newStash());
		});

        instanceRoot.addMethod(function handlerFor(selector) {
		    var handlers = this.handlers();
			return handlers[selector] ||
				(handlers[selector] = Top.bind(this, this[selector]));
		});

        instanceRoot.addMethod(function removeHandlerFor(selector) {
			var handlers, handler;
			if ((handlers = this._Handlers)) {
				handler = handlers[selector];
				handlers[selector] = null;
			}
			return handler;
		});

        //  `signalError` is a simple method for allowing error reporting within a TopObject. Invocation is as
        //  simple as `this.signalError("Something went wrong");`.
        instanceRoot.addMethod(function signalError(message) {
			var error;
			if (Top.handleErrorsQuietly()) {
                console.warn(message);
                return this;
            }

            console.error(message);

			error = new Error(message);
			error.name = this.constructorName() + "-Error";
			error.target = this;
			throw error;
		});

        //  `notYetImplemented` and `notYetTested` are maintenance tools that output a debug message when invoked. They
        //  are available in every TopObject, so invocation is simply a matter of 'this.notYetImplemented` or
        //  `this.notYetTested`
        instanceRoot.addMethod(function notYetImplemented() {
			return this.signalError("Method not yet implemented!");
		});

        instanceRoot.addMethod(function notYetTested() {
			return this.signalError("Method not yet tested!");
		});

	});


    //
    //
    // # Module
    // Modules are objects with the same functionality as a TopObject, but with the added ability to create types,
    //  subtypes, and submodules. Moving Type management into Modules allows us to create natural hierarchies
    //  and allows Top to automatically turn your types into TopObjects.
	Module = NewConstructor("Module", TopObject);

	Module.passInstanceRootInto(function (instanceRoot) {
        //  The Module constructor requires its name, and optionally, the parent object that will contain the
        //  module, and an extension action for expanding upon the module object.
        instanceRoot.addMethod(function init(name, parentContext_, extensionAction_) {
            /* TODO: Document how the call chain for 'init' is processed */
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

        instanceRoot.addAccessors("parentContext!");

        instanceRoot.addMethod(function name(name_) {
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

        //  Creates and returns a new type, using the optional `rootExtensionAction_` parameter to expand upon
        //  the root for the newly-created type. New types are automatically subtyped from TopObject.
        instanceRoot.addMethod(function newType(typeName, rootExtensionAction_) {
			return this.newSubTypeFrom(typeName, TopObject, rootExtensionAction_);
		});

        instanceRoot.addMethod(function newSubTypeFrom(typeName, parent, rootExtensionAction_) {
			var parentConstructor, constructor;
			this[typeName] && this.signalError("Type already in module!");
			switch (typeof parent) {
				case "function" :
					parentConstructor = parent;
					break;
                case "string"   :
                    /// __proto__ contains "Object" at this point, but for
                    ///     some reason the member isn't being found
					parentConstructor = this[parent] ||
						this.signalError("Unknown parent constructor name!: " + parent);
					break;
				default : this.signalError("Invalid parent argument!");
			}
			constructor = NewConstructor(typeName, parentConstructor);
			this[typeName] = constructor;
			return constructor.passInstanceRootInto(rootExtensionAction_);
		});

        instanceRoot.addMethod(function newSubModule(moduleName, extensionAction_) {
			var module = SpawnFrom(this);
			module.init(moduleName, this);
			this[moduleName] = module;
			return module.passInto(extensionAction_);
		});
	});



    // # Top
    //  The global Top object/namespace.
	window.Top = new Module("Top", window, function (module) {
		var GUID_SEGMENTS, GUID_SEGMENTS_LENGTHS;

        //  The Top object exposes the Object and Module types
        module.Object = TopObject;
        module.Module = Module;

        module.addMethod(function bind(Target, Func) {
		    return function delegator(/* arguments */) {
		        return Func.apply(Target, arguments);
		    };
		});

        module.addMethod(RandomIntMethod);

        module.addMethod(NewUniqueIdMethod);

        //  GUID generation methods
		GUID_SEGMENTS_LENGTHS = [8, 4, 4, 4, 6, 6];
		GUID_SEGMENTS = [0xFFFFFFFF, 0xFFFF, 0xFFF, 0x3FFF, 0xFFFFFF, 0xFFFFFF];
		GUID_SEGMENTS = GUID_SEGMENTS.map(function (segment) { return segment + 1; });

        module.addMethod(function isGUID(string) {
		    var match;
		    if (typeof string !== "string") { return false; }
		    match = string.match(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/gi);
		    return (match !== null) && (match.length === 1);
		});

        module.addMethod(function newGUID() {
			/* This newGUID4 from http://jsperf.com/guid-makers/3
			 * http://en.wikipedia.org/wiki/Uuid#Version_4_.28random.29
			 * xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx    y -> & 0x3 | 0x8;
			 */
			var index, seedValues, substrings, grouping, padding;
			index = GUID_SEGMENTS.length;
			seedValues = [];
			while (index-- > 0) {
				seedValues[index] = Math.floor(Math.random() * GUID_SEGMENTS[index]);
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

		/* http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript */
		/* http://frugalcoder.us/post/2012/01/13/javascript-guid-uuid-generator.aspx */

        //
        module.spawnFrom = SpawnFrom;

        module.addMethod(function newStash() { return this.spawnFrom(null); });

        module.addAccessor("handleErrorsQuietly", false);

        module.addMethod(function isTopObject(target) {
			switch (typeof target) {
				case "function" : return (target.passInstanceRootInto == Constructor_PassInstanceRootIntoMethod);
				case "object"   : return (target instanceof Top.Object);
			}
			return false;
		});

        module.addMethod(function asDate(dateValue_) {
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

