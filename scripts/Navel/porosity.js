




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




function Outer() {}

const Outer_prototype = Outer.prototype = SpawnFrom(DefaultBehavior)
const Impermeable     = new Outer()


// Setting on things in not allowed because the setting semantics are broken.
// For our model, the return value should always be the receiver, or a copy
// of the receiver, with the property changed.

// Further, note that the return value of a set always returns the value that
// was tried to be set to, regardless of whether it was successful or not.

Outer_prototype.set = function set($outer, property, value, $rind) {
  return DirectAssignmentFromOutsideError($rind) || false
  // return InterMap.get($rind)._externalWrite(property, value) || false
}


// getOwnPropertyDescriptor ($outer, property) {
//   switch (property[0]) {
//     case "_"       : return $outer._externalPrivateRead(property) || undefined
//     // case undefined : if (!(property in VISIBLE_SYMBOLS)) { return false }
//     case undefined : return undefined
//   }
//   return PropertyDescriptor($outer, property)
// },

// ownKeys ($outer) { },


Impermeable.get = function get($outer, property, $rind) {
  const value = $outer[property]
  if (value !== undefined) { return value }

  const methodOuterWrapper = $outer[$IMMEDIATES][property]
  if (methodOuterWrapper) { return methodOuterWrapper.call($rind) }

  if (property[0] === "_") {
    return PrivateAccessFromOutsideError($rind, property)
  }

  const $inner = InterMap.get($rind)
  return $inner._unknownProperty.call($inner[$PULP], property)
}

// REVISIT!!!
Impermeable.has = function has($outer, property) {
  // const firstChar = (typeof property === "symbol") ?
  //   property.toString()[7] : property[0]

    switch (property[0]) {
    case "_"       :
      return PrivateAccessFromOutsideError($inner[$RIND], property) || false
    // case undefined : if (!(property in VISIBLE_SYMBOLS)) { return false }
    case undefined :
      return false
  }
  return (property in $outer)
}


function Outer_() {}

const Outer__prototype = Outer_.prototype = SpawnFrom(Outer_prototype)
const Permeable        = new Outer_()


Permeable.get = function get($outer, property, $rind) {
  const $inner = InterMap.get($rind)
  const value  = $inner[property]

  switch (typeof value) {
    default          : return value
    case "function"  : return value[$OUTER_WRAPPER] || value
    case "undefined" : break
  }

  const $method = $inner[$IMMEDIATES][property]
  if ($method) { return $method._outer.call($rind) }

  return $inner._unknownProperty.call($inner[$PULP], property)
}

// REVISIT!!!
Permeable.has = function has($outer, property) {
  const $inner = InterMap.get($outer[$RIND])
  return (property in $inner)
}



function TypeOuter($pulp, $outer, permeability) {
  this.$pulp        = $pulp
  this.$outer       = $outer
  this.permeability = permeability
}

const TypeOuter_prototype = SpawnFrom(Outer_prototype)
TypeOuter.prototype = TypeOuter_prototype

TypeOuter_prototype.get = function get(func, property, $rind) {
  return this.permeability.get(this.$outer, property, $rind)
}

TypeOuter_prototype.has = function has(func, property) {
  return this.permeability.has(this.$outer, property)
}

TypeOuter_prototype.apply = function newAsFact(func, receiver, args) {
  // return func.apply(this.$inner, args)
  // return this.$pulp.newAsFact(...args)

  // This is the same code as in newAsFact(...args)
  const  instance = this.$pulp.new(...args)
  const _instance = InterMap.get(instance)[$PULP]
  if (_instance.id == null) { _instance._setImmutable() }
  return instance
}





// UNTESTED
function MutableInner() {}

const MutableInner_prototype = MutableInner.prototype = EMPTY_OBJECT
const Mutability             = new MutableInner()

Mutability.get = function get($inner, property, $pulp) {
  const value = $inner[property]
  if (value !== undefined) { return value }

  const $method = $inner[$IMMEDIATES][property]
  if ($method) { return $method._inner.call($pulp) }

  return $inner._unknownProperty.call($inner[$PULP], property)
}


Mutability.set = function set($inner, property, value, $pulp) {
  if ($inner[IS_IMMUTABLE]) { return $pulp._invalidPulpError() }

  const onSetLoader = $inner[$SET_LOADERS][property]

  if (onSetLoader) {
    if (typeof onSetLoader !== "function")
         { property = onSetLoader                    } // selector
    else { value    = onSetLoader.call($pulp, value) } // handler
  }

  const existing = $inner[property]
  if (value === existing && HasOwnProperty.call($inner, property)) {
    return true
  }

  if (existing == null && $inner[KNOWN_PROPERTIES]) {
    delete $inner[KNOWN_PROPERTIES]
    delete $inner[$OUTER][KNOWN_PROPERTIES]
  }
  InSetProperty($inner, property, value, $pulp)
  return true
}



Mutability.deleteProperty = function deleteProperty($inner, property, $pulp) {
  const onSetLoader = $inner[$SET_LOADERS][property]

  if (onSetLoader && onSetLoader.name === "$assignmentError") {
    return onSetError.call($pulp) || true
  }

  if (HasOwnProperty.call($inner, property)) {
    delete $inner[property]
    delete $inner[$OUTER][property]
    delete $inner[KNOWN_PROPERTIES]
  }
  return true
}

// has () {
//   // hide symbols from view
// }


// BEWARE!!! The $pulp of the original target of the barrier/proxy always
// references the original pulp proxy.
function ImmutableInner() {}

const ImmutableInner_prototype = SpawnFrom(EMPTY_OBJECT)
ImmutableInner.prototype = ImmutableInner_prototype

ImmutableInner_prototype.get = Mutability.get

ImmutableInner_prototype.set = function set($inner, property, value, $pulp) {
  const onSetLoader = $inner[$SET_LOADERS][property]
  var   $target     = $inner
  var   isImmutable = true

  if (onSetLoader) {
    if (typeof onSetLoader !== "function") { property = onSetLoader } // symbol
    else {                                                            // handler
      // The loader might cause a write, invalidating the target $inner.
      value       = onSetLoader.call($pulp, value)
      $target     = $pulp[$INNER]         // Re-get the (possibly new) $inner
      isImmutable = $target[IS_IMMUTABLE] // See if loader caused a new copy
    }
  }

  const existing = $target[property]
  if (value === existing) {
    if (isImmutable || HasOwnProperty.call($target, property)) { return true }
  }

  if (isImmutable) { // After onSetLoader executes the object might
                     // have already been copied as writable!!!
    $target             = $Copy($inner, false, undefined, property)
    this.$target        = $target
    this.set            = this.retargetedSet
    this.get            = this.retargetedGet
    this.deleteProperty = this.retargetedDelete
  }

  // If was going to assigning property to self, instead assign it to the copy
  if (value === $pulp || value === $inner[$RIND]) { value = $target[$RIND] }

  if (existing == null && $target[KNOWN_PROPERTIES]) {
    delete $target[KNOWN_PROPERTIES]
    delete $target[$OUTER][KNOWN_PROPERTIES]
  }
  InSetProperty($target, property, value, $pulp)
  return true
}


ImmutableInner_prototype.deleteProperty = function deleteProperty($inner, property, $pulp) {
  var onSetLoader, permeability, $target

  onSetLoader = $inner[$SET_LOADERS][property]

  if (onSetLoader && onSetLoader.name === "$assignmentError") {
    return onSetError.call($pulp) || true
  }

  switch (property) {
    case _DELETE_IMMUTABILITY   :
      $target = $Copy($inner, false)
      break

    case _DELETE_ALL_PROPERTIES :
      permeability = $inner[$PERMEABILITY]
      $target = $inner[$BLANKER](permeability)
      if (permeability === Permeable) { $target[$PERMEABILITY] = Permeable }
      break

    default :
      if (!HasOwnProperty.call($inner, property)) { return true }
      $target = $Copy($inner, false, undefined, property)
      break
  }

  this.$target        = $target
  this.set            = this.retargetedSet
  this.get            = this.retargetedGet
  this.deleteProperty = this.retargetedDelete

  delete $target[KNOWN_PROPERTIES]
  delete $target[$OUTER][KNOWN_PROPERTIES]
  return true
}

ImmutableInner_prototype.retargetedGet = function retargetedGet($inner, property, $pulp) {
  // Note: Could have simply done the following line, but gets need to be fast,
  // so reimplemented it here.
  // return Mutability.get(this.$target, property, $target[$PULP])

  const $target = this.$target
  const value = $target[property]
  if (value !== undefined) { return value }

  const $method = $target[$IMMEDIATES][property]
  if ($method) { return $method._inner.call($target[$PULP]) }

  return $target._unknownProperty.call($target[$PULP], property)
}

ImmutableInner_prototype.retargetedSet = function retargetedSet($inner, property, value, $pulp) {
  const $target = this.$target
  return Mutability.set($target, property, value, $target[$PULP])
}

ImmutableInner_prototype.retargetedDelete = function retargetedDelete($inner, property, $pulp) {
  const $target = this.$target
  return Mutability.deleteProperty($target, property, $target[$PULP])
}



// CHECK THAT BARRIER WORK ON TYPE PROXIES, IMMUTABLE AS WELL AS MUTABLE!!!
function TypeInner($target) {
  this.$target = $target
  // this.$pulp  = $pulp // this is the proxy, which is now set from the outside
}

const TypeInner_prototype = TypeInner.prototype = SpawnFrom(MutableInner_prototype)


TypeInner_prototype.get = function get(func, property, $pulp) {
  // Note: Could reimplement it here is following call is too slow.
  return Mutability.get(this.$target, property, $pulp)
}

TypeInner_prototype.set = function set(func, property, value, $pulp) {
  return Mutability.set(this.$target, property, value, $pulp)
}

TypeInner_prototype.has = function has(func, property, $pulp) {
  return (property in this.$target)
}

TypeInner_prototype.deleteProperty = function deleteProperty(func, property, $pulp) {
  return Mutability.deleteProperty(this.$target, property, $pulp)
}

TypeInner_prototype.apply = function newAsFact(func, receiver, args) {
  // return func.apply(this.$target, args)
  // return this.$pulp.newAsFact(...args)

  // This is the same code as in newAsFact(...args)
  const  instance = this.$pulp.new(...args)
  const _instance = InterMap.get(instance)[$PULP]
  if (_instance.id == null) { _instance._setImmutable() }
  return instance
}


// TypeInner.prototype = SpawnFrom(DefaultBehavior)




// REVISIT!!!
function SetSuperPropertyFor($inner, property) {
  const ancestors = $inner.type.ancestry
  const supers    = $inner[$SUPERS]
  var next, $type, nextProperties, value, mode, handler, _super

  next = ancestors.length
  if (!$inner._hasOwn(property)) { next-- }

  while (next--) {
    $type          = InterMap.get(ancestors[next])
    nextProperties = $type._properties
    value          = nextProperties[property]

    if (value !== undefined) {
      if (value && value.type === Method) {
        mode    = value.mode
        handler = value.super

        if (mode.isImmediate) {
          supers[$IMMEDIATES][property] = handler
          return (supers[property] = IMMEDIATE)
        }
        return (supers[property] = handler)
      }
      return (supers[property] = value)
    }
  }
  return (supers[property] = NO_SUPER)
}


function Super() {}

const Super_prototype = SpawnFrom(DefaultBehavior)
Super.prototype = Super_prototype

Super_prototype.get = function get($inner, property, $super) {
  const supers = $inner[$SUPERS]
  var   value = supers[property]

  do {
    switch (value) {
      case undefined :
        value = SetSuperPropertyFor($inner, property)
        break

      case IMMEDIATE :
        return supers[$IMMEDIATES][property].call($inner[$PULP])

      case NO_SUPER  :
        return $inner._unknownProperty.call($inner[$PULP], property)

      default :
        return value
    }
  } while (true)
}


// const OwnSuperBehavior = {
//   __proto__ : SuperBehavior,
//
//   get ($inner, property, target) {
//     // const supers = $inner[SUPERS]
//     // const value =
//     //
//     // if (property in supers) {
//     //   let sharedSupers = supers[SUPERS]
//     //   if (sharedSupers !== supers) { // instance has its own SUPERS
//     //     if (!(property in sharedSupers)) {
//     //
//     //     }
//     //
//     //   }
//     //   value = supers[property]
//     // }
//     // else {
//     //   value = SetSuperPropertyFor($inner, property)
//     // }
//     // return (value === NO_SUPER) ?
//     //   ($inner._unknownProperty ?
//     //     $inner[$PULP]._unknownProperty(property) : undefined) :
//     //   (value && value[$SECRET] === $INNER ?
//     //     value.handler.call($inner[$PULP]) : value)
//   }
// }
