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

(function (global) {
	"use strict";

	function factory(require) {

		var RootOf      = Object.getPrototypeOf;
		var SpawnFrom   = Object.create;
		var IsArray     = Array.isArray;
		var Array_join  = Array.prototype.join;
		var Math_floor  = Math.floor;
		var Math_random = Math.random;

		var HandleErrorsQuietly = false;

		var ParenthesesMatcher = /\(|\)/;
		var SelectorMatcher    = /[\w\$_!&]+/gi;
		var VowelMatcher       = /^[aeiou]/i;

		var Implementation_root = SpawnFrom(null);
		var 	Stash_root        = SpawnFrom(Implementation_root);
		var 	Default_root      = SpawnFrom(Implementation_root);

		var Thing_root, Type_root, Context_root;
		var Thing,      Type,      Context;
		var Top;

		function NewStash() { return SpawnFrom(Stash_root); }

		function IsUpperCase(target) {
			return target.match && target.match(/^[A-Z]/);
		}

		function AsMemoizing(FactoryFunc) {
			var Repo = newStash();
			return function (id) {
				return Repo[id] || (Repo[id] = FactoryFunc.apply(null, arguments));
			}
		}

		var SelectorMethodFor = AsMemoizing(function NewSelectorMethod(Selector) {
			return function selector() { return Selector; }
		});

		function AsMethodNamed(handler, selector) {
			if (handler.selector) { return handler; }
			handler.selector = SelectorMethodFor(selector);
			// handler.method = Method.newInstance(selector, handler);
			// handler.selector = handler.method.selector;
			return handler;
		}

		function AsMethod(namedFunction) {
			return AsMethodNamed(namedFunction, namedFunction.name);
		}

		function NewUnimplementedMethod(Selector) {
		return AsMethodNamed(function (/* arguments */) {  // _unimplemented
				return this._noSuchMethod(Selector, arguments);
			}, Selector);
		}

		function NewSuperMethod(Selector) {
			return AsMethodNamed(function (/* arguments */) { // _super
				// return this.superPerformWithArgs(Selector, arguments);
				return SuperMethodOf(Selector, this).apply(this, arguments);
			}, "_super_" + Selector);
		}

		function EnsureDefaultMethodsFor(selector) {
			if (Default_root[selector]) { return; }
			var unimplementedMethod = NewUnimplementedMethod(selector);
			var superMethod = NewSuperMethod(selector);

			Default_root[selector] = unimplementedMethod;
			Default_root[superMethod.selector()] = superMethod;
		}

		function SignalError(target, message) {
			var error;

			if (HandleErrorsQuietly) {
				console.warn(message);
			} else {
				console.error(message);
				error = new Error(message);
				error.name = "TopError";
				error.target = this;
				throw error;
			}
		}


		EnsureDefaultMethodsFor("_noSuchMethod");

		Default_root._noSuchMethod =
		 AsMethod(function _noSuchMethod(selector, args) {
			var message =
				this.type().name() + " has no such method #" + selector + "!";
			SignalError(this, message);
			return null;
		});



		Thing_root = SpawnFrom(Default_root);

		EnsureDefaultMethodsFor("atPutMethod");

		Thing_root.atPutMethod = function atPutMethod(selector, method) {
			this[selector] = AsMethodNamed(method, selector);
			EnsureDefaultMethodsFor(selector);
			return this;
		};

		Thing_root.atPutMethod("addMethod", function (namedFunction) {
			return this.atPutMethod(namedFunction.name, namedFunction);
		});

		Thing_root.addMethod(function addProperty(name, value) {
			this[name] = value;
			return this;
		});


		Thing_root.addMethod(function name() {
			return this._Name;
		});

		Thing_root.addMethod(function toString() {
			var name = this.name();
			var typeName = this.type().name();
			var prefix = typeName.match(VowelMatcher) ? "an " : "a ";
			return name !== undefined ?
				typeName + ":" + name : prefix + typeName;
		});

		Thing_root.addMethod(function signalError(/* args */) {
			var message = Array_join(arguments, "");
			SignalError(this, message);
			return this;
		});



		function ExecuteOn(method, receiver, arg1, arg2, arg3, allArgs) {
			switch (allArgs.length) {
				case 0 : return method.call(receiver);
				case 1 : return method.call(receiver, arg1);
				case 2 : return method.call(receiver, arg1, arg2);
				case 3 : return method.call(receiver, arg1, arg2, arg3);
			}
			var remainingArgs = Array_slice.call(allArgs, 1);
			return method.apply(receiver, remainingArgs);
		}

		function SuperMethodOf(selector, receiver) {
			var originalMethod = receiver[selector];
			var nextReceiver = receiver;
			var nextMethod;
			do {
				nextReceiver = RootOf(nextReceiver);
				nextMethod = nextReceiver[selector];
			} while (nextMethod === originalMethod);
			return nextMethod;
		}

		Thing_root.addMethod(function yourself() { return this; });

		Thing_root.addMethod(function perform(selector, arg_, arg__, arg___) {
			return ExecuteOn(this[selector], this, arg_, arg__, arg___, arguments);
		});

		Thing_root.addMethod(function performWithArgs(selector, args) {
			return this[selector].apply(this, args);
		});

		Thing_root.addMethod(function superPerform(selector, arg_, arg__, arg___) {
			var method = SuperMethodOf(selector, this);
			return ExecuteOn(method, this, arg_, arg__, arg___, arguments);
		});

		Thing_root.addMethod(function superPerformWithArgs(selector, args) {
			return SuperMethodOf(selector, this).apply(this, args);
		});


		Thing_root.addMethod(function init(name_) {
			// this.superPerformWithArgs("init", arguments);
			// this._super_init.apply(this, arguments);
			if (arguments.length) { this._Name = name_; }
			return this;
		});



		function CreatePureGetter(Value) {
			return function () { return Value; };
		}

		Type_root = SpawnFrom(Thing_root);

		Type_root.addMethod(function init(name, supertype, instanceRoot) {
			this._super_init(name);
			this._Subtypes = NewStash();
			ConnectToSuperType(subtype, supertype);
			this._InstanceRoot = instanceRoot;

			instanceRoot.type = CreatePureGetter(this);

			return this;
		});

		// ADD defaults for type method !!!

		Type_root.addMethod(function _addSubtype(subtype) {
			this._Subtypes[subtype._Name] = subtype;
			return this;
		});

		Type_root.addMethod(function newInstance(/* arguments */) {
			var instanceRoot = this._InstanceRoot;
			var instance = SpawnFrom(instanceRoot);
			instanceRoot.init.apply(instance, arguments);
			return instanceRoot;
		});

		Type_root.addMethod(function newSubtype(name) {
			return Type.newInstance(name, this);
		});

		Type_root.addMethod(function addSharedMethod(namedFunction) {
			this._InstanceRoot.addMethod(namedFunction);
			return this;
		});

		Type_root.addMethod(function addSharedProperty(name, value) {
			this._InstanceRoot[name] = value;
			return this;
		});

		// Bootstrapping!!! //
		(function () {
			ConnectToSuperType = function (subtype) { subtype._Supertype = null; };

			Type_root._InstanceRoot = Type_root;
			Thing = Type_root.newInstance("Thing", null , Thing_root);
			Type  = Type_root.newInstance("Type" , Thing, Type_root );
			delete Type_root._InstanceRoot;

			ConnectToSuperType = function (subtype, supertype) {
				subtype._Supertype = supertype;
				supertype._Subtypes[subtype._Name] = subtype;
			};
		})();
		// Bootstrapping!!! //




		Type.addMethod(function newInstance(name, supertype_) {
			var supertype, instanceRoot;
			if (!IsUpperCase(name)) {
				return this.signalError("Type must have an uppercase name!");
			}
			supertype = supertype_ || Thing;
			instanceRoot = SpawnFrom(supertype._InstanceRoot);
			return this._super_newInstance(name, supertype, instanceRoot);
		});



		Context = Type.newInstance("Context");

		Context.addMethod(function newInstance(name, superContext_) {
			if (!IsUpperCase(name)) {
				return this.signalError("Context must have an uppercase name!");
			}
			var superContext = superContext_ || null;
			var root = (superContext_ === global) ? null : superContext_;
			var instance = SpawnFrom(root || this._InstanceRoot);
			return instance.init(name, superContext);
		});

		function ConnectToSuperContext(subcontext, supercontext) {
			supercontext._Subcontexts[subcontext._Name] = subcontext;
		};

		Context.addSharedMethod(function init(name, superContext) {
			this._super_init(name);

			superContext && ConnectToSuperContext(this, superContext);
			this._Subcontexts = NewStash();
			return this;
		});


		Top = Context.newInstance("Top");

		Top.Thing       = Thing;
		Top.Type        = Type;
		Top.Context     = Context;

		Top.newStash    = NewStash;
		Top.rootOf      = RootOf;
		Top.spawnFrom   = SpawnFrom;

		Top.isArray     = IsArray;
		Top.isUpperCase = IsUpperCase;
		Top.asMemoizing = AsMemoizing;

		return Top;
	}

	if (typeof define === 'function' && define.amd) {
			// AMD. Register as an anonymous module.
			define(factory);
	} else {
			// Browser globals
			global.Top = factory(global);
	}
})(this);
