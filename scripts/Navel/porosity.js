


// UNTESTED
const BaseOuterBehavior = {
  __proto__ : null,

  get (base$root, selector, $outer) {
    const $inner = InterMap.get($outer[$RIND])
    if (selector[0] === "_") {
      return PrivateAccessFromOutsideError($inner[$RIND], selector)
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
const DefaultBehavior = {
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

const Outer_prototype = Outer.prototype = SpawnFrom(DefaultBehavior)


// Setting on things in not allowed because the setting semantics are broken.
// For our model, the return value should always be the receiver, or a copy
// of the receiver, with the property changed.

// Further, note that the return value of a set always returns the value that
// was tried to be set to, regardless of whether it was successful or not.

Outer_prototype.set = function set($outer, selector, value, $rind) {
  return DirectAssignmentFromOutsideError($rind) || false
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
    case "_"       :
      return PrivateAccessFromOutsideError($inner[$RIND], selector) || false
    // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
    case undefined :
      return false
  }
  return (selector in $outer)
}


const Permeable = new Outer("Permeable")

Permeable.get = function get($outer, selector, $rind) {
  const $method = $outer[$IMMEDIATES][selector]
  if ($method) { return $method.outer.call($rind) }

  const $inner = InterMap.get($rind)
  const value  = $inner[selector]
  return (typeof value !== "function") ? value : value.outer || value
}

Permeable.has = function has($outer, selector) {
  const $inner = InterMap.get($outer[$RIND])
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

TypeOuter_prototype.apply = function newAsFact(func, receiver, args) {
  // return func.apply(this.$inner, args)
  // return this.$pulp.newAsFact(...args)

  // This is the same code as in newAsFact(...args)
  const instance = this.$pulp.new(...args)
  if (instance.id == null) { instance.beImmutable }
  return instance
}





// UNTESTED
function MutableInner() {}

const MutableInner_prototype = MutableInner.prototype = EMPTY_OBJECT
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
    delete $inner[$OUTER][KNOWN_PROPERTIES]
  }

  switch (typeof value) {
    // case "undefined" :
    // AssignmentOfUndefinedError($inner[$RIND])
    //   break

    case "object" :
      if (!isPublic) { break }

      if (value === null || value[IS_IMMUTABLE] || value.id != null) { }
      else if (value === $pulp) { value = $inner[$RIND] }
      else if (value === $inner[$RIND]) { }
      else if (value === $inner[selector]) { return $pulp }
      else {
        value = ($value = InterMap.get(value)) ?
          $Copy($value, true)[$RIND] : CopyObject(value, true)
      }
      $inner[$OUTER][selector] = value
      break

    case "function" : // LOOK: will catch Type things!!!
      // Note: Checking for value.constructor is inadequate to prevent func spoofing
      switch (InterMap.get(value)) {
        default           : break
        // case WRAPPER_FUNC : return $pulp.addOwnMethod(value.method)
        case undefined    : value = AsTameFunc(value); break
      }

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
  // return Mutability.get(this.$inner, selector, $pulp)
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

TypeInner_prototype.apply = function newAsFact(func, receiver, args) {
  // return func.apply(this.$inner, args)
  // return this.$pulp.newAsFact(...args)

  // This is the same code as in newAsFact(...args)
  const instance = this.$pulp.new(...args)
  if (instance.id == null) { instance.beImmutable }
  return instance
}


// TypeInner.prototype = SpawnFrom(DefaultBehavior)



// BEWARE!!! The $pulp of the original target of the barrier/proxy always
// references the original pulp proxy.
function ImmutableInner() {}

const ImmutableInner_prototype = SpawnFrom(EMPTY_OBJECT)
ImmutableInner.prototype = ImmutableInner_prototype

ImmutableInner_prototype.get = function get($inner, selector, $pulp) {
  // Might need to put in check for $PULP selector, if so return this proxy???
  const value = $inner[selector]
  return (value !== IMMEDIATE) ? value :
    $inner[$IMMEDIATES][selector].inner.call($pulp)
}

ImmutableInner_prototype.set = function set($inner, selector, value, $pulp) {
  if ($inner[selector] !== value) {
    const $copy  = $Copy($inner, false, undefined, selector)

    $copy[$PULP][selector] = value
    this.$target           = $copy
    this.set               = this.retargetedSet
    this.get               = this.retargetedGet
    this.deleteProperty    = this.retargetedDelete
  }
  return true
}

ImmutableInner_prototype.deleteProperty = function deleteProperty($inner, selector, $pulp) {
  var $copy
  switch (selector) {
    case _DELETE_IMMUTABILITY   : $copy = $Copy($inner, false); break
    case _DELETE_ALL_PROPERTIES : $copy = $inner[$BLANKER]()  ; break
    default :
      if (!$inner._hasOwn(selector)) { return true }
      $copy = $Copy($inner, false, undefined, selector)
      break
  }

  this.$target         = $copy
  this.set            = this.retargetedSet
  this.get            = this.retargetedGet
  this.deleteProperty = this.retargetedDelete
  return true
}

ImmutableInner_prototype.retargetedGet = function retargetedGet($inner, selector, $pulp) {
  // DOUBLE CHECK THIS!!!
  const $target = this.$target
  const value   = $target[selector]
  return (value !== IMMEDIATE) ? value :
    $target[$IMMEDIATES][selector].inner.call($target[$PULP])
}

ImmutableInner_prototype.retargetedSet = function retargetedSet($inner, selector, value, $pulp) {
  this.$target[$PULP][selector] = value
  return true
}

ImmutableInner_prototype.retargetedDelete = function retargetedDelete($inner, selector, $pulp) {
  delete this.$target[$PULP][selector]
  return true
}




class SuperInnerMethod {
  apply (func, receiver, args) {
    return func.apply(receiver[$PULP], args)
  }
}

const SuperMethodPorosity = new SuperInnerMethod()

// REVISIT!!!
function SetSuperPropertyFor($inner, selector) {
  const ancestors = $inner.type.ancestry
  const supers    = $inner[$SUPERS]
  var   next      = ancestors.length
  var   type$inner, nextProperties, value

  if ($inner._hasOwn(selector)) { next++ }

  while (next--) {
    let type$inner = InterMap.get(ancestors[next])
    let nextProperties = type$inner._properties

    if (selector in nextProperties) {
      value = nextProperties[selector]

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


const SuperBehavior = {
  __proto__ : DefaultBehavior,

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
}


const OwnSuperBehavior = {
  __proto__ : SuperBehavior,

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
