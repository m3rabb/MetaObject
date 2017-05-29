/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/




Thing.addSGetter(function _captureChanges() {
  if (this[IS_IMMUTABLE]) { delete this._IMMUTABILITY }
  DefineProperty(this, "_captureChanges", InvisibleConfiguration)
  return (this._captureChanges = this)
}


Thing.addSGetter(function _captureOverwrite() {
  if (this[IS_IMMUTABLE]) { delete this._ALL }
  DefineProperty(this. "_captureOverwrite", InvisibleConfiguration)
  return (this._captureOverwrite = this)
})












// Add logic to handle getters and lazys correctly
function Create_COPY(BlankConstructor) {
  return function COPY(asImmutable, visited = CopyLog(), exceptSelector_) {
    const target, targetInner, targetOuter, initializer
    let   selectors, next, value, traversed, valueCore

    target      = new BlankConstructor()
    targetInner = target[INNER]
    targetOuter = target[OUTER]

    visited.pairing(this.$, target.$) // to manage cyclic objects

    if ((initializer = target._initFrom_)) {
      if (initializer.length < 4) {
        targetInner._initFrom_(this, visited, exceptSelector_)
        return asImmutable ? target[BE_IMMUTABLE](true) : targetInner
      }

      targetInner._initFrom_(this, visited, exceptSelector_, asImmutable)
    }
    else {
      selectors = target[KNOWN_SELECTORS] = this[KNOWN_SELECTORS] ||
        (this[KNOWN_SELECTORS] = KnownNames(this))
      next = selectors.length

      while (next--) {
        selector = selectors[next]
        if (selector === exceptSelector_) { continue }
        value = this[selector]

        if (typeof value !== "object" || value === null)  {/* NOP */}
        else if (value[IS_IMMUTABLE] || value.id != null) {/* NOP */}
        else if ((traversed = visited.pair(value)) { value = traversed }
        else if ((valueCore = InterMap.get(value))) {
          value = valueCore[COPY](asImmutable, visited).$
        }
        else { value = CopyObject(value, asImmutable, visited) }

        target[selector] = value
        if (selector[0] !== "_") { targetOuter[selector] = value }
      }
    }

    if ($inner._certified) {
      const $pulp = $pulp._certified()
      if ($pulp[IS_IMMUTABLE]) { return $pulp[$RIND] }
    }


    if (asImmutable) {
      if (this.id != null) {
        if (target._setImmutableCopyId) { target._setImmutableCopyId() }
        else {
          delete target.id
          delete targetOuter.id
        }
      }
      target[IS_IMMUTABLE] = true
      SetImmutable(targetOuter)
      return (target[INNER] = (new ImmutableInnerPermeability(target)).inner)
    }

    return targetInner
  }
}
// function Create__copy(_Blank) {
//   return function _copy(asImmutable, log = CopyLog.new(), _target = _Blank()) {
//     const  target = _target.$
//
//     visited.set(this.$, target)  // Prevents infinite recursion on cyclic objects
//     if (asImmutable && _target._initFrom_ !== _InitFrom_) {
//       BeFixedFacts(_target._initFrom_(this, visited), IS_INNER)
//     }
//     else {
//       _target._initFrom_(this, visited, asImmutable, IS_INNER)
//     }
//     return target
//   }
// }


function BE_IMMUTABLE(modifySelfDeeply, visited = new CopyLog()) {
  let next, value, inner, selectors, selector

  visited.add(target)

  targetCore  = this
  targetInner = this[INNER]
  targetOuter = this[OUTER]

  if (this._setPropertiesImmutable) {
    targetInner._setPropertiesImmutable(modifySelfDeeply, visited)
  }
  else {
    selectors = this[KNOWN_SELECTORS] ||
      (this[KNOWN_SELECTORS] = KnownNames(this))
    next = selectors.length

    while (next--) {
      selector = selectors[next]
      value = target[selector]

      if (typeof value !== "object" || value === null)  {/* NOP */}
      else if (value[IS_IMMUTABLE] || value.id != null) {/* NOP */}
      else if (visited.has(value))                      {/* NOP */}
      else if ((valueCore = InterMap.get(value))) {
        if (modifySelfDeeply) { valueCore[BE_IMMUTABLE](true, visited) }
        else {
          value = valueCore[COPY](true, visited).$
          targetCore[selector] = value
          if (selector[0] !== "_") { targetOuter[selector] = value }
        }
      }
      else if (modifySelfDeeply) { BeImmutableObject(value, true, visited) }
      else {
        value = CopyObject(value, true, visited)
        targetCore[selector] = value
        if (selector[0] !== "_") { targetOuter[selector] = value }
      }
    }
  }

  target[IS_IMMUTABLE] = true
  delete target._captureChanges
  delete target._captureOverwrite
  SetImmutable(targetOuter)
  return (target[INNER] = (new ImmutableInnerPermeability(target)).inner)
}


function BE_IMMUTABLE() {
  target[IS_IMMUTABLE] = true
  delete this._captureChanges
  delete this._captureOverwrite
  SetImmutable(target[OUTER])
  return (target[INNER] = (new ImmutableInnerPermeability(target)).inner)
}







This.addSGetter(function basicId() {
  const prefix = this.context ? this.context.id + "@" : ""
  return `${prefix}${this[IID]}.${this.type.name}`
})

function _setId(newId_) {
  if (arguments.length) { return this._super._setId(newId_) }
  const prefix = this.context ? this.context.id + "@" : ""
  const id     = NewUniqueId(`${prefix}${this.iid}.Type-`)
  return this._super._setId(id)
}


PutMethod(Type_root, function _init(spec, _root_, context__) {
  const _root    = _root_ || new BlankRoot()
  const _NewCore = BlankConstructorFor(_root)
  const _factory = CreateFactory(_NewCore)
  const permeability = new DisguisePermeability(this)
  const disguise = new Proxy(_factory, permeability)

  _factory[Symbol.hasInstance] = (instance) => (instance.type === this)
  SetImmutable(_factory.prototype)
  SetImmutable(_factory)

  _root.type         = disguise.$
  _root[ROOT]        = _root
  _root._newBlank    = () => (new _NewCore()).$
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

  this.prototype     = _root.$
  this.context       = context__.$ || null

  const supertypes =
    (spec && spec.supertypes || spec.supertype && [spec.supertype]) || [Thing]
  this.setSupertypes(supertypes)
  spec && this.setName(spec.name)
  spec && this.addAll(spec.instanceMethods || [])

  return disguise
}

AddGetter(Thing_root, function id() {
  return this[EXPLICIT_ID]
})

PutMethod(Type_root, function setSupertypes(supertypes) {
  const _supertypes = ConnectTypes(this, supertypes)
  const _ancestors  = BuildAncestors(_supertypes)

  SeedInstanceRootMethodHandlers(_root, _ancestors)

  _ancestors[_ancestors.length] = this
  this._instanceRoot.ancestry   = _ancestors // LOOK: need to be protected!!!
  this.supertypes               = supertypes // LOOK: need to be protected!!!
})

PutMethod(Type_root, function setName(name) {
  const properName   = name[0].toUpperCase() + name.slice(1)
  const priorName    = this.name
  const testName     = "is" + properName
  const instanceRoot = this._instanceRoot

  if (priorName === properName) { return this }

  this.name                = properName
  instanceRoot.constructor = ConstructorForNamingInDebugger(properName)

  if (priorName) { delete instanceRoot["is" + priorName] }

  instanceRoot[testName] = true
  Top_root[testName]     = false
})
