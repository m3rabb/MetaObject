ObjectSauce(function (
  $ASSIGNERS, $DELETE_ALL_PROPERTIES, $DELETE_IMMUTABILITY,
  $IMMEDIATES, $INNER, $IS_DEF, $OUTER, $PULP, $RIND, $ROOT, $SUPERS,
  ALWAYS_FALSE, ALWAYS_NULL, IMMEDIATE, IMPLEMENTATION, IS_IMMUTABLE,
  NO_SUPER, _DURABLES,
  HasOwn, InSetProperty, InterMap, SpawnFrom, _$Copy,
  AssignmentOfUndefinedError, AttemptSetOnSuperError,
  DirectAssignmentFromOutsideError, DisallowedDeleteError,
  PrivateAccessFromOutsideError,
  OSauce, _OSauce
) {
  "use strict"

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
  const Impermeable = new OuterBarrier()
  Impermeable.id = "Impermeable"


  // Setting on things in not allowed because the setting semantics are broken.
  // For our model, the return value should always be the receiver, or a copy
  // of the receiver, with the property changed.

  // Further, note that the return value of a set always returns the value that
  // was tried to be set to, regardless of whether it was successful or not.

  OuterBarrier_prototype.set = function set($target, selector, value, target) {
    return DirectAssignmentFromOutsideError(target) || false
  }


  // getOwnPropertyDescriptor ($target, selector) {
  //   switch (selector[0]) {
  //     case "_"       : return $target._externalPrivateRead(selector) || undefined
  //     // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
  //     case undefined : return undefined
  //   }
  //   return PropertyDescriptor($target, selector)
  // },

  // ownKeys ($target) { },


  OuterBarrier_prototype.get = function get($target, selector, target) {
    const value = $target[selector]
    if (value !== undefined) { return value }

    const _$method_outer = $target[$IMMEDIATES][selector]
    if (_$method_outer) { return _$method_outer.call(target) }
    if (selector in $target) { return null }

    const firstChar = (selector.charAt) ? selector[0] : selector.toString()[7]
    const _$target  = InterMap.get(target)

    if (firstChar === "_") {
      const _privateAccessFromOutside = _$target._privateAccessFromOutside
      return (_privateAccessFromOutside) ?
        _privateAccessFromOutside.call(_$target[$PULP], selector) :
        PrivateAccessFromOutsideError(target, selector)
    }
    return _$target._unknownProperty.call(_$target[$PULP], selector)
  }


  OuterBarrier_prototype.has = function has($target, selector) {
    // const firstChar = (typeof selector === "symbol") ?
    //   selector.toString()[7] : selector[0]

    switch (selector[0]) {
      case undefined : return null  // Effectively answers a shrug
      case "_"       :
        return PrivateAccessFromOutsideError($target[$RIND], selector) || false
      // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
      default        : return (selector in $target)
    }
  }



  // const Permeable = new OuterBarrier()
  //
  // Permeable.id = "Permeable"
  //
  // Permeable.get = function get($target, selector, target) {
  //   var value = $target[selector]
  //   if (value !== undefined) { return value }
  //
  //   const _$target = InterMap.get(target)
  //
  //   value = _$target[selector]
  //
  //   switch (typeof value) {
  //     case "undefined" : break
  //     case "function"  : return value[$OUTER_WRAPPER] || value
  //     default          : return value
  //   }
  //
  //   const $method_inner = _$target[$IMMEDIATES][selector]
  //   if ($method_inner) { return $method_inner[$OUTER_WRAPPER].call(target) }
  //   if (_$target[$DECLARATIONS][selector] !== undefined) { return null }
  //
  //   return _$target._unknownProperty.call(_$target[$PULP], selector)
  // }
  //
  // // REVISIT!!!
  // Permeable.has = function has($target, selector) {
  //   const _$target = InterMap.get($target[$RIND])
  //   return (selector in _$target)
  // }




  // UNTESTED
  function InnerBarrier() {}

  const InnerBarrier_prototype = SpawnFrom(DefaultBarrier)
  InnerBarrier.prototype = InnerBarrier_prototype

  InnerBarrier_prototype.get = function get(_$target, selector, _target) {
    const value = _$target[selector]
    if (value !== undefined) { return value }

    const $method_inner = _$target[$IMMEDIATES][selector]
    if ($method_inner) { return $method_inner.call(_target) }
    if (selector in _$target) { return null }

    return _$target._unknownProperty.call(_target, selector)
  }

  // has () {
  //   // hide symbols from view
  // }


  InnerBarrier_prototype.set = function set(_$source, selector, value, _source) {
    const assigner    = _$source[$ASSIGNERS][selector]
    var   _$target    = _$source
    var   isImmutable = _$source[IS_IMMUTABLE]

    if (assigner) {
      if (typeof assigner !== "function") { selector = assigner } // symbol
      else {                                                      // handler
        // The assigner might cause a write, invalidating the target $inner.
        value       = assigner.call(_source, value)
        _$target    = _source[$INNER]        // Re-get the (possibly new) $inner
        isImmutable = _$target[IS_IMMUTABLE] // See if assigner caused new copy
      }
    }

    const existing = _$target[selector]
    if (existing === _$target[$ROOT][selector]) {
      // Existing value has either never been set, or the current value has been
      // set to the same value as its root's value. The 2nd case is less likely.


      if (value === existing) {
        if (value === undefined) {
          return AssignmentOfUndefinedError(_source, selector)
        }
        if (HasOwn.call(_$target, selector))          { return true }
        if (isImmutable && _$source.type.isImmutable) { return true }
        // Else, target is mutable, and new value matches inherited shared value
      }
      else if (existing === undefined) {
        delete _$target[_DURABLES] // Invalidate durables because new property
      }
    }
    // Existing value is definitely one that's been set before.
    // If new value equals existing, then easy out.
    else if (value === existing) { return true }

    // Need to double check this as the execution of the assigner might trigger
    // the barrier and cause the object to already be copied as writable!!!
    if (isImmutable) {
      _$target            = _$Copy(_$source, false, undefined, selector)
      this._$target       = _$target
      this.get            = this.retargetedGet
      this.set            = this.retargetedSet
      this.deleteProperty = this.retargetedDelete
    }

    if (_$target !== _$source) {
      // If going to assigning property to self, instead assign it to the copy
      if (value === _source || value === _$source[$RIND]) {
        value = _$target[$RIND]
      }
    }
    InSetProperty(_$target, selector, value, _source)
    return true
  }


  InnerBarrier_prototype.deleteProperty = function deleteProperty(_$source, selector) {
    var assigner, _$target, value, value$root

    assigner = _$source[$ASSIGNERS][selector]

    if (assigner && assigner.name === "$assignmentError") {
      return DisallowedDeleteError(_$source, selector) || true
    }

    switch (selector) {
      case $DELETE_IMMUTABILITY   :  // Only called on immutable objects!!!
        _$target = _$Copy(_$source, false)
        break

      case $DELETE_ALL_PROPERTIES :  // Only called on immutable objects!!!
        _$target = new _$source._newBlank()
        break

      default :
        value$root = _$source[$ROOT][selector]
        value      = _$source[selector]

        if (value === value$root) {
          if (value === undefined || !HasOwn.call(_$source, selector)) {
            return true // Doesn't have the property, but inherits it from root.
          }
        }
    }

    if (_$source[IS_IMMUTABLE]) {
      this._$target = _$target || _$Copy(_$source, false, undefined, selector)
      this.set = this.retargetedSet
      this.get = this.retargetedGet
      this.deleteProperty = this.retargetedDelete
    }
    else {
      delete _$source[selector]
      delete _$source[$OUTER][selector]
      delete _$source[_DURABLES]
    }

    return true
  }

  // eslint-disable-next-line
  InnerBarrier_prototype.retargetedGet = function retargetedGet(_$source, selector, _source) {
    // Note: Could have simply done the following line, but gets need to be
    // fast, so reimplemented it here.
    // const _$target = this._$target
    // return InnerBarrier_prototype.get(_$target, selector, _$target[$PULP])

    const _$target = this._$target
    const value = _$target[selector]
    if (value !== undefined) { return value }

    const $method_inner = _$target[$IMMEDIATES][selector]
    if ($method_inner) { return $method_inner.call(_$target[$PULP]) }
    if (selector in _$target) { return null }

    return _$target._unknownProperty.call(_$target[$PULP], selector)
  }

  // eslint-disable-next-line
  InnerBarrier_prototype.retargetedSet = function retargetedSet(_$source, selector, value, _source) {
    const _$target = this._$target
    return InnerBarrier_prototype.set(
      _$target, selector, value, _$target[$PULP])
  }

  // eslint-disable-next-line
  InnerBarrier_prototype.retargetedDelete = function retargetedDelete(_$source, selector, _source) {
    const _$target = this._$target
    return InnerBarrier_prototype.deleteProperty(
      _$target, selector, _$target[$PULP])
  }


  function DisguisedOuterBarrier(_target, $target, applyHandler) {
    this._target = _target
    this.$target = $target
    this.apply   = applyHandler
  }

  const DisguisedOuterBarrier_prototype = SpawnFrom(OuterBarrier_prototype)
  DisguisedOuterBarrier.prototype = DisguisedOuterBarrier_prototype

  DisguisedOuterBarrier_prototype.get = function get(func, selector, target) {
    return Impermeable.get(this.$target, selector, target)
  }

  DisguisedOuterBarrier_prototype.has = function has(func, selector) {
    return Impermeable.has(this.$target, selector)
  }



  // CHECK THAT BARRIER WORK ON TYPE PROXIES, IMMUTABLE AS WELL AS MUTABLE!!!
  function DisguisedInnerBarrier(_$target, applyHandler) {
    this._$target = _$target
    this.apply    = applyHandler
    // this._target  = _target // this is the proxy, which is now set from the outside
  }

  const DisguisedInnerBarrier_prototype = SpawnFrom(InnerBarrier_prototype)
  DisguisedInnerBarrier.prototype = DisguisedInnerBarrier_prototype

  DisguisedInnerBarrier_prototype.get = function get(func, selector, _target) {
    // Note: Could reimplement it here is following call is too slow.
    return InnerBarrier_prototype.get(this._$target, selector, _target)
  }

  DisguisedInnerBarrier_prototype.set = function set(func, selector, value, _target) {
    return InnerBarrier_prototype.set(this._$target, selector, value, _target)
  }

  DisguisedInnerBarrier_prototype.has = function has(func, selector) {
    return (selector in this._$target)
  }

  DisguisedInnerBarrier_prototype.deleteProperty = function deleteProperty(func, selector) {
    return InnerBarrier_prototype.deleteProperty(this._$target, selector)
  }



  function SuperPropertyFor(_$target, selector) {
    const ancestors = _$target.type.ancestry
    const supers    = _$target[$SUPERS]
    var next, _$nextType, nextDefinitions, value, _$value, isDeclared

    next = ancestors.length
    if (!_$target._has(selector)) { next-- }

    while (next--) {
      _$nextType      = InterMap.get(ancestors[next])
      nextDefinitions = _$nextType._definitions
      value           = nextDefinitions[selector]

      if (value !== undefined) {
        _$value = InterMap.get(value)
        if (_$value && _$value[$IS_DEF]) {
          if (_$value.isImmediate) {
            supers[$IMMEDIATES][selector] = _$value.super
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
      else if (selector in _$nextType._blanker.$root$inner) { isDeclared = true }
    }
    return isDeclared ? null : NO_SUPER
  }


  function SuperBarrier() {}

  const SuperBarrier_prototype = SpawnFrom(DefaultBarrier)

  SuperBarrier.prototype = SuperBarrier_prototype

  // eslint-disable-next-line
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
          return _$target._unknownProperty.call(_$target[$PULP], selector)

        default :
          return value
      }
    } while (true)
  }

  // eslint-disable-next-line
  SuperBarrier_prototype.set = function set(_$target, selector, value, _super) {
    return AttemptSetOnSuperError(_$target[$RIND]) || false
  }




  // const OwnSuperBarrier = {
  //   __proto__ : SuperBarrier,
  //
  //   get ($inner, selector, target) {
  //     // const supers = $inner[SUPERS]
  //     // const value =
  //     //
  //     // if (selector in supers) {
  //     //   let sharedSupers = supers[SUPERS]
  //     //   if (sharedSupers !== supers) { // instance has its own SUPERS
  //     //     if (!(selector in sharedSupers)) {
  //     //
  //     //     }
  //     //
  //     //   }
  //     //   value = supers[selector]
  //     // }
  //     // else {
  //     //   value = SetSuperPropertyFor($inner, selector)
  //     // }
  //     // return (value === NO_SUPER) ?
  //     //   ($inner._unknownProperty ?
  //     //     $inner[$PULP]._unknownProperty(selector) : undefined) :
  //     //   (value && value[$PROOF] === INNER_SECRET ?
  //     //     value.handler.call($inner[$PULP]) : value)
  //   }
  // }

  _OSauce._Super                = new SuperBarrier()
  _OSauce.Impermeable           = Impermeable
  _OSauce.InnerBarrier          = InnerBarrier
  _OSauce.DisguisedOuterBarrier = DisguisedOuterBarrier
  _OSauce.DisguisedInnerBarrier = DisguisedInnerBarrier
  _OSauce.SuperBarrier          = SuperBarrier

})


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
