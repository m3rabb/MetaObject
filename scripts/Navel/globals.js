// "use strict"

const RootOf              = Object.getPrototypeOf
const SpawnFrom           = Object.create
const IsArray             = Array.isArray
const Floor               = Math.floor
const RandomUnitValue     = Math.random
const DefineProperty      = Object.defineProperty
const OwnKeys             = Reflect.ownKeys
const OwnSymbols          = Object.getOwnPropertySymbols
const OwnNames            = Object.getOwnPropertyNames
const OwnVisibleNames     = Object.keys
const Frost               = Object.freeze
const IsFrosted           = Object.isFrozen
const Object_prototype    = Object.prototype
const HasOwn_             = Object_prototype.hasOwnProperty  // ._hasOwn
const HasOwnProperty      = Object_prototype.hasOwnProperty  // ._hasOwn
const PropertyDescriptor  = Object.getOwnPropertyDescriptor
const PropertyDescriptors = Object.getOwnPropertyDescriptors
const Apply               = Reflect.apply

// Reflect.ownKeys === Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target)

// Protected Implementation properties (so no namespace clashing)
// private

// symbols for publicly knowable properties
const IS_IMMUTABLE           = Symbol("IS_IMMUTABLE")
const _DURABLES              = Symbol("_DURABLES")
const INSTANCEOF             = Symbol.hasInstance

// private symbols for implementation usage, $ means non-ya-bizness!!!
// Once everything is working, consider removing the names from the symbols
// to discourage tampering!!!
const $INNER                 = Symbol("$INNER")
const $PULP                  = Symbol("$PULP")
const $OUTER                 = Symbol("$OUTER")
const $RIND                  = Symbol("$RIND")  // Consider simply using $ !!!

const $DISGUISE              = Symbol("$DISGUISE")
const $BARRIER               = Symbol("$BARRIER")
//const $IID                   = Symbol("$instanceId")
const $PRIOR_IDS             = Symbol("$PRIOR_IDS")
const $PROOF                 = Symbol("$PROOF")

const $ROOT                  = Symbol("$ROOT")
const $BLANKER               = Symbol("$BLANKER")
const $ASSIGNERS             = Symbol("$ASSIGNERS")
const $IMMEDIATES            = Symbol("$IMMEDIATES")
const $DECLARATIONS          = Symbol("$DECLARATIONS")
const $SUPERS                = Symbol("$SUPERS")
const $OWN_DEFINITIONS       = Symbol("$OWN_DEFINITIONS")

const $OUTER_WRAPPER         = Symbol("$OUTER_WRAPPER")

const $DELETE_IMMUTABILITY   = Symbol("$DELETE_IMMUTABILITY")
const $DELETE_ALL_PROPERTIES = Symbol("$DELETE_ALL_PROPERTIES")


// Sentinels
const INNER_SECRET            = Symbol("INNER_SECRET")

const ASYMMETRIC_PROPERTY    = Symbol("ASYMMETRIC_PROPERTY")
// const CONSTRUCTOR         = Symbol("CONSTRUCTOR")
const NO_SUPER               = Symbol("NO_SUPER")
const IMMEDIATE              = Symbol("IMMEDIATE")
const IMPLEMENTATION         = Symbol("IMPLEMENTATION")

const VISIBLE                = Symbol("VISIBLE")
const INVISIBLE              = Symbol("INVISIBLE")
const REINHERIT              = Symbol("REINHERIT")
const INHERIT                = Symbol("INHERIT")

const PERMEABLE              = Symbol("PERMEABLE")
const IMPERMEABLE            = Symbol("IMPERMEABLE")

const PARAMS_MATCHER         = /[\w$]+/g
const CONTEXT_PARAM_MATCHER  = /^((\$)|(_))?([\w$]+)(_)?$/
const FUNC_PROLOG_MATCHER    =
  /^(function(\s+([\w$]+))?\s*\(([\w$\s,]*)\)|(\(([\w$\s,]*)\)|([\w$]+))\s*=>)/



const VisibleConfig = {
  configurable : true,
  writable     : true,
  enumerable   : true,
}

const InvisibleConfig = {
  configurable : true,
  writable     : true,
  enumerable   : false,
}


// const SymbolPropertyMap  = SpawnFrom(null)

const EMPTY_OBJECT    = Frost(SpawnFrom(null))
const EMPTY_ARRAY     = Frost([])

const InterMap         = new WeakMap()
const PropertyToSymbol = SpawnFrom(null)
// Safe functions are stored in here so that the diguised Types function are
// automatically recognized as safe functions too


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
