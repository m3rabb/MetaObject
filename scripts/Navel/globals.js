(function (globals) {
  "use strict"


  const  FreezeSurface   = Object.freeze
  const  SpawnFrom       = Object.create


  const Shared  = SpawnFrom(null)
  const _Shared = SpawnFrom(Shared)

  const IMMUTABLE    = Symbol("IMMUTABLE")
  const SAFE_FUNC    = FreezeSurface({id: "SAFE_FUNC", [IMMUTABLE]: true})
  const InterMap     = new WeakMap()
  const KnownFuncs   = new WeakMap()

  // symbols for publicly knowable properties
  Shared.IMMUTABLE   = IMMUTABLE
  Shared._DURABLES   = Symbol("_DURABLES")


  function KnowFunc(func, marker = SAFE_FUNC) {
    if (KnownFuncs.get(func)) { return func }
    KnownFuncs.set(func, marker)
    return func
  }


  _Shared.InterMap                = InterMap
  _Shared.KnownFuncs              = KnownFuncs
  _Shared.PropertyToSymbolMap     = SpawnFrom(null)
  // _Shared.SymbolPropertyMap    = SpawnFrom(null)
  _Shared.ImplementationSelectors = SpawnFrom(null)

  Shared.spawnFrom           = KnowFunc(SpawnFrom)
  Shared.freezeSurface       = KnowFunc(FreezeSurface)
  Shared.isSurfaceFrozen     = KnowFunc(Object.isFrozen)
  Shared.isArray             = KnowFunc(Array.isArray)
  Shared.rootOf              = KnowFunc(Object.getPrototypeOf)
  Shared.roundUp             = KnowFunc(Math.ceil)
  Shared.roundDown           = KnowFunc(Math.floor)
  Shared.randomUnitValue     = KnowFunc(Math.random)

  _Shared.DefineProperty     = Object.defineProperty
  _Shared.INSTANCEOF         = Symbol.hasInstance


  // private symbols for implementation usage, $ means non-ya-bizness!!!
  // Once everything is working, consider removing the names from the symbols
  // to discourage tampering!!!
  const $INNER                   = Symbol("$INNER")
  const $OUTER                   = Symbol("$OUTER")

  _Shared.$INNER                 = $INNER
  _Shared.$OUTER                 = $OUTER
  _Shared.$PULP                  = Symbol("$PULP")
  _Shared.$RIND                  = Symbol("$RIND")  // Consider simply using $ !!!

  _Shared.$DISGUISE              = Symbol("$DISGUISE")
  _Shared.$BARRIER               = Symbol("$BARRIER")

  _Shared.$IS_INNER              = Symbol("$IS_INNER")
  _Shared.$IS_DEFINITION         = Symbol("$IS_DEFINITION")
  _Shared.$IS_TYPE               = Symbol("$IS_TYPE")
  _Shared.$IS_CONTEXT            = Symbol("$IS_CONTEXT")
  _Shared.$PRIOR_IDS             = Symbol("$PRIOR_IDS")

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


  const  InvisibleConfig = {
    id           : "InvisibleConfig",
    configurable : true,
    writable     : true,
    enumerable   : false,
    [IMMUTABLE]  : true,
  }

  const VisibleConfig = {
    id           : "VisibleConfig",
    configurable : true,
    writable     : true,
    enumerable   : true,
    [IMMUTABLE]  : true,
  }


  // Safe functions are stored in here so that the diguised Types function are
  // automatically recognized as safe functions too

  // Document these!!!
  _Shared.SAFE_FUNC     = SAFE_FUNC
  _Shared.BLANKER_FUNC  = FreezeSurface({id:"BLANKER_FUNC" , [IMMUTABLE]:true})
  _Shared.TAMED_FUNC    = FreezeSurface({id:"TAMED_FUNC"   , [IMMUTABLE]:true})
  _Shared.OUTER_FUNC    = FreezeSurface({id:"OUTER_FUNC"   , [IMMUTABLE]:true})
  _Shared.INNER_FUNC    = FreezeSurface({id:"INNER_FUNC"   , [IMMUTABLE]:true})
  _Shared.SUPER_FUNC    = FreezeSurface({id:"SUPER_FUNC"   , [IMMUTABLE]:true})
  _Shared.ASSIGNER_FUNC = FreezeSurface({id:"ASSIGNER_FUNC", [IMMUTABLE]:true})
  _Shared.HANDLER_FUNC  = FreezeSurface({id:"HANDLER_FUNC" , [IMMUTABLE]:true})
  _Shared.DISGUISE_RIND = FreezeSurface({id:"DISGUISE_RIND", [IMMUTABLE]:true})
  _Shared.DISGUISE_PULP = FreezeSurface({id:"DISGUISE_PULP", [IMMUTABLE]:true})

  _Shared.KnowFunc      = KnowFunc

  // Simpleton function
  Shared.alwaysTrue     = KnowFunc(           () => true         )
  Shared.alwaysFalse    = KnowFunc(           () => false        )
  Shared.alwaysNull     = KnowFunc(           () => null         )
  Shared.alwayUndefined = KnowFunc(           () => undefined    )
  Shared.alwaysSelf     = KnowFunc(  function () { return this } )
  Shared.alwaysPass1st  = KnowFunc(          arg => arg          )
  Shared.alwaysPass2nd  = KnowFunc( (arg1, arg2) => arg2         )
  Shared.alwaysPass     = Shared.alwaysPass1st


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

  function ValueAsName(value) {
    var name
    switch (typeof value) {
      case "symbol" :
        name = value.toString()
        return name.slice(7, name.length - 1)

      case "function" :
      case "object"   :
        return value.name
    }
    return value
  }


  const TheEmptyArray      = []
  TheEmptyArray[IMMUTABLE] = true

  Shared.theEmptyArray            = FreezeSurface(TheEmptyArray)
  Shared.theEmptyStash            = FreezeSurface(SpawnFrom(null))

  Shared.invisibleConfig          = FreezeSurface(InvisibleConfig)
  Shared.visibleConfig            = FreezeSurface(VisibleConfig)

  _Shared.ExtractParamListing     = ExtractParamListing
  _Shared.ExtractParamNames       = ExtractParamNames

  Shared.asCapitalized            = KnowFunc(AsCapitalized)
  Shared.asDecapitalized          = KnowFunc(AsDecapitalized)
  Shared.valueAsName              = KnowFunc(ValueAsName)


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

  globals.HandAxe = MakeFauxContext(_Shared)

})(this)





/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
