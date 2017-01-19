// Protection for privacy and immutability

const InterMap = new WeakMap()


// Ensure that object passed in from the outside is wrapped
function Wrap(value) {
  switch (typeof value) {
    default         : return value  // Primitives don't need wrapping
    case "function" : break
    case "object"   : break
  }
  if (value === null) { return null }
  return (value[CONTEXT] === CONTEXT.secret) ?
    value[OUTER] : // value // Formerly, didn't wrap incoming things, but
                            // wrapping ensures immutable property access
    (InterMap.get(value) ?
      value : WrapObject(value, IsFrozen(value)))
}

// Ensure the object passed to the outside is wrapped
function ImmutableWrap(value) {
  let isFunc = false
  switch (typeof value) {
    default         : return value  // Primitives don't need wrapping
    case "function" : isFunc = true; break
    case "object"   : break
  }
  if (value === null) { return null }
  if (value[CONTEXT] === CONTEXT.secret) { return value[OUTER] }

  const inner = InterMap.get(value)
  return inner ?          // If wrapped object is mutable, then make a copy
    (value[IS_IMMUTABLE] ?
      value :
      (isFunc ?
        ImmutableWrapFunc(inner) :
        WrapObject( BeImmutable(CopyObject(inner)), true ))) :
    // The object was generated internally so no copying is necessary
    WrapObject(BeImmutable(value), true)
}

const BaseThingEnwrapture = {
  __proto__ : null,

  set : (inner, selector, value, outer) => {
    return inner._externalWrite(selector, value) || false
  },

  has (inner, selector) {
    switch (selector[0]) {
      case "_"       : return inner._externalPrivateRead(selector) || false
      case undefined : return undefined
    }
    return selector in inner
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

const BaseObjectEnwrapture = {
  __proto__ : null,

  set : (inner, selector, value, outer) => {
    return false  // Default setter mode is for immutable objects
  },

  apply : (func, receiver, args) => {
    return ImmutableWrap(func.apply(Wrap(receiver), args.map(Wrap)))
  },

  construct : (target, args, constructor) => {
    // Revisit!!!
    this.apply(constructor, target, args)
    return target
  }

  // getOwnPropertyDescriptor()
  // defineProperty()
}

const Outer_root = {
  __proto__     : null,
  [IS_IMMUTABLE] : true
}



function WrapThing(inner) {
  const Wrapped = { __proto__ : Outer_root }

  const handlers = {
    __proto__ : BaseThingEnwrapture,

    get : (inner, selector, outer_) => {
      if (selector in Wrapped) {
        return Wrapped[selector]
      }

      switch (selector[0]) {
        case "_"       : return inner._externalPrivateRead(selector)
        case undefined : return undefined  // Prevents reading of Symbols
      }

      return (Wrapped[selector] = ImmutableWrap(inner[selector]))
    }
  }
  const outer = new Proxy(inner, handlers)

  inner[IDENTITY] = inner[OUTER] = outer
  InterMap.set(outer, inner)
  return outer
}

function WrapObject(inner, immutable) {
  const Wrapped  = {
    __proto__      : null,
    [IS_IMMUTABLE] : immutable
  }
  const _Wrap = immutable ? ImmutableWrap : Wrap

  const handlers = immutable ?
    {
      __proto__ : BaseObjectEnwrapture,

      get : (inner, selector, outer_) => {
        return (selector in Wrapped) ?
          Wrapped[selector] : (Wrapped[selector] = _Wrap(inner[selector]))
      }
    }

  if (!immutable) {
    handlers.set = function (inner, selector, value, outer_) {
      (Wrapped[selector] = Wrap((inner[selector] = value)))
      return true
    }
  }

  const outer = new Proxy(inner, handlers)

  InterMap.set(outer, inner)
  return outer
}

function ImmutableWrapFunc(inner) {
  const Wrapped = {
    __proto__      : null,
    [IS_IMMUTABLE] : true
  }

  let names = LocalProperties(inner)
  let next = names.length
  while (next--) {
    const name = names[next]
    Wrapped[name] = ImmutableWrap(inner[name])
  }

  const handlers = {
    __proto__ : BaseObjectEnwrapture,

    has (inner_, selector) {
      return selector in Wrapped
    },

    ownKeys (inner_) {
      return AllNames(Wrapped)
    },

    get : (inner_, selector, outer_) => {
      return Wrapped[selector]
    }
  }

  const outer = new Proxy(inner, handlers)

  InterMap.set(outer, inner)
  return outer
}



const BaseMethodHandlerEnwrapture = {
  __proto__ : null,
  construct : (target, args, constructor) => {
    return null // Void
  }
  // getOwnPropertyDescriptor()
  // defineProperty()
}


const MethodHandlerEnwrapture = {
  __proto__ : BaseMethodHandlerEnwrapture,
  apply : (func, inner, args) => {
    return ImmutableWrap(func.apply(inner, args.map(Wrap)))
  }
}

const GetterHandlerEnwrapture = {
  __proto__ : MethodHandlerEnwrapture,
  apply : (func, inner, args) => {
    return ImmutableWrap(func.call(inner))
  }
}

const SetterHandlerEnwrapture = {
  __proto__ : MethodHandlerEnwrapture,
  apply : (func, inner, args) => {
    return ImmutableWrap(func.call(inner, Wrap(args[0])))
  }
}

function BakeGeneralHandler(handler) {
  return new Proxy(BeImmutable(handler), GetterHandlerEnwrapture)
}

function BakeGetterHandler(handler) {
  return new Proxy(BeImmutable(handler), GetterHandlerEnwrapture)
}

function BakeSetterHandler(handler) {
  return new Proxy(BeImmutable(handler), SetterHandlerEnwrapture)
}
