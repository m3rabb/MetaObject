// $Innate methods
//   id
//   _basicSet
//   other basicMethods
//   $
//   _super
//   isPermeable
//   isImmutable|isMutable
//   beImmutable
//   typeMembership methods
//   asMutable|asCopy
//   copying methods
//
// USER CAN/SHOULD NEVER REDEFINE INATE METHODS

Tranya(function (
  $BLANKER, $DELETE_IMMUTABILITY, $INNER, $IS_DEFINITION, $IS_IMPENETRABLE,
  $OUTER, $OWN_DEFINITIONS, $PULP, $RIND,
  DECLARATION, IS_IMMUTABLE, LAZY_INSTALLER, _DURABLES,
  IDEMPOT_SELF_METHOD, IDEMPOT_VALUE_METHOD, TRUSTED_VALUE_METHOD,
  $Intrinsic$root$inner, AsName, CrudeBeImmutable, ExtractDefinitionFrom,
  FindAndSetDurables, MakeDefinitionsInfrastructure, NewUniqueId, OwnSelectors,
  PropertyAt, SetDefinition, SetInvisibly, SignalError, SpawnFrom, ValueAsFact,
  _HasOwn, _$Copy, _$Intrinsic,
  InterMap, PropertyToSymbolMap,
  OwnNames, OwnVisibleNames,
  CompletelyDeleteProperty, DefineProperty,
  KnownSelectorsSorted, OwnSelectorsSorted
) {
  // "use strict"





  _$Intrinsic.addMethod(function isMutable() {
    return !this[IS_IMMUTABLE]
  }, IDEMPOT_VALUE_METHOD)

  _$Intrinsic.addMethod(function isFact() {
    return this[IS_IMMUTABLE] ? true : (this.id != null)
  }, IDEMPOT_VALUE_METHOD)


  _$Intrinsic.addMethod(function isA(type) {
    return this[type.membershipSelector]
  }, IDEMPOT_VALUE_METHOD)




  _$Intrinsic.addMethod(function copy(visited_asImmutable_, visited_, context__) {
    const $inner = this[$INNER]
    const [asImmutable, visited, context] =
      (typeof visited_asImmutable_ === "object") ?
        [undefined           , visited_asImmutable_, visited_ ] :
        [visited_asImmutable_, visited_            , context__]

    return (($inner[IS_IMMUTABLE] && asImmutable !== false) ? // true or undefined
      $inner : _$Copy($inner, asImmutable, visited, context))[$RIND]
  }, IDEMPOT_VALUE_METHOD)

  _$Intrinsic.addMethod(function immutableCopy(visited_) {
    const $inner = this[$INNER]
    return ($inner[IS_IMMUTABLE] ?
      $inner : _$Copy($inner, true, visited_))[$RIND]
  }, IDEMPOT_VALUE_METHOD)

  _$Intrinsic.addMethod(function mutableCopy(visited_) {
    return _$Copy(this[$INNER], false, visited_)[$RIND]
  }, IDEMPOT_VALUE_METHOD)

  _$Intrinsic.addMethod(function mutableCopyExcept(selector) {
    return _$Copy(this[$INNER], false, null, null, selector)[$RIND]
  }, IDEMPOT_VALUE_METHOD)

  // Thing.add(function _nonCopy() {
  //   return (this[IS_FACT] === IMMUTABLE) ? this._newBlank() : this
  // })


  _$Intrinsic.addMethod(function asCopy() {
    const $inner = this[$INNER]
    return ($inner[IS_IMMUTABLE] ? $inner : _$Copy($inner, false))[$RIND]
  }, IDEMPOT_VALUE_METHOD)

  _$Intrinsic.addMethod(function asMutableCopy() {
    return _$Copy(this[$INNER], false)[$RIND]
  }, IDEMPOT_VALUE_METHOD)

  _$Intrinsic.addMethod(function asFact() {
    const $inner = this[$INNER]
    return ($inner[IS_IMMUTABLE] || ($inner.id != null)) ?
      $inner : _$Copy($inner, true)[$RIND]
  }, IDEMPOT_VALUE_METHOD)

  _$Intrinsic.addMethod(function asImmutable() {
    const $inner = this[$INNER]
    return ($inner[IS_IMMUTABLE] ? $inner : _$Copy($inner, true))[$RIND]
  }, IDEMPOT_VALUE_METHOD)

  _$Intrinsic.addMethod(function asMutable() {
    const $inner = this[$INNER]
    return ($inner[IS_IMMUTABLE] ? _$Copy($inner, false) : $inner)[$RIND]
  }, IDEMPOT_VALUE_METHOD)





  // _$Intrinsic.addMethod(function _basicGet(property) {
  //
  // }, BASIC_VALUE_METHOD)


  _$Intrinsic.addMethod(function setImmutable(visited_inPlace_, visited_) {
    if (this[IS_IMMUTABLE]) { return this }
    const [inPlace, visited] = (typeof visited_inPlace_ === "object") ?
      [undefined, visited_inPlace_] : [visited_inPlace_, visited_]

    this._setImmutable(inPlace, visited)
  }, TRUSTED_VALUE_METHOD)


  _$Intrinsic.addMethod(function beImmutable() {
    if (!this[IS_IMMUTABLE]) { this._setImmutable() }
  }, TRUSTED_VALUE_METHOD)


  // This method should only be called on a mutable object!!!
  _$Intrinsic.addMethod(function _setImmutable(inPlace, visited) {
    var durables, selector, next, value, nextValue
    const $inner                  = this[$INNER]
    const $rind                   = $inner[$RIND]
    const _setPropertiesImmutable = $inner._setPropertiesImmutable

    visited = visited || new WeakMap()
    visited.set($rind, $rind)

    if (_setPropertiesImmutable) {
      _setPropertiesImmutable.call(this, inPlace, visited)
    }
    else {
      durables = $inner[_DURABLES] || FindAndSetDurables($inner)
      next      = durables.length

      while (next--) {
        selector = durables[next]
        if (selector[0] !== "_") { continue }

        value     = $inner[selector]
        nextValue = ValueAsFact(value, inPlace, visited)
        if (nextValue !== value) { $inner[selector] = nextValue }
      }
    }

    return this._basicSetImmutable()
  })



  _$Intrinsic.addMethod(function _newBlank() {
    const $inner     = this[$INNER]
    const _$instance = new $inner[$BLANKER]()
    const $instance  = new _$instance[$OUTER]

    if ($inner[$OUTER].this) {
      SetInvisibly($instance, "this", _$instance[$PULP])
    }
    return _$instance[$RIND]
  }, IDEMPOT_VALUE_METHOD)




  _$Intrinsic.addMethod(function _knownSelectors() {
    return KnownSelectorsSorted(this[$INNER], OwnSelectors)
  }, IDEMPOT_VALUE_METHOD)

  _$Intrinsic.addMethod(function _inheritedSelectors() {
    return this.type.allKnownSelectors
  }, TRUSTED_VALUE_METHOD)

  _$Intrinsic.addMethod(function visibleSelectors() {
    return KnownSelectorsSorted(this[$OUTER], OwnVisibleNames)
  }, IDEMPOT_VALUE_METHOD)

  _$Intrinsic.addMethod(function _ownSelectors() {
    // All string and symbol properties, includes invisibles
    return OwnSelectorsSorted(this[$INNER])
  }, IDEMPOT_VALUE_METHOD)

  _$Intrinsic.addMethod(function ownSelectors() {
    // Includes placed retroactive|lazy properties, but not symbols
    return CrudeBeImmutable(OwnNames(this[$OUTER]).sort())
  }, IDEMPOT_VALUE_METHOD)


  _$Intrinsic.addMethod("_hasOwn", _HasOwn, IDEMPOT_VALUE_METHOD)

  _$Intrinsic.addMethod(function hasOwn(selector) {
    switch (selector[0]) {
      case undefined : return null  // "Shrug when selector is a symbol
      case "_"       : return false
      default        : return this._hasOwn(selector)
    }
  }, IDEMPOT_VALUE_METHOD)


  _$Intrinsic.addMethod(function _has(selector) {
    return (selector in this[$INNER])
  }, IDEMPOT_VALUE_METHOD)

  _$Intrinsic.addMethod(function has(selector) {
    return (selector in this[$OUTER])
  }, IDEMPOT_VALUE_METHOD)



  _$Intrinsic.addMethod(function _basicSet(property, value) {
    const selector = PropertyToSymbolMap[property] || property
    this[selector] = value
  }, TRUSTED_VALUE_METHOD)



  // Note: This method might need to be moved to _$Something!!!
  //
  // It's not enough to simple make this method access the receiver's barrier.
  // Th receiver only references its original barrier, and there may be more than
  // one proxy/barrier associated with the receiver, so we need to invoke the
  // proxy to force the proper change to occur thru it.
  _$Intrinsic.addMethod(function _retarget() {
    const $inner = this[$INNER]

    if ($inner[IS_IMMUTABLE]) {
      delete this[$DELETE_IMMUTABILITY]
      return this
    }

    return SetInvisibly($inner, "_retarget", this)
  }, IDEMPOT_SELF_METHOD)



  // _$Intrinsic.addMethod(function _knowns(propertyName) {
  //   const properties = this[_DURABLES] || FindAndSetDurables(this)
  //   return (properties[propertyName] !== undefined)
  // }, BASIC_VALUE_METHOD)


  // const ancestry = this.ancestry
  // const knowns   = SpawnFrom(null)
  // var   next, _$nextType, nextDefinitions, tag, value
  //
  // next = ancestry.length
  // while (next--) {
  //   _$nextType      = InterMap.get(ancestry[next])
  //   nextDefinitions = _$nextType._definitions
  //
  //   for (tag in nextDefinitions) {
  //     if (!knowns[tag]) {
  //       knowns[tag] = true
  //       value       = nextDefinitions[tag]
  //       this._setDefinitionAt(tag, value, REINHERIT)
  //     }
  //   }
  // }



  _$Intrinsic.addMethod(function basicId() {
    const suffix = this.isPermeable ? "_" : ""
    return `#${this.uid}.${this.type.name}${suffix}`
  }, TRUSTED_VALUE_METHOD)


  _$Intrinsic.addRetroactiveProperty(function uid() {
    return this._hasOwn("guid") ? this.guid : NewUniqueId()
  }, TRUSTED_VALUE_METHOD)



  _$Intrinsic.addMethod(function oid() {
    const suffix = this.isPermeable ? "_" : ""
    return `${this.iid}.${this.type.formalName}${suffix}`
  }, TRUSTED_VALUE_METHOD)


  _$Intrinsic.addRetroactiveProperty(function iid() {
    return InterMap.get(this.type)[$PULP]._nextIID
  }, IDEMPOT_VALUE_METHOD)



  _$Intrinsic.addMethod(function typeName() {
    return this.type.name
  }, TRUSTED_VALUE_METHOD)



  _$Intrinsic.addMethod(function beImpenetrable() {
    this[$INNER][$IS_IMPENETRABLE] = true
  }, IDEMPOT_VALUE_METHOD)


  _$Intrinsic.addMethod(function isImpenetrable() {
    return this[$IS_IMPENETRABLE] || false
  }, IDEMPOT_VALUE_METHOD)



  // uri

  // @NamedFunction
  // Navel/30303/Type/367


  // _$Intrinsic.addMethod(function addOwnLazyProperty(...namedFunc_name__handler) {
  //   return this.addOwnMethod(...namedFunc_name__handler, LAZY_INSTALLER)
  // }, BASIC_SELF_METHOD)
  //

  _$Intrinsic.addMethod(function addOwnAlias(aliasSelector, selector_definition) {
    var value, _$value
    if (typeof selector_definition !== "string") { value = selector_definition }
    else {
        value = this._propertyAt(selector_definition)
      _$value = InterMap.get(value)
      if (!_$value || !_$value[$IS_DEFINITION]) {
        return this._unknownMethodToAliasError(selector_definition)
      }
    }
    this.addOwnDefinition(aliasSelector, value)
  }, TRUSTED_VALUE_METHOD)



  _$Intrinsic.addMethod(function addOwnDeclaration(selector) {
    this.addOwnDefinition(selector, null, DECLARATION)
  }, TRUSTED_VALUE_METHOD)



  _$Intrinsic.addMethod(function addOwnMethod(namedFunc_name, func_, mode__) {
    this.addOwnDefinition(namedFunc_name, func_, mode__)
  }, TRUSTED_VALUE_METHOD)


  _$Intrinsic.addMethod(function _addOwnDurable(selector) {
    var durables = this[_DURABLES] || []
    if (!durables.includes(selector)) {
      this[$INNER][_DURABLES] = CrudeBeImmutable([...durables, selector])
      this.addOwnDeclaration(selector)
    }
  }, TRUSTED_VALUE_METHOD)


  _$Intrinsic.addMethod(function _addOwnDurables(selectors) {
    selectors.forEach(selector => this._addOwnDurable(selector))
  }, TRUSTED_VALUE_METHOD)



  // addOwnDefinition(definition)
  // addOwnDefinition(tag, definition)
  // addOwnDefinition(namedFunc, mode_)
  // addOwnDefinition(selector, func, mode_)

  _$Intrinsic.addMethod(function addOwnDefinition(...args) {
    const definition   = ExtractDefinitionFrom(args, this.context)
    const tag          = definition.tag
    const $inner       = this[$INNER]
    var   definitions  = $inner[$OWN_DEFINITIONS]

    if (definitions && definitions[tag] === definition) { return this }
    this._retarget

    if (definitions) {
      CompletelyDeleteProperty($inner, definition.selector)
    }
    else {
      definitions = ($inner[$OWN_DEFINITIONS] = SpawnFrom(null))
      MakeDefinitionsInfrastructure($inner, $inner) // Check if this is right!!!
    }

    SetDefinition($inner, definition)
    definitions[tag] = definition
  }, TRUSTED_VALUE_METHOD)



  _$Intrinsic.addMethod(function _propertyAt(selector) {
    return PropertyAt(this[$INNER], selector)
  }, IDEMPOT_VALUE_METHOD)

  _$Intrinsic.addMethod(function propertyAt(selector) {
    return (selector[0] !== "_") ? PropertyAt(this[$INNER], selector) : null
    // If restoring the following, also add it back to InSetProperty.
    // return ((selector.charAt) ? selector[0] : selector.toString()[7] !== "_") ?
    //   PropertyAt(this[$INNER], selector) : null
  }, IDEMPOT_VALUE_METHOD)



  // _$Intrinsic.addMethod(function _addOwnValueMethod(...namedFunc_name__handler) {
  //   this.addOwnMethod(...namedFunc_name__handler, VALUE_METHOD)
  // })
  //
  // _$Intrinsic.addMethod(function _addOwnValueImmediate(...namedFunc_name__handler) {
  //   this.addOwnMethod(...namedFunc_name__handler, VALUE_IMMEDIATE)
  // })

  // _$Intrinsic.addMethod(function addOwnAssigner(assigner_property, assigner_) {
  //   this.addOwnMethod(...namedFunc_name__handler, VALUE_IMMEDIATE)
  // })
  //
  // _$Intrinsic.addMethod(function addOwnMandatorySetter(setter_property, setter_) {
  //   this.addOwnMethod(...namedFunc_name__handler, VALUE_IMMEDIATE)
  // })


  _$Intrinsic.addMethod(Symbol.toPrimitive, function (hint) { // eslint-disable-line
    return this.toString()
  }, TRUSTED_VALUE_METHOD)



  _$Intrinsic.addMethod(function _unknownProperty(selector) {
    return this._signalError(`Receiver ${this.basicId} doesn't have a property '${AsName(selector)}'!!`)
  })

  //_$Intrinsic.addMethod("_basicUnknownProperty", $Intrinsic$root$inner._unknownProperty)
  _$Intrinsic.addAlias("_basicUnknownProperty", "_unknownProperty")



  _$Intrinsic.addMethod(function _signalError(message) {
    return SignalError(this, message)
  })


})



// _beMutable _touch _captureChanges



// _$Intrinsic.addMethod(function _retargetAsBlank() {
//   const $inner = this[$INNER]
//
//   if ($inner[IS_IMMUTABLE]) {
//     delete this.[$DELETE_ALL_PROPERTIES]
//   }
//   else {
//    DefineProperty($inner, "_retarget", InvisibleConfig)
//    InSetProperty($inner, "_retarget", this)
//   }
//   return this
// }, BASIC_SELF_METHOD)




// _overwrite // _touchAsBlank  // _retargetAsBlank // _captureOverwrite

// _$Intrinsic.addImmediate(function _captureChanges() {
//   const $inner = this[$INNER]
//   if ($inner[IS_IMMUTABLE]) { delete this[_DELETE_IMMUTABILITY] }
//   DefineProperty($inner, "_captureChanges", InvisibleConfig)
//   return ($inner._captureChanges = this)
// }, BASIC_SELF_METHOD)
//
//
// _$Intrinsic.addImmediate(function _captureOverwrite() {
//   const $inner = this[$INNER]
//   if ($inner[IS_IMMUTABLE]) { delete this[_DELETE_ALL_PROPERTIES] }
//   DefineProperty($inner, "_captureOverwrite", InvisibleConfig)
//   return ($inner._captureOverwrite = this)
// }, BASIC_SELF_METHOD)

// Must we delete the _captureChanges and _captureOverwrite when copying or
// otherwise done using them???


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/





// AddMethod(_Primordial_root, function hasMethod(selector) {
//   return this[__type].methodAt(selector) != null
// })
//
//
//
//
//
// AddMethod(_Primordial_root, function execWithAll(selector, args) {
//   return Reflect_apply(this[selector], this, args)
// })
//
// AddMethod(_Primordial_root, function exec(selector, ...args) {
//   return Reflect_apply(this[selector], this, args)
// })
//
// AddMethod(_Primordial_root, function _asExecWithAll(type, selector, args) {
//   return Reflect_apply(type.methodAt(selector), this, args)
// })
//
// AddMethod(_Primordial_root, function _asExec(type, selector, ...args) {
//   return Reflect_apply(type.methodAt(selector), this, args)
// })
//
// AddMethod(_Primordial_root, function _superExecWithAll(selector, args) {
//   const method = this[selector]
//   const ancestors = this.withAncestorTypes()
//   let next = ancestors.length
//   while (next--) {
//     let type = ancestors[next]
//     let superMethod = type._methods[selector]
//     if (superMethod && superMethod !== method) {
//       return Reflect_apply(superMethod, this, args) // do these need to be protected too???
//     }
//   }
//   return this._noSuchMethod(selector, args)
// })
//
// AddMethod(_Primordial_root, function _superExec(selector, ...args) {
//   return this._superExecWithAll(selector, args)
// })




// “Innate” means “born with” and should be applied only to living things.
// “Inherent” means “essential” or “intrinsic” and is best applied to objects or ideas.
//
// http://people.physics.illinois.edu/Celia/MsP/Innate-Inherent.pdf
