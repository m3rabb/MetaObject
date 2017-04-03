// "use strict"

const InterMap = new WeakMap()




// UNTESTED
const DefaultOuterBehavior = {
  __proto__ : null,

  get (base_root, selector, outer) {
    return InterMap.get(outer[RIND])[INNER]._noSuchProperty(selector)
  },

  getPrototypeOf (base_root) { return base_root }
}

const DefaultCoreBehavior = {
  __proto__ : null,

  get (base_root, selector, core) {
    return core[INNER]._noSuchProperty(selector)
  },

  getPrototypeOf (base_root) { return base_root }
}



const Base$root                  = SpawnFrom(null)
// const   Stash$root          = SpawnFrom(Base$root)

const   Base$root$outer          = new Proxy(Base$root, DefaultOuterBehavior)
// let     Nothing$root$outer
let         Something$root$outer  // Inate Intrinsic

const   Base$root$core           = new Proxy(Base$root, DefaultCoreBehavior)
// let    Nothing$root$core
let         Something$root$core

// // Just in case sanity failsafe to prevent infinite recursion from CoreBaseBehavior
// Nothing$root$core[INNER]  = Nothing$root$core
//


Something$root$outer = Base$root$outer
Something$root$core  = Base$root$core

const BlankNothing   = NewBlankConstructor(CoreConstructorMaker)

// This secret is only known by inner objects
BlankNothing.prototype[SECRET] = INNER

// #type #isNothing #is #_noSuchProperty

InPutMethod(BlankNothing.prototype, function _noSuchProperty(selector) {
  return undefined
})


Something$root$outer = BlankNothing.$root$outer
Something$root$core  = BlankNothing.prototype

const BlankSomething = NewBlankConstructor(CoreConstructorMaker)

// _hasOwn
InAtPut(BlankSomething.prototype, "_hasOwn", InHasSelector)


Something$root$outer = BlankSomething.$root$outer
Something$root$core  = BlankSomething.prototype

const BlankType      = NewBlankConstructor(TypeCoreConstructorMaker)
const Type$root$core = BlankType.prototype

const BlankMethod    = NewBlankConstructor(CoreConstructorMaker)
const Method$root$core = BlankMethod.prototype



function Create_COPY() {}




InPutMethod(Method$root$core, function _init(namedFunc_name, func_, mode__) {
  const [name, handler, mode] = (typeof namedFunc_name === "function") ?
    [namedFunc_name.name, namedFunc_name, func_] :
    [namedFunc_name, func_, mode__]

  this.selector = name
  this.handler  = handler
  this.mode     = mode || STANDARD
})


InPutMethod(Type$root$core, function addProperty(selector, value) {
  this._blankConstructor.$root$inner[selector] = value
  return this
})

// InPutMethod(Type$root$core, function addInstanceMethod(method) {
//   this._blankConstructor.$root$core[selector] = value
//   return this
// })

InPutMethod(Type$root$core, function add(method_func__name, func__, mode___) {
  // const method   = AsMethod(method_func__name, func__, mode___)
  // const selector = method.selector
  // const handler  = method.handler
  //
  // switch (method.mode) {
  //   case STANDARD :
  //     this._instanceRoot[selector] = handler
  //     break
  //
  //   case GETTER :
  //     _AddGetter(this._instanceRoot, selector, true, handler)
  //     break
  //
  //   case LAZY_INSTALLER :
  //     _AddGetter(this._instanceRoot, selector, false, function _loader() {
  //       DefineProperty(this, selector, VisibleConfiguration)
  //       return (this[selector] = handler.call(this))
  //     })
  //     break
  // }
  //
  // this._methods[selector] = method
  // ReseedSubtypesMethodHandler(this, method)
  // return this
})

InPutMethod(Type$root$core, function setId() {

})

InPutMethod(Type$root$core, function setSupertypes(types) {
  this._supertypes = types
})

InPutMethod(Type$root$core, function setName(name) {
  this.name = name
})



InPutMethod(Type$root$core, function add(method) {

})

InPutMethod(Type$root$core, function addAll(methods) {

})

InPutMethod(Type$root$core, function _init(spec, context_, Blank_) {
  const name              = spec && spec.name
  const supertypes        =
    spec && (spec.supertypes || spec.supertype && [spec.supertype]) || [Thing]
  const methods           = spec && spec.instanceMethods || []
  const BlankConstructor  = Blank_ || NewBlankConstructor(CoreConstructorMaker)
  const instanceCoreRoot  = BlankConstructor.prototype

  instanceCoreRoot[COPY]  = Create_COPY(BlankConstructor)

  this._blankConstructor  = BlankConstructor
  // this._instanceOuterRoot = BlankConstructor.root$outer
  // this._instanceCoreRoot  = instanceCoreRoot
  this._nextIID           = 0
  this._subtypes          = new Set()
  this._methods           = SpawnFrom(null)
  this.context            = context_ ? context_[RIND] : null

  this.setId()
  this.setName(name)
  this.setSupertypes(supertypes)
  this.addProperty("type", this[RIND])
  this.add("_newBlank", () => new BlankConstructor()[RIND])
  this.addAll(methods)
  return this
})



let Type      = (new BlankType())[INNER]._init(
                     {name: "Type"     , supertypes: []}, null, BlankType)[RIND]
let Nothing   = Type({name: "Nothing"  , supertypes: []}, null, BlankNothing)
let Something = Type({name: "Something", supertypes: []}, null, BlankSomething)
let Thing     = Type({name: "Thing"    , supertypes: []})
let Method    = Type({name: "Method"   , supertypes: [Thing]}, null, BlankMethod)

// Type.setSupertypes([Thing])

// Thing.add(function _init(spec) {
//   this.setName(spec && spec.name)
// })

// Frost(Base_root)
// // Frost(Stash_root)
// Frost(Implementation_root)
// Frost(Inner_root)









/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
