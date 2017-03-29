// "use strict"

// UNTESTED
const OuterBaseBehavior = {
  __proto__ : null,

  // get (base_root, selector, outer) {
  //   return InterMap.get(outer[RIND])[INNER]._noSuchProperty(selector)
  // },

  getPrototypeOf (base_root) { return base_root }
}

// UNTESTED
const CoreBaseBehavior = {
  __proto__ : null,

  get (base_root, selector, core) {
    return core[INNER]._noSuchProperty(selector)
  },

  getPrototypeOf (base_root) { return base_root }
}


const InterMap = new WeakMap()


const Base_root                = SpawnFrom(null)
// const   Stash_root          = SpawnFrom(Base_root)

const   Outer_base             = new Proxy(Base_root, OuterBaseBehavior)
const     Outer_root           = SpawnFrom(Outer_base)

const   Core_base              = new Proxy(Base_root, CoreBaseBehavior)
const     Core_root            = SpawnFrom(Core_base)
const       Thing_core         = SpawnFrom(Core_root)
const       Type_core          = SpawnFrom(Core_root)
const       Method_core        = SpawnFrom(Core_root)


//const       Nothing_core_root    = SpawnFrom(Something_core_root)
// const         Context_root  = SpawnFrom(Top_root)
// const         Name_root     = SpawnFrom(Top_root)


// Just in case sanity failsafe to prevent infinite recursion from CoreBaseBehavior
Core_root[INNER]  = Core_root

// This secret is only known by inner objects
Core_root[SECRET] = INNER





// NOTE: Delete these after bootstrap is fully complete
InPutMethod(Outer_root, function _noSuchProperty(selector) {
  return undefined
})

InPutMethod(Core_root, Outer_root._noSuchProperty)

// _hasOwn
InAtPut(Core_root, "_hasOwn", InHasSelector)




const BlankRoot   = CoreConstructorFor(Core_root)
const BlankThing  = CoreConstructorFor(Thing_core)
const BlankMethod = CoreConstructorFor(Method_core)
const BlankType   = CoreConstructorFor(Type_root, true)



InPutMethod(Type_core, function _init(spec, _root_, context__) {
  const isDisguised          = spec && spec.isDisguised
  const _root                = _root_ || SpawnFrom(Core_root)
  const BlankCoreConstructor = CoreConstructorFor(_root, isDisguised)
  const $factory             = Create_$factory(BlankCoreConstructor)
  const $type                = new BlankType($type)

  _root.type         = disguise[RIND]
  _root[ROOT]        = _root
  _root._newBlank    = () => (new BlankCoreConstructor())[RIND]
  _root[COPY]        = Create_COPY(_NewCore)

  this.new           = _root.new = Create_new(_NewCore)

  this._instanceRoot = _root
  this._constructor  = _NewCore
  this._factory      = _factory
  this._disguise     = disguise
  this._nextIID      = 0
  this._subtypes     = SpawnFrom(null)
  this._methods      = SpawnFrom(null)

  this._setId()

  this.prototype     = _root[RIND]
  this.context       = context__ ? context__[RIND] : null

  const supertypes =
    (spec && spec.supertypes || spec.supertype && [spec.supertype]) || [Thing]
  this.setSupertypes(supertypes)
  spec && this.setName(spec.name)
  spec && this.addAll(spec.instanceMethods || [])

  return disguised$type
})


Type.add(INSTANCEOF, (instance) => instance[IS_TYPE_SELECTOR])



// Frost(Base_root)
// // Frost(Stash_root)
// Frost(Implementation_root)
// Frost(Inner_root)
