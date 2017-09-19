(function (globals) {
  "use strict"

  const  Object_prototype    = Object.prototype
  const  Frost               = Object.freeze
  const  SpawnFrom           = Object.create
  const  DefineProperty      = Object.defineProperty
  const _HasOwn              = Object_prototype.hasOwnProperty

  const Shared  = SpawnFrom(null)
  const _Shared = SpawnFrom(Shared)

  const _DURABLES    = Symbol("_DURABLES")
  const IS_IMMUTABLE = Symbol("IS_IMMUTABLE")
  const SAFE_FUNC    = Frost({ id : "SAFE_FUNC"   , [IS_IMMUTABLE] : true })
  const InterMap     = new WeakMap()

  Shared.IS_IMMUTABLE = IS_IMMUTABLE
  Shared.DURABLES     = _DURABLES
  _Shared._DURABLES   = _DURABLES


  function MarkFunc(func, marker = SAFE_FUNC) {
    if (InterMap.get(func)) { return func }
    InterMap.set(func, marker)
    return func
  }


  _Shared.InterMap            = InterMap
  _Shared.PropertyToSymbolMap = SpawnFrom(null)
  // Shared.SymbolPropertyMap  = SpawnFrom(null)


  Shared.spawnFrom           = MarkFunc(SpawnFrom)
  Shared.frost               = MarkFunc(Frost)
  Shared.isFrosted           = MarkFunc(Object.isFrozen)
  Shared.isArray             = MarkFunc(Array.isArray)
  Shared.rootOf              = MarkFunc(Object.getPrototypeOf)
  Shared.roundUp             = MarkFunc(Math.ceil)
  Shared.roundDown           = MarkFunc(Math.floor)
  Shared.randomUnitValue     = MarkFunc(Math.random)
  Shared.ownKeys             = MarkFunc(Reflect.ownKeys)
  Shared.ownSymbols          = MarkFunc(Object.getOwnPropertySymbols)
  Shared.ownNames            = MarkFunc(Object.getOwnPropertyNames)
  Shared.ownVisibleNames     = MarkFunc(Object.keys)

  _Shared._HasOwn            = _HasOwn  // ._hasOwn
  _Shared.defineProperty     = DefineProperty
  _Shared.INSTANCEOF         = Symbol.hasInstance


  Shared.hasOwn = function (target, selector) {
    return (target == null) ? false : _HasOwn.call(target, selector)
  }

  // Reflect.ownKeys === Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target)

  // Protected Implementation properties (so no namespace clashing)
  // private

  // symbols for publicly knowable properties


  const  InvisibleConfig = {
    id           : "InvisibleConfig",
    configurable : true,
    writable     : true,
    enumerable   : false,
  }

  const VisibleConfig = {
    id           : "VisibleConfig",
    configurable : true,
    writable     : true,
    enumerable   : true,
  }


  // Safe functions are stored in here so that the diguised Types function are
  // automatically recognized as safe functions too

  // Document these!!!
  _Shared.SAFE_FUNC     = SAFE_FUNC
  _Shared.BLANKER_FUNC  = Frost({ id : "BLANKER_FUNC", [IS_IMMUTABLE] : true })
  _Shared.TAMED_FUNC    = Frost({ id : "TAMED_FUNC"  , [IS_IMMUTABLE] : true })
  _Shared.OUTER_FUNC    = Frost({ id : "OUTER_FUNC"  , [IS_IMMUTABLE] : true })
  _Shared.INNER_FUNC    = Frost({ id : "INNER_FUNC"  , [IS_IMMUTABLE] : true })

  _Shared.DISGUISE_PULP = Frost({ id : "DISGUISE_PULP" })
  _Shared.ASSIGNER_FUNC = Frost({ id : "ASSIGNER_FUNC" })
  _Shared.HANDLER_FUNC  = Frost({ id : "HANDLER_FUNC"  })

  _Shared.MarkFunc      = MarkFunc

  // Simpleton function
  Shared.alwaysTrue     = MarkFunc(          () => true        )
  Shared.alwaysFalse    = MarkFunc(          () => false       )
  Shared.alwaysNull     = MarkFunc(          () => null        )
  Shared.alwayUndefined = MarkFunc(          () => undefined   )
  Shared.alwaysSelf     = MarkFunc( function () { return this })



  // private symbols for implementation usage, $ means non-ya-bizness!!!
  // Once everything is working, consider removing the names from the symbols
  // to discourage tampering!!!
  const   $INNER                 = Symbol("$INNER")
  const   $OUTER                 = Symbol("$OUTER")

  _Shared.$INNER                 = $INNER
  _Shared.$OUTER                 = $OUTER
  _Shared.$PULP                  = Symbol("$PULP")
  _Shared.$RIND                  = Symbol("$RIND")  // Consider simply using $ !!!

  _Shared.$DISGUISE              = Symbol("$DISGUISE")
  _Shared.$BARRIER               = Symbol("$BARRIER")
  //_Shared.$IID                   = Symbol("$instanceId")
  _Shared.$PRIOR_IDS             = Symbol("$PRIOR_IDS")
  _Shared.$IS_INNER              = Symbol("$IS_INNER")
  _Shared.$IS_DEFINITION         = Symbol("$IS_DEFINITION")
  _Shared.$IS_TYPE               = Symbol("$IS_TYPE")
  _Shared.$IS_CONTEXT            = Symbol("$IS_CONTEXT")

  _Shared.$ROOT                  = Symbol("$ROOT")
  _Shared.$BLANKER               = Symbol("$BLANKER")
  _Shared.$ASSIGNERS             = Symbol("$ASSIGNERS")
  _Shared.$IMMEDIATES            = Symbol("$IMMEDIATES")
  _Shared.$DECLARATIONS          = Symbol("$DECLARATIONS")
  _Shared.$SUPERS                = Symbol("$SUPERS")
  _Shared.$OWN_DEFINITIONS       = Symbol("$OWN_DEFINITIONS")
  _Shared.$IS_IMPENETRABLE       = Symbol("$IS_IMPENETRABLE")

  _Shared.$OUTER_WRAPPER         = Symbol("$OUTER_WRAPPER")

  _Shared.$DELETE_IMMUTABILITY   = Symbol("$DELETE_IMMUTABILITY")
  _Shared.$DELETE_ALL_PROPERTIES = Symbol("$DELETE_ALL_PROPERTIES")


  // Sentinels
  _Shared.PROOF                  = Symbol("PROOF")
  _Shared.COUNT                  = Symbol("COUNT")

  _Shared.ASYMMETRIC_PROPERTY    = Symbol("ASYMMETRIC_PROPERTY")
  // _Shared.CONSTRUCTOR         = Symbol("CONSTRUCTOR")
  _Shared.NO_SUPER               = Symbol("NO_SUPER")
  _Shared.IMMEDIATE              = Symbol("IMMEDIATE")
  _Shared.IMPLEMENTATION         = Symbol("IMPLEMENTATION")

  _Shared.VISIBLE                = Symbol("VISIBLE")
  _Shared.INVISIBLE              = Symbol("INVISIBLE")
  _Shared.REINHERIT              = Symbol("REINHERIT")
  _Shared.INHERIT                = Symbol("INHERIT")

  _Shared.MUTABLE                = Symbol("MUTABLE")
  _Shared.INHERITED              = Symbol("INHERITED")


  const FUNC_PROLOG_MATCHER =
    /^(function(\s+([\w$]+))?\s*\(([\w$\s.,=]*)\)|(\(([\w$\s.,=]*)\)|([\w$.]+))\s*=>)/
  const PARAMS_MATCHER = /[\w$]+/g

  function ExtractParamListing(func) {
    const match = FUNC_PROLOG_MATCHER.exec(func)
    return match[4] || match[6] || match[7] || ""
  }

  function ExtractParamNames(func) {
    const paramListing = ExtractParamListing(func)
    const params       = paramListing.match(PARAMS_MATCHER)
    return params || []
  }

  function AsCapitalized(word) {
    return `${word[0].toUpperCase()}${word.slice(1)}`
  }

  function AsDecapitalized(word) {
    return `${word[0].toLowerCase()}${word.slice(1)}`
  }


  // This method should only be called on a mutable object!!!
  function CrudeBeImmutable(object) {
    object[IS_IMMUTABLE] = true
    return Frost(object)
  }



  _Shared.ExtractParamListing     = ExtractParamListing
  _Shared.ExtractParamNames       = ExtractParamNames

  Shared.asCapitalized            = MarkFunc(AsCapitalized)
  Shared.asDecapitalized          = MarkFunc(AsDecapitalized)
  Shared.crudeBeImmutable         = MarkFunc(CrudeBeImmutable)

  Shared.theEmptyObject           = CrudeBeImmutable(SpawnFrom(null))
  Shared.theEmptyArray            = CrudeBeImmutable([])
  _Shared.EMPTY_THING_ANCESTRY    = CrudeBeImmutable([])

  Shared.invisibleConfig          = CrudeBeImmutable(InvisibleConfig)
  Shared.visibleConfig            = CrudeBeImmutable(VisibleConfig)

  _Shared._Shared = _Shared
  _Shared.Shared  =  Shared


  function MakeSauce(TargetContext) {
    return function (execContext) {
      const names = ExtractParamNames(execContext)
      const args  = names.map(name =>
        TargetContext[name] || TargetContext[AsDecapitalized(name)])
      return execContext.apply(null, args)
    }
  }

  globals.Tranya = MakeSauce(_Shared)

})(this)





/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
