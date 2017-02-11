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

const MutableWriteBarrierBehavior = {
  __proto__ : null,

  set (target, selector, value, outer_) {
    let isFunc, firstChar, asFixedFactsIfPublic, inner

    switch (typeof value) {
      default          :      target[selector] = value; return true
      case "function"  :      isFunc = true           ; break
      case "object"    :
        if (value === null) { target[selector] = value; return true }
    }

    if (value[MUTABILITY] <= FACT) { target[selector] = value; return true }

    firstChar            = selector[0]
    asFixedFactsIfPublic = (firstChar !== "_" && firstChar !== undefined)

    if ((inner = InterMap.get(value))) {
      target[selector] = asFixedFactsIfPublic ? inner.asImmutable : inner.asCopy
    }
    else if (value.id !== undefined) {
      target[selector] = value
    }
    else if (value.constructor !== Object && (copy = value.copy)) {
      if (typeof copy === "function") { copy = value.copy(visited) }

      target[selector] = (asFixedFactsIfPublic) ? AsFixedFacts(copy) : copy
    }
    else if (isFunc) {                               // is function
      target[selector] = CopyFunc(value, undefined, asFixedFactsIfPublic)
    }
    else {
      target[selector] = CopyObject(value, undefined, asFixedFactsIfPublic)
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
      (this.target = inner.copy)[selector] = value
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

    if (innerReceiver[IS_IMMUTABLE]) {
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
      return (handlers) ? handlers.target.$ : innerReceiver.$
    }
    if (result[MUTABILITY] <= FACT) { return result }
    if ((inner = InterMap.get(result))) { return inner.asImmutable }
    if (result.id !== undefined) { return result }
    if (value.constructor !== Object && (copy = value.copy)) {
      if (typeof copy === "function") { copy = value.copy(visited) }

      return AsFixedFacts(copy)
    }
    return (isFunc) ?
      CopyFunc(result, undefined, true) : CopyObject(result, undefined, true)
  }

  DefineProperty(method, "name", VisibleConfiguration)
  method.name        = OriginalMethod.name
  method[ORIGINAL]   = OriginalMethod[ORIGINAL] || OriginalMethod
  method[MUTABILITY] = IMMUTABLE

  return BeImmutable(method)
}


function ConstructorForNamingInDebugger(typeName) {
  const funcBody = `return function ${typeName}() {
    throw new Error("This constructor is only for use in debugging!")
  }`
  const constructor = Function(funcBody)()
  delete constructor.prototype
  constructor[MUTABILITY] = IMMUTABLE
  return BeImmutable(constructor)
}

function BlankConstructorFor(instanceRoot) {
  const constructor = function () {}
  constructor.prototype = instanceRoot
  constructor[MUTABILITY] = IMMUTABLE
  return BeImmutable(constructor)
}


function CreateFactory(_Blank) {
  return function (...args) {
    const instance = new _Blank()
    instance._init(...args)
    if (args.length && instance.id === undefined) { instance.beImmutable }
    return instance.$
  }
}

function Create_copy(_Blank) {
  return function copy(visited = new Map()) {
    if (this[MUTABILITY] === IMMUTABLE) { return this }

    const _copy = _Blank()
    const  copy = _copy.$

    visited.set(this.$, copy)  // Prevents infinite recursion on cyclic objects
    _copy._initFrom(this, visited)
    return copy
  }
}

function Create_asImmutable(_Blank) {
  function asImmutable() {
    if (this[MUTABILITY] === IMMUTABLE) { return this }

    const _copy = _Blank()
    const  copy = _copy.$

    visited.set(this.$, copy)  // Prevents infinite recursion on cyclic objects

    if (_copy._initFrom === _InitFrom)
      { _copy._initFrom(this, visited, true) }
    else
      { AsFixedFacts(_copy._initFrom(this, visited)) }
    return copy
  }
}


class TypeDisguiseBehavior {
  constructor (typeInstance) {
    this.typeInstance = typeInstance
  }

  get (_factory, selector, _disguise) {
    return this.typeInstance[selector]
  }

  set (_factory, selector, value, _disguise) {
    this.typeInstance[selector] = value
    return false
  }

  has (_factory, selector) {
    return (selector in this.typeInstance)
  }
}

const BlankRoot = BlankConstructorFor(Inner_root)
const BlankType = BlankConstructorFor(Type_root)


// This is the factory for Type
function Type(spec_typeName, supertypes_) {
  const newType = new BlankType()
  const spec    = (spec_typeName !== "string") ? spec_typeName :
                    {name : spec_typeName, supertypes : supertypes_}
  return newType._init(spec)
}





function defaultId() {
  const iid    = Type_root._nextIID++
  const prefix = this.context ? this.context.id + "@" : ""
  return NewUniqueId(`${prefix}${iid}.Type-`)
}


PutMethod(Type_root, function _init(spec, _root_, context__) {
  const _root            = _root_ || new BlankRoot()
  const _Blank           = BlankConstructorFor(_root)
  const _factory         = CreateFactory(_Blank)
  const behavior         = new TypeDisguiseBehavior(this)
  const disguise         = new Proxy(_factory, behavior)

  _factory[Symbol.hasInstance] = (instance) => (instance.type === this)
  BeImmutable(_factory.prototype)
  BeImmutable(_factory)

  _root.type         = disguise  // LOOK: need to be protected!!!
  _root[ROOT]        = _root
  _root._newBlank    = () => (new _Blank()).$
  _root.copy         = Create_copy(_Blank)
  _root.asImmutable  = Create_asImmutable(_Blank)

  this._instanceRoot = _root
  this._constructor  = basicConstructor
  this._factory      = _factory
  this._disguise     = disguise
  this._nextIID      = 0
  this._subtypes     = SpawnFrom(null)
  this._methods      = SpawnFrom(null)

  this.context       = context__ || null   // LOOK: need to be protected!!!
  this._setId()

  const supertypes =
    (spec && spec.supertypes || spec.supertype && [spec.supertype]) || [Thing]
  this.setSupertypes(supertypes)
  spec && this.setName(spec.name)

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
  this.name = name
  this._instanceRoot.constructor = ConstructorForNamingInDebugger(name)
})


function EnkrustThing(thing) {
  const krust = new Proxy(thing, KrustBehavior)
  InterMap.set(krust, thing)
  return (thing.$ = krust)
}

AddLazilyInstalledProperty(_Thing_root, "$", EnkrustThing)
