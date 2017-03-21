/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
const ALL_IDS     = Symbol("ALL_IDS")
const MUTABLE     = null
const FACT        = Symbol("FACT")
const IMMUTABLE   = Symbol("IMMUTABLE")


const InterMap = new WeakMap()

const ALWAYS_FALSE = () => false
const ALWAYS_NULL = () => null

const PrivacyPermeability = {
  __proto__ : null,

  get (outer, selector, krust) {
    let target, index

    return (outer.atIndex && ((index = +selector) === index)) ?
      outer.atIndex(index) : outer[selector]
  },

  // Setting on things in not allowed because the setting semantics are broken.
  // For our model, the return value should always be the receiver, or a copy
  // of the receiver, with the property changed.

  // Further, note that the return value of a set always returns the value that
  // was tried to be set to, regardless of whether it was successful or not.

  set (outer, selector, value, barrier_) {
    return outer._externalWrite(selector, value) || false
  },

  has (outer, selector) {
    switch (selector[0]) {
      case "_"       : return outer._externalPrivateRead(selector) || false
      // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
      case undefined : return false
    }
    return (selector in outer)
  },

  getOwnPropertyDescriptor (outer, selector) {
    switch (selector[0]) {
      case "_"       : return outer._externalPrivateRead(selector) || undefined
      // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
      case undefined : return undefined
    }
    return PropertyDescriptor(outer, selector)
  },

  ownKeys (outer) {
    return AllLocalSelectors(outer)
  },

  getPrototypeOf : ALWAYS_NULL,
  setPrototypeOf : ALWAYS_FALSE,
  defineProperty : ALWAYS_FALSE,
  deleteProperty : ALWAYS_FALSE,
  isExtensible   : ALWAYS_FALSE,
  // preventExtensions ???
}



const MutableInnerPermeability = {
  __proto__ : null,

  set (core, selector, value, inner) {
    const isPublic = (selector[0] !== "_")

    if ((core[selector] === undefined) && !core._hasOwn(selector)) {
      delete core[KNOWN_SELECTORS]
    }

    switch (typeof value) {
      default :
        core[selector] = value
        return true

      case "function" : // LOOK: will catch Type things!!!
        // NOTE: Checking for value.constructor is inadequate to prevent func spoofing
        core[selector] = InterMap.get(value) ? value : WrapFunc(value, OUTSIDE)
        return true

      case "object" :
        if (!isPublic) {
          core[selector] = value
        }
        else if (value === inner) {
          core[selector] = value
          core[OUTER][selector] = core.$
        }
        else if (value === null || value[IS_IMMUTABLE] || value.id != null) {
          core[OUTER][selector] = core[selector] = value
        }
        else if (value === core[selector]) {
          core[OUTER][selector] = value
        }
        else if ((valueCore = InterMap.get(value))) {
          core[OUTER][selector] = core[selector] =
            valueCore[COPY](true, visited).$
        }
        else {
          core[OUTER][selector] = core[selector] = CopyObject(value, true)
        }
        return true
    }
  },

  deleteProperty (core, selector, inner) {
    if ((core[selector] !== undefined) || core._hasOwn(selector)) {
      delete core[KNOWN_SELECTORS]
      delete core[selector]
    }

    return true
  }
}



class ImmutableInnerPermeability {
  constructor (core) {
    this.inUse = false
    // this.target = new Proxy(core, this)
    this.target = this.inner = new Proxy(core, this)
  }

  set (core, selector, value, inner) {
    if (core[selector] !== value) {
      const copy = inner.mutableCopyExcept(selector)
      copy[selector] = value
      this.target = copy

      this.set = this.detourSet
      this.get = this.detourGet
      this.deleteProperty = this.detourDelete
    }
    return true
  }

  deleteProperty (core, selector, inner) {
    switch (selector) {
      case "_IMMUTABILITY" : this.target = core.asMutableCopy; break
      case "_ALL"          : this.target = core._newBlank()  ; break
      default :
        if (!core._hasOwn(selector)) { return true }
        this.target = inner.mutableCopyExcept(selector)
        break
    }

    this.set = this.detourSet
    this.get = this.detourGet
    this.deleteProperty = this.detourDelete
    return true
  }

  detourSet (core, selector, value, inner) {
    this.target[selector] = value
    return true
  }

  detourGet (core, selector, inner) {
    return this.target[selector]
  }

  detourDelete (core, selector, inner) {
    delete this.target[selector]
    return true
  }
}

ImmutableInnerPermeability.prototype = SpawnFrom(null)


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


function WrapFunc(OriginalFunc) {
  return $wrappedOutsideFunc(...args) {
    const receiver = (this != null && this[SECRET] === INNER) ? this.$ : this
    return OriginalFunc.apply(receiver, args)
  }
}

// LOOK: consider making public methods on immutables always
// answer immutables!!!
function AsPublicMethod(originalFunc) {
  const methodName = originalFunc.name
  const funcBody   = `
    return function (
      InterMap, SetImmutable, ImmutableInnerPermeability,
      INNER, IS_IMMUTABLE, INNER_PERMEABILITY
    ) {
      return function ${methodName}(OriginalMethod) {
        let core, permeability, receiver, result

        core = InterMap.get(this)

        if ((permeability = core[INNER_PERMEABILITY])) {
          if (permeability.inUse) {
            permeability = new ImmutableInnerPermeability(core)
          }
          permeability.inUse = true
          receiver = permeability.target
        }
        else { receiver = core[INNER] }

        result = OriginalFunc.apply(receiver, args)

        if (permeability) { // indicator that receiver isImmutable
          if (result === receiver) {
            result = permeability.target
            if (result !== inner) {
              permeability.target = permeability.inner  // reset permeability
              result.beImmutable
            }
            permeability.inUse = false
            return result.$
          }
          if (typeof value !== "object" || value === null) { return result }
          if (value[IS_IMMUTABLE] || value.id != null)     { return result }
          return ((valueCore = InterMap.get(value))) ?
            valueCore[COPY](true).$ : CopyObject(value, true)
        }

        return (result === receiver) ? result.$ : result
      }
    }
  `
  const methodMaker  = Function(funcBody)
  const publicMethod = methodMaker(
    InterMap, SetImmutable, ImmutableInnerPermeability,
    INNER, IS_IMMUTABLE, INNER_PERMEABILITY
  )
  publicMethod[IS_IMMUTABLE] = true
  SetImmutable(publicMethod.prototype)
  return SetImmutable(publicMethod)
}



function _setImmutableCopyId() {
  // if it has a way to make a new id then set it,
  // otherwise if mutable, no id, and if immutable set id to ""
}



function EnkrustThing(thing) {
  const krust = new Proxy(thing, PrivacyPermeability)
  InterMap.set(krust, thing)
  return (thing.$ = thing[OUTER] = krust)
}

AddLazilyInstalledProperty(_Thing_root, "$", EnkrustThing)


//
// function CreateInnerPublicMethod(methodName) {
//   const funcBody = `return function (globals) {
//     const
//       InterMap = globals.InterMap,
//       IMMUTABLE_WRITE_PERMEABILITY = globals.IMMUTABLE_WRITE_PERMEABILITY,
//       ImmutableWritePermeability   = globals.ImmutableWritePermeability,
//       AsOutsideFunc                = globals.AsOutsideFunc,
//       SECRET                       = globals.SECRET,
//       PARAM                        = globals.PARAM,
//       PARAM_TYPE                   = globals.PARAM_TYPE,
//       OBJECT                       = globals.OBJECT,
//       FACT                         = globals.FACT,
//       OUTSIDER                     = globals.OUTSIDER,
//       INNER                        = globals.INNER,
//       COPY                         = globals.COPY,
//       OUTER_BARRIER                = globals.OUTER_BARRIER,
//       InnerParamBarrier            = globals.InnerParamBarrier,
//       OuterParamBarrier            = globals.OuterParamBarrier,
//       ObjectParamBarrier           = globals.ObjectParamBarrier,
//       CopyObject                   = globals.CopyObject
//   ) {
//     return function ${methodName}(OriginalMethod) {
//
//     }
//   }`
//
//   const method = Function(funcBody)()
//   delete method.prototype
//   method.isFact = method.isImmutable = true
//   return SetImmutable(method)
// }





function ConstructorForNamingInDebugger(typeName) {
  const funcBody = `return function ${typeName}() {
    throw new Error("This constructor is only for use in debugging!")
  }`
  const constructor = Function(funcBody)()

  constructor[IS_IMMUTABLE] = true
  SetImmutable(constructor.prototype)
  return SetImmutable(constructor)
}

function CreateEmptyNamelessFunction() {
  return function () {}
}

function BlankConstructorFor(instanceRoot) {
  const constructor = CreateEmptyNamelessFunction()
  constructor.prototype = instanceRoot
  constructor[IS_IMMUTABLE] = true
  return SetImmutable(constructor)
}

function CreateFactory(_NewCore, isDisguised) {
  return function (...args) {
    const core = new _NewCore()
    core[INNER]._init(...args)
    if (args.length && core.id == null) { core.beImmutable } // LOOK!!!
    return instance.$
  }
}

function Create_new(_NewCore) {
  const target = {}
  target.new =function (...args) {
    const instance = new _NewCore()
    instance._init(...args)
    return instance.$
  }
  return target.new
}

function Create_COPY(_NewCore) {
  return function COPY(asImmutable, visited = CopyLog(), exceptSelector_) {
    const target, targetInner, targetOuter, initializer
    let   selectors, next, value, traversed, valueCore

    target      = new _NewCore()
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


class DisguisePermeability {
  constructor (disguised) {
    this.disguised = disguised
  }

  get (func, selector, disguise) {
    return this.disguised[selector]
  }

  set (func, selector, value, disguise) {
    this.disguised[selector] = value
    return false
  }

  has (func, selector, disguise) {
    return (selector in this.disguised)
  }
}

const BlankRoot   = BlankConstructorFor(Inner_root)
const BlankType   = BlankConstructorFor(Type_root)
const BlankMethod = BlankConstructorFor(Method_root)



// This is the factory for Type
function Type(spec_typeName, supertypes_) {
  const newType = new BlankType()
  const spec    = (spec_typeName !== "string") ? spec_typeName :
                    {name : spec_typeName, supertypes : supertypes_}
  return newType._init(spec)
}



function _setId(newId_) {
  const newId = (arguments.length) ? newId_ : NewUniqueId(this.basicId() + "-")

  const id = this.id

  if (id !== undefined) {
    let ids

    if (newId === existingId) { return this }
    if (!(ids = this[ALL_IDS])) {
      this[ALL_IDS] = ids = SpawnFrom(null)
      ids[existingId] = existingId
    }
    ids[newId] = newId
  }

  this.id = newId
  return this
},

Thing.addSLazyProperty(IID, function() {
  return InterMap.get(this.type)._nextIID++
})

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
  return this[EXPICIT_ID]
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
