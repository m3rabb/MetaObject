
const InterMap = new WeakMap()

const KrustBehaviors = {
  __proto__ : null,

  // Setting on things in not allowed because the setting semantics are broken.
  // For our model, the return value should always be the receiver, or a copy
  // of the receiver, with the property changed.

  // Further, note that the return value of a set always returns the value that
  // was tried to be set to, regardless of whether it was successful or not.

  get (inner, selector, _outer) {
    switch (selector[0]) {
      case "_"       :
        return inner._externalPrivateRead(selector) || undefined
      case undefined : if (!(selector in ALLOWED_SYMBOLS)) { return undefined }
    }

    if (inner.atIndex) {
      index = +selector
      if (index === index || index === "null") { return inner.atIndex(index) }
    }

    let value = inner[selector]

    return (value === inner) ? value.$ : value
  },

  set (inner, selector, value, _outer) {
    return inner._externalWrite(selector, value) || false
  },

  defineProperty (inner, selector, descriptor) {
    return false
  },

  has (inner, selector) {
    switch (selector[0]) {
      case "_"       : return inner._externalPrivateRead(selector) || false
      case undefined : if (!(selector in ALLOWED_SYMBOLS)) { return false }
    }
    return (selector in inner)
  },

  ownKeys (inner) {
    const names = AllNames(inner).filter(name => name[0] !== "_")
    return names.concat(ALLOWED_SYMBOLS_LIST)
  },

  getPrototypeOf (inner) {
    return null
  },

  setPrototypeOf (inner, target) {
    return false
  },

  // Symbol.hasInstance
  // isExtensible()
  // preventExtensions()
  // getOwnPropertyDescriptor: function(target, prop)
  // defineProperty: function(target, property, descriptor)
  // deleteProperty: function(target, property)
}




const MutableWriteBarrierBehaviors = {
  __proto__ : null,

  set (inner, selector, value, _outer) {
    switch (typeof value) {
      case "undefined" :       inner[selector] = value; return true
      case "boolean"   :       inner[selector] = value; return true
      case "number"    :       inner[selector] = value; return true
      case "symbol"    :       inner[selector] = value; return true
      case "string"    :       inner[selector] = value; return true
      case "object"    :       inner[selector] = value; return true
        if (result === null) { inner[selector] = value; return true }
        isFunc = true ; break
      case "function"  :
        isFunc = false; break
    }

    if (value[IS_FACT]) { inner[selector] = value; return true }

    const firstChar = selector[0]
    const isPublic  = (firstChar !== "_" && firstChar !== undefined)

    inner[selector] = ((innerValue = InterMap.get(value))) ?
      (isPublic) ? innerValue.asFact : innerValue.copy
      (isFunc) ? CopyFunc(value, isPublic) :
        IsArray(value) ? CopyArray(value, isPublic) :CopyObject(value, isPublic)

    return true
  }
}



const ImmutableWriteBarrierBehaviors = {
  __proto__ : null,

  set (inner, selector, value, _outer) {
    if (inner[selector] !== value) {
      (this.target = inner.copy)[selector] = value
      this.set = this.setMutableCopy
      this.get = this.getMutableCopy
    }
    return true
  },

  setMutableCopy (inner, selector, value, _outer) {
    this.target[selector] = value
    return true
  },

  getMutableCopy (inner, selector, _outer) {
    return this.target[selector]
  },
}


function EnkrustMethod(OriginalMethod) {
  const method = function (...args) {
    const innerReceiver = InterMap.get(this)
    let handlers, receiver

    if (innerReceiver[IS_IMMUTABLE]) {
      handlers = { __proto__ : ImmutableWriteBarrierBehaviors,
                     target  : innerReceiver                   }
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

    return (result === receiver) ?
       (handlers) ? handlers.target.$ : innerReceiver.$  :
       (result[IS_FACT]) ? result : _NonFactAsFact(result)
  }

  DefineProperty(method, "name", VisibleConfiguration)
  method.name      = OriginalMethod.name
  method[ORIGINAL] = OriginalMethod[ORIGINAL] || OriginalMethod
  method[IS_FACT]  = true

  return BeImmutable(method)
}


const AsFact = {
  object   : _ObjectAsFact,
  function : _FuncAsFact,
}

function _NonFactAsFact(nonFact) {
  const visited = new Map()
  const inner   = InterMap.get(nonFact)
  return (inner) ?
    inner._copyInto(this._new(), true, visited) : // asImmutable
    AsFact[typeof nonFact](nonFact, visited)
}

function _ObjectAsFact(nonFact, visited) {
  let fact, next, value, names, name

  if (IsArray(nonFact)) {
    next = nonFact.length
    fact = []
    visited.set(nonFact, fact)

    while (next--) {
      value      = nonFact[next]
      fact[next] = (value[IS_FACT]) ? value :
        visited.get(value) || AsFact[typeof value](value, visited)
    }
  }
  else {
    names = LocalProperties(nonFact)
    next  = names.length
    fact  = { __proto__ : nonFact.__proto__ }
    visited.set(nonFact, fact)

    while (next--) {
      name       = names[next]
      value      = nonFact[name]
      fact[next] = (value[IS_FACT]) ? value :
        visited.get(value) || AsFact[typeof value](value, visited)
    }
  }

  fact[IS_FACT] = true
  return BeImmutable(fact)
}

function _FuncAsFact(nonFactFunc, visited) {
  const func  = function (...args) { return Func.apply(this, ...args) }
  const names = LocalProperties(func)
  let   next  = names.length

  DefineProperty(func, "name", VisibleConfiguration)
  visited.set(nonFactFunc, func)

  while (next--) {
    name       = names[next]
    value      = nonFactFunc[name]
    func[next] = (value[IS_FACT]) ? value :
      visited.get(value) || AsFact[typeof value](value, visited)
  }

  func[ORIGINAL] = nonFactFunc[ORIGINAL] || nonFactFunc
  func[IS_FACT]  = true
  return BeImmutable(func)
}




function ConstructorNamingInDebugger(typeName) {
  const funcBody = `return function ${typeName}() {
    throw new Error("This constructor is only for use in debugging!")
  }`
  const constructor = Function(funcBody)()
  delete constructor.prototype
  constructor[IS_FACT] = constructor[IS_IMMUTABLE] = true
  return BeImmutable(constructor)
}

// function MakeConstructor(typeName, instanceRoot) {
//   const funcBody = `return function _${typeName}_constructor() {
//     this._init(...arguments)
//     if (arguments.length && this.id === undefined) { this.beImmutable }
//   }`
//   const constructor = Function(funcBody)()
//   constructor.prototype = instanceRoot
//   constructor[IS_FACT] = constructor[IS_IMMUTABLE] = true
//   return BeImmutable(constructor)
// }


function MakeFactory(InstanceRoot) {
  return function (...args) {
    const instance = { __proto__ : InstanceRoot }
    instance._init(...args)
    if (args.length && instance.id === undefined) { instance.beImmutable }
    return instance
  }
}




function Type(spec_typeName, supertypes_) {
  const spec = (spec_typeName !== "string") ? spec_typeName :
                 {name : spec_typeName, supertypes : supertypes_}
  const newType = { __proto__ : Inner_root }
  return newType._init(typeName, supertypes_)
}

TypeBehaviors = {
  get (_factory, selector, _disguise) {
    return this.typeInstance[selector]
  },

  set (_factory, selector, value, _disguise) {
    this.typeInstance[selector] = value
    return false
  },

  has (_factory, selector) {
    return (selector in this.typeInstance)
  },
}


PutMethod(Type_root, function _init(spec, _root_, context__) {
  const _supertypes  = ConnectTypes(this, spec.supertypes)
  const _ancestors   = BuildAncestors(_supertypes)
  const _root        = _root_ || { __proto__ : Inner_root }

  this.name          = spec.name
  this._factory      = MakeFactory(_root)
  this._instanceRoot = _root
  this.context       = context__ || null
  this.subtypes      = { __proto__ : null }
  this.methods       = { __proto__ : null }
  this.supertypes    =
    spec.supertypes || spec.supertype && [spec.supertype] || [Thing]

  this._setId(`${spec.name},${Type_root._nextInstanceNumber}.Type`)

  _root.type         = this
  _root[ROOT]        = _root
  _root.constructor  = ConstructorNamingInDebugger(typeName)

  SeedInstanceRootMethodHandlers(_root, _ancestors)
  _ancestors[_ancestors.length] = this
  _root.ancestry     = _ancestors

  this._disguise     = new Proxy(this._factory, {
    __proto__    : TypeBehaviors,
    typeInstance : this
  })

  return (this._disguise)
})


function EnkrustThing(thing) {
  const krust = new Proxy(thing, KrustBehaviors)

  InterMap.set(krust, thing)
  return (thing.$ = krust)
}
