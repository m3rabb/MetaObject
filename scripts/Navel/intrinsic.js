// Programmers should never redefine these intrinsic methods!!!

HandAxe(function (
  $BLANKER, $IMMEDIATES, $INNER, $IS_DEFINITION, $IS_IMPENETRABLE, $PRIOR_IDS,
  $OUTER, $OWN_DEFINITIONS, $PULP, $RIND, DECLARATION, FACT_METHOD, IMMUTABLE,
  INVISIBLE, LAZY_INSTALLER, SYMBOL_1ST_CHAR, VALUE_METHOD, _DURABLES,
  AsDefinitionFrom, BasicSetInvisibly, CompareSelectors, DefineProperty,
  CompletelyDeleteProperty, DeclareImmutable, GetDurables, InvisibleConfig,
  IsPublicSelector, MakeDefinitionsInfrastructure, NewUniqueId,
  NormalizeCopyArgs, PropertyAt, SetDefinition, SpawnFrom, ValueAsFact,
  ValueAsName, _BasicSetImmutable, _HasOwnHandler, _$Copy, _$Intrinsic,
  PrivateAccessFromOutsideError, SignalError,
  InterMap, PropertyToSymbolMap,
  _PrimaryPublicSelectorsOf, _PrimarySelectorsOf,
  OwnNamesOf, OwnSelectorsOf, OwnVisiblesOf, OwnVisibleNamesOf,
  _KnownNamesOf, _KnownSelectorsOf, _KnownVisiblesOf, _KnownVisibleNamesOf,
  DiffAndSort, IntersectAndSort
) {
  "use strict"




  //// INITIALIZING ////

  _$Intrinsic.addDeclaration("_initFrom_")
  _$Intrinsic.addDeclaration("_postInit")




  //// INTRINSIC ////

  //// INTRINSIC : Immutablility

  _$Intrinsic.addValueMethod(function beImmutable() {
    return this[IMMUTABLE] ? this : this._setImmutable()
  })

  _$Intrinsic.addValueMethod(function setImmutable(inPlace_, visited_) {
    if (this[IMMUTABLE]) { return this }
    const [inPlace, visited] = (typeof inPlace_ === "object") ?
      [undefined, inPlace_] : [inPlace_, visited_]
    return this._setImmutable(inPlace, visited)
  })


  // This method should only be called on a mutable object!!!
  _$Intrinsic.addValueMethod(function _setImmutable(inPlace, visited) {
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
      durables = $inner[_DURABLES] || GetDurables($inner)
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

  _$Intrinsic.addDeclaration("_setPropertiesImmutable")



  //// INTRINSIC : Permeability

  _$Intrinsic.addValueMethod(function beImpenetrable() {
    this[$INNER][$IS_IMPENETRABLE] = true
    return this
  })



  //// INTRINSIC : Exception Handling

  // eslint-disable-next-line
  _$Intrinsic.addValueMethod(function _unknownProperty(selector) {
    return undefined
  })

  _$Intrinsic.addValueMethod(function _externalPrivateAccess(selector) {
    return this._externalPrivateAccessError(selector)
  })




  //// TESTING ////

  //// TESTING : Intrinsic

  _$Intrinsic.addValueMethod(function isMutable() {
    return !this[IMMUTABLE]
  })

  _$Intrinsic.addValueMethod(function isFact() {
    return this[IMMUTABLE] || (this.id != null)
  })

  _$Intrinsic.addValueMethod(function isA(type) {
    return this[type.membershipSelector]
  })

  _$Intrinsic.addValueMethod(function isImpenetrable() {
    return this[$IS_IMPENETRABLE] || false
  })



  //// TESTING : Selectors

  _$Intrinsic.addValueMethod(function hasOwn(selector) {
    switch (selector[0]) {
      case undefined : return undefined  // "Shrug when selector is a symbol
      case "_"       : return undefined
      default        : return this._hasOwn(selector)
    }
  })

  _$Intrinsic.addValueMethod(function has(selector) {
    return (selector in this[$OUTER])
  })


  _$Intrinsic.addValueMethod("_hasOwn", _HasOwnHandler)

  _$Intrinsic.addValueMethod(function _has(selector) {
    return (selector in this[$INNER])
  })




  //// SETTING ////

  _$Intrinsic.addSetter("basicSetId", function id(newId_) {
    const existingId = this.id
    if (existingId == null) {
      this._retarget
      const $inner = this[$INNER]
      DefineProperty($inner        , "id", InvisibleConfig)
      DefineProperty($inner[$OUTER], "id", InvisibleConfig)
      return (newId_ !== undefined) ? newId_ : this.oid
    }
    if (newId_ == null || newId_ === existingId) { return existingId }

    if (existingId != null) {
      const $inner   = this[$INNER]
      const priorIds = this[$PRIOR_IDS] || []
      $inner[$PRIOR_IDS] = [...priorIds, existingId]
    }
    return newId_
  })


  _$Intrinsic.addValueMethod(function _basicSet(selector, value, visibility_) {
    if (visibility_ !== undefined) {
      const $inner = this[$INNER]
      DefineProperty($inner, selector, InvisibleConfig)
      if (IsPublicSelector(selector)) {
        DefineProperty($inner[$OUTER], selector, InvisibleConfig)
      }
    }
    selector = PropertyToSymbolMap[selector] || selector
    this[selector] = value
    return this
  })


  _$Intrinsic.addSetter("basicSetContext", "context")




  //// ACCESSING ////

  //// ACCESSING : Ids

  _$Intrinsic.addValueMethod(function oid() {
    const permeability = this.isPermeable ? "._" : ""
    return `${this.iid}${permeability}.${this.type.formalName}`
  })

  _$Intrinsic.addValueMethod(function basicId() {
    const permeability = this.isPermeable ? "._" : ""
    return `#${this.uid}${permeability}.${this.type.name}`
  })

  _$Intrinsic.addRetroactiveValue(function iid() {
    return InterMap.get(this.type)[$PULP]._nextIID
  })

  _$Intrinsic.addRetroactiveValue(function uid() {
    return this._hasOwn("guid") ? this.guid : NewUniqueId()
  })



  //// ACCESSING : Intrinsic

  _$Intrinsic.addValueMethod(function typeName() {
    return this.type.name
  })

  _$Intrinsic.addValueMethod(function contextName() {
    return this.context.name
  })



  //// ACCESSING : Selector introspection

  _$Intrinsic.addValueMethod(function ownVisibleNameSelectors() {
    // Not retroactive|lazy properties or symbols
    return OwnVisibleNamesOf(this[$OUTER])
  })

  _$Intrinsic.addValueMethod(function ownNameSelectors() {
    // Includes placed retroactive|lazy properties, but not symbols
    return OwnNamesOf(this[$OUTER])
  })


  _$Intrinsic.addValueMethod(function primarySelectors() {
    return _PrimaryPublicSelectorsOf(this)
  })

  _$Intrinsic.addValueMethod(function primaryImmediates() {
    const immediates = _KnownSelectorsOf(this[$IMMEDIATES])
    return IntersectAndSort(this.primarySelectors, immediates)
  })

  _$Intrinsic.addValueMethod(function knownIntrinsicSelectors() {
    return _KnownVisiblesOf(_$Intrinsic._blanker.$root$outer)
  })

  _$Intrinsic.addValueMethod(function visibleNameSelectors() {
    return _KnownVisibleNamesOf(this[$OUTER])
  })

  _$Intrinsic.addValueMethod(function knownNameSelectors() {
    // All selectors except symbols or private selectors
    return _KnownNamesOf(this[$OUTER])
  })



  _$Intrinsic.addValueMethod(function _ownVisibleSelectors() {
    return OwnVisiblesOf(this[$INNER])
  })

  _$Intrinsic.addValueMethod(function _ownInvisibleSelectors() {
    return DiffAndSort(
      this._ownSelectors, this._ownVisibleSelectors, CompareSelectors)
  })

  _$Intrinsic.addValueMethod(function _ownSelectors() {
    // All string and symbol properties, includes invisibles
    return OwnSelectorsOf(this[$INNER])
  })


  _$Intrinsic.addValueMethod(function _primarySelectors() {
    return _PrimarySelectorsOf(this)
  })

  _$Intrinsic.addValueMethod(function _primaryImmediates() {
    const immediates = _KnownSelectorsOf(this[$IMMEDIATES])
    return IntersectAndSort(this._primarySelectors, immediates)
  })

  _$Intrinsic.addValueMethod(function _intrinsicSelectors() {
    return _KnownSelectorsOf(_$Intrinsic._blanker.$root$inner)
  })

  _$Intrinsic.addValueMethod(function _visibleSelectors() {
    return _KnownVisiblesOf(this[$INNER])
  })

  _$Intrinsic.addValueMethod(function _invisibleSelectors() {
    return DiffAndSort(
      this._knownSelectors, this._visibleSelectors, CompareSelectors)
  })

  _$Intrinsic.addValueMethod(function _knownSelectors() {
    return _KnownSelectorsOf(this[$INNER])
  })



  //// ACCESSING : Properties

  _$Intrinsic.addMethod(function propertyAt(selector) {
    return (selector[0] !== "_") ? PropertyAt(this[$INNER], selector) : null
    // If restoring the following, also add it back to InSetProperty.
    // return ((selector[0] || selector.toString()[SYMBOL_1ST_CHAR]) !== "_") ?
    //   PropertyAt(this[$INNER], selector) : null
  })


  _$Intrinsic.addValueMethod(function _propertyAt(selector) {
    return PropertyAt(this[$INNER], selector)
  })




  //// COPYING ////

  _$Intrinsic.addValueMethod(function copy(asImmutable_, visited_, context_) {
    var _value, context
    const $inner    = this[$INNER]
    const optionals = NormalizeCopyArgs(asImmutable_, visited_, context_)
    if ($inner[IMMUTABLE] && optionals[0] !== false) {
      _value = this[$PULP]
      // When the value has an id, we always want the same value
      if (_value.id != null)                         { return this }
      context = optionals[2]
      if (!context || _value.context === context)    { return this }
      // When the context is different, it's properties may need to be
      // created from the corresponding types in the new context.
      // But if it used _BasicSetImmutable (e.g. Definitions), then it
      // only refs primitive values, so no need to make a new copy.
      if (this._setImmutable === _BasicSetImmutable) { return this }
    }
    return _$Copy($inner, ...optionals)[$RIND]
  })

  _$Intrinsic.addValueMethod(function immutableCopy(visited_, context_) {
    var _value, optionals, context
    const $inner = this[$INNER]
    if ($inner[IMMUTABLE]) {
      _value = this[$PULP]
      // When the value has an id, we always want the same value
      if (_value.id != null)                         { return this }
      optionals = NormalizeCopyArgs(true, visited_, context_)
      context   = optionals[2]
      if (!context || _value.context === context)    { return this }
      if (this._setImmutable === _BasicSetImmutable) { return this }
    }
    else { optionals = NormalizeCopyArgs(true, visited_, context_) }
    return _$Copy($inner, ...optionals)[$RIND]
  })

  _$Intrinsic.addValueMethod(function mutableCopy(visited_, context_) {
    const optionals = NormalizeCopyArgs(false, visited_, context_)
    return _$Copy(this[$INNER], ...optionals)[$RIND]
  })

  _$Intrinsic.addValueMethod(function mutableCopyExcept(selector, visited_, context_) {
    const optionals = NormalizeCopyArgs(false, visited_, context_)
    return _$Copy(this[$INNER], ...optionals, selector)[$RIND]
  })


  _$Intrinsic.addValueMethod(function asCopy() {
    const $inner = this[$INNER]
    return ($inner[IMMUTABLE] ? $inner : _$Copy($inner))[$RIND]
  })

  _$Intrinsic.addValueMethod(function asImmutable() {
    const $inner = this[$INNER]
    return ($inner[IMMUTABLE] ? $inner : _$Copy($inner, true))[$RIND]
  })

  _$Intrinsic.addValueMethod(function asMutable() {
    const $inner = this[$INNER]
    return ($inner[IMMUTABLE] ? _$Copy($inner, false) : $inner)[$RIND]
  })

  _$Intrinsic.addValueMethod(function asFact() {
    const $inner = this[$INNER]
    return ($inner[IMMUTABLE] || $inner.id != null) ?
      $inner : _$Copy($inner, true)[$RIND]
  })




  //// ADDING ////

  // eslint-disable-next-line
  _$Intrinsic.addSelfMethod(function addOwnMethod(selector_, func, mode_) {
    const definition = this.context.Definition(selector_, func, mode_)
    this.addOwnDefinition(definition)
  })

  _$Intrinsic.addSelfMethod(function addOwnAlias(aliasSelector, selector_definition) {
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
  })

  _$Intrinsic.addSelfMethod(function addOwnDeclaration(selector) {
    this.addOwnDefinition(selector, undefined, DECLARATION)
  })

  // addOwnDefinition(definition)
  // addOwnDefinition(tag, definition)
  // addOwnDefinition(namedFunc, mode_)      <<--- This one is broken!!!
  // addOwnDefinition(selector, func, mode_) <<--- This one is broken!!!

  _$Intrinsic.addSelfMethod(function addOwnDefinition(...args) {
    const definition   = AsDefinitionFrom(args, this.context)
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
  })


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

  // _$Intrinsic.addMethod(function addOwnLazyProperty(...namedFunc_name__handler) {
  //   return this.addOwnMethod(...namedFunc_name__handler, LAZY_INSTALLER)
  // }, BASIC_SELF_METHOD)




  _$Intrinsic.addSelfMethod(function _addOwnDurable(selector) {
    var durables = this[_DURABLES] || []
    if (!durables.includes(selector)) {
      this[$INNER][_DURABLES] = DeclareImmutable([...durables, selector])
      this.addOwnDeclaration(selector)
    }
  })

  _$Intrinsic.addSelfMethod(function _addOwnDurables(selectors) {
    selectors.forEach(selector => this._addOwnDurable(selector))
  })




  //// CONVERTING ////

  _$Intrinsic.addValueMethod(Symbol.toPrimitive, function (hint) { // eslint-disable-line
    return this.toString()
  }, "INVISIBLE")




  //// INSTANTIATING ////

  _$Intrinsic.addValueMethod(function _newBlank() {
    const $inner     = this[$INNER]
    const _$instance = new $inner[$BLANKER]()
    const $instance  = new _$instance[$OUTER]

    if ($inner[$OUTER].this) {
      BasicSetInvisibly($instance, "this", _$instance[$PULP])
    }
    return _$instance[$RIND]
  })

  // _$Intrinsic.addValueMethod(function _nonCopy() {
  //   return this[IMMUTABLE] ? this._newBlank() : this
  // })




  //// ERROR HANDLING ////

  _$Intrinsic.addValueMethod(function _notYetImplemented(selector) {
    this._signalError(
      `The method ${ValueAsName(selector)} has not been implemented yet!!`)
  })

  _$Intrinsic.addValueMethod(function _signalError(message) {
    return SignalError(this, message)
  })


  _$Intrinsic.addValueMethod(function _unknownPropertyError(selector) {
    return this._signalError(`Unknown property '${ValueAsName(selector)}'!!`)
  }, "INVISIBLE")

  _$Intrinsic.addValueMethod(function _externalPrivateAccessError(selector) {
    return this._signalError(
      `External access to private property '${ValueAsName(selector)}' is forbidden!!`)
  }, "INVISIBLE")

})

/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// “Innate” means “born with” and should be applied only to living things.
// “Inherent” means “essential” or “intrinsic” and is best applied to objects or ideas.
//
// http://people.physics.illinois.edu/Celia/MsP/Innate-Inherent.pdf



// _$Intrinsic.addMethod(function _retargetAsBlank() {
//   const $inner = this[$INNER]
//
//   if ($inner[IMMUTABLE]) {
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
//   if ($inner[IMMUTABLE]) { delete this[_DELETE_IMMUTABILITY] }
//   DefineProperty($inner, "_captureChanges", InvisibleConfig)
//   return ($inner._captureChanges = this)
// }, BASIC_SELF_METHOD)
//
//
// _$Intrinsic.addImmediate(function _captureOverwrite() {
//   const $inner = this[$INNER]
//   if ($inner[IMMUTABLE]) { delete this[_DELETE_ALL_PROPERTIES] }
//   DefineProperty($inner, "_captureOverwrite", InvisibleConfig)
//   return ($inner._captureOverwrite = this)
// }, BASIC_SELF_METHOD)

// Must we delete the _captureChanges and _captureOverwrite when copying or
// otherwise done using them???



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
