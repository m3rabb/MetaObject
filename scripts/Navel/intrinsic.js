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
  $OUTER, $OWN_DEFINITIONS, $PULP, $RIND, DECLARATION, FACT_METHOD,
  IS_IMMUTABLE, LAZY_INSTALLER, SYMBOL_1ST_CHAR, VALUE_METHOD, _DURABLES,
  $Intrinsic$root$inner, AsName, CrudeBeImmutable, ExtractDefinitionFrom,
  FindAndSetDurables, MakeDefinitionsInfrastructure, NewUniqueId, OwnSelectors,
  PropertyAt, SetDefinition, SetInvisibly, SpawnFrom, ValueAsFact,
  _HasOwn, _$Copy, _$Intrinsic,
  PrivateAccessFromOutsideError, SignalError,
  InterMap, PropertyToSymbolMap,
  OwnNames, OwnVisibleNames,
  CompletelyDeleteProperty, DefineProperty,
  KnownSelectorsSorted, OwnSelectorsSorted
) {
  // "use strict"





  _$Intrinsic.addValueMethod(function isMutable() {
    return !this[IS_IMMUTABLE]
  })

  _$Intrinsic.addValueMethod(function isFact() {
    return this[IS_IMMUTABLE] || (this.id != null)
  })


  _$Intrinsic.addValueMethod(function isA(type) {
    return this[type.membershipSelector]
  })




  _$Intrinsic.addValueMethod(function copy(
    visited_asImmutable_, visited_, context__, exceptSelector___
  ) {
    const $inner = this[$INNER]
    const [asImmutable, visited, context, selector] =
      (typeof visited_asImmutable_ === "object") ?
        [undefined, visited_asImmutable_, visited_, context__] :
        [visited_asImmutable_, visited_, context__, exceptSelector___]

    if ($inner[IS_IMMUTABLE] && asImmutable !== false) {
      if (!context || $inner.context === context) { return $inner[$RIND] }
    }
    return _$Copy($inner, asImmutable, visited, context, selector)[$RIND]
  })

  _$Intrinsic.addValueMethod(function immutableCopy(visited_, context__) {
    const $inner = this[$INNER]
    if ($inner[IS_IMMUTABLE]) {
      if (!context__ || $inner.context === context__) { return $inner[$RIND] }
    }
    return _$Copy($inner, true, visited_, context__)[$RIND]
  })

  _$Intrinsic.addValueMethod(function mutableCopy(visited_, context__) {
    return _$Copy(this[$INNER], false, visited_, context__)[$RIND]
  })

  _$Intrinsic.addValueMethod(function mutableCopyExcept(selector, visited_, context__) {
    return _$Copy(this[$INNER], false, visited_, context__, selector)[$RIND]
  })

  // Thing.add(function _nonCopy() {
  //   return (this[IS_FACT] === IMMUTABLE) ? this._newBlank() : this
  // })


  _$Intrinsic.addValueMethod(function asCopy() {
    const $inner = this[$INNER]
    return ($inner[IS_IMMUTABLE] ? $inner : _$Copy($inner))[$RIND]
  })

  _$Intrinsic.addValueMethod(function asMutableCopy() {
    return _$Copy(this[$INNER], false)[$RIND]
  })

  _$Intrinsic.addValueMethod(function asImmutableCopy() {
    const $inner = this[$INNER]
    return ($inner[IS_IMMUTABLE] ? $inner : _$Copy($inner, true))[$RIND]
  })

  _$Intrinsic.addValueMethod(function asMutable() {
    const $inner = this[$INNER]
    return ($inner[IS_IMMUTABLE] ? _$Copy($inner, false) : $inner)[$RIND]
  })

  _$Intrinsic.addValueMethod(function asFact() {
    const $inner = this[$INNER]
    return ($inner[IS_IMMUTABLE] || ($inner.id != null)) ?
      $inner : _$Copy($inner, true)[$RIND]
  })

  _$Intrinsic.addAlias("asImmutable", "asImmutableCopy")



  // _$Intrinsic.addMethod(function _basicGet(property) {
  //
  // }, BASIC_VALUE_METHOD)


  _$Intrinsic.addValueMethod(function setImmutable(visited_inPlace_, visited_) {
    if (this[IS_IMMUTABLE]) { return this }
    const [inPlace, visited] = (typeof visited_inPlace_ === "object") ?
      [undefined, visited_inPlace_] : [visited_inPlace_, visited_]

    return this._setImmutable(inPlace, visited)
  })


  _$Intrinsic.addValueMethod(function beImmutable() {
    return this[IS_IMMUTABLE] ? this : this._setImmutable()
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



  _$Intrinsic.addValueMethod(function _newBlank() {
    const $inner     = this[$INNER]
    const _$instance = new $inner[$BLANKER]()
    const $instance  = new _$instance[$OUTER]

    if ($inner[$OUTER].this) {
      SetInvisibly($instance, "this", _$instance[$PULP])
    }
    return _$instance[$RIND]
  })




  _$Intrinsic.addValueMethod(function _knownSelectors() {
    return KnownSelectorsSorted(this[$INNER], OwnSelectors)
  })

  _$Intrinsic.addValueMethod(function _inheritedSelectors() {
    return this.type.allKnownSelectors
  })

  _$Intrinsic.addValueMethod(function _ownSelectors() {
    // All string and symbol properties, includes invisibles
    return OwnSelectorsSorted(this[$INNER])
  })

  _$Intrinsic.addValueMethod(function visibleSelectors() {
    return KnownSelectorsSorted(this[$OUTER], OwnVisibleNames)
  })

  _$Intrinsic.addValueMethod(function ownSelectors() {
    // Includes placed retroactive|lazy properties, but not symbols
    return CrudeBeImmutable(OwnNames(this[$OUTER]).sort())
  })


  _$Intrinsic.addValueMethod("_hasOwn", _HasOwn)

  _$Intrinsic.addValueMethod(function hasOwn(selector) {
    switch (selector[0]) {
      case undefined : return null  // "Shrug when selector is a symbol
      case "_"       : return false
      default        : return this._hasOwn(selector)
    }
  })


  _$Intrinsic.addValueMethod(function _has(selector) {
    return (selector in this[$INNER])
  })

  _$Intrinsic.addValueMethod(function has(selector) {
    return (selector in this[$OUTER])
  })



  _$Intrinsic.addValueMethod(function _basicSet(property, value) {
    const selector = PropertyToSymbolMap[property] || property
    this[selector] = value
    return this
  })



  // Note: This method might need to be moved to _$Something!!!
  //
  // It's not enough to simple make this method access the receiver's barrier.
  // Th receiver only references its original barrier, and there may be more than
  // one proxy/barrier associated with the receiver, so we need to invoke the
  // proxy to force the proper change to occur thru it.
  _$Intrinsic.addValueMethod(function _retarget() {
    const $inner = this[$INNER]

    if ($inner[IS_IMMUTABLE]) {
      delete this[$DELETE_IMMUTABILITY]
      return this
    }

    return SetInvisibly($inner, "_retarget", this)
  })



  _$Intrinsic.addValueMethod(function basicId() {
    const suffix = this.isPermeable ? "_" : ""
    return `#${this.uid}.${this.type.name}${suffix}`
  })


  _$Intrinsic.addRetroactiveValue(function uid() {
    return this._hasOwn("guid") ? this.guid : NewUniqueId()
  })



  _$Intrinsic.addValueMethod(function oid() {
    const suffix = this.isPermeable ? "_" : ""
    return `${this.iid}.${this.type.formalName}${suffix}`
  })


  _$Intrinsic.addRetroactiveValue(function iid() {
    return InterMap.get(this.type)[$PULP]._nextIID
  })



  _$Intrinsic.addValueMethod(function typeName() {
    return this.type.name
  })



  _$Intrinsic.addValueMethod(function beImpenetrable() {
    this[$INNER][$IS_IMPENETRABLE] = true
    return this
  })


  _$Intrinsic.addValueMethod(function isImpenetrable() {
    return this[$IS_IMPENETRABLE] || false
  })



  // uri

  // @NamedFunction
  // Navel/30303/Type/367


  // _$Intrinsic.addMethod(function addOwnLazyProperty(...namedFunc_name__handler) {
  //   return this.addOwnMethod(...namedFunc_name__handler, LAZY_INSTALLER)
  // }, BASIC_SELF_METHOD)
  //

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
    this.addOwnDefinition(selector, null, DECLARATION)
  })


  // eslint-disable-next-line
  _$Intrinsic.addSelfMethod(function addOwnMethod(func_selector, func_, mode__) {
    const [selector, handler, mode = FACT_METHOD] =
      (typeof func_selector === "function") ?
        [func_selector.name, func_selector, func_ ] :
        [func_selector     , func_        , mode__]
    const definition = this.context.Definition(selector, handler, mode)
    this.addOwnDefinition(definition)
  })


  _$Intrinsic.addSelfMethod(function _addOwnDurable(selector) {
    var durables = this[_DURABLES] || []
    if (!durables.includes(selector)) {
      this[$INNER][_DURABLES] = CrudeBeImmutable([...durables, selector])
      this.addOwnDeclaration(selector)
    }
  })


  _$Intrinsic.addSelfMethod(function _addOwnDurables(selectors) {
    selectors.forEach(selector => this._addOwnDurable(selector))
  })



  // addOwnDefinition(definition)
  // addOwnDefinition(tag, definition)
  // addOwnDefinition(namedFunc, mode_)      <<--- This one is broken!!!
  // addOwnDefinition(selector, func, mode_) <<--- This one is broken!!!

  _$Intrinsic.addSelfMethod(function addOwnDefinition(...args) {
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
  })



  _$Intrinsic.addValueMethod(function _propertyAt(selector) {
    return PropertyAt(this[$INNER], selector)
  })

  _$Intrinsic.addMethod(function propertyAt(selector) {
    return (selector[0] !== "_") ? PropertyAt(this[$INNER], selector) : null
    // If restoring the following, also add it back to InSetProperty.
    // return ((selector[0] || selector.toString()[SYMBOL_1ST_CHAR]) !== "_") ?
    //   PropertyAt(this[$INNER], selector) : null
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


  _$Intrinsic.addValueMethod(Symbol.toPrimitive, function (hint) { // eslint-disable-line
    return this.toString()
  })


  // eslint-disable-next-line
  _$Intrinsic.addValueMethod(function _unknownProperty(selector) {
    return undefined
  })

  _$Intrinsic.addValueMethod(function _externalPrivateAccess(selector) {
    return this._externalPrivateAccessError(selector)
  })


  _$Intrinsic.addValueMethod(function _signalError(message) {
    return SignalError(this, message)
  })


  _$Intrinsic.addValueMethod(function _externalPrivateAccessError(selector) {
    return this._signalError(`External access to private property '${AsName(selector)}' is forbidden!!`)
  })

  _$Intrinsic.addValueMethod(function _unknownPropertyError(selector) {
    return this._signalError(`Unknown property '${AsName(selector)}'!!`)
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
  //
  //


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
