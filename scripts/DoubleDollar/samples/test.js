/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

const InterMap = new WeakMap()

const ANSWER_FALSE = () => false
const ANSWER_NULL = () => null

const KrustPrivacyBehavior = {
  __proto__ : null,

  get (inner, selector, outer_) {
    let value, index

    switch (selector[0]) {
      case "_"       :
        return inner._externalPrivateRead(selector) || undefined
      case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return undefined }
    }

    value = (inner.atIndex && ((index = +selector) === index)) ?
      inner.atIndex(index) : inner[selector]
    return (value === inner) ? inner.$ : value
  },

  // Setting on things in not allowed because the setting semantics are broken.
  // For our model, the return value should always be the receiver, or a copy
  // of the receiver, with the property changed.

  // Further, note that the return value of a set always returns the value that
  // was tried to be set to, regardless of whether it was successful or not.

  set (inner, selector, value, outer_) {
    return inner._externalWrite(selector, value) || false
  },

  has (inner, selector) {
    switch (selector[0]) {
      case "_"       : return inner._externalPrivateRead(selector) || false
      // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
      case undefined : return false
    }
    return (selector in inner)
  },

  getOwnPropertyDescriptor (inner, selector) {
    switch (selector[0]) {
      case "_"       : return inner._externalPrivateRead(selector) || undefined
      // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
      case undefined : return undefined
    }
    return Reflect.getOwnPropertyDescriptor(inner, selector)
  },

  ownKeys (inner) {
    const names = AllNames(inner).filter(name => name[0] !== "_")
    // return names.concat(VISIBLE_SYMBOLS_LIST)
    return names
  },

  getPrototypeOf : ANSWER_NULL,
  setPrototypeOf : ANSWER_FALSE,
  defineProperty : ANSWER_FALSE,
  deleteProperty : ANSWER_FALSE,
  isExtensible   : ANSWER_FALSE,
  // preventExtensions ???
}

// SetBarrierBehavior = {
//   set (inner, selector, value, outer_) {
//     if (inner[selector] !== value) {
//       inner[selector] = value
//       // check to see if it was successfully set
//       if (inner[selector] !== value) {
//         (this.target = inner.copy)[selector] = value  // LOOK: check this!!!
//         this.set = this.setMutableCopy
//         this.get = this.getMutableCopy
//       }
//     }
//     return true
//   }
// }



const MutableWriteBarrierBehavior = {
  __proto__ : null,

  set (target, selector, value, outer_) {
    if (target[selector] !== value) {
      return true
    }
    if (value === null || typeof value !== "object" || value.isFact) {
      target[selector] = value; return true
    }
    if ((inner = InterMap.get(value))) {
      if (inner[IS_FACT]) { target[selector] = value; return true }
    }

    const firstChar    = selector[0]
    const isPublic     = (firstChar !== "_" && firstChar !== undefined)

    target[selector] = (inner) ?
      inner[COPY](isPublic) :     // as immutable
      CopyObject(value, isPublic) // as fact
    return true
  }
}


Thing.addSGetter(function _captureChanges() {
  if (this[IS_FACT] === IMMUTABLE) {
    delete this._$captureChangesLock
    return this
  }
  DefineProperty(this, "_captureChanges", InvisibleConfiguration)
  return (this._captureChanges = this)
})

Thing.addSGetter(function _captureOverwrite() {
  if (this[IS_FACT] === IMMUTABLE) {
    delete this._$captureOverwriteLock
    return this
  }
  DefineProperty(this, "_captureOverwrite", InvisibleConfiguration)
  return (this._captureOverwrite = this)
})


class ImmutableWriteBarrierBehavior {
  constructor (target) {
    this.target = target
    this.isInUse = false
    this.proxy = new Proxy(target, this)
  }

  set (inner, selector, value, outer_) {
    if (inner[selector] !== value) {
      (this.target = inner.asMutableCopy)[selector] = value
      this.set = this.detourSet
      this.get = this.detourGet
    }
    return true
  }

  deleteProperty (inner, selector, outer_) {
    if (inner[selector] !== undefined) {
      delete (this.target = inner.asMutableCopy)[selector]
    }
    else if (selector === "_$captureChangesLock") {
      this.target = inner.asMutableCopy
    }
    else if (selector === "_$captureOverwriteLock") {
      this.target = inner._newBlank()
    }
    else if (IsLocalProperty.call(target, selector)) {
      delete (this.target = inner.asMutableCopy)[selector]
    }
    else { return true }

    this.set = this.detourSet
    this.get = this.detourGet
    this.deleteProperty = this.detourDelete
    return true
  }

  detourSet (inner, selector, value, outer_) {
    this.target[selector] = value
    return true
  }

  detourGet (inner, selector, outer_) {
    return this.target[selector]
  }

  detourDelete (inner, selector, outer_) {
    delete this.target[selector]
    return true
  }
}



function EnkrustMethod(OriginalMethod) {
  const method = function (...args) {
    let receiver, barrier, handlers, result, inner

    receiver = InterMap.get(this)

    if (receiver[IS_FACT] !== IMMUTABLE) {
      target = receiver
    }
    else {
      barrier = receiver[WRITE_BARRIER]
      if (barrier.isInUse) {
        barrier = new ImmutableWriteBarrierBehavior(receiver)
      }
      else {
        barrier.isInUse = true
      }
      target = barrier.proxy
    }

    result = OriginalMethod.apply(receiver, ...args)

    if (result === null || typeof result !== "object") { return result }
    if (result === target) {
      if (barrier) {
        result = barrier.target
        if (result !== receiver) {
          barrier.target = receiver
          result.beImmutable
        }
        barrier.isInUse = false
      }
      return result.$
    }
    if (result.isFact) { return result }
    return ((inner = InterMap.get(result))) ?
      (inner[IS_FACT] ? result : inner.asImmutable) : CopyObject(result, true)
  }

  DefineProperty(method, "name", VisibleConfiguration)
  method.name = OriginalMethod.name
  // method[ORIGINAL]   = OriginalMethod[ORIGINAL] || OriginalMethod
  method[IS_FACT] = IMMUTABLE

  return SetImmutable(method)
}


function ConstructorForNamingInDebugger(typeName) {
  const funcBody = `return function ${typeName}() {
    throw new Error("This constructor is only for use in debugging!")
  }`
  const constructor = Function(funcBody)()
  delete constructor.prototype
  constructor[IS_FACT] = IMMUTABLE
  return SetImmutable(constructor)
}

function CreateEmptyNamelessFunction() {
  return function () {}
}

function BlankConstructorFor(instanceRoot) {
  const constructor = CreateEmptyNamelessFunction()
  constructor.prototype = instanceRoot
  constructor[IS_FACT] = IMMUTABLE
  return SetImmutable(constructor)
}

function CreateFactory(_Blank, isDisguised) {
  return function (...args) {
    const instance = new _Blank()
    instance._init(...args)
    if (args.length && instance.id === undefined) { instance.beImmutable }
    return instance.$
  }
}

function Create_new(_Blank) {
  const target = {}
  target.new =function (...args) {
    const instance = new _Blank()
    instance._init(...args)
    return instance.$
  }
  return target.new
}

function Create__copy(_Blank) {
  return function COPY(asImmutable, visited = CopyLog(), _target = _Blank()) {
    const  target = _target.$

    visited.pairing(this.$, target) // to manage cyclic objects

    if (_target._initFrom_ !== _InitFrom_) {
      _target._initFrom_(this, visited)
      if (asImmutable) { BeImmutable(_target, true) }
    }
    else {
      _target._initFrom_(this, asImmutable, visited)
    }
    return target
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

class DisguiseBehavior {
  constructor (disguised) {
    this.disguised = disguised
  }

  get (_factory, selector, _disguise) {
    return this.disguised[selector]
  }

  set (_factory, selector, value, _disguise) {
    this.disguised[selector] = value
    return false
  }

  has (_factory, selector) {
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
  const _Blank   = BlankConstructorFor(_root)
  const _factory = CreateFactory(_Blank)
  const behavior = new DisguiseBehavior(this)
  const disguise = new Proxy(_factory, behavior)

  _factory[Symbol.hasInstance] = (instance) => (instance.type === this)
  SetImmutable(_factory.prototype)
  SetImmutable(_factory)

  _root.type         = disguise.$
  _root[ROOT]        = _root
  _root._newBlank    = () => (new _Blank()).$
  _root[COPY]        = Create__copy(_Blank)

  this.new           = _root.new = Create_new(_Blank)

  this._instanceRoot = _root
  this._constructor  = _Blank
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


function EnkrustThing(thing) {
  const krust = new Proxy(thing, KrustPrivacyBehavior)
  InterMap.set(krust, thing)
  return (thing.$ = thing[OUTER] = krust)
}

AddLazilyInstalledProperty(_Thing_root, "$", EnkrustThing)
