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
    const IsFrozen           = Object.isFrozen
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




    const INNER              = Symbol("INNER")
    const INTER              = Symbol("INTER")
    const OUTER              = Symbol("OUTER")
    const _OUTER_            = Symbol("_OUTER_")
    const SECRET             = Symbol("SECRET")
    const INSTANCE_METHODS   = Symbol("INSTANCE_METHODS")
    const INSTANCE_SYMBOLS   = Symbol("INSTANCE_SYMBOLS")



    // Implementation/Base/Default/Pulp








    const LockedConfiguration = {
      __proto__   : null,
      writable    : false,
      enumerable  : true,
      configurable: false,
    }





    function SetPropertyGetter(target, getter_name, getter_) {
      const [name, getter] = (typeof getter_name === "function") ?
        [getter_name.name, getter_name] :
        [getter_name     , getter_    ]

      return DefineProperty(target, name, {
        __proto__ : LockedConfiguration,
          get     : getter
      })
    }

    function AddLazyProperty(target, namedInstaller_name, installer_) {
      const [name, installer] = (typeof namedInstaller_name === "function") ?
        [namedInstaller_name.name, namedInstaller_name] :
        [namedInstaller_name     , installer_         ]
      const configuration = {
        __proto__ : LazyPropertyConfiguration,
          get     : installer
      }

      return DefineProperty(target, name, configuration)
    }


    AddLazyProperty(Inner_root, OUTER, function () {
      return this[OUTER] = this[_OUTER_] = BakeThing(this)
    })

    AddLazyProperty(Inner_root, function oid() {
      return (this.oid = Symbol(NewUniqueId(this.typeName))
    })





    PutMethod(Thing_root, function is(other) {
      return (this === other || this[_OUTER_] === other)
    })








    AddLazyProperty(BaseObjectEnwrapture, IMMUTABLE_COPY, function () {
      return this[OUTER] = this[_OUTER_] = BakeThing(this)
    })







    PutGetter(Thing_root, function _asMutable() {
      return this[IMMUTABLE] ? this._mutableCopy : this
    })




    

    PutGetter(Thing_root, function _mutableCopy() {
      const copy  = this.type()
      const names = this[KNOWN_PROPERTIES] || LocalProperties(this)
      const next  = names.length

      while (next--) {
        const name = names[next]
        copy[name] = this[name]
      }
      return copy
    })

    function GetInner(target) {
      return (target[INTER] === SECRET) ? target : InterMap.get(target)
    }


    List.new()




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






    this.AddSMethod(function Copy() {
      return this.ShallowCopy()
    });


    this.AddIMethod(function ShallowCopy(target) {
      var copy, names, index, name;
      if (typeof target !== "object" || target === null) { return target; }
      if (IsArray(target)) { return target.slice(); }

      copy = SpawnFrom(RootOf(target));
      names = PropertiesOf(target);
      index = names.length;
      while (index--) {
        name = names[index];
        copy[name] = target[name];
      }
      return copy;
    });
