(function (globals) {
  "use strict"

  const  Object_prototype    = Object.prototype
  const  Frost               = Object.freeze
  const  SpawnFrom           = Object.create
  const  DefineProperty      = Object.defineProperty
  const _HasOwn              = Object_prototype.hasOwnProperty

  const OSauce  = SpawnFrom(null)
  const _OSauce = SpawnFrom(OSauce)

  const _DURABLES    = Symbol("_DURABLES")
  const IS_IMMUTABLE = Symbol("IS_IMMUTABLE")
  const SAFE_FUNC    = Frost({ id : "SAFE_FUNC"   , [IS_IMMUTABLE] : true })
  const InterMap     = new WeakMap()

  OSauce.IS_IMMUTABLE = IS_IMMUTABLE
  OSauce.DURABLES     = _DURABLES
  _OSauce._DURABLES   = _DURABLES


  function MarkFunc(func, marker = SAFE_FUNC) {
    if (InterMap.get(func)) { return func }
    InterMap.set(func, marker)
    return func
  }


  _OSauce.InterMap            = InterMap
  _OSauce.PropertyToSymbolMap = SpawnFrom(null)
  // OSauce.SymbolPropertyMap  = SpawnFrom(null)


  OSauce.spawnFrom           = MarkFunc(SpawnFrom)
  OSauce.frost               = MarkFunc(Frost)
  OSauce.isFrosted           = MarkFunc(Object.isFrozen)
  OSauce.isArray             = MarkFunc(Array.isArray)
  OSauce.rootOf              = MarkFunc(Object.getPrototypeOf)
  OSauce.roundUp             = MarkFunc(Math.ceil)
  OSauce.roundDown           = MarkFunc(Math.floor)
  OSauce.randomUnitValue     = MarkFunc(Math.random)
  OSauce.ownKeys             = MarkFunc(Reflect.ownKeys)
  OSauce.ownSymbols          = MarkFunc(Object.getOwnPropertySymbols)
  OSauce.ownNames            = MarkFunc(Object.getOwnPropertyNames)
  OSauce.ownVisibleNames     = MarkFunc(Object.keys)

  _OSauce._HasOwn            = _HasOwn  // ._hasOwn
  _OSauce.defineProperty     = DefineProperty
  _OSauce.INSTANCEOF         = Symbol.hasInstance


  OSauce.hasOwn = function (target, selector) {
    return (target == null) ? false : _HasOwn.call(target, selector)
  }

  // Reflect.ownKeys === Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target)

  // Protected Implementation properties (so no namespace clashing)
  // private

  // symbols for publicly knowable properties


  const  InvisibleConfig = {
    configurable : true,
    writable     : true,
    enumerable   : false,
  }

  const VisibleConfig = {
    configurable : true,
    writable     : true,
    enumerable   : true,
  }


  // Safe functions are stored in here so that the diguised Types function are
  // automatically recognized as safe functions too

  // Document these!!!
  _OSauce.SAFE_FUNC     = SAFE_FUNC
  _OSauce.BLANKER_FUNC  = Frost({ id : "BLANKER_FUNC", [IS_IMMUTABLE] : true })
  _OSauce.TAMED_FUNC    = Frost({ id : "TAMED_FUNC"  , [IS_IMMUTABLE] : true })
  _OSauce.OUTER_FUNC    = Frost({ id : "OUTER_FUNC"  , [IS_IMMUTABLE] : true })
  _OSauce.INNER_FUNC    = Frost({ id : "INNER_FUNC"  , [IS_IMMUTABLE] : true })

  _OSauce.DISGUISE_PULP = Frost({ id : "DISGUISE_PULP" })
  _OSauce.ASSIGNER_FUNC = Frost({ id : "ASSIGNER_FUNC" })
  _OSauce.HANDLER_FUNC  = Frost({ id : "HANDLER_FUNC"  })

  _OSauce.MarkFunc      = MarkFunc

  // Simpleton function
  OSauce.alwaysTrue     = MarkFunc(          () => true        )
  OSauce.alwaysFalse    = MarkFunc(          () => false       )
  OSauce.alwaysNull     = MarkFunc(          () => null        )
  OSauce.alwayUndefined = MarkFunc(          () => undefined   )
  OSauce.alwaysSelf     = MarkFunc( function () { return this })



  // private symbols for implementation usage, $ means non-ya-bizness!!!
  // Once everything is working, consider removing the names from the symbols
  // to discourage tampering!!!
  _OSauce.$INNER                 = Symbol("$INNER")
  _OSauce.$PULP                  = Symbol("$PULP")
  const   $OUTER                 = Symbol("$OUTER")
  _OSauce.$OUTER                 = $OUTER
  _OSauce.$RIND                  = Symbol("$RIND")  // Consider simply using $ !!!

  _OSauce.$DISGUISE              = Symbol("$DISGUISE")
  _OSauce.$BARRIER               = Symbol("$BARRIER")
  //_OSauce.$IID                   = Symbol("$instanceId")
  _OSauce.$PRIOR_IDS             = Symbol("$PRIOR_IDS")
  _OSauce.$IS_INNER              = Symbol("$IS_INNER")
  _OSauce.$IS_DEFINITION         = Symbol("$IS_DEFINITION")
  _OSauce.$IS_TYPE               = Symbol("$IS_TYPE")
  _OSauce.$IS_CONTEXT            = Symbol("$IS_CONTEXT")

  _OSauce.$ROOT                  = Symbol("$ROOT")
  _OSauce.$BLANKER               = Symbol("$BLANKER")
  _OSauce.$ASSIGNERS             = Symbol("$ASSIGNERS")
  _OSauce.$IMMEDIATES            = Symbol("$IMMEDIATES")
  _OSauce.$DECLARATIONS          = Symbol("$DECLARATIONS")
  _OSauce.$SUPERS                = Symbol("$SUPERS")
  _OSauce.$OWN_DEFINITIONS       = Symbol("$OWN_DEFINITIONS")
  _OSauce.$LOCKED                = Symbol("$LOCKED")

  _OSauce.$OUTER_WRAPPER         = Symbol("$OUTER_WRAPPER")

  _OSauce.$DELETE_IMMUTABILITY   = Symbol("$DELETE_IMMUTABILITY")
  _OSauce.$DELETE_ALL_PROPERTIES = Symbol("$DELETE_ALL_PROPERTIES")


  // Sentinels
  _OSauce.PROOF                  = Symbol("PROOF")
  _OSauce.COUNT                  = Symbol("COUNT")

  _OSauce.ASYMMETRIC_PROPERTY    = Symbol("ASYMMETRIC_PROPERTY")
  // _OSauce.CONSTRUCTOR         = Symbol("CONSTRUCTOR")
  _OSauce.NO_SUPER               = Symbol("NO_SUPER")
  _OSauce.IMMEDIATE              = Symbol("IMMEDIATE")
  _OSauce.IMPLEMENTATION         = Symbol("IMPLEMENTATION")

  _OSauce.VISIBLE                = Symbol("VISIBLE")
  _OSauce.INVISIBLE              = Symbol("INVISIBLE")
  _OSauce.REINHERIT              = Symbol("REINHERIT")
  _OSauce.INHERIT                = Symbol("INHERIT")

  _OSauce.MUTABLE                = Symbol("MUTABLE")
  _OSauce.INHERITED              = Symbol("INHERITED")


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
  function BasicSetObjectImmutable(target) {
    target[IS_IMMUTABLE] = true
    return Frost(target)
  }

  function SetInvisibly(target, selector, value, setOuterToo_) {
    DefineProperty(target, selector, InvisibleConfig)
    if (setOuterToo_) { target[$OUTER][selector] = value }
    return target[selector] = value
  }



  _OSauce.ExtractParamListing     = ExtractParamListing
  _OSauce.ExtractParamNames       = ExtractParamNames
  _OSauce.BasicSetObjectImmutable = BasicSetObjectImmutable
  _OSauce.SetInvisibly            = SetInvisibly

  OSauce.asCapitalized            = MarkFunc(AsCapitalized)
  OSauce.asDecapitalized          = MarkFunc(AsDecapitalized)

  OSauce.theEmptyObject           = BasicSetObjectImmutable(SpawnFrom(null))
  OSauce.theEmptyArray            = BasicSetObjectImmutable([])
  _OSauce.EMPTY_THING_ANCESTRY    = BasicSetObjectImmutable([])

  OSauce.invisibleConfig           = BasicSetObjectImmutable(InvisibleConfig)
  OSauce.visibleConfig            = BasicSetObjectImmutable(VisibleConfig)

  _OSauce._OSauce = _OSauce
  _OSauce.OSauce  =  OSauce


  function MakeSauce(TargetContext) {
    return function (execContext) {
      const names = ExtractParamNames(execContext)
      const args  = names.map(name =>
        TargetContext[name] || TargetContext[AsDecapitalized(name)])
      return execContext.apply(null, args)
    }
  }

  globals.ObjectSauce = MakeSauce(_OSauce)

})(this)





/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
