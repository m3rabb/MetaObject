/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

const InterMap = new WeakMap()

const ANSWER_FALSE = () => false
const ANSWER_NULL = () => null

const KrustBehavior = {
  __proto__ : null,

  get (inner, selector, outer_) {
    switch (selector[0]) {
      case "_"       :
        return inner._externalPrivateRead(selector) || undefined
      case undefined : if (!(selector in ALLOWED_SYMBOLS)) { return undefined }
    }

    if (inner.atIndex) {
      let index = +selector
      if (index === index || index === "null") { return inner.atIndex(index) }
    }

    let value = inner[selector]

    return (value === inner) ? value.$ : value
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
      // case undefined : if (!(selector in ALLOWED_SYMBOLS)) { return false }
      case undefined : return false
    }
    return (selector in inner)
  },

  getOwnPropertyDescriptor (inner, selector) {
    switch (selector[0]) {
      case "_"       : return inner._externalPrivateRead(selector) || undefined
      // case undefined : if (!(selector in ALLOWED_SYMBOLS)) { return false }
      case undefined : return undefined
    }
    return Reflect.getOwnPropertyDescriptor(inner, selector)
  },

  ownKeys (inner) {
    const names = AllNames(inner).filter(name => name[0] !== "_")
    // return names.concat(ALLOWED_SYMBOLS_LIST)
    return names
  },

  getPrototypeOf : ANSWER_NULL,
  setPrototypeOf : ANSWER_FALSE,
  defineProperty : ANSWER_FALSE,
  deleteProperty : ANSWER_FALSE,
  isExtensible   : ANSWER_FALSE,
  // preventExtensions ???
}

SetBarrierBehavior = {
  set (inner, selector, value, outer_) {
    if (inner[selector] !== value) {
      inner[selector] = value
      if (inner[selector] !== value) {
        (this.target = inner.copy)[selector] = value  // LOOK: check this!!!
        this.set = this.setMutableCopy
        this.get = this.getMutableCopy
      }
    }
    return true
  }
}

const MutableWriteBarrierBehavior = {
  __proto__ : null,

  set (target, selector, value, outer_) {
    let isFunc, firstChar, asFixedFacts, isPublic, inner

    if (target[selector] === value) { return true }

    switch (typeof value) {
      default          :      target[selector] = value; return true
      case "function"  :      isFunc = true           ; break
      case "object"    :
        if (value === null) { target[selector] = value; return true }
    }

    if (value[IS_FACT]) { target[selector] = value; return true }

    firstChar    = selector[0]
    isPublic     = (firstChar !== "_" && firstChar !== undefined)
    asFixedFacts = isPublic

    if ((inner = InterMap.get(value))) {
      target[selector] = inner[COPY](asFixedFacts)
    }
    else if (value.id !== undefined) {
      target[selector] = value
    }
    else if (value.constructor !== Object && (copy = value.copy)) {
      if (typeof copy === "function") { copy = value.copy() }

      target[selector] = (asFixedFacts) ? BeFixedFacts(copy) : copy
    }
    else if (isFunc) {                               // is function
      target[selector] = CopyFunc(value, undefined, asFixedFacts)
    }
    else {
      target[selector] = CopyObject(value, undefined, asFixedFacts)
    }

    return true
  }
}

class ImmutableWriteBarrierBehavior {
  constructor (target) {
    this.target = target
  }

  set (inner, selector, value, outer_) {
    if (inner[selector] !== value) {
      (this.target = inner.mutableCopy)[selector] = value
      this.set = this.setMutableCopy
      this.get = this.getMutableCopy
    }
    return true
  }

  setMutableCopy (inner, selector, value, outer_) {
    this.target[selector] = value
    return true
  }

  getMutableCopy (inner, selector, outer_) {
    return this.target[selector]
  }
}

function EnkrustMethod(OriginalMethod) {
  const method = function (...args) {
    let innerReceiver, handlers, receiver, result, isFunc, inner

    innerReceiver = InterMap.get(this)

    if (innerReceiver[IS_FACT] === IMMUTABLE) {
      handlers = new ImmutableWriteBarrierBehavior(innerReceiver)
      receiver = new Proxy(innerReceiver, handlers)
    }
    else { receiver = innerReceiver }

    result = OriginalMethod.apply(receiver, ...args)

    switch (typeof result) {
      default          : return result
      case "function"  : isFunc = true; break
      case "object"    : if (result === null) { return result } break
    }

    if (result === receiver) {
      return (handlers) ? handlers.target.beImmutable.$ : innerReceiver.$
    }
    if (result[IS_FACT]) { return result }
    if ((inner = InterMap.get(result))) { return inner.asImmutable }
    if (result.id !== undefined) { return result }
    if (value.constructor !== Object && (copy = value.copy)) {
      if (typeof copy === "function") { copy = value.copy() }

      return BeFixedFacts(copy)
    }
    return (isFunc) ?
      CopyFunc(result, undefined, true) : CopyObject(result, undefined, true)
  }

  DefineProperty(method, "name", VisibleConfiguration)
  method.name        = OriginalMethod.name
  // method[ORIGINAL]   = OriginalMethod[ORIGINAL] || OriginalMethod
  method[IS_FACT] = IMMUTABLE

  return BeImmutable(method)
}


function ConstructorForNamingInDebugger(typeName) {
  const funcBody = `return function ${typeName}() {
    throw new Error("This constructor is only for use in debugging!")
  }`
  const constructor = Function(funcBody)()
  delete constructor.prototype
  constructor[IS_FACT] = IMMUTABLE
  return BeImmutable(constructor)
}

function CreateEmptyNamelessFunction() {
  return function () {}
}

function BlankConstructorFor(instanceRoot) {
  const constructor = CreateEmptyNamelessFunction()
  constructor.prototype = instanceRoot
  constructor[IS_FACT] = IMMUTABLE
  return BeImmutable(constructor)
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
  target.new = function (...args) {
    const instance = new _Blank()
    instance._init(...args)
    return instance.$
  }
  return target.new
}

function Create__copy(_Blank) {
  return function _copy(asImmutable, visited = new Map(), _target = _Blank()) {
    const  target = _target.$

    visited.set(this.$, target)  // Prevents infinite recursion on cyclic objects
    if (asImmutable && _target._initFrom_ !== _InitFrom_) {
      BeFixedFacts(_target._initFrom_(this, visited))
    }
    else {
      _target._initFrom_(this, visited, asImmutable)
    }
    return target
  }
}

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
  return NewUniqueId(`${prefix}${this[IID]}.Type`)
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
  BeImmutable(_factory.prototype)
  BeImmutable(_factory)

  _root.type         = disguise.$
  _root[ROOT]        = _root
  _root._newBlank    = () => (new _Blank()).$
  _root[COPY]        = Create__copy(_Blank)

  this._instanceRoot = _root
  this._constructor  = _Blank
  this._factory      = _factory
  this._disguise     = disguise
  this._nextIID      = 0
  this._subtypes     = SpawnFrom(null)
  this._methods      = SpawnFrom(null)

  this._setId()

  this.new           = Create_new(_Blank)
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
  const krust = new Proxy(thing, KrustBehavior)
  InterMap.set(krust, thing)
  return (thing.$ = krust)
}

AddLazilyInstalledProperty(_Thing_root, "$", EnkrustThing)
