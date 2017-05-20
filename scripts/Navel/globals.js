// "use strict"

const RootOf             = Object.getPrototypeOf
const SpawnFrom          = Object.create
const IsArray            = Array.isArray
const Floor              = Math.floor
const RandomUnitValue    = Math.random
const DefineProperty     = Object.defineProperty
const VisibleProperties  = Object.keys
const AllSelectors       = Reflect.ownKeys
const AllNames           = Object.getOwnPropertyNames
const AllSymbols         = Object.getOwnPropertySymbols
const Frost              = Object.freeze
const IsFrosted          = Object.isFrozen
const Object_prototype   = Object.prototype
const HasOwnProperty     = Object_prototype.hasOwnProperty  // ._hasOwn
const PropertyDescriptor = Object.getOwnPropertyDescriptor
const Apply              = Reflect.apply

// Reflect.ownKeys === Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target)

// Protected Implementation properties (so no namespace clashing)
// private

// symbols for publicly knowable properties
const IS_IMMUTABLE       = Symbol("isImmutable")
const KNOWN_PROPERTIES   = Symbol("knownProperties")
const INSTANCEOF         = Symbol.hasInstance

// private symbols for implementation usage, $ means non-ya-bizness!!!
// Once everything is working, consider removing the names from the symbols
// to discourage tampering!!!
const $INNER             = Symbol("$inner")
const $PULP              = Symbol("$pulp")
const $OUTER             = Symbol("$outer")
const $RIND              = Symbol("$rind")  // Consider simply using $ !!!

const $BARRIER           = Symbol("$barrier")
const $COPY              = Symbol("$copy")
const $IID               = Symbol("$instanceId")
const $PRIOR_IDS         = Symbol("$priorIds")
const $SECRET            = Symbol("$secret")

const $IMMEDIATES        = Symbol("$immediates")
const $SUPERS            = Symbol("$supers")
const $SUPER             = Symbol("$super")


// Sentinels
const CONSTRUCTOR        = Symbol("CONSTRUCTOR")
const PROPERTY           = Symbol("PROPERTY")
const METHOD             = Symbol("METHOD")
const NO_SUPER           = Symbol("NO_SUPER")
const IGNORE             = Symbol("IGNORE")


const ALWAYS_FALSE       = (() => false)
const ALWAYS_NULL        = (() => null)
const ALWAYS_UNDEFINED   = (() => undefined)
const ALWAYS_SELF        = function () { return this }

const SAFE_FUNCTION      = {[IS_IMMUTABLE] : true}
// const KNOWN_GETTER       = {[IS_IMMUTABLE] : true, [GETTER] : true}



const STANDARD = {
  id          : "STANDARD",
  isRelaxed   : false,
  isImmediate : false,
  isLazy      : false,
}

const GETTER = {
  id          : "GETTER",
  isRelaxed   : false,
  isImmediate : true ,
  isLazy      : false,
}

const LAZY_INSTALLER = {
  id          : "LAZY_INSTALLER",
  isRelaxed   : false,
  isImmediate : true ,
  isLazy      : true ,
}

const RELAXED_STANDARD = {
  id          : "RELAXED_STANDARD",
  isRelaxed   : true ,
  isImmediate : false,
  isLazy      : false,
}

const RELAXED_GETTER = {
  id          : "RELAXED_GETTER",
  isRelaxed   : true ,
  isImmediate : true ,
  isLazy      : false,
}

isRelaxed ?
  (mode.isImmediate ? RelaxedGetterPorosity : RelaxedMethodPorosity) :
  (mode.isImmediate ? FactGetterPorosity    : FactMethodPorosity)

  

const VisibleConfiguration = {
  configurable : true,
  writable     : true,
  enumerable   : true,
}

const InvisibleConfiguration = {
  configurable : true,
  writable     : true,
  enumerable   : false,
}


const SymbolPropertyMap  = SpawnFrom(null)
const InterMap           = new WeakMap()
