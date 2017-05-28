


// UNTESTED
const BaseOuterBehavior = {
  __proto__ : null,

  get (base$root, selector, $outer) {
    const $inner = InterMap.get($outer[$RIND])
    if (selector[0] === "_") {
      if ($inner._externalPrivateAccess) {
        return $inner[$PULP]._externalPrivateAccess(selector)
      }
    }
    return $inner._noSuchProperty ?
      $inner[$PULP]._noSuchProperty(selector) : undefined
  },
  // getPrototypeOf (base$root) { return base$root }
}

const BaseInnerBehavior = {
  __proto__ : null,

  get (base$root, selector, $inner) {
    return $inner._noSuchProperty ?
      $inner[$PULP]._noSuchProperty(selector) : undefined
  },

  // getPrototypeOf (base$root) { return base$root }
}



// UNTESTED
const DefaultPermeability = {
  __proto__      : null        ,
  getPrototypeOf : ALWAYS_NULL ,
  setPrototypeOf : ALWAYS_FALSE,
  defineProperty : ALWAYS_FALSE,
  deleteProperty : ALWAYS_FALSE,
  isExtensible   : ALWAYS_FALSE,
  // preventExtensions ???
}




function Outer(id) {
  this.id = id
}

const Outer_prototype = Outer.prototype = SpawnFrom(DefaultPermeability)


// Setting on things in not allowed because the setting semantics are broken.
// For our model, the return value should always be the receiver, or a copy
// of the receiver, with the property changed.

// Further, note that the return value of a set always returns the value that
// was tried to be set to, regardless of whether it was successful or not.

Outer_prototype.set = function set($outer, selector, value, $rind) {
  SignalError($rind, "Assignment is not allowed to the outside of an object, use a setter instead!")
  return false
  // return InterMap.get($rind)._externalWrite(selector, value) || false
}


// getOwnPropertyDescriptor ($outer, selector) {
//   switch (selector[0]) {
//     case "_"       : return $outer._externalPrivateRead(selector) || undefined
//     // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
//     case undefined : return undefined
//   }
//   return PropertyDescriptor($outer, selector)
// },

// ownKeys ($outer) { },



const Impermeable = new Outer("Impermeable")

Impermeable.get = function get($outer, selector, $rind) {
  const value = $outer[selector]
  return (value !== IMMEDIATE) ? value :
    $outer[$IMMEDIATES][selector].outer.call($rind)
}

Impermeable.has = function has($outer, selector) {
  // const firstChar = (typeof selector === "symbol") ?
  //   selector.toString()[7] : selector[0]
  switch (selector[0]) {
    case "_"       : return $outer._externalPrivateRead(selector) || false
    // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
    case undefined : return false
  }
  return (selector in $outer)
}


const Permeable = new Outer("Permeable")

Permeable.get = function get($outer, selector, $rind) {
  const method = $outer[$IMMEDIATES][selector]
  if (method) { return method.outer.call($rind) }

  if (selector in $outer) { return $outer[selector] }

  const $inner = InterMap.get($rind)

  if (selector in $inner) {
    const value = $inner[selector]
    if (typeof value !== "function") {
      return (value === $inner[$PULP]) ? $rind : value
    }

    const marker = InterMap.get(value)
    return marker.isMethod ? marker.outer : value
  }

  return $outer[selector]
}

Permeable.has = function has($outer, selector) {
  return (selector in $inner)
}



function TypeOuter($pulp, $outer, permeability) {
  this.$pulp        = $pulp
  this.$outer       = $outer
  this.permeability = permeability
}

const TypeOuter_prototype = SpawnFrom(Outer_prototype)
TypeOuter.prototype = TypeOuter_prototype

TypeOuter_prototype.get = function get(disguisedFunc, selector, $rind) {
  return this.permeability.get(this.$outer, selector, $rind)
}

TypeOuter_prototype.has = function has(disguisedFunc, selector) {
  return this.permeability.has(this.$outer, selector)
}

TypeOuter_prototype.apply = function apply(func, receiver, args) {
  // return func.apply(this.$inner, args)
  // return this.$pulp.newAsFact(...args)

  // This is the same code as in newAsFact(...args)
  let instance = this.$pulp.new(...args)
  if (instance.id == null) { instance.beImmutable }
  return instance
}





// UNTESTED
function MutableInner() {}

const MutableInner_prototype = MutableInner.prototype = SpawnFrom(null)
const Mutability = new MutableInner()

Mutability.get = function get($inner, selector, $pulp) {
  const value = $inner[selector]
  return (value !== IMMEDIATE) ? value :
    $inner[$IMMEDIATES][selector].inner.call($pulp)
}


Mutability.set = function set($inner, selector, value, $pulp) {
  const loader   = $inner[$SET_LOADERS][selector]
  const newValue = (loader) ? loader.call($pulp, value) : value
  InSetProperty($inner, selector, newValue, $pulp)
  return true
}

function InSetProperty($inner, selector, value, $pulp) {
  const isPublic = (selector[0] !== "_")

  if (!(selector in $inner)) {
    // Consider making id invisible, and ensuring that id is only set thru a special method here!!!
    delete $inner[KNOWN_PROPERTIES]
  }

  switch (typeof value) {
    case "object" :
      if (!isPublic) { break }

      if (value === $pulp) {  // Perhaps will force assignments to always be target!!!
        $inner[selector] = $pulp
        value = $inner[$RIND]
      }
      else if (value === null || value[IS_IMMUTABLE] || value.id != null) {
        $inner[selector] = value
      }
      else if (value === $inner[selector]) { return $pulp }

      else if (value === $inner[$RIND]) {
        $inner[selector] = $pulp
      }
      else if ((value$inner = InterMap.get(value))) {
        $inner[selector] = (value = value$inner[COPY](true)[$RIND])
      }
      else {
        $inner[selector] = value // (value = CopyObject(value, true))
      }
      $inner[$OUTER][selector] = value
      return $pulp

    case "function" : // LOOK: will catch Type things!!!
      // NOTE: Checking for value.constructor is inadequate to prevent func spoofing
      value = (InterMap.get(value)) ? value : AsTameFunc(value)

      // if (selector === "_initFrom_") {
      //   value = ((tag = InterMap.get(value)) && tag === "_initFrom_") ?
      //     value : Wrap_initFrom_(value)
      // }
      // else {
      //   value = (InterMap.get(value)) ? value : TameFunc(value)
      // }

      // break omitted
    default :
      if (isPublic) { $inner[$OUTER][selector] = value }
      break
  }

  $inner[selector] = value
  return $pulp
}

Mutability.deleteProperty = function deleteProperty($inner, selector, $pulp) {
  // const selector = SymbolPropertyMap[symbol]
  //
  // if (selector === undefined) {
  //   const message = "Use property setter instead of delete!"
  //   return SignalError($pulp, message)
  // }

  if (selector in $inner) {
    delete $inner[selector]
    delete $inner[KNOWN_PROPERTIES]
    delete $inner[$OUTER][selector]
  }
  return true
}

// has () {
//   // hide symbols from view
// }


// CHECK THAT BARRIER WORK ON TYPE PROXIES!!!

function TypeInner($inner) {
  this.$inner = $inner
  // this.$pulp  = $pulp // this is the proxy, which is now set from the outside
}

const TypeInner_prototype = TypeInner.prototype = SpawnFrom(MutableInner_prototype)


TypeInner_prototype.get = function get(disguisedFunc, selector, $pulp) {
  // Double check this!!!
  const $inner = this.$inner
  const value  = $inner[selector]
  return (value !== IMMEDIATE) ? value :
    $inner[$IMMEDIATES][selector].inner.call($pulp)
}

TypeInner_prototype.set = function set(disguisedFunc, selector, value, $pulp) {
  return Mutability.set(this.$inner, selector, value, $pulp)
  // return Mutability.set(this.$inner, selector, value, $pulp)
}

TypeInner_prototype.has = function has(disguisedFunc, selector, $pulp) {
  return (selector in this.$inner)
}

TypeInner_prototype.deleteProperty = function deleteProperty(disguisedFunc, selector, $pulp) {
  return Mutability.deleteProperty(this.$inner, selector, $pulp)
  // return Mutability.deleteProperty(this.$inner, selector, $pulp)
}

TypeInner_prototype.apply = function apply(func, receiver, args) {
  // return func.apply(this.$inner, args)
  // return this.$pulp.newAsFact(...args)

  // This is the same code as in newAsFact(...args)
  let instance = this.$pulp.new(...args)
  if (instance.id == null) { instance.beImmutable }
  return instance
}


// TypeInner.prototype = SpawnFrom(DefaultPermeability)




function ImmutableInner($inner) {
  $inner[$PULP] = new Proxy($inner, this)
  this.inUse    = false
  this.target   = $inner
}

const ImmutableInner_prototype = ImmutableInner.prototype = SpawnFrom(null)

ImmutableInner_prototype.get = function get($inner, selector, $pulp) {
  const value = $inner[selector]
  return (value !== IMMEDIATE) ? value :
    $inner[$IMMEDIATES][selector].inner.call($pulp)
}

ImmutableInner_prototype.set = function set($inner, selector, value, $pulp) {
  if ($inner[selector] !== value) {
    const copy = $pulp.mutableCopyExcept(selector) // Check returns rind|pulp

    copy[selector]      = value
    this.target         = InterMap.get(copy)
    this.set            = this.retargetedSet
    this.get            = this.retargetedGet
    this.deleteProperty = this.retargetedDelete
  }
  return true
}

ImmutableInner_prototype.deleteProperty = function deleteProperty($inner, selector, $pulp) {
  let copy
  switch (selector) {
    case "_IMMUTABILITY" : copy = $inner.asMutableCopy; break
    case "_ALL"          : copy = $inner._newBlank()  ; break
    default :
      if (!$inner._hasOwn(selector)) { return true }
      copy = $pulp.mutableCopyExcept(selector)
      break
  }

  this.target         = InterMap.get(copy)
  this.set            = this.retargetedSet
  this.get            = this.retargetedGet
  this.deleteProperty = this.retargetedDelete
  return true
}

ImmutableInner_prototype.retargetedGet = function retargetedGet($inner, selector, $pulp) {
  const target$inner = this.target
  const value        = target$inner[selector]
  return (value !== IMMEDIATE) ? value :
    target$inner[$IMMEDIATES][selector].inner.call(target$inner[$PULP])

  return this.target[selector]
}

ImmutableInner_prototype.retargetedSet = function retargetedSet($inner, selector, value, $pulp) {
  this.target[$PULP][selector] = value
  return true
}

ImmutableInner_prototype.retargetedDelete = function retargetedDelete($inner, selector, $pulp) {
  delete this.target[$PULP][selector]
  return true
}




class SuperInnerMethod {
  apply (func, receiver, args) {
    return func.apply(receiver[$PULP], args)
  }
}

const SuperMethodPorosity = new SuperInnerMethod()


function SetSuperPropertyFor($inner, selector) {
  let ancestors = $inner.type.ancestry
  let next      = ancestors.length
  let supers    = $inner[$SUPERS]

  if ($inner._hasOwn(selector)) { next++ }

  while (next--) {
    let type$inner = InterMap.get(ancestors[next])
    let nextProperties = type$inner._properties

    if (selector in nextProperties) {
      const value = nextProperties[selector]

      if (value && value.isMethod) {
        if (value.mode.isImmediate) {
          supers[$IMMEDIATES][selector] = value.super
          return (supers[selector] = IMMEDIATE)
        }
        return (supers[selector] = value.super)
      }
      return (supers[selector] = value)
    }
  }

  return (supers[selector] = NO_SUPER)
}


const SuperPorosity = {
  __proto__ : null,

  get ($inner, selector, target) {
    const supers = $inner[$SUPERS]
    const value = (selector in supers) ?
      supers[selector] : SetSuperPropertyFor($inner, selector)

    switch (value) {
      case NO_SUPER  :
        return $inner._noSuchProperty ?
          $inner[$PULP]._noSuchProperty(selector) : undefined
      case IMMEDIATE :
        return supers[$IMMEDIATES][selector].call($inner[$PULP])
      default :
        return value // if method, answer sf|sx|sl wrapper handler
    }
      //
      // (value && value[$SECRET] === $INNER ?
      //   value.handler.call($inner[$PULP]) : value)
  },

  set            : ALWAYS_FALSE,
  getPrototypeOf : ALWAYS_NULL ,
  setPrototypeOf : ALWAYS_FALSE,
  defineProperty : ALWAYS_FALSE,
  deleteProperty : ALWAYS_FALSE,
  isExtensible   : ALWAYS_FALSE,
}


const OwnSuperPorosity = {
  __proto__ : SuperPorosity,

  get ($inner, selector, target) {
    // const supers = $inner[SUPERS]
    // const value =
    //
    // if (selector in supers) {
    //   let sharedSupers = supers[SUPERS]
    //   if (sharedSupers !== supers) { // instance has its own SUPERS
    //     if (!(selector in sharedSupers)) {
    //
    //     }
    //
    //   }
    //   value = supers[selector]
    // }
    // else {
    //   value = SetSuperPropertyFor($inner, selector)
    // }
    // return (value === NO_SUPER) ?
    //   ($inner._noSuchProperty ?
    //     $inner[$PULP]._noSuchProperty(selector) : undefined) :
    //   (value && value[$SECRET] === $INNER ?
    //     value.handler.call($inner[$PULP]) : value)
  }
}
