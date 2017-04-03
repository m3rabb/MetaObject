// "use strict"

const InterMap = new WeakMap()




// UNTESTED
const DefaultOuterBehavior = {
  __proto__ : null,

  get (base_root, selector, outer) {
    return InterMap.get(outer[RIND])[INNER]._noSuchProperty(selector)
  },

  // getPrototypeOf (base_root) { return base_root }
}

const DefaultCoreBehavior = {
  __proto__ : null,

  get (base_root, selector, core) {
    return core[INNER]._noSuchProperty(selector)
  },

  // getPrototypeOf (base_root) { return base_root }
}



const Base$root                  = SpawnFrom(null)
// const   Stash$root          = SpawnFrom(Base$root)

const   Base$outer$root          = new Proxy(Base$root, DefaultOuterBehavior)
// let     Nothing$outer$root
let         Something$outer$root  // Inate Intrinsic

const   Base$core$root           = new Proxy(Base$root, DefaultCoreBehavior)
// let    Nothing$core$root
let         Something$core$root

// // Just in case sanity failsafe to prevent infinite recursion from CoreBaseBehavior
// Nothing$core$root[INNER]  = Nothing$core$root
//


Something$outer$root = Base$outer$root
Something$core$root  = Base$core$root

const BlankNothing   = NewBlankConstructor(CoreConstructorMaker)

// This secret is only known by inner objects
BlankNothing.prototype[SECRET] = INNER

// #type #isNothing #is #_noSuchProperty

InPutMethod(BlankNothing.prototype, function _noSuchProperty(selector) {
  return undefined
})

Something$outer$root = BlankNothing.outerRoot
Something$core$root  = BlankNothing.prototype

const BlankSomething = NewBlankConstructor(CoreConstructorMaker)

Something$outer$root = BlankSomething.outerRoot
Something$core$root  = BlankSomething.prototype

const BlankType      = NewBlankConstructor(TypeCoreConstructorMaker)
const Type$core$root = BlankType.prototype


function Create_COPY() {}

InPutMethod(Type$core$root, function setId() {

})

InPutMethod(Type$core$root, function setSupertypes(types) {
  this._supertypes = types
})

InPutMethod(Type$core$root, function setName(name) {
  this.name = name
})

InPutMethod(Type$core$root, function addProperty(selector, value) {

})

InPutMethod(Type$core$root, function add(method) {

})

InPutMethod(Type$core$root, function addAll(methods) {

})

InPutMethod(Type$core$root, function _init(spec, context_, Blank_) {
  const name              = spec && spec.name
  const supertypes        =
    (spec && spec.supertypes || spec.supertype && [spec.supertype]) || [Thing]
  const methods           = spec && spec.instanceMethods || []
  const BlankConstructor  = Blank_ || NewBlankConstructor(CoreConstructorMaker)
  const instanceCoreRoot  = BlankConstructor.prototype

  instanceCoreRoot[COPY]  = Create_COPY(BlankConstructor)

  this._blankConstructor  = BlankConstructor
  this._instanceOuterRoot = BlankConstructor.outerRoot
  this._instanceCoreRoot  = instanceCoreRoot
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
// Fix Type's supertype later

let Nothing   = Type({name: "Nothing"  , supertypes: []}, null, BlankNothing)
let Something = Type({name: "Something", supertypes: []}, null, BlankSomething)
let Thing     = Type({name: "Thing"    , supertypes: []})
let Method    = Type({name: "Method"   , supertypes: [Thing]})

// Thing.add(function _init(spec) {
//   this.setName(spec && spec.name)
// })

// Frost(Base_root)
// // Frost(Stash_root)
// Frost(Implementation_root)
// Frost(Inner_root)





// _hasOwn
InAtPut(Something$core$root, "_hasOwn", InHasSelector)




/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
