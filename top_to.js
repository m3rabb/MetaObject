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
    const VisiblePropertiesOf = Reflect.ownKeys
    const Object_prototype   = Object.prototype
    const IsLocalProperty    = Object_prototype.hasOwnProperty
    const PropertyDescriptor = Object.getOwnPropertyDescriptor
    const Reflect_apply      = Reflect.apply

    // var ParenthesesMatcher   = /\(|\)/
    // var SelectorMatcher      = /[\w\$_!&]+/gi
    const VowelMatcher         = /^[aeiou]/i
    const ValidSelectorMatcher = /_*\$*[a-z][\w$]*/

    // const _ = SpawnFrom(null)

    const PulpHandler = SpawnFrom({
      get (_base_root, name, inner) {
        return inner._noSuchProperty(name)
      },
      // set (_base_root, selector, value, inner) {
      //   if (inner[_$isImmutable]) {
      //     return inner._innerImmutableWrite(inner, selector, value) || false
      //   }
      //   inner[selector] = value
      //   return true
      // }
    })


    const Base_root             = SpawnFrom(null)
    const   Stash_root          = SpawnFrom(Base_root)

    const   Implementation_root = SpawnFrom(Base_root)
    const     Inner_root        = new Proxy(Implementation_root, PulpHandler)

    const       Nothing_root    = SpawnFrom(Inner_root)
    const       Thing_root      = SpawnFrom(Inner_root)
    const       Type_root       = SpawnFrom(Inner_root)
    const       Method_root     = SpawnFrom(Inner_root)
    const       Context_root    = SpawnFrom(Inner_root)

    function ConstructorError(constructor) {
      SignalError(constructor.name,
        " is only for use with 'instanceof', it's not meant to be executed!")
    }

    function Implementation () { ConstructorError(Implementation) }
    function Inner ()          { ConstructorError(Inner)          }

    Implementation.prototype = Implementation_root
    Inner.prototype          = Inner_root




    const _$OUTER           = Symbol("_$OUTER")
    const _$OUTER$_         = Symbol("_$OUTER$_")
    const _$ROOT            = Symbol("_$ROOT")
    const _$O_METHODS = Symbol("_$O_METHODS")
    const _$OUTER_HANDLER = Symbol("_$OUTER_HANDLER")



    // Implementation/Base/Default/Pulp

    let HandleErrorsQuietly        = false
    let HandleInheritancePoisoning = true

    function _HandleErrorsQuietly(bool_) {
      return (arguments.length) ?
        (HandleErrorsQuietly = bool_) : HandleErrorsQuietly
    }

    function SignalError(target, message) {
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


    function NewStash(spec_) {
      const stash = SpawnFrom(Stash_root)
      if (spec_) {
        if (HandleInheritancePoisoning && spec_ instanceof Object) {
          for (const name in spec_) {
            let value = spec_[name]
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
      return /^[A-Z]/.test(string)
    }

    function IsLowerCase(string) {
      return /^[a-z]/.test(string)
    }

    function IsValidMethodSelector(selector) {
      return ValidSelectorMatcher.test(selector)
    }


    // function OnGet(inner, selector, outer) {
    //   if (selector[0] === "_") { return Top._outerPrivateRead(inner, selector) }
    //   if (selector in inner) {  // Perhaps limit this to undefined vs null for better performance!!!
    //     const value = inner[selector]
    //     return value[_$OUTER] || value
    //   }
    //   return inner._noSuchProperty(selector))
    // }

    function OnGet(inner, name, outer) {
      if (name[0] === "_") { return Top._outerPrivateRead(inner, name) }
      return value[_$OUTER] || inner[name]
    }

    function OnMutableSet(inner, name, value, outer) {
      const firstChar = name[0]
      if (firstChar === "_") { return Top._outerPrivateWrite(inner, name, value) }
      if (firstChar === "$") { return Top._outerFixedWrite(inner, name, value) }
      inner[name] = value
      return true
    }

    function OnImmutableSet(inner, name, value, outer) {
      return Top._outerImmutableWrite(inner, name, value) || false
    }

    function OnHas(inner, name) {
      if (name[0] === "_") { return Top._outerPrivateAccess(inner, name) }
      return name in inner
    },

    function OnOwnKeys(inner) {
      return VisiblePropertiesOf(inner).filter(name => name[0] !== "_")
    }

    const MutableOuterHandler = NewStash({
      get : OnGet,
      set : OnMutableSet,
      has : OnHas,
      ownKeys : OnOwnKeys,
    })

    const ImmutableOuterHandler = NewStash({
      get : OnGet,
      set : OnImmutableSet,
      has : OnHas,
      ownKeys : OnOwnKeys,
    })

      // getPrototypeOf
      // setPrototypeOf
      // Symbol.hasInstance
    })

    function WrapInner(inner) {
      return (inner[_$OUTER] = inner[_$OUTER$_] =
                new Proxy(inner, this[_$OUTER_HANDLER]))
    }


    const LockedConfiguration = NewStash({
      writable    : false,
      enumerable  : true,
      configurable: false,
    })


    function SetPropertyGet(target, name, getBehavior) {
      const configuration = SpawnFrom(LockedConfiguration)
      configuration.get = getBehavior
      return DefineProperty(target, name, configuration)
    }





    function AtPutMethod(target, name, func) {
      target[name] = func
    }

    function PutMethod(target, namedFunc) {
      target[namedFunc.name] = namedFunc
    }

    // Non-WeakMap implementation
    // function GetInner(target) {
    //   const oid = target.$oid
    //   const inner = InnerMap[oid]
    //   if (inner !== target) {
    //     if (inner === undefined) {
    //       return Top.error("The target's oid doesn't match that of any interred object!")
    //     }
    //     if (inner[_$OUTER$_] !== target) {
    //       return inner.error(`The inner's oid has been hijacked the by the target!`)
    //     }
    //   }
    //   return inner
    // }



    // function GetInner(target) {
    //   return (this._$INNER === _$PROOF) ? target : InnerWeakMap.get(target)
    // }

    // function GetInner(target) {
    //   const oid = target.$oid
    //   const inner = InnerWeakMap.get(target)
    //   if (inner !== target) {
    //     if (inner === undefined) {
    //       return Top.error("The target's oid doesn't match that of any interred object!")
    //     }
    //     if (inner[_$OUTER$_] !== target) {
    //       return inner.error(`The inner's oid has been hijacked the by the target!`)
    //     }
    //   }
    //   return inner
    // }

    // Non-WeakMap implementation
    // PutMethod(Thing_root, _$INTER, function () {
    //   if (this._$PROOF !== _$SECRET) {
    //     return Top.error(`_$INTER method Hijacked to inter foreign object!`)
    //   }
    //   const oid = this.$oid
    //   InnerMap[oid] = this
    //   // returns undefined to make sure that its return value isn't depended upon
    //   // If this method is man-in-the-middled via proxy its return value could be changed
    // })

    // PutMethod(Thing_root, _$INTER, function () {
    //   if (this._$PROOF !== _$SECRET) {
    //     return Top.error(`_$INTER method Hijacked to inter foreign object!`)
    //   }
    //   InnerWeakMap[this.$oid] = this
    //   // returns undefined to make sure that its return value isn't depended upon
    //   // If this method is man-in-the-middled via proxy its return value could be changed
    // })

    // // _$INNER make this property non-enum!!!
    //
    // PutMethod(Thing_root, _$INTER, function () {
    //   if (this._$INNER !== _$PROOF) {
    //     return Top.error(`_$INTER method Hijacked to inter foreign object!`)
    //   }
    //   const outer = this[_$OUTER$_]
    //   if (outer) { InnerWeakMap.set(outer, this) }
    //   // returns undefined to make sure that its return value isn't depended upon
    //   // If this method is man-in-the-middled via proxy its return value could be changed
    // })

    PutMethod(Thing_root, function _init(name_) {
      // this._super._Init(arguments);
      if (name_ !== undefined) { this.$name = name_ }
    })

    PutMethod(Thing_root, function is(other) {
      return (this === other || this[_$OUTER$_] === other)
    })

    const InnerWeakMap = new WeakMap()

    // function GetInner(target) {
    //   return (target instanceof Inner) ? target : InnerWeakMap.get(target)
    // }

    function GetInner(target) {
      if (target instanceof Inner) { return target }
      target[_$INTER]()
      return InnerWeakMap.get(target)
    }

    PutMethod(Thing_root, _$INTER, function () {
      if (!this instanceof Inner) {
        return Top.error(`_$INTER method Hijacked to inter foreign object!`)
      }
      const outer = this[_$OUTER$_]
      if (outer) { InnerWeakMap.set(outer, this) }
      // returns undefined to make sure that its return value isn't depended upon
      // If this method is man-in-the-middled via proxy its return value could be changed
    })





    Type.new("RemoteControlBat", Mammal, Flying, RemoteControllable, => {})

    Type.new(Mammal, Flying, RemoteControllable, RemoteControlBat => {})


    function ConnectTypes(_type, supertypes) {
      const typeOID = _type.$oid
      return supertypes.map(supertype => {
        const _supertype = GetInner(supertype)
        _supertype._subtypes[typeOID] = _type
        return _supertype
      })
    }

    function BuildAncestors(_supertypes) {
      const count = _supertypes.length
      if (count === 0) { return [] }

      let _supertype = _supertypes[0]
      const ancestors = [_supertype].push(..._supertype._ancestors)
      if (count === 1) { return ancestors }

      const visited = NewStash()
      ancestors.forEach(_type => (visited[_type.$oid] = _type))

      let next = 1
      do {
        _supertype = _supertypes[next]
        const oid = _supertype.$oid
        if (!visited[oid]) {
          ancestors.push(visited[oid] = _supertype)
          _supertype._ancestors.forEach(_type => {
            const oid = _type.$oid
            if (!visited[oid]) { ancestors.push(visited[oid] = _type) }
          })
        }
      } while (++next < count)
      return ancestors
    }

    function SeedRootMethodHandlers(_root, _ancestors) {
      let next = _ancestors.length
      while (next--) {
        const methods = _ancestors[next]._methods
        for (const selector in methods) {
          _root[selector] = methods[selector].handler
        }
      }
    }

    function ReseedTypeMethodHandler(selector, _type) {
      if (!_type._methods[selector]) {
        const _ancestors = _type._ancestors
        const count = _ancestors.length
        let next = 0
        while (next < count) {
          const method = _ancestors[next]._methods[selector]
          if (method) {
            _type._instanceRoot[selector] = method.handler
            return ReseedSubtypesMethodHandler(selector, _type)
          }
        }
        delete _type._instanceRoot[selector]
        return ReseedSubtypesMethodHandler(selector, _type) // Is this necessary???
      }
    }

    function ReseedSubtypesMethodHandler(selector, _type) {
      const _subtypes = _type._subtypes
      for (const oid in _subtypes) {
        const _subtype = _subtypes[oid]
        ReseedTypeMethodHandler(selector, _subtype)
      }
    }

    Type.new("", [Plastic, Robotic, Flying, Mammal], function (ToyBat) )
    Type.new([, ,])

    Mammal, F

    Type.new(function (RobotBat, Will))

    // Type bootstrapping

    PutMethod(Type_root, function _init(name, supertypes, _root_) {
      const _supertypes  = ConnectTypes(this, supertypes)
      const _ancestors   = BuildAncestors(_supertypes)
      const _root        = _root_ || SpawnFrom(Inner_root)

      this.$name         =  name // this._asExec(Thing, "_init", name)
      this._instanceRoot = _root
      this._supertypes   = _supertypes
      this._subtypes     = NewStash()
      this._methods      = NewStash()

      _root.$type   = this
      _root.$types  = BeImmutable([this].concat(_ancestors))
      _root[_$ROOT] = _root
      SeedRootMethodHandlers(_root, _types)
    })

    PutMethod(Type_root, function new(...args) {
      var instance = SpawnFrom(this._instanceRoot)
      instance._init(...args)
      return instance
    })

    _Type_root._instanceRoot = _Type_root
    Thing     = _Type_root.new("Thing"  , [],      Thing_root)
    Type      = _Type_root.new("Type"   , [Thing], Type_root)
    Nothing   =  Type.new(     "Nothing", [],      Nothing_root)
    Method    =  Type.new(     "Method" , [Thing], Method_root)
    Context   =  Type.new(     "Context", [Thing], Context_root)

    PutMethod(Method_root, function _init(func_name, func_) {
      const isFuncArg = (typeof func_name === "function")
      const [name, func] = isFuncArg ?
        [func_name.name, func_name] : [func_name, func_]
      if (!name || !isFuncArg &&
          (typeof name !== "string" || typeof func !== "function")) {
        return this.error("Args must be named function, or name and function!")
      }
      if (!IsValidMethodSelector(name)) {
        return this.error("Method must have a valid selector name!")
      }
      this.selector = name
      this.handler = func
      // this.imp = WrapFunction(func)
    })

    PutMethod(Type_root, function addSMethod(method__func_name, func_) {
      const method = method__func_name.$type.is(Method) ?
        method__func_name : Method.new(method__func_name, func_)
      const selector = method.selector
      this._methods[selector] = this._instanceRoot[selector] = method
      ReseedSubtypesMethodHandler(selector, this)
      return this
    })

    // Method bootstrapping

    Method_root[_$OUTER_HANDLER] = ImmutableOuterHandler

    Thing.addSMethod(_$INTER, Thing_root._instanceRoot[_$INTER])
    Thing.addSMethod(Thing_root._instanceRoot._init)
    Thing.addSMethod(Thing_root._instanceRoot.is)
    Type.addSMethod(Type_root._instanceRoot._init)
    Type.addSMethod(Type_root._instanceRoot.new)
    Type.addSMethod(Type_root._instanceRoot.addSMethod)
    Method.addSMethod(Method_root._instanceRoot._init)

    Thing.addSMethod(function _noSuchProperty(name) {
      return this.error(`No such property: ${name}!`)
    })

    Nothing.addSMethod(Thing_root.is)
    Nothing.addSMethod(Thing_root._noSuchProperty)

    Thing.addSMethod(function addOMethod(method__func_name, func_) {
      const method = method__func_name.$type.is(Method) ?
        method__func_name : Method.new(method__func_name, func_)
      const selector = method.selector
      const methods = (this[_$O_METHODS] || this[_$O_METHODS] = NewStash())
      methods[selector] = this[selector] = method
      return this
    })

    Thing.addSMethod("equals", Thing_root.is)

    Thing.addSMethod(function exec(selector, ...args) {
      return Reflect_apply(this[selector], this, args)
    })

    Thing.addSMethod(function _asExec(type, selector, ...args) {
      return Reflect_apply(type.handlerAt(selector), this, args)
    })

    Thing.addSMethod(function _superExec(selector, ...args) {
      const handler = this[selector]
      const types = this.$types
      const count = types.length
      let   next = 0
      while (next < count) {
        let type = types[next++]
        let superMethod = type._methods[selector]
        if (superMethod && superMethod !== method) {
          return Reflect_apply(superMethod, this, args) // do these need to be protected too???
        }
      }
      return this._noSuchMethod(selector, args)
    })

    Thing.addSMethod(function hasMethod(selector) {
      !!return this.$type.methodAt(selector)
    })

    Thing.addSMethod(function hasProperty(name) {
      return (name[0] === "_") ? undefined : (name in this)
    })

    Thing.addSMethod(function isImmutable() { return !!this[_$isImmutable]}) }

    Thing.addSMethod(function isMutable() { return !this[_$isImmutable]}) }

    Thing.addSMethod(function ShouldNotImplementError() {
      return this.error("Method should not be implemented!");
    });

    Thing.addSMethod(function NotYetImplementedError() {
      return this.error("Method not yet implemented!");
    });

    Thing.addSMethod(function NotYetTestedError() {
      return this.error("Method not yet tested!");
    });

    Thing.addSMethod(function SubtypeResponsibilityError() {
      return this.error("Method should be implemented by this or subtype!");
    });

    _as(Thing).new()
    _super


    //// Ella's typing
    // Type=add _addSelector publicEqualitySelector...supertypes
    // getElementsByClassName('className')(marker )RANDOM_MAX SeedAllMethodsFrom KIT KAT

    const FUNC_PROLOG_MATCHER   = /^(function\s*(\s[\w$]+)?\(([\w$\s,]*)\)|(\(([\w$\s,]*)\)|([\w$]+))\s*=>)/
    const PARAMS_MATCHER = /[\w$]+/g

    function ExtractParamNames(func) {
      const match        = FUNC_PROLOG_MATCHER.exec(func)
      const paramsString = match[3] || match[5] || match[6]
      const params       = PARAMS_MATCHER.exec(paramsString)
      return params || []
    }


    Type.AddOMethod(function new(...args) {
      const argTypes = NewStash()
      const improperArgs = args.forEach(arg => {
        const type = typeof arg
        if (argTypes[type]) { return true }
        argTypes[type] = arg
      })
      if (improperArgs) {
        return this.error(
          "Args must contain name and/or function, and optional supertype(s)!")
      }
      let name            = argTypes.string
      let supertypes      = argTypes.object
      let extensionAction = argTypes.function

      supertypes = supertypes ?
        (IsArray(supertypes) ?
          (supertypes.length ? supertypes : [Thing]) :
          [supertypes]) :
        [Thing]
      if (!name) {
        if (!extensionAction) {
          return this.error(
            "Args must contain a type name and/or extension function!")
        }
        const params = ExtractParamNames(extensionAction)
        name = params[0] : ""
      }
      if (!IsUpperCase(name)) { // if (!/[A-Z][\w$]*/.test(name))
        return this.error("Type must have an uppercase name!")
      }
      const type = this._asExec(Type, "new", name, supertypes)
      return type.extend(extensionAction)
    })

    Type.AddSMethod(function handlerAt(selector) {
      return this._instanceRoot[selector]
    })

    // Top.access(function ())


    AddMethod(_Thing_root, function checkMutability() {
      return this.isImmutable() ? this.error("Object isn't mutable!") : this
    })


    this._super.New
    this._asExec()
    this._as(Thing)._init()

    this._as(Thing)._init()
    this._super.add()

    get (func, selector, outer) {
      func[_$super](selector)
    }



    function _super(supertype) {
      const type = this.$type
      const ancestors = _type[_$ancestor]
      ancestors.forEach(ancestor => {
        const root = ancestor._instanceRoot
        if ()
      })
    }


    bat
      _super --> func
        bat




    Thing.addSMethod(function _outerPrivateAccess(selector) {
      return this._privateAccessError(selector)
    })

    Top.addOMethod(function _outerPrivateAccess(inner, selector) {
      // Note: this is necessary to enable Nothings to handle errors.
      return inner._privateAccessError ?
         inner._outerPrivateAccess(selector) :
         inner._noSuchProperty(selector)
    })
