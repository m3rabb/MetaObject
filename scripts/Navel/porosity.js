




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

  const $inner        = InterMap.get($rind)
  const $method_outer = $outer[$IMMEDIATES][property]
  if ($method_outer) { return $method_outer.call($rind) }

  return (property[0] === "_") ?
    PrivateAccessFromOutsideError($rind, property) :
    $inner._unknownProperty.call($inner[$PULP], property)
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
    case "undefined" : break
    case "function"  : return value[$OUTER_WRAPPER] || value
    default          : return value
  }

  const $method = $inner[$IMMEDIATES][property]
  if ($method) { return $method.outer.call($rind) }

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
  const $instance = InterMap.get(instance)
  const _instance = $instance[$PULP]
  if (_instance.id == null) { $instance._setImmutable.call(_instance) }
  return instance
}





// UNTESTED
function Inner() {}

const Inner_prototype = Inner.prototype = SpawnFrom(DefaultBehavior)

Inner_prototype.get = function get($inner, property, $pulp) {
  const value = $inner[property]
  if (value !== undefined) { return value }

  const $method = $inner[$IMMEDIATES][property]
  if ($method) { return $method.inner.call($pulp) }

  return $inner._unknownProperty.call($pulp, property)
}

// has () {
//   // hide symbols from view
// }


Inner_prototype.set = function set($inner, property, value, $pulp) {
  const onSetLoader = $inner[$SET_LOADERS][property]
  var   $target     = $inner
  var   isImmutable = $inner[IS_IMMUTABLE]

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
  if (existing === $inner[$ROOT][property]) {
    // Existing value has either never been set, or the current value has been
    // set to the same value as its root's value. The second case is less likely.

    if (value === existing && HasOwnProperty($inner, property)) {return true}

    // Skipped if property is a symbol, as symbol properties are not copied.
    var flushKnownProperties = (property[0] !== "")
  }
  else {
    // Existing value is definitely one that's been set before.
    // If new value equals existing, then easy out.
    if (value === existing) { return true }
  }

  // Need to double check this as the execution of the onSetLoader might trigger
  // the barrier and cause the object to already be copied as writable!!!
  if (isImmutable) {
    $target             = $Copy($inner, false, undefined, property)
    this.$target        = $target
    this.set            = this.retargetedSet
    this.get            = this.retargetedGet
    this.deleteProperty = this.retargetedDelete
  }

  // If was going to assigning property to self, instead assign it to the copy
  if (value === $pulp || value === $inner[$RIND]) { value = $target[$RIND] }
  if (flushKnownProperties) { delete $target[$KNOWN_PROPERTIES] }
  InSetProperty($target, property, value, $pulp)
  return true
}


Inner_prototype.deleteProperty = function deleteProperty($inner, property, $pulp) {
  var onSetLoader, permeability, $target, value, value$root

  onSetLoader = $inner[$SET_LOADERS][property]

  if (onSetLoader && onSetLoader.name === "$assignmentError") {
    return onSetError.call($pulp) || true
  }

  switch (property) {
    case $DELETE_IMMUTABILITY   :  // Only called on immutable objects!!!
      $target = $Copy($inner, false)
      break

    case $DELETE_ALL_PROPERTIES :  // Only called on immutable objects!!!
      permeability = $inner[$PERMEABILITY]
      $target      = $inner[$BLANKER](permeability)

      if (permeability === Permeable) {
        $target[$OUTER].$INNER = $target
        $target[$PERMEABILITY] = Permeable
      }
      break

    default :
      value$root = $inner[$ROOT][property]
      value      = $inner[property]

      if (value === value$root) {
        if (value === undefined || !HasOwnProperty.call($inner, property)) {
          return true // Doesn't actually have the property. Inherited from root.
        }
      }

      // If immutable, copy is set below.
      delete $target[$KNOWN_PROPERTIES]
      break
  }

  if ($inner[IS_IMMUTABLE]) {
    this.$target        = $target || $Copy($inner, false, undefined, property)
    this.set            = this.retargetedSet
    this.get            = this.retargetedGet
    this.deleteProperty = this.retargetedDelete
  }
  else {
    delete $inner[property]
    delete $inner[$OUTER][property]
  }

  return true
}

Inner_prototype.retargetedGet = function retargetedGet($inner, property, $pulp) {
  // Note: Could have simply done the following line, but gets need to be fast,
  // so reimplemented it here.
  // return Inner_prototype.get(this.$target, property, $target[$PULP])

  const $target = this.$target
  const value = $target[property]
  if (value !== undefined) { return value }

  const $method = $target[$IMMEDIATES][property]
  if ($method) { return $method.inner.call($target[$PULP]) }

  return $target._unknownProperty.call($target[$PULP], property)
}

Inner_prototype.retargetedSet = function retargetedSet($inner, property, value, $pulp) {
  const $target = this.$target
  return Inner_prototype.set($target, property, value, $target[$PULP])
}

Inner_prototype.retargetedDelete = function retargetedDelete($inner, property, $pulp) {
  const $target = this.$target
  return Inner_prototype.deleteProperty($target, property, $target[$PULP])
}



// CHECK THAT BARRIER WORK ON TYPE PROXIES, IMMUTABLE AS WELL AS MUTABLE!!!
function TypeInner($target) {
  this.$target = $target
  // this.$pulp  = $pulp // this is the proxy, which is now set from the outside
}

const TypeInner_prototype = TypeInner.prototype = SpawnFrom(Inner_prototype)


TypeInner_prototype.get = function get(func, property, $pulp) {
  // Note: Could reimplement it here is following call is too slow.
  return Inner_prototype.get(this.$target, property, $pulp)
}

TypeInner_prototype.set = function set(func, property, value, $pulp) {
  return Inner_prototype.set(this.$target, property, value, $pulp)
}

TypeInner_prototype.has = function has(func, property, $pulp) {
  return (property in this.$target)
}

TypeInner_prototype.deleteProperty = function deleteProperty(func, property, $pulp) {
  return Inner_prototype.deleteProperty(this.$target, property, $pulp)
}

TypeInner_prototype.apply = function newAsFact(func, receiver, args) {
  // return func.apply(this.$target, args)
  // return this.$pulp.newAsFact(...args)

  // This is the same code as in newAsFact(...args)
  const  instance = this.$pulp.new(...args)
  const $instance = InterMap.get(instance)
  const _instance = $instance[$PULP]
  if (_instance.id == null) { $instance._setImmutable.call(_instance) }
  return instance
}


// TypeInner.prototype = SpawnFrom(DefaultBehavior)



function SetSuperPropertyFor($inner, property) {
  const ancestors = $inner.type.ancestry
  const supers    = $inner[$SUPERS]
  var next, $type, nextProperties, value

  next = ancestors.length
  if (!$inner._hasOwn(property)) { next-- }

  while (next--) {
    $type          = InterMap.get(ancestors[next])
    nextProperties = $type._properties
    value          = nextProperties[property]

    if (value !== undefined) {
      if (value && value.type === Method) {
        if (value.isImmediate) {
          supers[$IMMEDIATES][property] = value.super
          return (supers[property] = IMMEDIATE)
        }
        return (supers[property] = value.super)
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
