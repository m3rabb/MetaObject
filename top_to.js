(function (global) {
  "use strict";

  function factory(require) {
    const RootOf             = Object.getPrototypeOf
    const SpawnFrom          = Object.create
    const IsArray            = Array.isArray
    const Floor              = Math.floor
    const RandomUnitValue    = Math.random
    const DefineProperty     = Object.defineProperty
    const LocalProperties    = Object.keys
    const AllProperties      = Reflect.ownKeys
    const AllNames           = Object.getOwnPropertyNames
    const AllSymbols         = Object.getOwnPropertySymbols
    const ShallowFreeze      = Object.freeze
    const Object_prototype   = Object.prototype
    const IsLocalProperty    = Object_prototype.hasOwnProperty
    const PropertyDescriptor = Object.getOwnPropertyDescriptor
    const Apply              = Reflect.apply

    // var ParenthesesMatcher   = /\(|\)/
    // var SelectorMatcher      = /[\w\$_!&]+/gi
    const VowelMatcher         = /^[aeiou]/i
    const ValidSelectorMatcher = /_*\$*[a-z][\w$]*/

    // const _ = SpawnFrom(null)

    const ImplementationHandler = {
      __proto__ : null,
      get (_base_root, name, target) {
        return target._noSuchProperty(name)
      },
      // set (_base_root, selector, value, inner) {
      //   if (inner[_$isImmutable]) {
      //     return inner._innerImmutableWrite(inner, selector, value) || false
      //   }
      //   inner[selector] = value
      //   return true
      // }
    }


    const Base_root             = SpawnFrom(null)
    const   Stash_root          = SpawnFrom(Base_root)

    const   Implementation_root = new Proxy(Base_root, ImplementationHandler)
    const     Inner_root        = SpawnFrom(Implementation_root)

    const       Nothing_root    = SpawnFrom(Inner_root)
    const       Thing_root      = SpawnFrom(Inner_root)
    const       Type_root       = SpawnFrom(Inner_root)
    const       Method_root     = SpawnFrom(Inner_root)
    const       Context_root    = SpawnFrom(Inner_root)
    const       Name_root       = SpawnFrom(Inner_root)

    function ConstructorError(constructor) {
      SignalError(constructor.name,
        " is only for use with 'instanceof', it's not meant to be executed!")
    }

    function Implementation () { ConstructorError(Implementation) }
    function Inner ()          { ConstructorError(Inner)          }

    Implementation.prototype = Implementation_root
    Inner.prototype          = Inner_root

    ShallowFreeze(Base_root)
    ShallowFreeze(Stash_root)
    ShallowFreeze(Implementation_root)
    ShallowFreeze(Inner_root)
    ShallowFreeze(Implementation)
    ShallowFreeze(Inner)


    const INNER              = Symbol("INNER")
    const INTER              = Symbol("INTER")
    const OUTER              = Symbol("OUTER")
    const _OUTER_            = Symbol("_OUTER_")
    const SECRET             = Symbol("SECRET")
    const INSTANCE_METHODS   = Symbol("INSTANCE_METHODS")
    const INSTANCE_SYMBOLS   = Symbol("INSTANCE_SYMBOLS")



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
      return Floor(RandomUnitValue() * (max - min + 1)) + min
    }

    function NewUniqueId(prefix_, seedDate__, seedValue__) {
      const prefix = prefix_ || ""
      const seedDate = seedDate__ || Date.now()
      const seedValue = seedValue__ || RandomInt(RANDOM_MAX)
      const id = (seedDate * seedValue).toString(36)
      const zeros = ZERO_PADDING.slice(0, MAX_UNIQUE_ID_LENGTH - id.length)
      return prefix + zeros + id
    }

    // Note: Doesn't handle symbols for init
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



    const LockedConfiguration = {
      __proto__   : null,
      writable    : false,
      enumerable  : true,
      configurable: false,
    }

    const LazyPropertyConfiguration = {
      __proto__   : null,
      writable    : true,
      enumerable  : false,
      configurable: true,
    }



    function SetPropertyGet(target, getBehavior_name, getBehavior_) {
      const [name, installer] = (typeof getBehavior_name === "function") ?
        [getBehavior_name.name, getBehavior_name] :
        [getBehavior_name, getBehavior_]
      return DefineProperty(target, name, {
        __proto__ : LockedConfiguration,
          get     : getBehavior
      })
    }

    function AddLazyProperty(target, namedInstaller_name, installer_) {
      const [name, installer] = (typeof namedInstaller_name === "function") ?
        [namedInstaller_name.name, namedInstaller_name] :
        [namedInstaller_name, installer_]
      return DefineProperty(target, name, {
        __proto__ : LazyPropertyConfiguration,
          get     : installer
      })
    }


    AddLazyProperty(Inner_root, OUTER, function () {
      return this[OUTER] = this[_OUTER_] = BakeThing(this)
    })

    AddLazyProperty(Inner_root, function oid() {
      return (this.oid = Symbol(NewUniqueId(this.typeName))
    })



    function AtPutMethod(target, selector, func) {
      target[selector] = func
    }

    function PutMethod(target, namedFunc) {
      target[namedFunc.name] = namedFunc
    }


    // Change name into an instance of Name!!!
    PutMethod(Thing_root, function _init(name_) {
      // this._super._Init(arguments);
      if (name_ !== undefined) { this.name = name_ }
    })

    PutMethod(Thing_root, function is(other) {
      return (this === other || this[_OUTER_] === other)
    })

    const InterMap = new WeakMap()

    const BaseThingEnkrustment = {
      __proto__ : null,
      has (inner, selector) {
        switch (selector[0]) {
          case "_" :
            return inner._externalPrivateRead(selector) || false
          case undefined :
            if (inner[INSTANCE_SYMBOLS][selector]) { break }
            return false
        }
        return selector in inner
      },
      ownKeys (inner) {
        const known = inner[INSTANCE_SYMBOLS]
        const names = AllNames(inner).filter(name => name[0] !== "_")
        const symbols = AllSymbols(inner).filter(symbol => known[symbol])
        return names.concat(symbols)
      },
      getPrototypeOf (inner) {
        return null
      },
      setPrototypeOf (inner, target) {
        return false
      },
      // Symbol.hasInstance
      // isExtensible()
      // preventExtensions()
      // getOwnPropertyDescriptor: function(target, prop)
      // defineProperty: function(target, property, descriptor)
      // deleteProperty: function(target, property)
    }

    function Enkrust(selector, krust, crumb, value) {
      crumb[selector] = value
      switch (typeof value) {
        default :
          return (krust[selector] = value)
        case "function" :
          (value[INTER])
          return (krust[selector] = InterMap.get(value) ?
            value : BakeUntrusted(value))
        case "object" :
          return (krust[selector] = (value[INTER] === SECRET) ? value[OUTER] :
            (InterMap.get(value) ? value : BakeUntrusted(value)))
      }
    }

    function BakeThing(thing) {
      const Krust = { __proto__ : KrustRoot }
      const Core  = { __proto__ : thing[ROOT] }
      let Map
      return new Proxy(thing, {
        __proto__ : BaseThingEnkrustment,
        get : (inner, selector, outer) => {
          switch (selector[0]) {
            case "_" :
              return inner._externalPrivateRead(selector)
            case undefined :
              if (selector === INTER) {
                Map = Map || InterMap.set(outer, inner)
              }
              else if (inner[INSTANCE_SYMBOLS][selector]) { break }
              return undefined
          }
          const value = inner[selector]
          return value === Core[selector] ?
            Krust[selector] : Enkrust(selector, Krust, Core, value)
        },
        set : (inner, selector, value, outer) => {
          switch (selector[0]) {
            case "_" :
              return inner._externalPrivateWrite(selector, value) || false
            case undefined :
              inner[INSTANCE_SYMBOLS][selector] = true; break
          }
          if (inner[selector] !== undefined) {
            return inner._externalOverwrite(selector, value) || false
          }
          inner[selector] = Enkrust(selector, Krust, Core, value)
          return true
        }
      })
    }

    const UntrustedEnkrustment = {
      __proto__ : null,
      apply : (func, receiver, args) => {
        const $receiver = (receiver[INTER] === SECRET) ? receiver[OUTER] :
          (InterMap.get(receiver) ? receiver : BakeUntrusted(receiver))
        const $args = []
        let next = args.length
        while (next--) {
          let arg = args[next]
          switch (typeof arg) {
            default :
              $args[next] = arg; break
            case "function" :
              (arg[INTER])
              $args[next] = InterMap.get(arg) ? arg : BakeUntrusted(arg)); break
            case "object" :
              $args[next] = (arg[INTER] === SECRET) ? arg[OUTER] :
                (InterMap.get(arg) ? arg : BakeUntrusted(arg)); break
          }
        }
        const result = Apply(func, $receiver, $args)
        switch (typeof result) {
          default :
            return result
          case "function" :
            (result[INTER])
            return InterMap.get(result) ? result : BakeUntrusted(result))
          case "object" :
            return (result[INTER] === SECRET) ? result[OUTER] :
              (InterMap.get(result) ? result : BakeUntrusted(result))
        }
      },
      construct : (target, args, constructor) => {
        this.apply(constructor, target, args)
        return target
      }
    }

    function BakeUntrusted(object) {
      const Purple = { __proto__ : null }
      const Red    = { __proto__ : null }
      let _InteredMap
      return new Proxy(object, {
        __proto__ : UntrustedEnkrustment,
        get : (red, selector, purple) => {
          if (selector === INTER) {
            _InteredMap = _InteredMap || InterMap.set(purple, red)
            return undefined
          }
          const value = red[selector]
          return value === Red[selector] ?
            Purple[selector] : Enkrust(selector, Purple, Red, value)
        },
        set : (red, selector, value, purple) => {
          if (selector === INTER) { return false }
          red[selector] = Enkrust(selector, Purple, Red, value)
          return true
        }
      }
        // getOwnPropertyDescriptor()
        // defineProperty()
      })
    }

    const BaseMethodHandlerEnkrustment = {
      __proto__ : null,
      set : (func, selector, value, outer) => {
        if (selector === INTER) { return false }
        func[selector] = value
        return true
      },
      construct : (target, args, constructor) => {
        return null // Void
      }
      // getOwnPropertyDescriptor()
      // defineProperty()
    }

    const MethodHandlerEnkrustment = {
      __proto__ : BaseMethodHandlerEnkrustment,
      apply : (func, inner, args) => {
        const $args = []
        let next = args.length
        while (next--) {
          let arg = args[next]
          switch (typeof arg) {
            default :
              $args[next] = arg; break
            case "function" :
              (arg[INTER])
              $args[next] = InterMap.get(arg) ? arg : BakeUntrusted(arg)); break
            case "object" :
              $args[next] = (arg[INTER] === SECRET) ? arg :
                (InterMap.get(arg) ? arg : BakeUntrusted(arg)); break
          }
        }
        const result = Apply(func, inner, $args)
        switch (typeof result) {
          default :
            return result
          case "function" :
            (result[INTER])
            return InterMap.get(result) ? result : BakeUntrusted(result))
          case "object" :
            return (result[INTER] === SECRET) ? result[OUTER] :
              (InterMap.get(result) ? result : BakeUntrusted(result))
        }
      }
    }

    const GetterHandlerEnkrustment = {
      __proto__ : MethodHandlerEnkrustment,
      apply : (func, inner, args) => {
        const result = func.call(inner)
        switch (typeof result) {
          default :
            return result
          case "function" :
            (result[INTER])
            return InterMap.get(result) ? result : BakeUntrusted(result))
          case "object" :
            return (result[INTER] === SECRET) ? result[OUTER] :
              (InterMap.get(result) ? result : BakeUntrusted(result))
        }
      }
    }

    const SetterHandlerEnkrustment = {
      __proto__ : MethodHandlerEnkrustment,
      apply : (func, inner, args) => {
        let arg = args[0]
        switch (typeof arg) {
          case "function" :
            (arg[INTER])
            arg = InterMap.get(arg) ? arg : BakeUntrusted(arg)); break
          case "object" :
            arg = (arg[INTER] === SECRET) ? arg :
              (InterMap.get(arg) ? arg : BakeUntrusted(arg)); break
        }
        const result = func.call(inner, arg)
        switch (typeof result) {
          default :
            return result
          case "function" :
            (result[INTER])
            return InterMap.get(result) ? result : BakeUntrusted(result))
          case "object" :
            return (result[INTER] === SECRET) ? result[OUTER] :
              (InterMap.get(result) ? result : BakeUntrusted(result))
        }
      }
    }

    function BakeMethodHandler(handler, enkrustmentBase) {
      let Map
      return new Proxy(BeImmutable(handler), {
        __proto__ : enkrustmentBase,
        get : (func, selector, outer) => {
          if (selector === INTER) {
            Map = Map || InterMap.set(outer, inner)
            return undefined
          }
          return func[selector]
        }
      })
    }

    function BakeGeneralHandler(handler) {
      return BakeMethodHandler(handler, GetterHandlerEnkrustment)
    }

    function BakeGetterHandler(handler) {
      return BakeMethodHandler(handler, GetterHandlerEnkrustment)
    }

    function BakeSetterHandler(handler) {
      return BakeMethodHandler(handler, SetterHandlerEnkrustment)
    }



    function GetInner(target) {
      return (target[INTER] === SECRET) ? target : InterMap.get(target)
    }


    function ConnectTypes(_type, supertypes) {
      const typeOID = _type.oid
      return supertypes.map(supertype => {
        const _supertype = GetInner(supertype)
        _supertype._subtypes[typeOID] = _type
        return _supertype
      })
    }

    // _supertypes each type to the left overrides types to the right
    // ancestors each type to the right overrides types to the left
    function BuildAncestors(_supertypes) {
      let next = _supertypes.length
      if (next === 0) { return [] }

      let _supertype = _supertypes[--next]
      const ancestors = _supertype.ancestry.slice()
      if (next === 0) { return ancestors }

      const visited = { __proto__ : null }
      ancestors.forEach(_type => (visited[_type.oid] = _type))

      do {
        _supertype = _supertypes[--next]
        let oid = _supertype.oid
        if (!visited[oid]) {
          _supertype.ancestry.forEach(_type => {
            const oid = _type.oid
            if (!visited[oid]) { ancestors.push((visited[oid] = _type)) }
          })
        }
      } while (next)
      return ancestors
    }

    function SeedInstanceRootMethodHandlers(_root, _ancestors) {
      const count = _ancestors.length
      let next = 0
      while (next < count) {
        const methods = _ancestors[next++].methods
        for (const selector in methods) {
          _root[selector] = methods[selector].handler
        }
      }
    }

    function ReseedSubtypesMethodHandler(type, selector, handler) {
      const subtypes = type.subtypes
      for (const oid in subtypes) {
        ReseedTypeMethodHandler(subtypes[oid], selector, handler)
      }
    }

    function ReseedTypeMethodHandler(type, selector, handler) {
      if (type.methods[selector] == undefined) {
        type._instanceRoot[selector] = handler
        ReseedSubtypesMethodHandler(type, selector, handler)
      }
    }


    // Type bootstrapping

    PutMethod(Type_root, function _init(name, supertypes, _root_) {
      const _supertypes  = ConnectTypes(this, supertypes)
      const _ancestors   = BuildAncestors(_supertypes)
      const _root        = _root_ || { __proto__ : Inner_root }

      this.name          =  name // this._asExec(Thing, "_init", name)
      this._instanceRoot = _root
      this.supertypes    = _supertypes
      this.subtypes      = { __proto__ : null }
      this.methods       = { __proto__ : null }
      // this.context       = null

      _root.type     = this
      _root[ROOT]    = _root
      SeedInstanceRootMethodHandlers(_root, _ancestors)
      _root.ancestry = ShallowFreeze(_ancestors.push(this))
    })

    Type.addSGetter(function copy() {
      // Fix to make name a copy!!!
      const type = Type.new(this.name, this.supertypes)
    })

    PutMethod(Type_root, function new(...args) {
      var instance = SpawnFrom(this._instanceRoot)
      instance._init(...args)
      return instance
    })


    _Type_root._instanceRoot = _Type_root
    const Thing   = _Type_root.new("Thing"  , []     , Thing_root)
    const Type    = _Type_root.new("Type"   , [Thing], Type_root)
    const Nothing =       Type.new("Nothing", []     , Nothing_root)
    const Method  =       Type.new("Method" , [Thing], Method_root)
    const Context =       Type.new("Context", [Thing], Context_root)
    const Name    =       Type.new("Name"   , [Thing], Name_root)

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

    PutMethod(Type_root, function addSMethod(method_func__name, func__) {
      const type = method_func__name.type
      const method = type && type.is(Method) ?
        method_func__name : Method.new(method_func__name, func__)
      const selector = method.selector
      const handler = method.handler
      this.methods[selector] = method
      this._instanceRoot[selector] = handler
      ReseedSubtypesMethodHandler(this, selector, handler)
      return this
    })

    // Method bootstrapping

    Thing.addSMethod(INTER, Thing_root._instanceRoot[INTER])
    Thing.addSMethod(       Thing_root._instanceRoot._init)
    Thing.addSMethod(       Thing_root._instanceRoot.is)
    Type.addSMethod(         Type_root._instanceRoot._init)
    Type.addSMethod(         Type_root._instanceRoot.new)
    Type.addSMethod(         Type_root._instanceRoot.addSMethod)
    Method.addSMethod(     Method_root._instanceRoot._init)

    Thing.addSMethod(function _noSuchProperty(name) {
      return this.error(`No such property: ${name}!`)
    })

    Nothing.addSMethod(Thing_root.is)
    Nothing.addSMethod(Thing_root._noSuchProperty)


    Thing.addSMethod(function addOMethod(method_func__name, func_) {
      const type = method_func__name.type
      const method = type && type.is(Method) ?
        method_func__name : Method.new(method_func__name, func__)
      const selector = method.selector
      const methods = (this[INSTANCE_METHODS] ||
        this[INSTANCE_METHODS] = { __proto__ : null })
      methods[selector] = method
      this[selector] = method.handler
      return this
    })

    Thing.addSMethod("equals", Thing_root.is)

    Thing.addSMethod(function exec(selector, ...args) {
      // Must check that selector is not private!!!
      return Apply(this[selector], this, args)
    })

    Thing.addSMethod(function _asExec(type, selector, ...args) {

      // Must check that type is a valid supertype!!!
      // It might be enough to check whether or not type is extensible!!!
      return type.isExtensible ?
        Apply(type.handlerAt(selector), this, args) :
        this.error(`Can't call _asExec with a nonextensible type!`)
    })
    Thing.addSMethod(function _asExec(type, selector, ...args) {
      // Might need a security check to make sure target object is a
      // subtype of the given type to prevent unauthorized param access!!!

      // using _handlerAt vs handlerAt might be enough
      return Apply(type._instanceRoot[selector], this, args)
    })

    Thing.addSMethod(function _superExec(selector, ...args) {
      const handler = this[selector]
      const ancestry = this.ancestry
      let next = ancestry.length
      while (next--) {
        let type = ancestry[next]
        let superHandler = type.methods[selector]
        if (superHandler && superHandler !== handler) {
          return Apply(superHandler, this, args) // do these need to be protected too???
        }
      }
      return this._noSuchProperty(selector, args)
    })

    Thing.addSMethod(function understands(selector) {
      !!return this.type.handlerAt(selector)
    })

    Thing.addSMethod(function hasProperty(selector) {
      return (selector[0] === "_") ? undefined : (selector in this)
    })

    Thing.addSMethod(function isImmutable() { return !!this[_$isImmutable]}) }

    Thing.addSMethod(function isMutable() { return !this[_$isImmutable]}) }

    Thing.addSMethod(function shouldNotImplementError() {
      return this.error("Method should not be implemented!");
    });

    Thing.addSMethod(function notYetImplementedError() {
      return this.error("Method not yet implemented!");
    });

    Thing.addSMethod(function notYetTestedError() {
      return this.error("Method not yet tested!");
    });

    Thing.addSMethod(function subtypeResponsibilityError() {
      return this.error("Method should be implemented by this or subtype!");
    });



    //// Ella's typing
    // Type=add _addSelector publicEqualitySelector...supertypes
    // getElementsByClassName('className')(marker )RANDOM_MAX SeedAllMethodsFrom KIT KAT

    hack 2244 bazooka. ~a function Qs rc radar ConnectSubtype_ToSuperty EnsureDefaultMethodsFor BaseMethodHandlerEnkrustment
    console.warn(function (a confirm('olè! ');  document ZERO_PADDING 222
    2U2USD enter 64 prefix $45  appendix a40 function  {

    }








    ) {

    });

    const FUNC_PROLOG_MATCHER   = /^(function\s*(\s[\w$]+)?\(([\w$\s,]*)\)|(\(([\w$\s,]*)\)|([\w$]+))\s*=>)/
    const PARAMS_MATCHER = /[\w$]+/g

    function ExtractParamNames(func) {
      const match        = FUNC_PROLOG_MATCHER.exec(func)
      const paramsString = match[3] || match[5] || match[6]
      const params       = PARAMS_MATCHER.exec(paramsString)
      return params || []
    }


    Type.AddOMethod(function new(...args) {
      const argTypes = { __proto__ : null }
      let improperArgs = args.filter(arg => {
        const type = typeof arg
        return argTypes[type] || (argTypes[type] = arg, false)
      })
      if (improperArgs.length) {
        return this.error(
          "Args must contain name and/or function, and optional supertype(s)!")
      }
      let name            = argTypes.string
      let supertypes      = argTypes.object
      let extensionAction = argTypes.function
      // Add check to ensure all supertypers are extensible!!!
      supertypes = supertypes ?
        (IsArray(supertypes) ?
          (supertypes.length ? supertypes : [Thing]) :
          [supertypes]) :
        [Thing]
      improperArgs = supertypes.filter(type => type.isImmutable)
      if (improperArgs) {
        return this.error(`Supertypes ${improperArgs} cannot be immutable!`)
      }
      improperArgs = supertypes.filter(type => type.isSealed)
      if (improperArgs) {
        return this.error(`Supertypes ${improperArgs} must be extensible!`)
      }
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

    Type.AddSMethod(function $new(...args) {
      return this.new(...args).be$
    })

    Type.AddSAccessor(function be$() {
      ShallowFreeze(this)
      ShallowFreeze(this.name)
      ShallowFreeze(this._instanceRoot)
      // this._supertypes <-- this array is already immutable!!!
      ShallowFreeze(this._subtypes)
      ShallowFreeze(this._methods)
    })

    function BeDeeplyImmutable(target) {
      if (typeof target === "object" && !IsFrozen(target)) {
        DeepFreeze(target)
      }
      return target
    }

    function DeepFreeze(object) {
      ShallowFreeze(object)
      const selectors = AllProperties(object)
      const next = selectors.length
      while (next--) {
        const value = object[selectors[next]]
        if (typeof value === "object" && !IsFrozen(value)) {
          DeepFreeze(value)
        }
      }
      return object
    }

    filter selectors for protected functions
    if so, need to have outer heirarchy to store different handlers



    AddMethod(_Thing_root, function checkMutability() {
      return this.is$ ? this.error("Object isn't mutable!") : this
    })

    _as(Thing).new()
    _super




    Type.new("RemoteControlBat", Mammal, Flying, RemoteControllable, => {})

    Type.new(Mammal, Flying, RemoteControllable, RemoteControlBat => {})


    Type.new("", [Plastic, Robotic, Flying, Mammal], function (ToyBat) )
    Type.new([, ,])

    Mammal, F

    Type.new(function (Bat, Flying, Mammal))
    Type.new(function (RemoteControlBat, RemoteControllable, Plastic, Bat))

    Krust.newContext(function Animals(Collection, $Object) {

    })

i like to eat! =Ellacrazy type RemoteControlBat null KITKAT



    bat
      _super --> func
        bat





    Type.new(Mammal, Flying, RemoteControllable, RemoteControlBat => {})


    Thing.addSMethod(function _outerPrivateAccess(selector) {
      return this._privateAccessError(selector)
    })

    Top.addOMethod(function _outerPrivateAccess(inner, selector) {
      // Note: this is necessary to enable Nothings to handle errors.
      return inner._privateAccessError ?
         inner._outerPrivateAccess(selector) :
         inner._noSuchProperty(selector)
    })
