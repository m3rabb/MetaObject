
const InterMap = new WeakMap()

const BaseKrustBehaviors = {
  __proto__ : null,

  // Setting on things in not allowed because the setting semantics are broken.
  // For our model, the return value should always be the receiver, or a copy
  // of the receiver, with the property changed.

  // Further, note that the return value of a set always returns the value that
  // was tried to be set to, regardless of whether it was successful or not.

  set (inner, selector, value, _outer) {
    return inner._externalWrite(selector, value) || false
  },

  defineProperty (inner, selector, descriptor) {
    return false
  },

  has (inner, selector) {
    switch (selector[0]) {
      case "_"       : return inner._externalPrivateRead(selector) || false
      case undefined : return undefined
    }
    return (selector in inner)
  },

  ownKeys (inner) {
    const names = AllNames(inner).filter(name => name[0] !== "_")
    return names.concat(ALLOWED_SYMBOLS)
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

function MutableGet(inner, selector, _outer) {
  switch (selector[0]) {
    case "_"       :
      return inner._externalPrivateRead(selector) || undefined
    case undefined :
      if (!(selector in ALLOWED_SYMBOLS)) { return undefined }
  }

  if (inner.atIndex) {
    index = +selector
    if (index === index || index === "null") { return inner.atIndex(index) }
  }

  let externals = this.externals
  let internals = this.internals
  let external  = externals[selector]
  let internal  = internals[selector]
  let value     = inner    [selector]

  if (internal === value) { return external }

  internals[selector] = value

  if (internal === undefined) { // This is first access of the property
    if (external !== undefined) {
      return external          // The krust is inheriting this property
    }
  }

  switch (typeof value) {
    case "undefined" :       return (externals[selector] = value)
    case "boolean"   :       return (externals[selector] = value)
    case "number"    :       return (externals[selector] = value)
    case "symbol"    :       return (externals[selector] = value)
    case "string"    :       return (externals[selector] = value)
    case "object"    :
      if (result === null) { return (externals[selector] = value) }
      // break omitted
    case "function"  : break
  }

  return (externals[selector] = (value[IS_FACT]) ? value :
    (value === inner) ? inner.$ : _NonFactAsFact(value))
}

function ImmutableGet(inner, selector, _outer) {
  switch (selector[0]) {
    case "_"       : return inner._externalPrivateRead(selector) ||undefined
    case undefined : return undefined  // Prevents reading of Symbols
  }

  if (inner.atIndex) {
    index = +selector
    if (index === index || index === "null") { return inner.atIndex(index) }
  }

  return this.external[selector]
}

function EnkrustMutable(thing) {
  const krustBehaviors = {
    __proto__   : BaseKrustBehaviors,
      get       : MutableGet,
      externals : { __proto__ : Outer_root },
      internals : { __proto__ : null       },
  }
  const krust = new Proxy(thing, krustBehaviors)

  InterMap.set(krust, thing)
  thing[KRUST_BEHAVIORS] = krustBehaviors
  return (thing.$ = krust)
}



const BaseWriteBarrierBehaviors = {
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
      handlers = { __proto__ : BaseWriteBarrierBehaviors,
                     target  : innerReceiver              }
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


// function MakeConstructor(typeName, instanceRoot) {
//   const funcBody =
//     `return function ${typeName}(...args) {
//       this._init(...args)
//       if (args.length) { this.beImmutable }
//     }`
//   const constructor = Function(funcBody)()
//
//   constructor.prototype    = instanceRoot
//   instanceRoot.constructor = constructor
//   return constructor
// }

function MakeConstructor(typeName, instanceRoot) {
  const funcBody = `return function ${typeName}() {}`
  const constructor = Function(funcBody)()

  constructor.prototype    = instanceRoot
  instanceRoot.constructor = constructor
  return constructor
}

function MakeType(typeName) {
  return new Proxy(

    function (...args) {
      const instance = new this._constructor()
      instance._init(...args)

    },

    {

    }

}
