"use strict"

const RootOf             = Object.getPrototypeOf
const SpawnFrom          = Object.create
const IsArray            = Array.isArray
const Floor              = Math.floor
const RandomUnitValue    = Math.random
const DefineProperty     = Object.defineProperty
const KnownNames         = Object.keys
const OwnNames           = Object.getOwnPropertyNames
const OwnSymbols         = Object.getOwnPropertySymbols
const OwnSelectors       = Reflect.ownKeys
const SetImmutable       = Object.freeze
const IsImmutable        = Object.isFrozen
const Object_prototype   = Object.prototype
const ContainsSelector   = Object_prototype.hasOwnProperty  // ._hasOwn
const PropertyDescriptor = Object.getOwnPropertyDescriptor
const Apply              = Reflect.apply


// Reflect.ownKeys === Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target)
