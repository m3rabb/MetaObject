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

ObjectSauce(function (
  $BLANKER, $INNER, $LOCKED, $OUTER, $OWN_DEFINITIONS, $PULP, $RIND,
  DECLARATION, IS_IMMUTABLE, LAZY_INSTALLER, _DURABLES,
  BASIC_SELF_METHOD, BASIC_VALUE_METHOD,
  $Intrinsic$root$inner, AsName, BasicSetObjectImmutable, Definition, HasOwn,
  InterMap, InvisibleConfig, MakeDefinitionsInfrastructure, NewUniqueId,
  OwnSelectors, PropertyAt, SignalError, SpawnFrom, _$Copy, _$Intrinsic,
  AsDefinition, SetDefinition,
  OwnNames, OwnVisibleNames,
  CompletelyDeleteProperty, DefineProperty,
  AllSelectorsSorted, OwnSelectorsSorted
) {
  // "use strict"


  _$Intrinsic.addMethod(function _addOwnDurable(selector) {
    var durables = this[_DURABLES] || []
    if (!durables.includes(selector)) {
      this[_DURABLES] = BasicSetObjectImmutable([...durables, selector])
      this.addOwnDeclaration(selector)
    }
    return this
  }, BASIC_SELF_METHOD)


  _$Intrinsic.addMethod(function _addOwnDurables(selectors) {
    selectors.forEach(selector => this._addOwnDurable(selector))
    return this
  }, BASIC_SELF_METHOD)



  _$Intrinsic.addMethod(function isMutable() {
    return !this[IS_IMMUTABLE]
  }, BASIC_VALUE_METHOD)

  _$Intrinsic.addMethod(function isFact() {
    return this[IS_IMMUTABLE] ? true : (this.id != null)
  }, BASIC_VALUE_METHOD)


  _$Intrinsic.addMethod(function isA(type) {
    return this[type.membershipSelector]
  }, BASIC_VALUE_METHOD)




  _$Intrinsic.addMethod(function copy(visited_asImmutable_, visited_) {
    const [asImmutable, visited] =
      (typeof visited_asImmutable_ === "boolean") ?
        [visited_asImmutable_, visited_            ] :
        [undefined           , visited_asImmutable_]
    const $inner = this[$INNER]

    return (($inner[IS_IMMUTABLE] && asImmutable !== false) ? // true or undefined
      $inner : _$Copy($inner, asImmutable, visited))[$RIND]
  }, BASIC_VALUE_METHOD)

  _$Intrinsic.addMethod(function immutableCopy(visited_) {
    const $inner = this[$INNER]
    return ($inner[IS_IMMUTABLE] ? $inner : _$Copy($inner, true, visited_))[$RIND]
  }, BASIC_VALUE_METHOD)

  _$Intrinsic.addMethod(function mutableCopy(visited_) {
    return _$Copy(this[$INNER], false, visited_)[$RIND]
  }, BASIC_VALUE_METHOD)

  _$Intrinsic.addMethod(function mutableCopyExcept(selector) {
    return _$Copy(this[$INNER], false, undefined, selector)[$RIND]
  }, BASIC_VALUE_METHOD)

  // Thing.add(function _nonCopy() {
  //   return (this[IS_FACT] === IMMUTABLE) ? this._newBlank() : this
  // })


  _$Intrinsic.addMethod(function asCopy() {
    const $inner = this[$INNER]
    return ($inner[IS_IMMUTABLE] ? $inner : _$Copy($inner, false))[$RIND]
  }, BASIC_VALUE_METHOD)

  _$Intrinsic.addMethod(function asMutableCopy() {
    return _$Copy(this[$INNER], false)[$RIND]
  }, BASIC_VALUE_METHOD)

  _$Intrinsic.addMethod(function asFact() {
    const $inner = this[$INNER]
    return ($inner[IS_IMMUTABLE] || ($inner.id != null)) ?
      $inner : _$Copy($inner, true)[$RIND]
  }, BASIC_VALUE_METHOD)

  _$Intrinsic.addMethod(function asImmutable() {
    const $inner = this[$INNER]
    return ($inner[IS_IMMUTABLE] ? $inner : _$Copy($inner, true))[$RIND]
  }, BASIC_VALUE_METHOD)

  _$Intrinsic.addMethod(function asMutable() {
    const $inner = this[$INNER]
    return ($inner[IS_IMMUTABLE] ? _$Copy($inner, false) : $inner)[$RIND]
  }, BASIC_VALUE_METHOD)





  // _$Intrinsic.addMethod(function _basicGet(property) {
  //
  // }, BASIC_VALUE_METHOD)


  _$Intrinsic.addMethod(function setImmutable(visited_inPlace_, visited_) {
    if (this[IS_IMMUTABLE]) { return this }
    const [inPlace, visited] = (typeof visited_inPlace_ === "boolean") ?
      [visited_inPlace_, visited_] : [undefined, visited_inPlace_]
    return this._setImmutable(inPlace, visited)
  })


  _$Intrinsic.addMethod(function beImmutable() {
    return this[IS_IMMUTABLE] ? this : this._setImmutable()
  })



  _$Intrinsic.addMethod(function _newBlank() {
    const $inner     = this[$INNER]
    const _$instance = new $inner[$BLANKER]()
    const $instance  = new _$instance[$OUTER]

    if ($inner[$OUTER].this) {
      DefineProperty($instance, "this", InvisibleConfig)
      $instance.this = _$instance[$PULP]
    }
    return _$instance[$RIND]
  }, BASIC_VALUE_METHOD)




  _$Intrinsic.addMethod(function _allSelectors() {
    return AllSelectorsSorted(this[$INNER], OwnSelectors)
  })

  _$Intrinsic.addMethod(function _inheritedSelectors() {
    return this.type.allKnownSelectors
  })

  _$Intrinsic.addMethod(function visibleSelectors() {
    return AllSelectorsSorted(this[$OUTER], OwnVisibleNames)
  })

  _$Intrinsic.addMethod(function _ownSelectors() {
    // All string and symbol properties, includes invisibles
    return OwnSelectorsSorted(this[$INNER])
  })

  _$Intrinsic.addMethod(function ownSelectors() {
    // Includes placed retroactive|lazy properties, but not symbols
    return BasicSetObjectImmutable(OwnNames(this[$OUTER]).sort())
  })


  _$Intrinsic.addMethod("_hasOwn", HasOwn, BASIC_VALUE_METHOD)

  _$Intrinsic.addMethod(function hasOwn(selector) {
    switch (selector[0]) {
      case undefined : return null  // "Shrug when selector is a symbol
      case "_"       : return false
      default        : return this._hasOwn(selector)
    }
  }, BASIC_VALUE_METHOD)


  _$Intrinsic.addMethod(function _has(selector) {
    return (selector in this[$INNER])
  }, BASIC_VALUE_METHOD)

  _$Intrinsic.addMethod(function has(selector) {
    return (selector in this[$OUTER])
  }, BASIC_VALUE_METHOD)





  // _$Intrinsic.addMethod(function _knowns(propertyName) {
  //   const properties = this[_DURABLES] || SetDurables(this)
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
    return `${this.uid}.${this.type.formalName}${suffix}`
  }, BASIC_VALUE_METHOD) // VALUE_METHOD)

  _$Intrinsic.addMethod(function oid() {
    const suffix = this.isPermeable ? "_" : ""
    return `${this.iid}.${this.type.formalName}${suffix}`
  }, BASIC_VALUE_METHOD) // VALUE_METHOD)


  _$Intrinsic.addRetroactiveProperty(function uid() {
    return this._hasOwn("guid") ? this.guid : NewUniqueId()
  }, BASIC_VALUE_METHOD)


  _$Intrinsic.addRetroactiveProperty(function iid() {
    return InterMap.get(this.type)[$PULP]._nextIID
  }, BASIC_VALUE_METHOD)


  _$Intrinsic.addMethod(function typeName() {
    return this.type.name
  }, BASIC_VALUE_METHOD)




  // uri

  // @NamedFunction
  // Navel/30303/Type/367


  // _$Intrinsic.addMethod(function addOwnLazyProperty(...namedFunc_name__handler) {
  //   return this.addOwnMethod(...namedFunc_name__handler, LAZY_INSTALLER)
  // }, BASIC_SELF_METHOD)
  //

  _$Intrinsic.addMethod(function addOwnAlias(aliasSelector, selector_definition) {
    var value
    if (selector_definition.isDefinition) { value = selector_definition }
    else {
      value = this._propertyAt(selector_definition)
      if (!value.isDefinition) {
        return this._unknownMethodToAliasError(selector_definition)
      }
    }
    return this.addOwnDefinition(aliasSelector, value)
  })


  _$Intrinsic.addMethod(function addOwnDeclaration(selector) {
    const declaration = Definition(selector, null, DECLARATION)
    return this.addOwnDefinition(declaration)
  }, BASIC_SELF_METHOD)


  _$Intrinsic.addMethod(function addOwnMethod(namedFunc_name, func_, mode__) {
    const method = Definition(namedFunc_name, func_, mode__)
    this._addOwnDefinition(method)
  })


  // addOwnDefinition(definition)
  // addOwnDefinition(tag, definition)
  // addOwnDefinition(namedFunc, mode_)
  // addOwnDefinition(selector, func, mode_)

  _$Intrinsic.addMethod(function addOwnDefinition(...args) {
    const definition = AsDefinition(...args)
    this._addOwnDefinition(definition)
  })

  _$Intrinsic.addMethod(function _addOwnDefinition(definition) {
    const tag    = definition.tag
    const $inner = this[$INNER]
    var   definitions = $inner[$OWN_DEFINITIONS]

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
    return this
  }, BASIC_SELF_METHOD)



  _$Intrinsic.addMethod(function _propertyAt(selector) {
    return PropertyAt(this[$INNER], selector)
  })

  _$Intrinsic.addMethod(function propertyAt(selector) {
    return ((selector.charAt) ? selector[0] : selector.toString()[7] !== "_") ?
      PropertyAt(this[$INNER], selector) : null
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


  _$Intrinsic.addMethod(Symbol.toPrimitive, function (hint) { // eslint-disable-line
    return this.toString()
  }, BASIC_VALUE_METHOD)



  _$Intrinsic.addMethod(function _unknownProperty(selector) {
    return this._signalError(`Receiver ${this.basicId} doesn't have a property '${AsName(selector)}'!!`)
  })

  _$Intrinsic.addMethod("_basicUnknownProperty", $Intrinsic$root$inner._unknownProperty)



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
//    InSetProperty($inner, "_retarget", this, this)
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
