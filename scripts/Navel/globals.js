(function (globals) {
  "use strict"

  const Object_prototype    = Object.prototype
  const Frost               = Object.freeze
  const SpawnFrom           = Object.create

  const OSauce  = SpawnFrom(null)
  const _OSauce = SpawnFrom(OSauce)

  OSauce.OSauce   = OSauce
  _OSauce._OSauce = _OSauce


  OSauce.spawnFrom           = SpawnFrom
  OSauce.frost               = Frost
  OSauce.isFrosted           = Object.isFrozen
  OSauce.isArray             = Array.isArray
  OSauce.rootOf              = Object.getPrototypeOf
  OSauce.roundUp             = Math.ceil
  OSauce.roundDown           = Math.floor
  OSauce.randomUnitValue     = Math.random
  OSauce.defineProperty      = Object.defineProperty
  OSauce.ownKeys             = Reflect.ownKeys
  OSauce.ownSymbols          = Object.getOwnPropertySymbols
  OSauce.ownNames            = Object.getOwnPropertyNames
  OSauce.ownVisibleNames     = Object.keys
  OSauce.hasOwn              = Object_prototype.hasOwnProperty  // ._hasOwn
  OSauce.propertyDescriptor  = Object.getOwnPropertyDescriptor
  OSauce.propertyDescriptors = Object.getOwnPropertyDescriptors
  // OSauce.apply               = Reflect.apply

  // Reflect.ownKeys === Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target)

  // Protected Implementation properties (so no namespace clashing)
  // private

  // symbols for publicly knowable properties

  const IS_IMMUTABLE            = Symbol("IS_IMMUTABLE")

  OSauce.IS_IMMUTABLE           = IS_IMMUTABLE
  OSauce._DURABLES              = Symbol("_DURABLES")
  OSauce.INSTANCEOF             = Symbol.hasInstance

  OSauce.VisibleConfig = {
    configurable : true,
    writable     : true,
    enumerable   : true,
  }

  OSauce.InvisibleConfig = {
    configurable : true,
    writable     : true,
    enumerable   : false,
  }


  const InterMap              = new WeakMap()
  _OSauce.InterMap            = InterMap
  // OSauce.SymbolPropertyMap  = SpawnFrom(null)
  _OSauce.PropertyToSymbolMap = SpawnFrom(null)
  // Safe functions are stored in here so that the diguised Types function are
  // automatically recognized as safe functions too


  function MarkFunc(func, marker) {
    if (InterMap.get(func)) { return func }
    InterMap.set(func, marker)
    return func
  }

  // Document these!!!
  const SAFE_FUNC       = Frost({ id : "SAFE_FUNC"   , [IS_IMMUTABLE] : true })

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
  OSauce.ALWAYS_FALSE     = MarkFunc(          () => false       , SAFE_FUNC)
  OSauce.ALWAYS_NULL      = MarkFunc(          () => null        , SAFE_FUNC)
  OSauce.ALWAYS_UNDEFINED = MarkFunc(          () => undefined   , SAFE_FUNC)
  OSauce.ALWAYS_SELF      = MarkFunc( function () { return this }, SAFE_FUNC)



  // private symbols for implementation usage, $ means non-ya-bizness!!!
  // Once everything is working, consider removing the names from the symbols
  // to discourage tampering!!!
  _OSauce.$INNER                 = Symbol("$INNER")
  _OSauce.$PULP                  = Symbol("$PULP")
  _OSauce.$OUTER                 = Symbol("$OUTER")
  _OSauce.$RIND                  = Symbol("$RIND")  // Consider simply using $ !!!

  _OSauce.$DISGUISE              = Symbol("$DISGUISE")
  _OSauce.$BARRIER               = Symbol("$BARRIER")
  //_OSauce.$IID                   = Symbol("$instanceId")
  _OSauce.$PRIOR_IDS             = Symbol("$PRIOR_IDS")
  _OSauce.$IS_INNER              = Symbol("$IS_INNER")
  _OSauce.$IS_DEFINITION         = Symbol("$IS_DEFINITION")

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
    /^(function(\s+([\w$]+))?\s*\(([\w$\s.,]*)\)|(\(([\w$\s.,]*)\)|([\w$.]+))\s*=>)/
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



  _OSauce.ExtractParamListing     = ExtractParamListing
  _OSauce.ExtractParamNames       = ExtractParamNames
  _OSauce.BasicSetObjectImmutable = BasicSetObjectImmutable

  OSauce.asCapitalized            = AsCapitalized
  OSauce.asDecapitalized          = AsDecapitalized

  OSauce.EMPTY_OBJECT             = BasicSetObjectImmutable(SpawnFrom(null))
  OSauce.EMPTY_ARRAY              = BasicSetObjectImmutable([])
  OSauce.EMPTY_THING_ANCESTRY     = BasicSetObjectImmutable([])

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
