Tranya(function (
  $ASSIGNERS, $DELETE_ALL_PROPERTIES, $DELETE_IMMUTABILITY,$IMMEDIATES, $INNER,
  $IS_DEFINITION, $OUTER, $OUTER_WRAPPER, $PULP, $RIND, $ROOT, $SUPERS,
  IMMEDIATE, IMPLEMENTATION, IS_IMMUTABLE, NO_SUPER, _DURABLES,
  AlwaysFalse, AlwaysNull, InSetProperty, InterMap, SpawnFrom, _$Copy, _HasOwn,
  AssignmentOfUndefinedError, AssignmentViaSuperError,
  ChangeToImmutableThisError, DeleteFromOutsideError,
  DirectAssignmentFromOutsideError, DisallowedDeleteError,
  PrivateAccessFromOutsideError,
  _Shared
) {
  "use strict"


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

  // eslint-disable-next-line
  OuterBarrier_prototype.deleteProperty = function deleteProperty($self, selector) {
    return DeleteFromOutsideError(self) || false
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

    const _$self = InterMap.get(self)

    return _$self._unknownProperty.call(_$self[$PULP], selector, true)
  }


  OuterBarrier_prototype.has = function has($self, selector) {
    switch (selector[0]) {
      case "_"       :
        return PrivateAccessFromOutsideError($self[$RIND], selector) || false
      case undefined : return null  // Effectively answers a shrug
      // case undefined : if (!(selector in VISIBLE_SYMBOLS)) { return false }
      default        : return (selector in $self)
    }
  }


  OuterBarrier_prototype.basicGet    = OuterBarrier_prototype.get
  OuterBarrier_prototype.basicHas    = OuterBarrier_prototype.has



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

    return _$target._unknownProperty.call(_$target[$PULP], selector, false)
  }


  InnerBarrier_prototype.has = function has(_$self, selector) {
    return (selector in this._$target)
  }


  InnerBarrier_prototype.set = function set(_$self, selector, value, _self) {
    var _$target, assigner
    _$target = this._$target

    if ((assigner = _$target[$ASSIGNERS][selector])) {
      if (typeof assigner !== "function") { selector = assigner } // symbol
      else {                                                      // handler
        // The assigner might cause a write, invalidating the target $inner.
        value    = assigner.call(_$target[$PULP], value)
        _$target = this._$target // assigner might have made new copy
      }
    }

    const isImmutable = _$target[IS_IMMUTABLE]
    const existing    = _$target[selector]

    if (existing === _$target[$ROOT][selector]) {
      // Existing value has either never been set, or the current value has been
      // set to the same value as its root's value. The 2nd case is less likely.

      if (value === existing) {
        if (value === undefined) {
          return AssignmentOfUndefinedError(_$self, selector) || false
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
      if (!this.isInUse) { return ChangeToImmutableThisError(_$self) || false }
      this._$target = (_$target = _$Copy(_$self, false, null, null, selector))
    }

    if (_$target !== _$self) {
      if (value === _self || value === _$self[$RIND]) {
        // If going to assigning property to self, instead assign it to the copy
        value = _$target[$RIND]
      }
    }
    InSetProperty(_$target, selector, value)
    return true
  }


  InnerBarrier_prototype.deleteProperty = function deleteProperty(_$self, selector) {
    var _$target, assigner, _$copy, value, value$root
    _$target = this._$target
    assigner = _$target[$ASSIGNERS][selector]

    if (assigner && assigner.name === "$assignmentError") {
      return DisallowedDeleteError(_$self, selector) || false
    }

    switch (selector) {
      case $DELETE_IMMUTABILITY   :  // Only called on immutable objects!!!
        _$copy = _$Copy(_$self, false)
        break

      case $DELETE_ALL_PROPERTIES :  // Only called on immutable objects!!!
        _$copy = InterMap.get(new _$self._newBlank())
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

    if (_$self[IS_IMMUTABLE]) {
      if (!this.isInUse) { return ChangeToImmutableThisError(_$self) || false }
      this._$target = _$copy || _$Copy(_$self, false, null, null, selector)
    }
    else {
      delete _$target[selector]
      delete _$target[$OUTER][selector]
      delete _$target[_DURABLES]
    }

    return true
  }

  InnerBarrier_prototype.basicSet    = InnerBarrier_prototype.set
  InnerBarrier_prototype.basicDelete = InnerBarrier_prototype.deleteProperty






  function DisguisedOuterBarrier(_$self, $self, applyHandler) {
    this._$target = _$self
    this.$self    =  $self
    this.apply    = applyHandler
  }

  const DisguisedOuterBarrier_prototype = SpawnFrom(OuterBarrier_prototype)
  DisguisedOuterBarrier.prototype = DisguisedOuterBarrier_prototype


  DisguisedOuterBarrier_prototype.get = function get(func, selector, self) {
    return this.basicGet(this.$self, selector, self)
  }

  DisguisedOuterBarrier_prototype.has = function has(func, selector) {
    return this.basicHas(this.$self, selector)
  }




  function DisguisedInnerBarrier(_$self, applyHandler) {
    this._$self   = _$self
    this._$target = _$self
    this.apply    = applyHandler
    // For the outer the target always stays set to self.
    // It's only needs for Type_apply.
  }

  const DisguisedInnerBarrier_prototype = SpawnFrom(InnerBarrier_prototype)
  DisguisedInnerBarrier.prototype = DisguisedInnerBarrier_prototype


  DisguisedInnerBarrier_prototype.set = function set(func, selector, value, _self) {
    return this.basicSet(this._$self, selector, value, _self)
  }

  DisguisedInnerBarrier_prototype.deleteProperty = function deleteProperty(func, selector) {
    return this.basicDelete(this._$self, selector)
  }





  function SetSuperPropertyFor(_$target, selector, supers) {
    var next, _$nextType, _$nextRoot, value, isDeclared
    const ancestors = _$target.type.ancestry

    next = ancestors.length
    if (!_$target._hasOwn(selector)) { next -= 1 }

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
  SuperBarrier_prototype.get = function get(_$target, selector, _super) {
    const supers = _$target[$SUPERS]
    var   value  = supers[selector]

    do {
      switch (value) {
        case undefined :
          value = SetSuperPropertyFor(_$target, selector, supers)
          break

        case IMPLEMENTATION :
          return _$target[selector]

        case IMMEDIATE :
          return supers[$IMMEDIATES][selector].call(_$target[$PULP])

        case NO_SUPER :
          return _$target
            ._unknownProperty.call(_$target[$PULP], selector, false)

        default :
          return value
      }
    } while (true)
  }

  // eslint-disable-next-line
  SuperBarrier_prototype.set = function set(_$target, selector, value, _super) {
    return AssignmentViaSuperError(_$target[$RIND]) || false
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


  _Shared._Super                = new SuperBarrier()
  _Shared.Impermeable           = Impermeable
  _Shared.InnerBarrier          = InnerBarrier
  _Shared.DisguisedOuterBarrier = DisguisedOuterBarrier
  _Shared.DisguisedInnerBarrier = DisguisedInnerBarrier
  _Shared.SuperBarrier          = SuperBarrier
  _Shared.Permeable             = Permeable

})


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


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
