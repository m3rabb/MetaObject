// "use strict"

// UNTESTED
const OuterBaseBehavior = {
  __proto__ : null,

  get (base_root, selector, outer) {
    return InterMap.get(outer[RIND])[INNER]._noSuchProperty(selector)
  },

  getPrototypeOf (base_root) { return base_root }
}

// UNTESTED
const CoreBaseBehavior = {
  __proto__ : null,

  get (base_root, selector, core) {
    return core[INNER]._noSuchProperty(selector)
  },

  getPrototypeOf (base_root) { return base_root }
}


const InterMap = new WeakMap()


const Base_root                = SpawnFrom(null)
// const   Stash_root          = SpawnFrom(Base_root)

const   Outer_base             = new Proxy(Base_root, OuterBaseBehavior)
const     Outer_root           = SpawnFrom(Outer_base)

const   Core_base              = new Proxy(Base_root, CoreBaseBehavior)
const     Core_root            = SpawnFrom(Core_base)
const       Thing_core         = SpawnFrom(Core_root)
const       Type_core          = SpawnFrom(Core_root)
const       Method_core        = SpawnFrom(Core_root)


//const       Nothing_core_root    = SpawnFrom(Something_core_root)
// const         Context_root  = SpawnFrom(Top_root)
// const         Name_root     = SpawnFrom(Top_root)


// Just in case sanity failsafe to prevent infinite recursion from CoreBaseBehavior
Core_root[INNER]  = Core_root

// This secret is only known by inner objects
Core_root[SECRET] = INNER


const ErrorLog = []

let HandleErrorsQuietly = true
let LogErrors           = false

// let HandleInheritancePoisoning = true


function SignalError(target, message) {
  if (LogErrors) { ErrorLog.push(`${target}: ${message}`) }

  if (HandleErrorsQuietly) {
    console.warn(message) // eslint-disable-line no-console
  } else {
    const error = new Error(message)
    error.name = "Purple Carrot Error"
    error.target = target
    throw error
  }
  return null
}



function InAtPut(target, selector, func) {
  target[selector] = func
}

function InPutMethod(target, namedFunc) {
  target[namedFunc.name] = namedFunc
}


// NOTE: Delete these after bootstrap is fully complete
InPutMethod(Outer_root, function _noSuchProperty(selector) {
  return undefined
})

InPutMethod(Core_root, Outer_root._noSuchProperty)

// _hasOwn
InAtPut(Core_root, "_hasOwn", InHasSelector)



// UNTESTED
function WrapFunc(OriginalFunc) {
  return function $wrappedOutsideFunc(...args) {
    const receiver =
      (this != null && this[SECRET] === INNER) ? this[RIND] : this
    return OriginalFunc.apply(receiver, args)
  }
}

// UNTESTED
function Wrap_initFrom_(OriginalFunc) {
  if (OriginalFunc.length < 4) {
    return function $_initFrom_3(_source, visited, exceptSelector_) {
      const receiver =
        (this != null && this[SECRET] === INNER) ? this[RIND] : this
      const source = (_source != null && _source[SECRET] === INNER) ?
        _source[RIND] : _source
      return OriginalFunc.apply(receiver, source, visited, exceptSelector_)
    }
  }
  return function $_initFrom_4(_source, visited, exceptSelector_, asImmutable) {
    const receiver =
      (this != null && this[SECRET] === INNER) ? this[RIND] : this
    const source = (_source != null && _source[SECRET] === INNER) ?
      _source[RIND] : _source
    return OriginalFunc.apply(
      receiver, source, visited, exceptSelector_, asImmutable)
  }
}


// UNTESTED
const PrivacyPorosity = {
  __proto__ : null,

  get (outer, selector, skin) {
    let target, index

    return (outer.atIndex && ((index = +selector) === index)) ?
      outer.atIndex(index) : outer[selector]
  },

  // Setting on things in not allowed because the setting semantics are broken.
  // For our model, the return value should always be the receiver, or a copy
  // of the receiver, with the property changed.

  // Further, note that the return value of a set always returns the value that
  // was tried to be set to, regardless of whether it was successful or not.

  set (outer, selector, value, skin) {
    return false
    // return InterMap.get(skin)._externalWrite(selector, value) || false
  },

  has (outer, selector) {
    switch (selector[0]) {
      case "_"       : return outer._externalPrivateRead(selector) || false
      // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
      case undefined : return false
    }
    return (selector in outer)
  },

  // getOwnPropertyDescriptor (outer, selector) {
  //   switch (selector[0]) {
  //     case "_"       : return outer._externalPrivateRead(selector) || undefined
  //     // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
  //     case undefined : return undefined
  //   }
  //   return PropertyDescriptor(outer, selector)
  // },

  // ownKeys (outer) { },

  getPrototypeOf : ALWAYS_NULL,
  setPrototypeOf : ALWAYS_FALSE,
  defineProperty : ALWAYS_FALSE,
  deleteProperty : ALWAYS_FALSE,
  isExtensible   : ALWAYS_FALSE,
  // preventExtensions ???
}

// UNTESTED
const MutableInnerPorosity = {
  __proto__ : null,

  set (core, selector, value, inner) {
    const isPublic = (selector[0] !== "_")

    // if ((core[selector] === undefined) && !core._hasOwn(selector)) {
    //   delete core[KNOWN_SELECTORS]
    // }

    switch (typeof value) {
      case "object" :
        if (!isPublic) { break }

        if (value === inner) {
          core[selector] = value
          value = core[RIND]
        }
        else if (value === null || value[IS_IMMUTABLE] || value.id != null) {
          core[selector] = value
        }
        else if (value === core[selector]) {/* NOP */}

        else if ((valueCore = InterMap.get(value))) {
          core[selector] = (value = valueCore[COPY](true, visited)[RIND])
        }
        else {
          core[selector] = (value = CopyObject(value, true))
        }
        core[OUTER][selector] = value
        return true

      case "function" : // LOOK: will catch Type things!!!
        // NOTE: Checking for value.constructor is inadequate to prevent func spoofing
        if (selector === "_initFrom_") {
          value = ((tag = InterMap.get(value)) && tag === "_initFrom_") ?
            value : Wrap_initFrom_(value)
        }
        else {
          value = (InterMap.get(value)) ? value : WrapFunc(value)
        }
        // break omitted

      default :
        if (isPublic) { core[OUTER][selector] = value }
        break
    }

    core[selector] = value
    return true
  },

  deleteProperty (core, selector, inner) {
    if ((core[selector] !== undefined) || core._hasOwn(selector)) {
      delete core[KNOWN_SELECTORS]
      delete core[selector]
    }

    return true
  }
}



function CreateNamelessOuterConstructor() {
  return function () {
    this[RIND] = new Proxy(this, PrivacyPorosity)
  }
}

function OuterConstructorFor(outerRoot) {
  const constructor = CreateNamelessOuterConstructor()
  constructor.prototype = outerRoot
  return constructor
}

function CreateNamelessCoreConstructor(OuterConstructor) {
  return function () {
    const outer = new OuterConstructor()
    const rind  = outer[RIND]

    this[INNER] = new Proxy(this, MutableInnerPorosity)
    this[OUTER] = outer
    this[RIND]  = rind
    InterMap.set(rind, this)
  }
}

function CoreConstructorFor(coreRoot) {
  const outerRoot        = SpawnFrom(Outer_root)
  const outerConstructor = OuterConstructorFor(outerRoot)
  const coreConstructor  = CreateNamelessCoreConstructor(outerConstructor)
  coreConstructor.prototype = coreRoot
  return coreConstructor
}



const BlankThing  = CoreConstructorFor(Thing_core)
const BlankType   = CoreConstructorFor(Type_core)
const BlankMethod = CoreConstructorFor(Method_core)



function Create_new(BlankCore) {
  const target = {
    new : function (...args) {
      const core = new BlankCore()
      core[INNER]._init(...args)
      return core[RIND]
    }
  }
  return target.new
}

function CreateFactory(BlankCore) {
  return function (...args) {
    const core = new BlankCore()
    core[INNER]._init(...args)
    if (core.id == null) { core.beImmutable }
    return core[RIND]
  }
}


function DegenerateConstructorForNamingInDebugger(typeName, isInner) {
  const funcName = (isInner ? "_" : "") + typeName
  const funcBody = `
    return function ${funcName}() {
      const message = "This constructor is only used for debugging!"
      return SignalError(${funcName}, message)
    }
  `
  const constructor = Function(funcBody)()

  constructor[IS_IMMUTABLE] = true
  Freeze(constructor.prototype)
  return Freeze(constructor)
}








// Freeze(Base_root)
// // Freeze(Stash_root)
// Freeze(Implementation_root)
// Freeze(Inner_root)
