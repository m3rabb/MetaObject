"use strict"

exports.RootOf             = Object.getPrototypeOf
exports.SpawnFrom          = Object.create
exports.IsArray            = Array.isArray
exports.Floor              = Math.floor
exports.RandomUnitValue    = Math.random
exports.DefineProperty     = Object.defineProperty
exports.LocalProperties    = Object.keys
exports.AllProperties      = Reflect.ownKeys
exports.AllNames           = Object.getOwnPropertyNames
exports.AllSymbols         = Object.getOwnPropertySymbols
exports.ShallowFreeze      = Object.freeze
exports.IsFrozen           = Object.isFrozen
exports.Object_prototype   = Object.prototype
exports.IsLocalProperty    = Object_prototype.hasOwnProperty
exports.PropertyDescriptor = Object.getOwnPropertyDescriptor
exports.Apply              = Reflect.apply
