// See http://exploringjs.com/es6/ch_proxies.html sec 28.5.1 & 28.7.5.1


/* global
  jasmine:false
*/

// validthis:true

(function (global) {
  "use strict";

  function factory(require) {
    const RootOf             = Object.getPrototypeOf
    const SpawnFrom          = Object.create
    const IsArray            = Array.isArray
    const Array_join         = Array.prototype.join
    const Math_floor         = Math.floor
    const Math_random        = Math.random
    const DefineProperty     = Object.defineProperty
    const PropertiesOf       = Object.keys
    const BeImmutable        = Object.freeze
    const Object_prototype   = Object.prototype
    const IsLocalProperty    = Object.hasOwnProperty
    const PropertyDescriptor = Object.getOwnPropertyDescriptor
    const Reflect_apply      = Reflect.apply

    // var ParenthesesMatcher   = /\(|\)/
    // var SelectorMatcher      = /[\w\$_!&]+/gi
    const VowelMatcher         = /^[aeiou]/i
    const ValidSelectorMatcher = /_*[a-z][\w$]*/

    // const _ = SpawnFrom(null)

    const _Base_root               = SpawnFrom(null)
    const   Stash_root             = SpawnFrom(_Base_root)
    const   _Top_root              = SpawnFrom(_Base_root)

    const     _Outer_root          = SpawnFrom(_Top_root)
    const       _Rind_root         = SpawnFrom(_Outer_root)
    const         Primordial_root  = SpawnFrom(_Rind_root)
    const         Nothing_root     = SpawnFrom(_Rind_root)
    const         Thing_root       = SpawnFrom(_Rind_root)
    const         Type_root        = SpawnFrom(_Rind_root)
    const         Context_root     = SpawnFrom(_Rind_root)

    const     _Inner_root          = SpawnFrom(_Top_root)
    const       _Super_root        = SpawnFrom(_Inner_root)
    const       _Pulp_root         = SpawnFrom(_Inner_root)
    const         _Primordial_root = SpawnFrom(_Pulp_root)
    const         _Nothing_root    = SpawnFrom(_Pulp_root)
    const         _Thing_root      = SpawnFrom(_Pulp_root)
    const         _Type_root       = SpawnFrom(_Pulp_root)
    const         _Context_root    = SpawnFrom(_Pulp_root)

    // const _Default  ----> deal with super called whne there is noe

    // Implementation/Base/Default

    // const ConnectSubtype_ToSupertype

    let HandleErrorsQuietly                = false
    let IsProtectingAgainstObjectIntrusion = true

    function _HandleErrorsQuietly(bool_) {
      return (arguments.length) ?
        (HandleErrorsQuietly = bool_) : HandleErrorsQuietly
    }

    function _SignalError(target, message) {
      if (HandleErrorsQuietly) {
        console.warn(message)
      } else {
        console.error(message)
        const error = new Error(message)
        error.name = "TopError"
        error.target = target
        throw error
      }
      return null
    }

    function _ConstructorError(constructor) {
      _SignalError(constructor.name,
        " is only for use with 'instanceof', it's not meant to be executed!")
    }

    // function _Top ()        { _ConstructorError(_Top)        }
    function _Inner ()      { _ConstructorError(_Inner)      }
    function _Pulp ()       { _ConstructorError(_Pulp)       }
    function _Rind ()       { _ConstructorError(_Rind)       }
    function _Primordial () { _ConstructorError(_Primordial) }
    function  Primordial () { _ConstructorError(Primordial) }
    // function _Thing ()      { _ConstructorError(_Thing)      }

    // _Top.prototype        = _Top_root
    _Inner.prototype      = _Inner_root
    _Pulp.prototype       = _Pulp_root
    _Rind.prototype       = _Rind_root
    _Primordial.prototype = _Primordial_root
     Primordial.prototype =  Primordial_root
    // _Thing.prototype      = Thing_root



    // #### Random Number Generation
    const MAX_SAFE_INTEGER     = 9007199254740991
    const RANDOM_MAX           = 0xFFFFFFFFFFFF
    const ZERO_PADDING         = "0000000000000000"
    const MAX_UNIQUE_ID_LENGTH =
      (+new Date("2067-01-01") * RANDOM_MAX).toString(36).length

    function RandomInt(max_min_, max__) {
      let min, max
      switch (arguments.length) {
        case 0  : min = 0       ; max = MAX_SAFE_INTEGER; break
        case 1  : min = 0       ; max = max_min_        ; break
        default : min = max_min_; max = max__           ; break
      }
      return Math_floor(Math_random() * (max - min + 1)) + min
    }

    function NewUniqueId(prefix_, seedDate__, seedValue__) {
      const prefix = prefix_ || ""
      const seedDate = seedDate__ || Date.now()
      const seedValue = seedValue__ || RandomInt(RANDOM_MAX)
      const id = (seedDate * seedValue).toString(36)
      const zeros = ZERO_PADDING.slice(0, MAX_UNIQUE_ID_LENGTH - id.length)
      return prefix + zeros + id
    }


    const KNIFE   = Symbol("KNIFE")   // KNIFE???


    function NewStash(spec_) {
      const stash = SpawnFrom(Stash_root)
      if (spec_) {
        if (IsProtectingAgainstObjectIntrusion && spec_ instanceof Object) {
          for (const name in spec_) {
            const value = spec_[name]
            if (value !== Object_prototype[name] ||
                IsLocalProperty.call(spec_, name)) {
              stash[name] = spec_[name]
            }
          }
        } else {
          for (const name in spec_) {
            stash[name] = spec_[name]
          }
        }
      }
      return stash
    }


    function IsUpperCase(string) {
      return string.match(/^[A-Z]/)
    }

    function IsLowerCase(string) {
      return string.match(/^[a-z]/)
    }

    // function IsUpperCase(target) {
    //   return target.match && target.match(/^[A-Z]/);
    // }
    //
    // function IsLowerCase(target) {
    //   return target.match && target.match(/^[a-z]/);
    // }


    function IsValidMethodSelector(selector) {
      return ValidSelectorMatcher.test(selector)
    }

    // function IsAutoGeneratedSelector(selector) {
    //   return selector.indexOf("$") >= 0;
    // }
    //
    // function IsntAutoGeneratedSelector(selector) {
    //   return selector.indexOf("$") < 0;
    // }

    function IsPrivateSelector(selector) {
      return selector[0] === "_"
    }

    function IsPublicSelector(selector) {
      return selector[0] !== "_"
    }


    var HiddenConfiguration = NewStash({
      writable    : true,
      enumerable  : false,
      configurable: false,
    })

    var LockedConfiguration = NewStash({
      writable    : false,
      enumerable  : true,
      configurable: false,
    })

    var LockedHiddenConfiguration = NewStash() // all false

    var LazyPropertyConfiguration = NewStash({
      writable    : true,
      enumerable  : false,
      configurable: true,
    })


    function SetImmutableGetter(target, name, getter) {
      const configuration = SpawnFrom(LockedConfiguration)
      configuration.get = getter
      return DefineProperty(target, name, configuration)
    }

    function SetImmutableProperty(target, name, value) {
      target[name] = value
      return DefineProperty(target, name, LockedConfiguration)
    }

    function SetHiddenImmutableProperty(target, name, value) {
      const configuration = SpawnFrom(LockedHiddenConfiguration)
      configuration.value = value
      return DefineProperty(target, name, configuration)
    }

    function SetHiddenProperty(target, name, value) {
      DefineProperty(target, name, HiddenConfiguration)
      return (target[name] = value)
    }

    function AddLazyProperty(target, name, installer) {
      var configuration = SpawnFrom(LazyPropertyConfiguration)
      configuration.get = installer
      return DefineProperty(target, name, configuration)
    }


    // function AsMemoizing(FactoryFunc) {
    //   var Repo = NewStash();
    //   return function (id) {
    //     return Repo[id] || (Repo[id] = FactoryFunc.apply(null, arguments));
    //   };
    // }

    // var SelectorMethodFor = AsMemoizing(function NewSelectorMethod(Name) {
    //   return function Selector() { return Name; };
    // });

    const __isProtected = Symbol("__isProtected")
    const __oid         = Symbol("__oid")
    const __rind        = Symbol("__rind")
    const ___rind       = Symbol("___rind")
    const __pulp        = Symbol("__pulp")
    const __Pulp        = Symbol("__Pulp")
    const __type        = Symbol("__type")
    const __rind_root   = Symbol("__rind_root")
    const __pulp_root   = Symbol("__pulp_root")



    const ValidIVarStarts = NewStash()
    {
      let chars = "abcdefghijklmnopqrstuvwxyz"
      chars = chars.toUpperCase() + chars
      chars.forEach(char => ValidIVarStarts[char] = true)
    }

    const ProxyHandler = NewStash({
      get (rind, selector, proxy) {
        const pulp = rind[__pulp]
        if (proxy !== rind[__proxy]) { return pulp._hijackedProxyError(proxy) }
        if (IsLocalProperty(pulp, selector)) {
          return (ValidIVarStarts[selector[0]]) ?
            pulp[selector] :
            pulp._improperAccessError(selector)
        }
        const method = rind[selector]
        if (method) { return method }
        return pulp._improperAccessError(selector)
      },
      set (rind, selector, value, proxy) {
        const pulp = rind[__pulp]
        if (proxy !== rind[__proxy]) { return pulp._hijackedProxyError(proxy) }
        if (ValidIVarStarts[selector[0]]) {
          if (pulp[selector] !== undefined) {
            pulp[selector] = value
          }
          return true
        }
        if (selector === __setPulp) {
          rind[__pulp] = value
          return true
        }
        return pulp._improperAccessError(selector)
      },
      has (rind, selector) {
        const pulp = rind[__pulp]
        if (ValidIVarStarts[selector[0]]) {
          if (pulp[selector] !== undefined) { return true }
          return (rind[selector] !== undefined)
        }
        return pulp._improperAccessError(selector)
      },
      ownKeys (rind) {
        return rind[__pulp].keys().filter(
          selector => ValidIVarStarts[selector[0]])
      }

    })

    function AttachRind() {
      var rind = SpawnFrom(this[__rind_root])
      var proxy = new Proxy(rind, ProxyHandler)
      this[__rind] = this[___rind] = rind
      // BeImmutable(rind)
      return proxy
    }


    function NewDelegationHandler(Selector) {
      return function __Delegation(/* arguments */) {
        return this.ExecWithAll(Selector, arguments)
      };
    }

    function AsProtectedFunction(func) {
      function __Protected(/* arguments */) {
        var args = arguments.map(arg =>
          (arg instanceof _Inner) ? arg[__rind] : arg)
        return Reflect_apply(func, this, args)
      }
      return SetImmutableProperty(__Protected, __isProtected, true)
    }

    argsWithProtectedFuncs = []
    index = args.length
    while (index--) {
      arg = args[index]
      argsWithProtectedFuncs[index] =
        (typeof arg !== "function" || arg[__isProtected]) ?
          arg : AsProtectedFunction(arg)
    }
    result = Reflect_apply(P[selector], P, argsWithProtectedFuncs)
    return (result instanceof _Inner) ? result[__rind] : result





    function NewUnimplementedHandler(Selector) {
      return function __Unimplemented(/* arguments */) {
        return this._NoSuchMethod(Selector, arguments)
      };
    }


    function NewSuperHandler(Selector) {
      return function __Super(/* arguments */) {
        var pulp, method, ancestors, next, type, superMethod

        pulp = this._pulp
        method = pulp[Selector]
        ancestors = pulp.AncestorTypes()

        next = ancestors.length
        while (next--) {
          type = ancestors[next]
          superMethod = type._methods[Selector]
          if (superMethod || superMethod !== method) {
            return superMethod.apply(pulp, arguments) // do these need to be protected too???
          }
        }
        return pulp._NoSuchMethod(Selector, arguments)
      }
    }


    function _SetMethod_(target, name, handler, isHidden_) {
      SetImmutableProperty(handler, "selector", name)
      if (isHidden_) { DefineProperty(target, name, HiddenConfiguration) }
      return (target[name] = handler)
    }

    function EnsureDefaultMethodsFor(name) {
      if (_Pulp_root[name]) { return }
      _SetMethod_(_Pulp_root , name, NewUnimplementedHandler(name), true)
      _SetMethod_(_Super_root, name, NewSuperHandler(name)        , true)
      _SetMethod_(_Rind_root , name, NewDelegationHandler(name)   , true)
    }


    // function Within_AtPutMethod(root, selector, method) {
    //   EnsureDefaultMethodsFor(selector);
    //   root[selector] = method;
    // }

    function SetMethod(target, name, handler) {
      EnsureDefaultMethodsFor(name)
      if (IsPublicSelector(name)) {
        _SetMethod_(target[__rind_root], name, _Rind_root[name]) // _Primordial_root
      }
      return _SetMethod_(target, name, handler)
    }

    function AddMethod(target, method_name, method_) {
      var name, handler
      (typeof method_name === "string") ?
        (name = method_name     , handler = method_    ) :
        (name = method_name.name, handler = method_name)
      var method = SetMethod(target, name, handler)
			var selector$ = method.selector + "$"
      return target
    }

    // function Within_At_Install(root, selector, pulpMethod) {
    //   if (IsValidMethodSelector(selector) &&
    //       IsntAutoGeneratedSelector(selector)) {
    //         return  Within_At_Install_(root, selector, pulpMethod);
    //   }
    //   return _SignalError("Selector must be lowecase and not end with $!");
    // }



    SetImmutableGetter(_Rind_root, __rind, function () { return this })

    AddLazyProperty(_Pulp_root, __rind, AttachRind)

    AddLazyProperty(_Pulp_root, __oid, function () {
      return (this[__oid] = Symbol(NewUniqueId(this.TypeName())))
    });

    AddLazyProperty(_Pulp_root, "_super", function () {
      // jshint shadow:true
      var _super = SpawnFrom(_Super_root);
      _super._pulp = this
      // _super._super = _super  // Is this necessary???
      return SetHiddenProperty(this, "_super", _super)
    })

    SetImmutableProperty(_Pulp_root,  __Pulp, function (knife) { return this })


    /// NOTE:  Special methods like #Is should go in _Pulp_root
    ///        unimplementedHandlers should go in    _Outer_root





    AddMethod(_Primordial_root, function Is(that) {
      // return that.__Pulp ? (this.__rind === that) : (this === that);
      return that instanceof _Primordial ?
        (this[___rind] === that) : (this === that)
    })

    //// NOTE THIS METHOD!!! It must be set after the previous. Order matters.
    _SetMethod_(Primordial_root, "Is", function Is(that) {
      return that instanceof Primordial ?
        (this === that[___rind]) : (this === that)
    })

    AddMethod(_Primordial_root, function Type() { return this[__type]; })

    AddMethod(_Primordial_root, function _NoSuchMethod(selector, args) {
      return _SignalError(this, "Receiver has no such method #"+ selector +"!")
    })

    AddMethod(_Primordial_root, function Exec(selector, args) {
      return Reflect_apply(this[selector], this, args)
    })


    AddMethod(_Thing_root, function Equals(that) {
      // return that.__Pulp ? (this.__rind === that) : (this === that);
      return that instanceof _Primordial ?
        (this[___rind] === that) : (this === that)
    })

    //// NOTE THIS METHOD!!! It must be set after the previous. Order matters.
    _SetMethod_(Thing_root, "Equals", function Equals(that) {
      return that instanceof Primordial ?
        (this === that[___rind]) : (this === that)
    })

    AddMethod(_Thing_root, function _As_ExecWithAll(type, selector, args) {
      // return type[__Pulp](KNIFE)._instanceRoot[selector].apply(this, args)
      // return Reflect_apply(type[__Pulp](KNIFE)._instanceRoot[selector], this, args)
      return Reflect_apply(type.MethodAt(selector), this, args)
    })

    AddMethod(_Thing_root, function _Error(message) {
      return _SignalError(this, message)
    })

    AddMethod(_Thing_root, function _ImproperPrivateMethodExecError(selector) {
      return this._Error(`Private method #${selector} can only be called from within an object's method!`)
    })

    AddMethod(_Thing_root, function _EnsureUnlocked() {
      return this.IsLocked() ? this._LockedObjectError() : this
    })



    AddMethod(Thing_root, function AtPutMethod(selector, method) {
      this._EnsureUnlocked()
      return AddMethod(this, selector, method)
    });

    // function CreatePureGetter(Value) {
    //   return function () { return Value; };
    // }


    // Minimum metahierarchy methods

    Thing_root.AtPutMethod("AddMethod", function AddMethod(/* arguments */) {
      var index = -1;
      var count = arguments.length;
      var method;

      while (++index < count) {
        method = arguments[index];
        this.AtPutMethod(method.name, method);
      }
      return this;
    });

    Thing_root.AddMethod(function AddAlias(alias, original) {
      return this.AtPutMethod(alias, this[original]);
    });

    Thing_root.AddMethod(function _Init(name_) {
      // this._super._Init(arguments);
      if (name_ !== undefined) { this._name = name_; }
      return this;
    });

    // Thing_root.AddMethod(function Extend(extensionAction) {
    //   var receiver, rind, pulp;
    //   if (extensionAction == null) { return this; }
    //   if (extensionAction.length) {
    //     rind = this.__$rind;
    //     if (this.__$isLocked) {
    //       receiver = rind;
    //       pulp = null;
    //     } else {
    //       receiver = pulp = this;
    //     }
    //     extensionAction.call(receiver, rind, pulp);
    //   } else {
    //     receiver = this.__$isLocked ? this.__$rind : this;
    //     extensionAction.call(receiver);
    //   }
    //   return this;
    // });
    //
    // // function NewFauxConstructor(instanceRoot) {
    // //   var constructor function () {
    // //     _SignalError(this, "This function exists only for use with instanceof!");
    // //   };
    // //   constructor.prototype = instanceRoot;
    // //   return constructor;
    // // }

    function BuildAncestors(_supertypes) {
      let ancestors = []
      if (_supertypes.length === 1) {
          let _supertype = _supertypes[0]
          ancestors = _supertype._ancestors.slice()
          ancestors.push(_supertype)
      }
      else {
        let visited = NewStash()
        _supertypes.forEach((_supertype) => {
          _supertype._ancestors.forEach((_type) => {
            const oid = _type[__oid]
            if (!visited[oid]) {
              visited[oid] = _type
              ancestors.push(_type)
            }
          })
          const oid = _supertype[__oid]
          if (!visited[oid]) {
            visited[oid] = _supertype
            ancestors.push(_supertype)
          }
        })
      }
      return ancestors
    }

    function SeedAllMethodsFrom(_root, _ancestors) {
      _ancestors.forEach(_ancestor => {
        _ancestor.methods().forEach(method => {
          _root[method.selector] = method
        })
      })
    }

    function ConnectTypes(_type, supertypes) {
      const oid = _type.__oid
      const _supertypes = supertypes.map(_supertype => _supertype.__Pulp(KNIFE))
      _supertypes.forEach(_supertype => _supertype._subtypes[oid] = _type)
      return _supertypes
    }

    AddMethod(_Type_root, function _Init(name, supertypes, root, _root) {
      this._AsExec(_Thing, "_Init", name)

      this._instanceRoot = _root
      this._subtypes = NewStash()
      this._supertypes = ConnectTypes(this, supertypes)
      this._ancestors = BuildAncestors(this._supertypes)
      this._methods = NewStash()

      SeedAllMethodsFrom(_root, this._supertypes)

      SetImmutableProperty(_root, __type     , this)
      SetImmutableProperty(_root, __pulp_root, _root)
      SetImmutableProperty(_root, __rind_root, root)
    })

    AddMethod(_Type_root, function New(/* arguments */) {
      var instanceRoot = this._instanceRoot
      var instance = SpawnFrom(instanceRoot)
      instance._Init(...arguments)
      return instance
    })

    AddMethod(_Type_root, function AddInstanceMethod(namedFunction) {
      this._EnsureUnlocked()
      this._instanceRoot.AddMethod(namedFunction)
      return this;
    });

    Type_root.AddAlias("AddIMethod", "AddInstanceMethod");

    Type_root.AddMethod(function AddInstanceAlias(alias, original) {
      if (this.IsLocked()) { return this.LockedObjectError(); }
      this._instanceRoot.AddAlias(alias, original);
      return this;
    });

    Type_root.AddAlias("AddIAlias", "AddInstanceAlias");


    (function Bootstrap_Core_Types() {
      ConnectSubtype_ToSupertype = function (_subtype, supertype) {
        _subtype._supertype = supertype;
      };

      Type_root._instanceRoot = Type_root;

      Primordial = Type_root.New("Primordial", null, Primordial_root);

      ConnectSubtype_ToSupertype = function (_subtype, supertype) {
        var _supertype = supertype.__Pulp(STRAW);
        _subtype._supertype = supertype;
        _supertype._subtypes[_subtype.__$oid] = _subtype;
      };

      Nothing = Type_root.New("Nothing", Primordial, Nothing_root);
      Thing   = Type_root.New("Thing"  , Primordial, Thing_root);
      Type    = Type_root.New("Type"   , Thing     , Type_root );

      delete Type_root._instanceRoot;
    })();


    Void = Nothing.New("VOID");


    Primordial.AddMethod(function New() {
      return _SignalError(Primordial, "Abstract type cannot create instances!");
    });

    Nothing.AddMethod(function New() { return Void;});

    Type.AddMethod(function New(name, supertype_extend_, extend_) {
      var supertype, extensionAction, instanceRoot, type;

      if (IsLowerCase(name)) {
        return this.signalError("Type must have an uppercase name!");
      }
      if (typeof supertype_extend_ === "object") {
        supertype = supertype_extend_;
        extensionAction = extend_;
      } else {
        supertype = Thing;
        extensionAction = supertype_extend_;
      }

      instanceRoot = SpawnFrom(supertype._instanceRoot);
      type = this._super.New(name, supertype, instanceRoot);
      return type.Extend(extensionAction);
    })

    .x =



    Thing.Extend(function () {
      this.AddIMethod(function IsLocked() { return this.__$isLocked || false; });

      this.AddIMethod(function Lock()     { this.__$isLocked = true; return this; });

      this.AddIMethod(function Yourself() { return this; });

      this.AddIMethod(function Name()     { return this._name; });

      this.AddIMethod(function TypeName() { return this.__$type._name; });

      this.AddIMethod(function Id()       { return this.__$id; });

      this.AddIMethod(function ToString() {
        var name = this.Name() || "";
        var typeName = this.TypeName();
        var prefix = typeName.match(VowelMatcher) ? "an " : "a ";
        return name !== undefined ?
          typeName + ":" + name : prefix + typeName;
      });

      this.AddIMethod(function Print() {
        return this.ToString();
      });

      this.AddIMethod(function SignalError(/* arguments */) {
        var message = Array_join(arguments, "");
        _SignalError(this, message);
        return this;
      });

      this.AddIMethod(function _NoSuchMethod(selector, args) {
        var message = this.Print() + " has no such method #" + selector + "!";
        return this.SignalError(message);
      });

      this.AddIMethod(function LockProperty(name) {
        DefineProperty(this, name, LockedConfiguration); /// !!!
        return this;
      });

      this.AddIMethod(function LockedObjectError() {
        return this.SignalError("Attempt to modify locked object!");
      });

      this.AddIMethod(function IsSame(that) {
        return this.Id() === that.Id();
      });

      this.AddIMethod(function KnownProperties(names_) {
        return arguments.length ?
          (this._knownProperties = names_.slice().sort(), this) :
          (this._knownProperties || []);
      });

      this.AddIMethod(function KnowProperty(name) {
        var names = this._knownProperties || (this._knownProperties = []);
        var index = names.length;
        while (index--) {
          if (names[index] === name) { return this; }
        }
        names.push(name);
        names.sort();
        return this;
      });

      this.AddIMethod(function UnknowProperty(name) {
        var names, index;
        if ((names = this._knownProperties)) {
          index = names.length;
          while (index--) {
            if (names[index] === name) {
              names.splice(index, 1);
              break;
            }
          }
        }
        return this;
      });

      this.AddIMethod(function ShallowCopy() {
        var copy, names, index, name;
        copy = this.Type().New();
        names = this._knownProperties;
        index = names.length;
        if (names) {
          while (index--) {
            name = names[index];
            copy[name] = this[name];
          }
        }
        return copy;
      });

      this.AddIMethod(function Copy() {
        return this.ShallowCopy();
      });

    });


    Type.Extend(function () {
      this.AddIMethod(function NewSubtype(name, extend_) {
        return Type.New(name, this, extend_);
      });

      this.AddIMethod(function Supertype() {
        return this._supertype;
      });

      this.AddIMethod(function Subtypes() {
        var subtypes, index, list, oid;

        subtypes = this._subtypes;
        index = 0;
        list = [];

        for (oid in subtypes) {
          list[index++] = subtypes[oid];
        }
        return list.sort();
      });

      this.AddIMethod(function AddSharedConstant(name, value) {
        var root = this._instanceRoot;
        if (root[name]) {
          return this.SignalError("Cannot overwrite shared constant: ", name, " !");
        }
        SetImmutableProperty(root, name, value);
        return this;
      });

      this.AddIMethod(function InstanceMethodAt(selector) {
        return this._instanceRoot[selector];
      });

      this.AddIAlias("IMethodAt", "InstanceMethodAt");


      this.AddIMethod(function KnownInstanceProperties(names_) {
        return (arguments.length) ?
          this._instanceRoot.KnownProperties(names_) :
          this._instanceRoot.KnownProperties();
      });

      this.AddIAlias("KnownIProperties", "KnownInstanceProperties");

      this.AddIMethod(function ShouldNotImplementError() {
        return this.signalError("Method should not be implemented!");
      });

      this.AddIMethod(function NotYetImplementedError() {
        return this.signalError("Method not yet implemented!");
      });

      this.AddIMethod(function NotYetTestedError() {
        return this.signalError("Method not yet tested!");
      });

      this.AddIMethod(function SubtypeResponsibilityError() {
        return this.signalError("Method should be implemented by this or subtype!");
      });
    });


    function As$Name(name) {
      return (name[0] === "$") ? name : "$" + name;
    }

    Context = Type.New("Context", function () {
      this.AddIMethod(function New(name, supercontext_) {
        if (IsLowerCase(name)) {
          return this.SignalError("Context must have an uppercase name!");
        }
        var supercontext = supercontext_ || null;
        if (supercontext && supercontext[As$Name(name)]) {
          return this.SignalError("Super context already contains name!");
        }
        var root = (supercontext === global) ? null : supercontext;
        var instance = SpawnFrom(root || this._instanceRoot);
        return instance._Init(name, supercontext, root);
      });

      this.AddIMethod(function _Init(name, supercontext, supercontext_) {
        this._super._Init(name);
        this._subcontexts = [];
        this._supercontext = supercontext;
        this.AddProperty(name, this);
        if (supercontext_) {
          var subcontexts = supercontext_._subcontexts;
          subcontexts.push(this);
          subcontexts.sort();
        }
      });

      this.AddIMethod(function Supercontext() { return this._supercontext; });

      this.AddIMethod(function Subcontexts() {
        return this._subcontexts.slice();
      });

      this.AddIMethod(function Lock() {
        if (this.IsLocked()) { return this; }
        return this.PropertiesDo(this.LockProperty);
        // return this._super.Lock();
      });

      this.AddIMethod(function PropertiesDo(action) {
        var name, names, index;
        names = PropertiesOf(this);
        index = names.length;
        while (index--) {
          name = names[index];
          if (name[0] === "$") {
            action.call(this, name, this[name]);
          }
        }
        return this;
      });

      this.AddIMethod(function AddProperty(name, value) {
        var $name = As$Name(name);
        if (IsLowerCase) {
          return this.SignalError("Property name ", name, " must be uppercase!");
        }
        if (this.IsLocked()) {
          if (this[$name]) {
            return this.SignalError("Cannot overwrite locked property: ", $name, " !");
          }
          return SetImmutableProperty(this, $name, value);
        }
        this[$name] = value;
        return this;
      });

      this.AddIMethod(function Add(/* arguments */) {
        var index, count, namedObject;
        index = -1;
        count = arguments.length;
        while (++index < count) {
          namedObject = arguments[index];
          this.AddProperty(namedObject.Name(), namedObject);
        }
        return this;
      });

      this.AddIMethod(function SetType(name, supertype_extend_, extend_) {
        var supertype, extensionAction, type;

        switch (typeof supertype_extend_) {
          case "string" :
            supertype = this[As$Name(supertype_extend_)];
            extensionAction = extend_;
            if (supertype == null) {
              this.SignalError("Can't find supertype: ", supertype_extend_, "!");
              return null;
            }
            break;
          case "object" :
            supertype = supertype_extend_;
            extensionAction = extend_;
            break;
          case "function" :
            extensionAction = supertype_extend_;
            break;
        }

        if ((type = this[As$Name(name)])) {
          if (supertype && supertype !== type._supertype) {
            this.SignalError("Type ", name, " exists with different supertype!");
            return null;
          }
        } else {
          type = Type.New(name, supertype);
          this.Add(type);
        }
        return type.Extend(extensionAction);
      });

      this.AddIMethod(function SetSubcontext(name, extend_) {
        return Context.New(name, this).Extend(extend_);
      });
    });

    return Context.New("Top", function () {
      this.Add(Thing, Nothing, Type, Context);
      this.AddMethod(NewStash, RootOf, SpawnFrom);
      this.AddMethod(IsArray, IsUpperCase);

      this.AddMethod(function IsRind(target) {
        return target instanceof _Rind;
      });

      this.AddMethod(function IsPulp(target) {
        return target instanceof _Pulp;
      });
    });
  }

  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory);
  } else {
      // Browser globals
      global.Top = factory(global);
  }
})(this);



  // function ExecuteOn(method, receiver, arg1, arg2, arg3, allArgs) {
  //   switch (allArgs.length) {
  //     case 0 : return method.call(receiver);
  //     case 1 : return method.call(receiver, arg1);
  //     case 2 : return method.call(receiver, arg1, arg2);
  //     case 3 : return method.call(receiver, arg1, arg2, arg3);
  //   }
  //   var remainingArgs = Array_slice.call(allArgs, 1);
  //   return method.apply(receiver, remainingArgs);
  // }


  // Thing_root.addMethod(function perform(selector, arg_, arg__, arg___) {
  //   return ExecuteOn(this[selector], this, arg_, arg__, arg___, arguments);
  // });
  //
  // Thing_root.addMethod(function performWithArgs(selector, args) {
  //   return this[selector].apply(this, args);
  // });


  // Context.AddInstanceMethod(function At_IfPresent_IfAbsent(name, present, absent) {
  //   var $name = As$Name(name);
  //   var value = this[$name];
  //   return value ? present.call(this, value, $name) : absent.call(this, $name);
  // });
