/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

const InterMap = new WeakMap()

const ANSWER_FALSE = () => false
const ANSWER_NULL = () => null

const KrustBehavior = {
  __proto__ : null,

  get (inner, selector, _outer) {
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

  set (inner, selector, value, _outer) {
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

  set (inner, selector, value, _outer) {
    let result, isFunc

    switch (typeof value) {
      case "undefined" :       inner[selector] = value; return true
      case "boolean"   :       inner[selector] = value; return true
      case "number"    :       inner[selector] = value; return true
      case "symbol"    :       inner[selector] = value; return true
      case "string"    :       inner[selector] = value; return true
      case "object"    :
        if (result === null) { inner[selector] = value; return true }
        isFunc = true ; break
      case "function"  : break
    }

    if (value[MUTABILITY] <= FACT) { inner[selector] = value; return true }

    const firstChar = selector[0]
    const hardenIfPublic = (firstChar !== "_" && firstChar !== undefined)

    if ((inner = InterMap.get(value))) {
      inner[selector] = inner._copy(hardenIfPublic, undefined, inner._new())
    }
    else if (value.id !== undefined) {
      inner[selector] = value
    }
    // if (value.krustyCopy) {
    //   inner[next] = value.krustyCopy(hardenIfPublic); return true
    // }
    // if (value.constructor !== Object && (copy = value.copy)) {
    //   if (typeof copy === "function") { copy = value.copy(harden) }
    //
    //   inner[next] = copy; return true
    // }
    else if (isFunc) {                               // is function
      inner[selector] = CopyFunc(value, hardenIfPublic)
    }
    else if (IsArray(value)) {  // is array
      inner[selector] = _Copy.call(value, hardenIfPublic, undefined, null)
    }
    else {
      inner[selector] = _Copy.call(value, hardenIfPublic)
    }

    return true
  }
}

class ImmutableWriteBarrierBehavior {
  constructor (target) {
    this.target = target
  }

  set (inner, selector, value, _outer) {
    if (inner[selector] !== value) {
      (this.target = inner.copy)[selector] = value
      this.set = this.setMutableCopy
      this.get = this.getMutableCopy
    }
    return true
  }

  setMutableCopy (inner, selector, value, _outer) {
    this.target[selector] = value
    return true
  }

  getMutableCopy (inner, selector, _outer) {
    return this.target[selector]
  }
}

function EnkrustMethod(OriginalMethod) {
  const method = function (...args) {
    let innerReceiver, handlers, receiver, inner

    innerReceiver = InterMap.get(this)

    if (innerReceiver[IS_IMMUTABLE]) {
      handlers = new ImmutableWriteBarrierBehavior(innerReceiver)
      receiver = new Proxy(innerReceiver, handlers)
    }
    else { receiver = innerReceiver }

    const result = OriginalMethod.apply(receiver, ...args)

    switch (typeof result) {
      case "undefined" : return result
      case "boolean"   : return result
      case "number"    : return result
      case "symbol"    : return result
      case "string"    : return result
      case "object"    : if (result === null) { return null } break
      case "function"  : break
    }

    if (result === receiver) {
      return (handlers) ? handlers.target.$ : innerReceiver.$
    }
    if (result[MUTABILITY] <= FACT) { return result }
    if ((inner = InterMap.get(result))) { return inner.asImmutable }
    if (result.id !== undefined) { return result }
    // if (result.krustyCopy) { return result.krustyCopy(true) }
    // if (result.constructor !== Object && (copy = result.copy)) {
    //   return (typeof copy === "function") ? result.copy(true) : result
    // }
    if (isFunc) { return CopyFunc(result, true) }
    if (IsArray(result)) { return _Copy.call(result, true, undefined, null) }

    return _Copy.call(result, true)
  }

  DefineProperty(method, "name", VisibleConfiguration)
  method.name        = OriginalMethod.name
  method[ORIGINAL]   = OriginalMethod[ORIGINAL] || OriginalMethod
  method[MUTABILITY] = IMMUTABLE

  return BeImmutable(method)
}


function ConstructorNamingInDebugger(typeName) {
  const funcBody = `return function ${typeName}() {
    throw new Error("This constructor is only for use in debugging!")
  }`
  const constructor = Function(funcBody)()
  delete constructor.prototype
  constructor[MUTABILITY] = IMMUTABLE
  return BeImmutable(constructor)
}

function BasicConstructorFor(instanceRoot) {
  const constructor = function () {}
  constructor.prototype = instanceRoot
  constructor[MUTABILITY] = IMMUTABLE
  return BeImmutable(constructor)
}

function CreateFactory(typeName, basicConstructor) {
  const funcBody =
    `return function (_basic_${typeName}) {
      return function ${typeName}(...args) {
        const instance = new _basic_${typeName}()
        instance._init(...args)
        if (args.length && instance.id === undefined) { instance.beImmutable }
        return instance
      }
    }`
  const customFactoryGenerator = Function(funcBody)()
  const factory = customFactoryGenerator(basicConstructor)

  BeImmutable(factory.prototype)
  return BeImmutable(factory)
}

class TypeBasisBehavior {
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

const RootConstructor = BasicConstructorFor(Inner_root)
const TypeConstructor = BasicConstructorFor(Type_root)


// This is the factory for Type
function Type(spec_typeName, supertypes_) {
  const newType = new TypeConstructor()
  const spec    = (spec_typeName !== "string") ? spec_typeName :
                    {name : spec_typeName, supertypes : supertypes_}
  return newType._init(spec)
}


PutMethod(Type_root, function _init(spec, _root_, context__) {
  const _supertypes      = ConnectTypes(this, spec.supertypes)
  const _ancestors       = BuildAncestors(_supertypes)
  const _root            = _root_ || new RootConstructor()
  const basicConstructor = BasicConstructorFor(_root)
  const name             = spec.name
  const iid              = Type_root._nextIID++

  SeedInstanceRootMethodHandlers(_root, _ancestors)
  _ancestors[_ancestors.length] = this

  _root.ancestry     = _ancestors // LOOK: ancestry & type need to be protected!!!
  _root.type         = this
  _root[ROOT]        = _root
  _root.constructor  = ConstructorNamingInDebugger(name)
  _root._new         = basicConstructor

  const _factory = CreateFactory(name, basicConstructor)
  _factory[Symbol.hasInstance] = (instance) => (instance.type === this)

  const behavior = new TypeBasisBehavior(this)
  const disguise = new Proxy(_factory, behavior)

  this.name          = name
  this._iid          = iid
  this._factory      = _factory
  this._constructor  = basicConstructor
  this._nextIID      = 0
  this._instanceRoot = _root
  this.context       = context__ || null
  this.subtypes      = SpawnFrom(null)
  this.methods       = SpawnFrom(null)
  this.supertypes    = spec.supertypes ||
    spec.supertype && [spec.supertype] || [Thing]

  const prefix = context__ ? context__.id + "@" : ""

  this._setId(`${prefix}${name},${iid}.Type`)

  return (this._disguise = disguise)
})

function EnkrustThing(thing) {
  const krust = new Proxy(thing, KrustBehavior)
  InterMap.set(krust, thing)
  return (thing.$ = krust)
}

AddLazilyInstalledProperty(_Thing_root, "$", EnkrustThing)
