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



const Base$root         = SpawnFrom(null)
// const   Stash$root      = SpawnFrom(Base$root)
const   Base$root$outer = new Proxy(Base$root, DefaultOuterBehavior)
const   Base$root$core  = new Proxy(Base$root, DefaultCoreBehavior)


// // Just in case sanity failsafe to prevent infinite recursion from CoreBaseBehavior
// Nothing$root$core[INNER]  = Nothing$root$core
//


const _BaseBlanker = {$root$outer: Base$root$outer, $root$core: Base$root$core}
const  NothingBlanker  = NewBlankerFrom(_BaseBlanker  , CoreBlankerMaker)
const   $InateBlanker  = NewBlankerFrom(NothingBlanker, CoreBlankerMaker)
const    MethodBlanker = NewBlankerFrom($InateBlanker , CoreBlankerMaker)
const    TypeBlanker   = NewBlankerFrom($InateBlanker , TypeCoreBlankerMaker)


// This secret is only known by inner objects
NothingBlanker.$root$core[SECRET] = INNER

// #type #isNothing #is #_noSuchProperty

InPutMethod(NothingBlanker.$root$core, function _noSuchProperty(selector) {
  return undefined
})

InAtPut($InateBlanker.$root$core, "_hasOwn", InHasSelector)


InPutMethod(MethodBlanker.$root$core, function _init(func_name, func_, mode__) {
  const [selector, handler, mode] = (typeof func_name === "function") ?
    [func_name.name, func_name, func_] : [func_name, func_, mode__]

  this.selector = selector
  this.handler  = handler
  this.mode     = mode || STANDARD
  this.isPublic = (selector[0] !== "_")
})


InAtPut(TypeBlanker.$root$core, _init, function BOOTSTRAP_INIT(name, blanker) {
  this.name = name
  this._instanceBlanker = blanker
  this._subtypes = new Set()
  this._methods = SpawnFrom(null)
  return this
})



const Nothing$core = (new TypeBlanker())._init("NOTHING", NothingBlanker)
const $Inate$core  = (new TypeBlanker())._init("$INATE" , $InateBlanker )
const Method$core  = (new TypeBlanker())._init("METHOD" , MethodBlanker )
const Type$core    = (new TypeBlanker())._init("TYPE"   , TypeBlanker   )

const Nothing = Nothing$core[RIND]
const $Inate  = $Inate$core [RIND]
const Method  = Method$core [RIND]
const Type    = Type$core   [RIND]



function addMethod(method_func__name, func__, mode___) {
  const method        = AsMethod(method_func__name, func__, mode___)
  const mode          = method.mode
  const selector      = method.selector
  const handler       = method.handler
  const isPublic      = method.isPublic
  const blanker       = this._instanceBlanker
  const $root$outer   = blanker.$root$outer
  const $root$core    = blanker.$root$core

  if (mode === STANDARD) {
    if (isPublic) { $root$outer[selector] = PublicHandlerFor(selector) }
    $root$outer[$root$core] = handler
  }
  else {
    const getHandler = (mode === GETTER) ? handler : LazyLoaderMaker(handler)
    if (isPublic) {
      _AddGetter($root$outer, selector, true, PublicHandlerFor(selector, true))
    }
    _AddGetter($root$core, selector, true, getHandler)
  }

  this._methods[selector] = method
  ReseedSubtypesMethodHandler(this, method)
  return this
}


addMethod.call(Type$core, addMethod)


Type$core.addMethod(function _init(spec, context_) {
  const name            = spec && spec.name
  const supertypes      =
    spec && (spec.supertypes || spec.supertype && [spec.supertype]) || [Thing]
  const methods         = spec && spec.instanceMethods || []
  const blanker         = this._instanceBlanker

  this._nextIID         = 0
  this._subtypes        = new Set()
  this._properties      = SpawnFrom(null)
  this._methods         = SpawnFrom(null)
  this.context          = context_ ? context_[RIND] : null

  this.addMethod("_newBlank", () => new blanker()[RIND])
  this._create$copy(blanker)
  this.setId()
  this.setName(name)
  this.setSupertypes(supertypes)
  this.addProperty("type", this[RIND])
  this.addAllMethods(methods)
  return this
})

Type$core.addMethod(function _create$copy(blanker) {

})

Type$core.addMethod(function setId() {

})

Type$core.addMethod(function setName(name) {
  this.name = name
})

Type$core.addMethod(function setSupertypes(types) {
  this._supertypes = types
})

Type$core.addMethod(function addProperty(selector, value) {
  this._instanceBlanker.$root$inner[selector] = value
  this._properties[selector] = PROPERTY
  return this
})

Type$core.addMethod(function addAllMethods(methods) {
  let next = methods.length
  while (next--) { this.addMethod(methods[next]) }
  return this
})



const Thing = Type({name: "Thing", supertypes: []})

Nothing$core[INNER]._init({name: "Nothing", supertypes: []})
$Inate$core [INNER]._init({name: "$Inate" , supertypes: []})
Method$core [INNER]._init({name: "Method" })
Type$core   [INNER]._init({name: "Type"   })


Nothing$core.addMethod(Nothing$core._noSuchProperty)
$Inate$core .addMethod($Inate$core._hasOwn)
Method$core .addMethod(Method$core._init)
Type$core   .addMethod(Type$core._init)
Type$core   .addMethod(Type$core.addMethod)
Type$core   .addMethod(Type$core._create$copy)
Type$core   .addMethod(Type$core.setId)
Type$core   .addMethod(Type$core.setName)
Type$core   .addMethod(Type$core.setSupertypes)
Type$core   .addMethod(Type$core.addProperty)
Type$core   .addMethod(Type$core.addAllMethods)





// Frost(Base_root)
// // Frost(Stash_root)
// Frost(Implementation_root)
// Frost(Inner_root)









/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
