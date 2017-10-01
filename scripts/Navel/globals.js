(function (globals) {
  "use strict"

  const  Frost       = Object.freeze
  const  SpawnFrom   = Object.create

  const Shared  = SpawnFrom(null)
  const _Shared = SpawnFrom(Shared)

  const _DURABLES    = Symbol("_DURABLES")
  const IMMUTABLE    = Symbol("IMMUTABLE")
  const SAFE_FUNC    = Frost({ id : "SAFE_FUNC", [IMMUTABLE] : true })
  const InterMap     = new WeakMap()

  Shared.IMMUTABLE   = IMMUTABLE
  Shared._DURABLES   = _DURABLES


  function MarkFunc(func, marker = SAFE_FUNC) {
    if (InterMap.get(func)) { return func }
    InterMap.set(func, marker)
    return func
  }


  _Shared.InterMap              = InterMap
  _Shared.PropertyToSymbolMap   = SpawnFrom(null)
  // _Shared.SymbolPropertyMap  = SpawnFrom(null)
  _Shared.ImplementationSymbols = SpawnFrom(null)

  Shared.spawnFrom           = MarkFunc(SpawnFrom)
  Shared.frost               = MarkFunc(Frost)
  Shared.isFrosted           = MarkFunc(Object.isFrozen)
  Shared.isArray             = MarkFunc(Array.isArray)
  Shared.rootOf              = MarkFunc(Object.getPrototypeOf)
  Shared.roundUp             = MarkFunc(Math.ceil)
  Shared.roundDown           = MarkFunc(Math.floor)
  Shared.randomUnitValue     = MarkFunc(Math.random)

  _Shared.DefineProperty     = Object.defineProperty
  _Shared.INSTANCEOF         = Symbol.hasInstance


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
  _Shared.BLANKER_FUNC  = Frost({ id : "BLANKER_FUNC" , [IMMUTABLE] : true })
  _Shared.TAMED_FUNC    = Frost({ id : "TAMED_FUNC"   , [IMMUTABLE] : true })
  _Shared.OUTER_FUNC    = Frost({ id : "OUTER_FUNC"   , [IMMUTABLE] : true })
  _Shared.INNER_FUNC    = Frost({ id : "INNER_FUNC"   , [IMMUTABLE] : true })
  _Shared.ASSIGNER_FUNC = Frost({ id : "ASSIGNER_FUNC", [IMMUTABLE] : true })
  _Shared.HANDLER_FUNC  = Frost({ id : "HANDLER_FUNC" , [IMMUTABLE] : true })
  // _Shared.DISGUISE_FUNC = Frost({ id : "DISGUISE_FUNC", [IMMUTABLE] : true })
  _Shared.DISGUISE_PULP = Frost({ id : "DISGUISE_PULP", [IMMUTABLE] : true })

  _Shared.MarkFunc      = MarkFunc

  // Simpleton function
  Shared.alwaysTrue     = MarkFunc(           () => true         )
  Shared.alwaysFalse    = MarkFunc(           () => false        )
  Shared.alwaysNull     = MarkFunc(           () => null         )
  Shared.alwayUndefined = MarkFunc(           () => undefined    )
  Shared.alwaysSelf     = MarkFunc(  function () { return this } )
  Shared.alwaysPass1st  = MarkFunc(          arg => arg          )
  Shared.alwaysPass2nd  = MarkFunc( (arg1, arg2) => arg2         )
  Shared.alwaysPass     = Shared.alwaysPass1st


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
  _Shared.NONE                   = Symbol("NONE")

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


  // Constants
  _Shared.SYMBOL_1ST_CHAR        = 7


  const FUNC_PROLOG_MATCHER =
    /^(function(\s+([\w$]+))?\s*\(([\w$\s.,=]*)\)|(\(([\w$\s.,=]*)\)|([\w$.]+))\s*=>)/
  const PARAMS_MATCHER      = /[\w$]+/g
  const CAP_WORD_MATCHER    = /([_$]*)([a-z])([\w$]*)/i

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
    const match = CAP_WORD_MATCHER.exec(word)
    return `${match[1]}${match[2].toUpperCase()}${match[3]}`
  }

  function AsDecapitalized(word) {
    const match = CAP_WORD_MATCHER.exec(word)
    return `${match[1]}${match[2].toLowerCase()}${match[3]}`
  }


  // This method should only be called on a mutable object!!!
  function CrudeBeImmutable(object) {
    object[IMMUTABLE] = true
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


  function MakeFauxContext(Entries) {
    return function (execContext) {
      const names = ExtractParamNames(execContext)
      const args  = names.map(name =>
        Entries[name] || Entries[AsDecapitalized(name)])
      return execContext.apply(null, args)
    }
  }

  globals.Tranya = MakeFauxContext(_Shared)

})(this)





/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
