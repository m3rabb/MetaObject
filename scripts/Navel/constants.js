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
const $INNER             = Symbol("$inner")
const $PULP              = Symbol("$pulp")
const $OUTER             = Symbol("$outer")
const $RIND              = Symbol("$rind")

const $INNER_POROSITY    = Symbol("$innerPorosity")
const $COPY              = Symbol("$copy")
const $IID               = Symbol("$instanceId")
const $PRIOR_IDS         = Symbol("$priorIds")
const $SECRET            = Symbol("$secret")

const $GETTERS           = Symbol("$getters")
const $SUPERS            = Symbol("$supers")
const $SUPER             = Symbol("$super")


// Sentinels
const CONSTRUCTOR        = Symbol("CONSTRUCTOR")
const PROPERTY           = Symbol("PROPERTY")
const METHOD             = Symbol("METHOD")
const LOADER             = Symbol("LOADER")

const DONT_RECORD        = Symbol("DONT_RECORD")
const BLANKER            = Symbol("BLANKER")
const STANDARD           = Symbol("STANDARD")
const GETTER             = Symbol("GETTER")
const LAZY_INSTALLER     = Symbol("LAZY_INSTALLER")
const NO_SUPER           = Symbol("NO_SUPER")

const ALWAYS_FALSE       = (() => false)
const ALWAYS_NULL        = (() => null)
const ALWAYS_UNDEFINED   = (() => undefined)
const ALWAYS_SELF        = function () { return this }

const SAFE_FUNCTION      = {[IS_IMMUTABLE] : true}
// const KNOWN_GETTER       = {[IS_IMMUTABLE] : true, [GETTER] : true}
