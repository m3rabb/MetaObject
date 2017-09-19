ObjectSauce(function (
  $ASSIGNERS, $DELETE_ALL_PROPERTIES, $DELETE_IMMUTABILITY,$IMMEDIATES, $INNER,
  $IS_DEFINITION, $OUTER, $OUTER_WRAPPER, $PULP, $RIND, $ROOT, $SUPERS,
  IMMEDIATE, IMPLEMENTATION, IS_IMMUTABLE, NO_SUPER, _DURABLES,
  AlwaysFalse, AlwaysNull, InSetProperty, InterMap, SpawnFrom, _$Copy, _HasOwn,
  AssignmentOfUndefinedError, AttemptSetOnSuperError,
  DirectAssignmentFromOutsideError, DisallowedDeleteError,
  PrivateAccessFromOutsideError,
  _OSauce
) {
  "use strict"

  // UNTESTED
  const DefaultBarrier = {
    __proto__      : null       ,
    getPrototypeOf : AlwaysNull ,
    setPrototypeOf : AlwaysFalse,
    defineProperty : AlwaysFalse,
    deleteProperty : AlwaysFalse,
    // isExtensible   : AlwaysFalse,
    // preventExtensions ???
  }

  function OuterBarrier() {}

  const OuterBarrier_prototype = SpawnFrom(DefaultBarrier)
  OuterBarrier.prototype       = OuterBarrier_prototype
  const Impermeable            = new OuterBarrier()


  // Setting on things in not allowed because the setting semantics are broken.
  // For our model, the return value should always be the receiver, or a copy
  // of the receiver, with the property changed.

  // Further, note that the return value of a set always returns the value that
  // was tried to be set to, regardless of whether it was successful or not.

  OuterBarrier_prototype.set = function set($self, selector, value, self) {
    return DirectAssignmentFromOutsideError(self) || false
  }


  // getOwnPropertyDescriptor ($self, selector) {
  //   switch (selector[0]) {
  //     case "_"       : return $self._externalPrivateRead(selector) || undefined
  //     // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
  //     case undefined : return undefined
  //   }
  //   return PropertyDescriptor($self, selector)
  // },

  // ownKeys ($self) { },


  OuterBarrier_prototype.get = function get($self, selector, self) {
    const value = $self[selector]
    if (value !== undefined) { return value }

    const _$method_outer = $self[$IMMEDIATES][selector]
    if (_$method_outer) { return _$method_outer.call(self) }
    if (selector in $self) { return null }

    const firstChar = (selector.charAt) ? selector[0] : selector.toString()[7]
    const _$self  = InterMap.get(self)

    if (firstChar === "_") {
      const _privateAccessFromOutside = _$self._privateAccessFromOutside
      return (_privateAccessFromOutside) ?
        _privateAccessFromOutside.call(_$self[$PULP], selector) :
        PrivateAccessFromOutsideError(self, selector)
    }
    return _$self._unknownProperty.call(_$self[$PULP], selector)
  }


  OuterBarrier_prototype.has = function has($self, selector) {
    // const firstChar = (typeof selector === "symbol") ?
    //   selector.toString()[7] : selector[0]

    switch (selector[0]) {
      case undefined : return null  // Effectively answers a shrug
      case "_"       :
        return PrivateAccessFromOutsideError($self[$RIND], selector) || false
      // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
      default        : return (selector in $self)
    }
  }


  OuterBarrier_prototype.basicGet    = OuterBarrier_prototype.get
  OuterBarrier_prototype.basicHas    = OuterBarrier_prototype.has



  // UNTESTED
  function InnerBarrier(_$self) {
    this._$target = _$self
  }

  const InnerBarrier_prototype = SpawnFrom(DefaultBarrier)
  InnerBarrier.prototype = InnerBarrier_prototype


  // eslint-disable-next-line
  InnerBarrier_prototype.get = function get(_$self, selector, _self) {
    const _$target = this._$target
    const value    = _$target[selector]
    if (value !== undefined) { return value }

    const $method_inner = _$target[$IMMEDIATES][selector]
    if ($method_inner) { return $method_inner.call(_$target[$PULP]) }
    if (selector in _$target) { return null }

    return _$target._unknownProperty.call(_$target[$PULP], selector)
  }


  InnerBarrier_prototype.has = function has(_$self, selector) {
    return (selector in this._$target)
  }


  InnerBarrier_prototype.set = function set(_$self, selector, value, _self) {
    var   _$target = this._$target
    const assigner = _$target[$ASSIGNERS][selector]

    if (assigner) {
      if (typeof assigner !== "function") { selector = assigner } // symbol
      else {                                                      // handler
        // The assigner might cause a write, invalidating the target $inner.
        value    = assigner.call(_$target[$PULP], value)
        _$target = this._$target  // reload target since assigner caused new copy
      }
    }

    const isImmutable = _$target[IS_IMMUTABLE]
    const existing    = _$target[selector]

    if (existing === _$target[$ROOT][selector]) {
      // Existing value has either never been set, or the current value has been
      // set to the same value as its root's value. The 2nd case is less likely.

      if (value === existing) {
        if (value === undefined) {
          return AssignmentOfUndefinedError(_self, selector)
        }
        if (_HasOwn.call(_$target, selector))           { return true }
        if (isImmutable && _$target.type[IS_IMMUTABLE]) { return true }
        // Else, target is mutable, and new value matches inherited shared value
      }
      else if (existing === undefined  && !isImmutable) {
        delete _$target[_DURABLES] // Invalidate durables because new property
      }
    }
    // Existing value is definitely one that's been set before.
    // If new value equals existing, then easy out.
    else if (value === existing) { return true }

    // Need to double check this as the execution of the assigner might trigger
    // the barrier and cause the object to already be copied as writable!!!
    if (isImmutable) {
      this._$target = (_$target = _$Copy(_$target, false, null, null, selector))
    }

    if (_$target !== _$self) {
      // If going to assigning property to self, instead assign it to the copy
      if (value === _self || value === _$self[$RIND]) {
        value = _$target[$RIND]
      }
    }
    InSetProperty(_$target, selector, value, _$target[$PULP])
    return true
  }


  InnerBarrier_prototype.deleteProperty = function deleteProperty(_$self, selector) {
    var _$copy, value, value$root

    var   _$target = this._$target
    const assigner = _$target[$ASSIGNERS][selector]

    if (assigner && assigner.name === "$assignmentError") {
      return DisallowedDeleteError(_$self, selector) || true
    }

    switch (selector) {
      case $DELETE_IMMUTABILITY   :  // Only called on immutable objects!!!
        _$copy = _$Copy(_$target, false)
        break

      case $DELETE_ALL_PROPERTIES :  // Only called on immutable objects!!!
        _$copy = InterMap.get(new _$target._newBlank())
        break

      default :
        value$root = _$target[$ROOT][selector]
        value      = _$target[selector]

        if (value === value$root) {
          if (value === undefined || !_HasOwn.call(_$target, selector)) {
            return true // Doesn't have the property, but inherits it from root.
          }
        }
    }

    if (_$target[IS_IMMUTABLE]) {
      this._$target = _$copy || _$Copy(_$target, false, null, null, selector)
    }
    else {
      delete _$target[selector]
      delete _$target[$OUTER][selector]
      delete _$target[_DURABLES]
    }

    return true
  }



  function DisguisedOuterBarrier(_$self, applyHandler) {
    this._$target = _$self
    this.apply    = applyHandler
  }

  const DisguisedOuterBarrier_prototype = SpawnFrom(OuterBarrier_prototype)
  DisguisedOuterBarrier.prototype = DisguisedOuterBarrier_prototype

  DisguisedOuterBarrier_prototype.get = function get(func, selector, target) {
    return this.basicGet(this._$target[$OUTER], selector, target)
  }

  DisguisedOuterBarrier_prototype.has = function has(func, selector) {
    return this.basicHas(this._$target[$OUTER], selector)
  }


  // CHECK THAT BARRIER WORK ON TYPE PROXIES, IMMUTABLE AS WELL AS MUTABLE!!!
  function DisguisedInnerBarrier(_$self, applyHandler) {
    this._$target = _$self
    this.apply    = applyHandler
  }

  const DisguisedInnerBarrier_prototype = SpawnFrom(InnerBarrier_prototype)
  DisguisedInnerBarrier.prototype = DisguisedInnerBarrier_prototype




  function SetSuperPropertyFor(_$self, selector, supers) {
    var next, _$nextType, _$nextRoot, value, isDeclared
    const ancestors = _$self.type.ancestry

    next = ancestors.length
    if (!_$self._hasOwn(selector)) { next -= 1 }

    while (next--) {
      _$nextType = InterMap.get(ancestors[next])
      _$nextRoot = _$nextType._blanker.$root$inner
      value      = _$nextRoot[selector]

      if (value != null) {
        return (supers[selector] =
          (value[$OUTER_WRAPPER] && InterMap.get(value)) ?
            value.method.super : value)
      }
      if (value === null) { return (supers[selector] = null) }

      if ((value = _$nextRoot[$IMMEDIATES][selector])) {
        supers[$IMMEDIATES][selector] = value.method.super
        return (supers[selector] = IMMEDIATE)
      }
      if (selector in _$nextRoot) { isDeclared = true }
    }

    return isDeclared ? null : NO_SUPER
  }


  function SuperBarrier() {}

  const SuperBarrier_prototype = SpawnFrom(DefaultBarrier)

  SuperBarrier.prototype = SuperBarrier_prototype

  // eslint-disable-next-line
  SuperBarrier_prototype.get = function get(_$self, selector, _super) {
    const supers = _$self[$SUPERS]
    var   value  = supers[selector]

    do {
      switch (value) {
        case undefined :
          value = SetSuperPropertyFor(_$self, selector, supers)
          break

        case IMPLEMENTATION :
          return _$self[selector]

        case IMMEDIATE :
          return supers[$IMMEDIATES][selector].call(_$self[$PULP])

        case NO_SUPER :
          return _$self._unknownProperty.call(_$self[$PULP], selector)

        default :
          return value
      }
    } while (true)
  }

  // eslint-disable-next-line
  SuperBarrier_prototype.set = function set(_$self, selector, value, _super) {
    return AttemptSetOnSuperError(_$self[$RIND]) || false
  }


  // NOTE: Not yet sure if the following is necessary.
  // Thusly, it's not yet connecting to permeable this.

  function PermeableBarrier() {}

  const PermeableBarrier_prototype = SpawnFrom(DefaultBarrier)
  const Permeable = new PermeableBarrier()
  PermeableBarrier.prototype = PermeableBarrier_prototype

  PermeableBarrier_prototype.get = InnerBarrier_prototype.get

  PermeableBarrier_prototype.has = InnerBarrier_prototype.has

  PermeableBarrier_prototype.set = function set(_$self, selector, value, _target) {
    return _$self[IS_IMMUTABLE] ? false :
      InnerBarrier_prototype.set(_$self, selector, value, _target)
  }

  PermeableBarrier_prototype.deleteProperty = function deleteProperty(_$self, selector) {
    return _$self[IS_IMMUTABLE] ? false :
      InnerBarrier_prototype.deleteProperty(_$self, selector)
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
  //     //   (value && value[$IS_INNER] === PROOF ?
  //     //     value.handler.call($inner[$PULP]) : value)
  //   }
  // }

  _OSauce._Super                = new SuperBarrier()
  _OSauce.Impermeable           = Impermeable
  _OSauce.InnerBarrier          = InnerBarrier
  _OSauce.DisguisedOuterBarrier = DisguisedOuterBarrier
  _OSauce.DisguisedInnerBarrier = DisguisedInnerBarrier
  _OSauce.SuperBarrier          = SuperBarrier
  _OSauce.Permeable             = Permeable

})


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
