"use strict"

const RootOf             = Object.getPrototypeOf
const SpawnFrom          = Object.create
const IsArray            = Array.isArray
const Floor              = Math.floor
const RandomUnitValue    = Math.random
const DefineProperty     = Object.defineProperty
const LocalProperties    = Object.keys
const AllLocalSelectors  = Reflect.ownKeys
const AllLocalNames      = Object.getOwnPropertyNames
const AllLocalSymbols    = Object.getOwnPropertySymbols
const SetImmutable       = Object.freeze
const IsImmutable        = Object.isFrozen
const Object_prototype   = Object.prototype
const IsLocalProperty    = Object_prototype.hasOwnProperty
const PropertyDescriptor = Object.getOwnPropertyDescriptor
const Apply              = Reflect.apply


// Reflect.ownKeys === Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target)
