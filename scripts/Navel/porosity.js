




// UNTESTED
const DefaultBarrier = {
  __proto__      : null        ,
  getPrototypeOf : ALWAYS_NULL ,
  setPrototypeOf : ALWAYS_FALSE,
  defineProperty : ALWAYS_FALSE,
  deleteProperty : ALWAYS_FALSE,
  // isExtensible   : ALWAYS_FALSE,
  // preventExtensions ???
}




function OuterBarrier() {}

const OuterBarrier_prototype = OuterBarrier.prototype = SpawnFrom(DefaultBarrier)

// Setting on things in not allowed because the setting semantics are broken.
// For our model, the return value should always be the receiver, or a copy
// of the receiver, with the property changed.

// Further, note that the return value of a set always returns the value that
// was tried to be set to, regardless of whether it was successful or not.

OuterBarrier_prototype.set = function set($target, property, value, target) {
  return DirectAssignmentFromOutsideError(target) || false
}


// getOwnPropertyDescriptor ($target, property) {
//   switch (property[0]) {
//     case "_"       : return $target._externalPrivateRead(property) || undefined
//     // case undefined : if (!(property in VISIBLE_SYMBOLS)) { return false }
//     case undefined : return undefined
//   }
//   return PropertyDescriptor($target, property)
// },

// ownKeys ($target) { },



const Impermeable = new OuterBarrier()

Impermeable.id = "Impermeable"

Impermeable.get = function get($target, property, target) {
  const value = $target[property]
  if (value !== undefined) { return value }

  const _$method_outer = $target[$IMMEDIATES][property]
  if (_$method_outer) { return _$method_outer.call(target) }
  if ($target[$DECLARATIONS][property]) { return null }
  if (property[0] === "_") {
    return PrivateAccessFromOutsideError(target, property)
  }

  const _$target = InterMap.get(target)
  return _$target._unknownProperty.call(_$target[$PULP], property)
}

Impermeable.has = function has($target, property) {
  // const firstChar = (typeof property === "symbol") ?
  //   property.toString()[7] : property[0]

  switch (property[0]) {
    case "_"       :
      return PrivateAccessFromOutsideError($target[$RIND], property) || false
    // case undefined : if (!(property in VISIBLE_SYMBOLS)) { return false }
    case undefined :
      return false
  }
  return (property in $target)
}


// const Permeable = new OuterBarrier()
//
// Permeable.id = "Permeable"
//
// Permeable.get = function get($target, property, target) {
//   var value = $target[property]
//   if (value !== undefined) { return value }
//
//   const _$target = InterMap.get(target)
//
//   value = _$target[property]
//
//   switch (typeof value) {
//     case "undefined" : break
//     case "function"  : return value[$OUTER_WRAPPER] || value
//     default          : return value
//   }
//
//   const $method_inner = _$target[$IMMEDIATES][property]
//   if ($method_inner) { return $method_inner[$OUTER_WRAPPER].call(target) }
//   if (_$target[$DECLARATIONS][property] !== undefined) { return null }
//
//   return _$target._unknownProperty.call(_$target[$PULP], property)
// }
//
// // REVISIT!!!
// Permeable.has = function has($target, property) {
//   const _$target = InterMap.get($target[$RIND])
//   return (property in _$target)
// }




// UNTESTED
function InnerBarrier() {}

const InnerBarrier_prototype = SpawnFrom(DefaultBarrier)
InnerBarrier.prototype = InnerBarrier_prototype

InnerBarrier_prototype.get = function get(_$target, property, _target) {
  const value = _$target[property]
  if (value !== undefined) { return value }

  const $method_inner = _$target[$IMMEDIATES][property]
  if ($method_inner) { return $method_inner.call(_target) }
  if (_$target[$DECLARATIONS][property] !== undefined) { return null }

  return _$target._unknownProperty.call(_target, property)
}

// has () {
//   // hide symbols from view
// }


InnerBarrier_prototype.set = function set(_$source, property, value, _source) {
  const assigner    = _$source[$ASSIGNERS][property]
  var   _$target    = _$source
  var   isImmutable = _$source[IS_IMMUTABLE]

  if (assigner) {
    if (typeof assigner !== "function") { property = assigner } // symbol
    else {                                                      // handler
      // The assigner might cause a write, invalidating the target $inner.
      value       = assigner.call(_source, value)
      _$target    = _source[$INNER]         // Re-get the (possibly new) $inner
      isImmutable = _$target[IS_IMMUTABLE] // See if assigner caused a new copy
    }
  }

  const existing = _$target[property]
  if (existing === _$target[$ROOT][property]) {
    // Existing value has either never been set, or the current value has been
    // set to the same value as its root's value. The second case is less likely.

    if (value === existing) {
      if (value === undefined) {
        return AssignmentOfUndefinedError(_source, property)
      }
      if (HasOwnProperty.call(_$target, property))  { return true }
      if (isImmutable && _$source.type.isImmutable) { return true }
    }
  }  // Existing value is definitely one that's been set before.
     // If new value equals existing, then easy out.
  else if (value === existing) { return true }

  // Need to double check this as the execution of the assigner might trigger
  // the barrier and cause the object to already be copied as writable!!!
  if (isImmutable) {
    _$target            = $Copy(_$source, false, undefined, property)
    this._$target       = _$target
    this.get            = this.retargetedGet
    this.set            = this.retargetedSet
    this.deleteProperty = this.retargetedDelete
  }

  if (_$target !== _$source) {
    // If was going to assigning property to self, instead assign it to the copy
    if (value === _source || value === _$source[$RIND]) {
      value = _$target[$RIND]
    }
  }
  InSetProperty(_$target, property, value, _source)
  return true
}


InnerBarrier_prototype.deleteProperty = function deleteProperty(_$source, property) {
  var assigner, _$target, value, value$root

  assigner = _$source[$ASSIGNERS][property]

  if (assigner && assigner.name === "$assignmentError") {
    return DisallowedDeleteError(_$source, property) || true
  }

  switch (property) {
    case $DELETE_IMMUTABILITY   :  // Only called on immutable objects!!!
      _$target = $Copy(_$source, false)
      break

    case $DELETE_ALL_PROPERTIES :  // Only called on immutable objects!!!
      _$target = new _$source._newBlank()
      break

    default :
      value$root = _$source[$ROOT][property]
      value      = _$source[property]

      if (value === value$root) {
        if (value === undefined || !HasOwnProperty.call(_$source, property)) {
          return true // Doesn't actually have the property. Inherited from root.
        }
      }
  }

  if (_$source[IS_IMMUTABLE]) {
    this._$target       = _$target || $Copy(_$source, false, undefined, property)
    this.set            = this.retargetedSet
    this.get            = this.retargetedGet
    this.deleteProperty = this.retargetedDelete
  }
  else {
    delete _$source[property]
    delete _$source[$OUTER][property]
  }

  return true
}

InnerBarrier_prototype.retargetedGet = function retargetedGet(_$source, property, _source) {
  // Note: Could have simply done the following line, but gets need to be fast,
  // so reimplemented it here.
  // const _$target = this._$target
  // return InnerBarrier_prototype.get(_$target, property, _$target[$PULP])

  const _$target = this._$target
  const value = _$target[property]
  if (value !== undefined) { return value }

  const $method_inner = _$target[$IMMEDIATES][property]
  if ($method_inner) { return $method_inner.call(_$target[$PULP]) }
  if (_$target[$DECLARATIONS][property] !== undefined) { return null }

  return _$target._unknownProperty.call(_$target[$PULP], property)
}

InnerBarrier_prototype.retargetedSet = function retargetedSet(_$source, property, value, _source) {
  const _$target = this._$target
  return InnerBarrier_prototype.set(_$target, property, value, _$target[$PULP])
}

InnerBarrier_prototype.retargetedDelete = function retargetedDelete(_$source, property, _source) {
  const _$target = this._$target
  return InnerBarrier_prototype.deleteProperty(_$target, property, _$target[$PULP])
}



function Type_apply(func, receiver, args) {
  // return func.apply(this.$inner, args)
  // return this._target.newAsFact(...args)

  // This is the same code as in newAsFact(...args)
  const   instance = this._target.new(...args)
  const _$instance = InterMap.get(instance)
  const _instance  = _$instance[$PULP]
  if (_instance.id == null) { _$instance._setImmutable.call(_instance) }
  return instance
}


function DisguisedOuterBarrier(_target, $target) {
  this._target      = _target
  this.$target      = $target
}

const DisguisedOuterBarrier_prototype = SpawnFrom(OuterBarrier_prototype)
DisguisedOuterBarrier.prototype = DisguisedOuterBarrier_prototype

DisguisedOuterBarrier_prototype.get = function get(func, property, target) {
  return Impermeable.get(this.$target, property, target)
}

DisguisedOuterBarrier_prototype.has = function has(func, property) {
  return Impermeable.has(this.$target, property)
}

DisguisedOuterBarrier_prototype.apply = Type_apply



// CHECK THAT BARRIER WORK ON TYPE PROXIES, IMMUTABLE AS WELL AS MUTABLE!!!
function DisguisedInnerBarrier(_$target) {
  this._$target = _$target
  // this._target  = _target // this is the proxy, which is now set from the outside
}

const DisguisedInnerBarrier_prototype = SpawnFrom(InnerBarrier_prototype)
DisguisedInnerBarrier.prototype = DisguisedInnerBarrier_prototype

DisguisedInnerBarrier_prototype.get = function get(func, property, _target) {
  // Note: Could reimplement it here is following call is too slow.
  return InnerBarrier_prototype.get(this._$target, property, _target)
}

DisguisedInnerBarrier_prototype.set = function set(func, property, value, _target) {
  return InnerBarrier_prototype.set(this._$target, property, value, _target)
}

DisguisedInnerBarrier_prototype.has = function has(func, property) {
  return (property in this._$target)
}

DisguisedInnerBarrier_prototype.deleteProperty = function deleteProperty(func, property) {
  return InnerBarrier_prototype.deleteProperty(this._$target, property)
}

DisguisedInnerBarrier_prototype.apply = Type_apply





function SuperPropertyFor(_$target, selector) {
  const ancestors = _$target.type.ancestry
  const supers    = _$target[$SUPERS]
  var next, _$nextType, nextDefinitions, value, isDeclared, marker

  next = ancestors.length
  if (!_$target._has(selector)) { next-- }

  while (next--) {
    _$nextType      = InterMap.get(ancestors[next])
    nextDefinitions = _$nextType._definitions
    value           = nextDefinitions[selector]

    if (value !== undefined) {
      if (value && value.type === Definition) {
        if (value.isImmediate) {
          supers[$IMMEDIATES][selector] = value.super
          return IMMEDIATE
        }
        if ((value = value.super)) { return value }

        // Here because value is a DECLARATION or ASSIGNER method
        isDeclared = true
        // value = $root$inner[selector]
        // if (value !== undefined) { return value }
      }
      else { return value }
    }
    else {
      marker = _$nextType._blanker.$root$inner[$DECLARATIONS][selector]
      if (marker !== undefined) { isDeclared = true }
    }
  }
  return isDeclared ? null : NO_SUPER
}


function SuperBarrier() {}

const SuperBarrier_prototype = SpawnFrom(DefaultBarrier)

SuperBarrier.prototype = SuperBarrier_prototype

SuperBarrier_prototype.get = function get(_$target, selector, _super) {
  const supers = _$target[$SUPERS]
  var   value  = supers[selector]

  do {
    switch (value) {
      case undefined :
        value = (supers[selector] = SuperPropertyFor(_$target, selector))
        break

      case IMPLEMENTATION :
        return _$target[selector]

      case IMMEDIATE :
        return supers[$IMMEDIATES][selector].call(_$target[$PULP])

      case NO_SUPER :
        return $inner._unknownProperty.call(_$target[$PULP], selector)

      default :
        return value
    }
  } while (true)
}

const _Super = new SuperBarrier()


// const OwnSuperBarrier = {
//   __proto__ : SuperBarrier,
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
//     //   (value && value[$PROOF] === INNER_SECRET ?
//     //     value.handler.call($inner[$PULP]) : value)
//   }
// }
