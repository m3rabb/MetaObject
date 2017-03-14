/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

const InterMap = new WeakMap()

const ALWAYS_FALSE = () => false
const ALWAYS_NULL = () => null

const PrivacyPermeability = {
  __proto__ : null,

  get (inner, selector, barrier_) {
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

  set (inner, selector, value, barrier_) {
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
    return GetOwnPropertyDescriptor(inner, selector)
  },

  ownKeys (inner) {
    const names = AllNames(inner).filter(name => name[0] !== "_")
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


class OutsideBarrier {
  constructor (target) {
    const outer   = SpawnFrom(null)
    outer[OBJECT] = target
    this.outer    = outer
    return new Proxy(target, this)
  }

  get (target, selector, barrier_) {
    let outer = this.outer
    let value = outer[selector]
    if (value !== undefined) { return value }

    value = target[selector]

    switch (typeof value) {
      default : return (outer[selector] = value)
      case "function" :
        return (outer[selector] =
                  (InterMap.get(value)) ? value : AsOutsideFunc(value))
      case "object" :
        if (value !== null) { break }
        return (outer[selector] = null)
    }

    objData = InterMap.get(value)

    return (outer[selector] =
      (objData && objData.isImmutable || objData[SECRET])
        ? value : new OutsideBarrier(value, objData))
  }

  set (source, selector, value, barrier_) {
    switch (typeof value) {
      default :
        outer[selector] = target[selector] = value
        return true

      case "function" :
        outer[selector] = (InterMap.get(value)) ? value : AsOutsideFunc(value)
        return true

      case "object" :
        if (value !== null) { break }
        outer[selector] = target[selector] = null
        return true
    }

    do {
      // Consider moving this check into each branch below!!!
      if (source[selector] === value && IsLocalProperty.call(source, selector)) {
        this.outer[selector] = value
        return true
      }

      switch (value[SECRET]) {
        case PARAM :
          value = value[WRITE_PARAM]
          continue

        case INNER :
          outer[selector] = target[selector] = (inner.isFact) ?
            value[OUTER_BARRIER] : value[COPY](false)[OUTER_BARRIER]
          return true

        case OUTSIDER :
          barrier = value
          object  = value[OBJECT]
          copy = CopyObject(object, false)
          target[selector] = copy
          outer [selector] = (copy === object) ?
            barrier : new OutsideBarrier(copy)
          return true

        default :  // value is outer or locally created|exposed object
          if ((objData = InterMap.get(value))) {
            if (objData[SECRET]) { value = objData; continue }
            if (objData.isImmutable) {
              outer[selector] = target[selector] = value
              return true
            }
          }
          copy = CopyObject(value, false)
          target[selector] = copy
          outer[selector] = new OutsideBarrier(copy, objData)
          return true
      }
    } while (true)
  }
}

OutsideBarrier.prototype[SECRET] = OUTSIDER


const MutableWritePermeability = {
  __proto__ : null,

  set (target, selector, value, barrier_) {
    const firstChar = selector[0]
    const isPublic  = (firstChar !== "_" && firstChar !== undefined)

    switch (typeof value) {
      default :
        target[selector] = value
        if (isPublic) { target[OUTER][selector] = value }
        return true

      case "function" :
        target[selector] = value
        if (isPublic) {
          target[OUTER][selector] =
            (InterMap.get(value)) ? value : AsOutsideFunc(value)
        }
        return true

      case "object" :
        if (value !== null) { break }
        target[selector] = null
        if (isPublic) { target[OUTER][selector] = null }
        return true
    }

    do {
      // Consider moving this check into each branch below!!!
      if (target[selector] === value) { // && IsLocalProperty.call(target, selector)
        if (isPublic) { target[OUTER][selector] = value }
        return true
      }

      switch (value[SECRET]) {
        case PARAM :
          value = value[isPublic ? WRITE_PARAM_AS_FACT : WRITE_PARAM]
          continue

        case INNER :
          if (isPublic) {
            inner = value.isFact ? value : value[COPY](true)
            target[selector] = inner
            target[OUTER][selector] = inner[OUTER_BARRIER]
          }
          else {
            target[selector] = value
          }
          return true

        case OUTSIDER :
          barrier = value
          object  = value[OBJECT]

          if (isPublic) {
            copy = CopyObject(object, true)
            if (copy === object) { barrier = new OutsideBarrier(copy) }
            target[OUTER][selector] = target[selector] = barrier
          }
          else {
            target[selector] = barrier
          }
          return true

        default :  // value is outer or locally created|exposed object
          if (isPublic) {
            target[OUTER][selector] = target[selector] =
              ((objData = InterMap.get(value))) ?
                (objData.isFact ? value : objData[COPY](true)[OUTER_BARRIER]) :
                CopyObject(value, true)
          }
          else {
            target[selector] = value
          }
          return true
      }
    } while (true)
  }
}



class ParamBarrier = {
  // When outer, set both
  // When inner, only set inner
  // When obj, only set param
  constructor (param, inner) {
    this.param = param
    this.inner = inner
    return new Proxy(param, this)
  }

  setMutableCopy (param, inner) {
    copy = (inner) ?
      (param ? inner[COPY](false)[OUTER_BARRIER] : inner[COPY](false)) :
      CopyObject(this.param, false))

    this.set = this.setOnFact
    this.get = this.getOnFact
    this.deleteProperty = this.deleteOnFact
    return (this.param = copy)
  }

  setFactCopy (param, inner) {
    copy = (inner) ?
      (param ? inner[COPY](true)[OUTER_BARRIER] : inner[COPY](true)) :
      CopyObject(this.param, true))

    this.set = this.setOnFact
    this.get = this.getOnFact
    this.deleteProperty = this.deleteOnFact
    return (this.fact = copy)
  }

  getOnFixed (param_, selector, barrier_) {
    switch (selector) {
      case SECRET              : return PARAM
      case WRITE_PARAM_AS_FACT : return this.setFactCopy(this.param, this.inner)
      case WRITE_PARAM      : return this.setMutableCopy(this.param, this.inner)
      default                  : return param[selector]
    }
  }

  setOnFixed (param_, selector, value, barrier_) {
    inner = this.inner
    param = this.param
    target = inner || param
    if (target[selector] !== value || !IsLocalProperty.call(target, selector)) {
      this.setMutableCopy(param, inner)[selector] = value
    }
    return true
  }

  deleteOnFixed (param_, selector, barrier_) {
    inner = this.inner
    param = this.param
    if (IsLocalProperty.call(inner || param, selector)) {
      delete setMutableCopy(param, inner)[selector]
    }
    return true
  }

  getOnMutable (param_, selector, barrier_) {
    switch (selector) {
      case SECRET              : return PARAM
      case WRITE_PARAM_AS_FACT : return this.setFactCopy(this.target, this.inner)
      case WRITE_PARAM      : return this.setMutableCopy(this.param, this.inner)
      default                  : return param[selector]
    }
  }

  setOnCopy (param_, selector, value, barrier_) {
    this.param[selector] = value
    return true
  }

  deleteOnCopy (param_, selector, barrier_) {
    delete this.param[selector]
    return true
  }

  getOnFact (param, selector, barrier_) {
    switch (selector) {
      case SECRET :
        return PARAM

      case WRITE_PARAM_AS_FACT :
        return this.param

      case WRITE_PARAM :
        inner = this.inner
        copy = inner ? this.param[COPY](false) : CopyObject(this.param, false))
        this.set = this.setOnCopy
        this.get = this.getOnCopy
        this.deleteProperty = this.detourDelete
        return (this.param = copy)

      default :
        return this.param[selector]
    }
  }

  factSet (param, selector, value, barrier_) {
    this.param[selector] = value
    return true
  }

  factDelete (param, selector, barrier_) {
    delete this.param[selector]
    return true
  }
}




Thing.addSGetter(function _captureChanges() {
  if (this[IS_FACT] === IMMUTABLE) {
    delete this._$captureChanges_triggerPin
    return this
  }
  DefineProperty(this, "_captureChanges", InvisibleConfiguration)
  return (this._captureChanges = this)
})

Thing.addSGetter(function _captureOverwrite() {
  if (this[IS_FACT] === IMMUTABLE) {
    delete this._$captureOverwrite_triggerPin
    return this
  }
  DefineProperty(this, "_captureOverwrite", InvisibleConfiguration)
  return (this._captureOverwrite = this)
})



class ImmutableWritePermeability {
  constructor (inner) {
    this.inner = inner
    this.isInUse = false
    this.barrier = new Proxy(target, this)
  }

  set (inner, selector, value, barrier_) {
    if (inner[selector] !== value) {
      (this.inner = inner.asMutableCopy)[selector] = value
      this.set = this.detourSet
      this.get = this.detourGet
      this.deleteProperty = this.detourDelete
    }
    return true
  }

  deleteProperty (inner, selector, barrier_) {
    if (selector === "_$captureChanges_triggerPin") {
      this.inner = inner.asMutableCopy
    }
    else if (selector === "_$captureOverwrite_triggerPin") {
      this.inner = inner._newBlank()
    }
    else if (IsLocalProperty.call(inner, selector)) {
      delete (this.inner = inner.asMutableCopy)[selector]
    }
    else { return true }

    this.set = this.detourSet
    this.get = this.detourGet
    this.deleteProperty = this.detourDelete
    return true
  }

  detourSet (inner_, selector, value, barrier_) {
    this.inner[selector] = value
    return true
  }

  detourGet (inner_, selector, barrier_) {
    return this.inner[selector]
  }

  detourDelete (inner_, selector, barrier_) {
    delete this.inner[selector]
    return true
  }
}


function EnkrustThing(thing) {
  const krust = new Proxy(thing, PrivacyPermeability)
  InterMap.set(krust, thing)
  return (thing.$ = thing[OUTER] = krust)
}

AddLazilyInstalledProperty(_Thing_root, "$", EnkrustThing)




function MethodBarrier(OriginalMethod, IsOuter) {
  const $public = function (...args) {

    receiver = InterMap.get(this)

    if (receiver && (permeability = receiver[IMMUTABLE_WRITE_PERMEABILITY])) {
      if (permeability.isInUse) {
        permeability = new ImmutableWritePermeability(receiver)
      }
      permeability.isInUse = true
      target = permeability.barrier
    }
    else {
      target = receiver
    }

    next = args.length
    params = []
    while (next--) {
      arg = args[next]

      switch (typeof arg) {
        default :
          params[next] = value
          break

        case "function" :
          objData = InterMap.get(value)
          params[next] = (objData && objData.isOuter === IsOuter) ?
            value : FuncBarrier(value, IsOuter)
          break

        case "object" :
          switch (arg[SECRET]) {
            case PARAM :
              params[next] = new arg[PARAM_TYPE](arg[OBJECT], arg[FACT])
              break

            case OUTSIDER :
              params[next] = new ObjectParamBarrier(arg)
              break

            case INNER :
              params[next] = new InnerParamBarrier(arg)
              break

            default :
              if ((objData = InterMap.get(arg))) {
                if (objData[SECRET]) {
                  params[next] = objData.isFact ? arg : new OuterParamBarrier(arg)
                  break
                }
                if (objData.isImmutable) {
                  params[next] = arg
                  break
                }
              }
              if (IsOuter) { arg = new OutsideBarrier(arg) }
              params[next] = new ObjectParamBarrier(arg)
              break
          }
          break
      }
    }

    result = OriginalMethod.apply(target, ...params)

    if (typeof result !== "object" || result === null) { return result }

    if (result === target) {
      if (permeability) {
        result = permeability.inner
        if (result !== receiver) {
          permeability.inner = receiver  // reset permeability
          result.beImmutable
        }
        permeability.isInUse = false
      }
      return IsOuter ? result[OUTER_BARRIER] : result
    }

    if (result[SECRET]) {  // Inner
      final = (result.isFact) ? result : result[COPY](true)
      return IsOuter ? final[OUTER_BARRIER] : final
    }
    if ((objData = InterMap.get(result))) {
      return (objData.isFact) ? result : objData[COPY](true)[OUTER_BARRIER]
    }
    return CopyObject(result, true)
  }

  DefineProperty($public, "name", VisibleConfiguration)
  $public.name = OriginalMethod.name
  $public.isFact = $public.isImmutable = true
  return SetImmutable($public)
}

function FuncBarrier(OriginalFunc, IsOuter) {
  const $public = function (...args) {

    receiver = InterMap.get(this)

    if (receiver && (permeability = receiver[IMMUTABLE_WRITE_PERMEABILITY])) {
      if (permeability.isInUse) {
        permeability = new ImmutableWritePermeability(receiver)
      }
      permeability.isInUse = true
      target = permeability.barrier
    }
    else {
      target = receiver
    }

    next = args.length
    params = []
    while (next--) {
      arg = args[next]

      switch (typeof arg) {
        default :
          params[next] = value
          break

        case "function" :
          objData = InterMap.get(value)
          params[next] = (objData && !IsOuter || objData.isOuter) ?
            value : FuncBarrier(value, IsOuter)
          break

        case "object" :
          do {
            switch (arg[SECRET]) {
              case PARAM :
                arg = IsOuter ? arg[CURRENT] : // this needs to do a lot!!!
                  new arg[PARAM_TYPE](arg[OBJECT], arg[FACT])
                continue

              case OUTSIDER :
                params[next] = IsOuter ? CopyObject(arg[OBJECT], false) :
                  new ObjectParamBarrier(arg)
                break

              case INNER :
                params[next] = IsOuter ?
                  arg.isFact ? arg : arg[COPY](false)[OUTER_BARRIER] :
                  new InnerParamBarrier(arg)
                break

              default :
                if ((objData = InterMap.get(arg))) {
                  if (objData[SECRET]) {
                    params[next] =
                      objData.isFact ? arg :
                      IsOuter ?
                        objData[COPY](false)[OUTER_BARRIER] :
                        new OuterParamBarrier(arg)
                    break
                  }
                  if (objData.isImmutable) {
                    params[next] = arg
                    break
                  }
                }
                params[next] = (IsOuter) ?
                  CopyObject(arg, false) : new ObjectParamBarrier(arg)
                break
            }
          } while (true)
          break
      }
    }

    result = OriginalFunc.apply(target, ...params)

    if (typeof result !== "object" || result === null) { return result }

    if (result === target) {
      if (permeability) {
        result = permeability.inner
        if (result !== receiver) {
          permeability.inner = receiver  // reset permeability
          result.beImmutable
        }
        permeability.isInUse = false
      }
      return result[OUTER_BARRIER]
    }

    if (result[SECRET]) {  // Inner
      final = (result.isFact) ? result : result[COPY](true)
      return final[OUTER_BARRIER]
    }
    if ((objData = InterMap.get(result))) {
      return (objData.isFact) ? result : objData[COPY](true)[OUTER_BARRIER]
    }
    return CopyObject(result, true)
  }

  DefineProperty($public, "name", VisibleConfiguration)
  $public.name = OriginalFunc.name
  $public.isFact = $public.isImmutable = true
  return SetImmutable($public)
}

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
