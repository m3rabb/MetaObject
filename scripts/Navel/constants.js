// "use strict"

const RootOf             = Object.getPrototypeOf
const SpawnFrom          = Object.create
const IsArray            = Array.isArray
const Floor              = Math.floor
const RandomUnitValue    = Math.random
const DefineProperty     = Object.defineProperty
const VisibleSelectors   = Object.keys
const AllSelectors       = Reflect.ownKeys
const AllNames           = Object.getOwnPropertyNames
const AllSymbols         = Object.getOwnPropertySymbols
const Frost              = Object.freeze
const IsFrosted          = Object.isFrozen
const Object_prototype   = Object.prototype
const InHasSelector      = Object_prototype.hasOwnProperty  // ._hasOwn
const PropertyDescriptor = Object.getOwnPropertyDescriptor
const Apply              = Reflect.apply

// Reflect.ownKeys === Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target)


const SECRET             = Symbol("SECRET")
const INNER              = Symbol("INNER")
const OUTER              = Symbol("OUTER")
const RIND               = Symbol("RIND")
const IS_IMMUTABLE       = Symbol("isImmutable")
const IID                = Symbol("instance id")
const KNOWN_SELECTORS    = Symbol("KNOWN_SELECTORS")
const COPY               = Symbol("COPY")

const ALWAYS_FALSE       = (() => false)
const ALWAYS_NULL        = (() => null)
