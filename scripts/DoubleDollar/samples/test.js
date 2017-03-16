/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

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
    return GetOwnPropertyDescriptor(outer, selector)
  },

  ownKeys (outer) {
    const names = AllNames(outer).filter(name => name[0] !== "_")
    // return names.concat(VISIBLE_SYMBOLS_LIST)
    return names
  },

  getPrototypeOf : ALWAYS_NULL,
  setPrototypeOf : ALWAYS_FALSE,
  defineProperty : ALWAYS_FALSE,
  deleteProperty : ALWAYS_FALSE,
  isExtensible   : ALWAYS_FALSE,
  // preventExtensions ???
}

// SetBarrierBehavior = {
//   set (inner, selector, value, barrier_) {
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






//
// const InternalNonFactJSParamPermeability = {
//   __proto__ : null,
//
//   get (target, selector, barrier) {
//     return (selector === SECRET) ? INTERNAL_MUTABLE_JS_OBJ : target[selector]
//   }
// }
//
// const NonFactThingParamPermeability = {
//   __proto__ : null,
//
//   get (target, selector, barrier) {
//     return (selector === KRUST) ? MUTABLE_THING_PARAM : target[selector]
//   }
// }


const MutableInnerPermeability = {
  __proto__ : null,

  set (core, selector, value, inner_) {
    const firstChar = selector[0]
    const isPublic  = (firstChar !== "_" && firstChar !== undefined)

    switch (typeof value) {
      default :
        core[selector] = value
        break

      case "function" :
        core[selector] = InterMap.get(value) ? value : WrapFunc(value, OUTSIDE)
        break

      case "object" :
        if (value === null) {
          core[selector] = value
        }
        else if (core[selector] === value) { // && IsLocalProperty.call(core, selector)
          // NOP
        }
        else if (value === core) { // LOOK or value === outer
          core[selector] = core
          value = core[OUTER]
        }
        else if ((isFact = value.isFact) &&
            (value.constructor !== Object || isFact === FACTUAL) {
          core[selector] = value
        }
        else if ((inner_rec = InterMap.get(value))) {
          value = core[selector] = isPublic && inner_rec[INNER] ?
            inner_rec[COPY](true)[KRUST] : value
        }
        else {
          value = core[selector] = isPublic ? CopyObject(value, true) : value
        }
        break
    }

    if (isPublic) { core[OUTER][selector] = value }
    return true
  }
}

class ImmutableInnerPermeability {
  constructor (core) {
    this.inUse = false
    this.target = this.inner =new Proxy(core, this)
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
        if (!IsLocalProperty.call(core, selector)) { return true }
        this.target = inner.mutableCopyExcept(selector)
        break
    }

    this.set = this.detourSet
    this.get = this.detourGet
    this.deleteProperty = this.detourDelete
    return true
  }

  detourSet (core_, selector, value, inner_) {
    this.target[selector] = value
    return true
  }

  detourGet (core_, selector, inner_) {
    return this.target[selector]
  }

  detourDelete (core_, selector, inner_) {
    delete this.target[selector]
    return true
  }
}

ImmutableInnerPermeability.prototype = SpwanFrom(null)


Thing.addSGetter(function _captureChanges() {
  if (this.isImmutable) { delete this._IMMUTABILITY }
  return this
}


Thing.addSGetter(function _captureOverwrite() {
  if (this.isImmutable) { delete this._ALL }
  return this
})



function WrapFunc(OriginalFunc, funcType) {
  const $func = function (...args) {
    switch (funcType) {
      case OUTSIDE :
        switch (typeof this) {
          default :
            receiver = this
            break

          case "function" :
            receiver = (InterMap.get(this)) ? this : WrapFunc(this, OUTSIDE)
            break

          case "object" :
            if (this === null) { receiver = null }
            else if ((isFact = this.isFact) &&  // LOOK: See if immutable
                (this.constructor !== Object || isFact === FACTUAL) {
              receiver = this[KRUST]
            }
            else if ((inner_rec = InterMap.get(this))) {
              if (inner_rec[INNER]) {
                if ((permeability = inner[INNER_PERMEABILITY])) {
                  if (permeability.inUse) {
                    permeability = new ImmutableInnerPermeability(inner[CORE])
                  }
                  permeability.inUse = true
                  receiver = permeability.target
                }
              }
              else { receiver = inner_rec[COPY](true)[KRUST] }
            }
            else { receiver = CopyObject(this, true) }
        }
        break

      case OUTER :
        inner = InterMap.get(this)

        if ((permeability = inner[INNER_PERMEABILITY])) {
          if (permeability.inUse) {
            permeability = new ImmutableInnerPermeability(inner[CORE])
          }
          permeability.inUse = true
          receiver = permeability.target
        }
        else { receiver = inner }
        break

      case INNER :
        receiver = this
        break
    }

    next = args.length
    params = []
    while (next--) {
      arg = args[next]

      switch (typeof arg) {
        default :
          params[next] = arg
          break

        case "function" :
          params[next] = (InterMap.get(arg)) ? arg : WrapFunc(arg, OUTSIDE)
          break

        case "object" :
          if (value === null) { params[next] = null }
          else if ((isFact = arg.isFact) &&
              (arg.constructor !== Object || isFact === FACTUAL) {
            params[next] = arg
          }
          else if ((inner_rec = InterMap.get(arg))) {
            params[next] = inner_rec[INNER] ? inner_rec[COPY](true)[KRUST] : arg
          }
          else { params[next] = CopyObject(value, true) }
      }
    }

    result = OriginalFunc.apply(receiver, params)

    switch (typeof result) {
      default         : return result
      case "object"   : break
      case "function" :
        return InterMap.get(result) ? result : WrapFunc(result, OUTSIDE)
    }
    if (result === null) { return result }

    if (result === receiver) {
      if (permeability) {
        result = permeability.target
        if (result !== inner) {
          permeability.target = inner  // reset permeability
          result.beImmutable
        }
        permeability.inUse = false
      }
      return (funcType === INNER) ? result : result[KRUST]
    }

    if ((isFact = result.isFact) &&
        (result.constructor !== Object || isFact === FACTUAL) {
      return result
    }
    if ((inner_rec = InterMap.get(result))) {
      return inner_rec[INNER] ? inner_rec[COPY](true)[KRUST] : result
    }
    return CopyObject(result, true)
  }

  DefineProperty($func, "name", VisibleConfiguration)
  $func.name = OriginalFunc.name
  $func.isFact = $func.isImmutable = true
  return SetImmutable($func)
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

function Create_COPY(_Blank) {
  return function COPY(
    asImmutable, visited = CopyLog(), _target = _Blank(), exceptSelector
  ) {
    const  target = _target.$

    visited.pairing(this.$, target) // to manage cyclic objects

    if (_target._initFrom_ === _InitFrom_) {
      _target._initFrom_(this, visited, exceptSelector, asImmutable)
    } else {
      _target._initFrom_(this, visited, exceptSelector)
      if (asImmutable) { BeImmutable(_target, true) }
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
  _root[COPY]        = Create_COPY(_Blank)

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
