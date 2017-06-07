// "use strict"

const RootOf              = Object.getPrototypeOf
const SpawnFrom           = Object.create
const IsArray             = Array.isArray
const Floor               = Math.floor
const RandomUnitValue     = Math.random
const DefineProperty      = Object.defineProperty
const VisibleProperties   = Object.keys
const AllProperties       = Reflect.ownKeys
const AllNames            = Object.getOwnPropertyNames
const AllSymbols          = Object.getOwnPropertySymbols
const Frost               = Object.freeze
const IsFrosted           = Object.isFrozen
const Object_prototype    = Object.prototype
const HasOwnProperty      = Object_prototype.hasOwnProperty  // ._hasOwn
const PropertyDescriptor  = Object.getOwnPropertyDescriptor
const PropertyDescriptors = Object.getOwnPropertyDescriptors
const Apply               = Reflect.apply

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

const $MAIN_BARRIER      = Symbol("$mainBarrier")
const $COPY              = Symbol("$copy")
//const $IID               = Symbol("$instanceId")
const $PRIOR_IDS         = Symbol("$priorIds")
const $SECRET            = Symbol("$secret")

const $IMMEDIATES        = Symbol("$immediates")
const $BLANKER           = Symbol("$blanker")
const $SUPERS            = Symbol("$supers")
const $SUPER             = Symbol("$super")
const $SET_LOADERS       = Symbol("$setLoaders")


// Sentinels
const PROPERTY           = Symbol("PROPERTY")
// const CONSTRUCTOR        = Symbol("CONSTRUCTOR")
const NO_SUPER           = Symbol("NO_SUPER")
const IMMEDIATE          = Symbol("IMMEDIATE")



// const KNOWN_GETTER       = {[IS_IMMUTABLE] : true, [GETTER] : true}



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


// const SymbolPropertyMap  = SpawnFrom(null)

const EMPTY_OBJECT    = Frost(SpawnFrom(null))
const EMPTY_ARRAY     = Frost([])

const InterMap      = new WeakMap()
// Safe functions are stored in here so that the diguised Types function are
// automatically recognized as safe functions too


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
