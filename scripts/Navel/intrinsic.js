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
//

_$Intrinsic.addMethod(function durableProperties() {
  return this[DURABLES] || EMPTY_ARRAY
}, BASIC_VALUE_METHOD)

_$Intrinsic.addMethod(function setDurableProperties(properties) {
  this[DURABLES] = properties
  return this
}, BASIC_SELF_METHOD)

// _$Intrinsic.addMethod(function addDurableProperty(property) {
//   const properties = this[DURABLES] || []
//   if (!properties.includes(property)) {
//     this[DURABLES] = SetImmutable([...properties, property])
//     this.addDeclaration(property)
//   }
//   return this
// }, BASIC_SELF_METHOD)
//
//
//
// _$Intrinsic.addMethod(function addDurableProperties(properties) {
//   properties.forEach(property => this.addDurableProperty(property))
//   return this
// }, BASIC_SELF_METHOD)



_$Intrinsic.addMethod(function isMutable() {
  return !this[IS_IMMUTABLE]
}, BASIC_VALUE_METHOD)

_$Intrinsic.addMethod(function isFact() {
  return this[IS_IMMUTABLE] ? true : (this.id != null)
}, BASIC_VALUE_METHOD)


_$Intrinsic.addMethod(function isA(type) {
  return this[type.membershipSelector]
}, BASIC_VALUE_METHOD)


_$Intrinsic.addSharedProperty("isVoid", false)



_$Intrinsic.addMethod(function copy(visited_asImmutable_, visited_) {
  const [asImmutable, visited] = (typeof visited_asImmutable_ === "boolean") ?
    [visited_asImmutable_, visited_] : [undefined, visited_asImmutable_]
  const $inner = this[$INNER]
  return (($inner[IS_IMMUTABLE] && asImmutable !== false) ?
    $inner : $Copy($inner, asImmutable, visited))[$RIND]
}, BASIC_VALUE_METHOD)

_$Intrinsic.addMethod(function immutableCopy(visited_) {
  const $inner = this[$INNER]
  return ($inner[IS_IMMUTABLE] ? $inner : $Copy($inner, true, visited_))[$RIND]
}, BASIC_VALUE_METHOD)

_$Intrinsic.addMethod(function mutableCopy(visited_) {
  return $Copy(this[$INNER], false, visited_)[$RIND]
}, BASIC_VALUE_METHOD)

_$Intrinsic.addMethod(function mutableCopyExcept(property) {
  return $Copy(this[$INNER], false, undefined, property)[$RIND]
}, BASIC_VALUE_METHOD)

// Thing.add(function _nonCopy() {
//   return (this[IS_FACT] === IMMUTABLE) ? this._newBlank() : this
// })


_$Intrinsic.addMethod(function asCopy() {
  const $inner = this[$INNER]
  return ($inner[IS_IMMUTABLE] ? $inner : $Copy($inner, false))[$RIND]
}, BASIC_VALUE_METHOD)

_$Intrinsic.addMethod(function asMutableCopy() {
  return $Copy(this[$INNER], false)[$RIND]
}, BASIC_VALUE_METHOD)

_$Intrinsic.addMethod(function asFact() {
  return this[IS_IMMUTABLE] || (this.id != null) ?
    this : $Copy(this[$INNER], true)[$RIND]
}, BASIC_VALUE_METHOD)

_$Intrinsic.addMethod(function asImmutable() {
  const $inner = this[$INNER]
  return ($inner[IS_IMMUTABLE] ? $inner : $Copy($inner, true))[$RIND]
}, BASIC_VALUE_METHOD)

_$Intrinsic.addMethod(function asMutable() {
  const $inner = this[$INNER]
  return ($inner[IS_IMMUTABLE] ? $Copy($inner, false) : $inner)[$RIND]
}, BASIC_VALUE_METHOD)



// Need to ensure ownMethods are copied a well!!!
function $Copy(_$source, asImmutable, visited = new WeakMap(), exceptProperty_) {
  var _source, next, property, value, traversed, $value, barrier, properties
  const source       = _$source[$RIND]
  const _$target     = new _$source[$BLANKER](_$source)
  const  $target     = _$target[$OUTER]
  const  _target     = _$target[$PULP]
  const   target     = _$target[$RIND]
  const _initFrom_   = _$target._initFrom_

  visited.set(source, target) // to manage cyclic objects

  if (_$source[$OUTER].this) {
    DefineProperty($target, "this", InvisibleConfig)
    $target.this = _target
  }

  if (_initFrom_) {
    _source = _$source[$PULP]
   _initFrom_.call(_target, _source, asImmutable, visited, exceptProperty_)
  }
  else if ((properties = _$source[DURABLES])) {
    next = properties.length

    while (next--) {
      property = properties[next]
      if (property === exceptProperty_) { continue }
      value = _$source[property]

      if (property[0] !== "_") {  // public property
        $target[property] = (value === source) ? (value = target) : value
      }                           // private property
      else { value = NextValue(value, asImmutable, visited, source, target) }

      _$target[property] = value
    }
  }
  else {
    for (property in _$source) {
      if (property === exceptProperty_) { continue }
      value = _$source[property]

      if (property[0] !== "_") {  // public property
        $target[property] = (value === source) ? (value = target) : value
      }                           // private property
      else { value = NextValue(value, asImmutable, visited, source, target) }

      _$target[property] = value
    }
  }

  if (_$target._postInit) {
    const result = _$target._postInit.call(_target)
    if (result !== undefined && result !== _target) {
      return asImmutable ? result.asImmutable : result
    }
  }

  if (asImmutable) {
    $target[IS_IMMUTABLE] = _$target[IS_IMMUTABLE] = true
    Frost($target)
  }

  return _$target
}


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
    $instance.this = _target
  }
  return _$instance[$RIND]
}, BASIC_VALUE_METHOD)


_$Intrinsic.addMethod(function has(propertyName) {
  return (propertyName in this[$OUTER])
}, BASIC_VALUE_METHOD)

_$Intrinsic.addMethod(function _has(propertyName) {
  return (propertyName in this[$INNER])
}, BASIC_VALUE_METHOD)

_$Intrinsic.addMethod(function hasOwn(propertyName) {
  if (propertyName[0] === "_") { return undefined }
  return this._hasOwn(propertyName)
}, BASIC_VALUE_METHOD)


_$Intrinsic.addMethod("_hasOwn", HasOwnProperty, BASIC_VALUE_METHOD)

// _$Intrinsic.addMethod(function _hasOwn(propertyName) {
//   const properties = this[DURABLES] || SetDurableProperties(this)
//   return (properties[propertyName] !== undefined)
// }, BASIC_VALUE_METHOD)


_$Intrinsic.addMethod(function basicId() {
  const suffix = this.isPermeable ? "_" : ""
  return `${this.uid}.${this.type.formalName}${suffix}`
}, VALUE_METHOD)

_$Intrinsic.addMethod(function oid() {
  const suffix = this.isPermeable ? "_" : ""
  return `${this.iid}.${this.type.formalName}${suffix}`
}, VALUE_METHOD)


_$Intrinsic.addMethod("uid", AsRetroactiveProperty("uid", function uid() {
  return this._hasOwn("guid") ? this.guid : NewUniqueId()
}), BASIC_VALUE_METHOD)


_$Intrinsic.addMethod("iid", AsRetroactiveProperty("iid", function iid() {
  return InterMap.get(this.type)[$PULP]._nextIID
}), BASIC_VALUE_METHOD)


_$Intrinsic.addMethod(function typeName() {
  return this.type.name
}, VALUE_METHOD)




// uri

// @NamedFunction
// Navel/30303/Type/367


_$Intrinsic.addMethod(function addOwnLazyProperty(...namedFunc_name__handler) {
  return this.addOwnMethod(...namedFunc_name__handler, LAZY_INSTALLER)
}, BASIC_SELF_METHOD)


_$Intrinsic.addMethod(function addOwnAlias(aliasSelector, selector_definition) {
  const definition = selector_definition.isDefinition ?
    selector_definition : this.methodAt(selector_definition)
  if (definition == null) {
    return this._unknownMethodToAliasError(selector_definition)
  }
  this.addOwnDefinition(aliasSelector, definition.handler, definition.mode)
})


_$Intrinsic.addMethod(function addOwnMethod(namedFunc_name, func_, mode__) {
  const definition = Definition(namedFunc_name, func_, mode__)
  this._addOwnDefinition(definition)
})

_$Intrinsic.addMethod(function addOwnDefinition(definition__namedFunc_selector, func_, mode__) {
  const definition = (definition__namedFunc_selector.isDefinition) ?
    definition__namedFunc_selector :
    Definition(definition__namedFunc_selector, func_, mode__)
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



_$Intrinsic.addMethod(function methodAt(selector) {
  return MethodAt(this[$INNER], selector)
})




// _$Intrinsic.addMethod(function _addOwnValueMethod(...namedFunc_name__handler) {
//   this.addOwnMethod(...namedFunc_name__handler, VALUE_METHOD)
// })
//
// _$Intrinsic.addMethod(function _addOwnValueImmediate(...namedFunc_name__handler) {
//   this.addOwnMethod(...namedFunc_name__handler, VALUE_IMMEDIATE)
// })

_$Intrinsic.addMethod(function addOwnDeclaration(propertyName) {
  this[propertyName] = null
  return this
}, BASIC_SELF_METHOD)

// _$Intrinsic.addMethod(function addOwnAssigner(assigner_property, assigner_) {
//   this.addOwnMethod(...namedFunc_name__handler, VALUE_IMMEDIATE)
// })
//
// _$Intrinsic.addMethod(function addOwnMandatorySetter(setter_property, setter_) {
//   this.addOwnMethod(...namedFunc_name__handler, VALUE_IMMEDIATE)
// })


_$Intrinsic.addMethod(Symbol.toPrimitive, function (hint) {
  return this.toString()
}, VALUE_METHOD)



_$Intrinsic.addMethod(function _unknownProperty(property) {
  return this._signalError(`Receiver ${this.basicId} doesn't have a property '${AsName(property)}'!!`)
})

_$Intrinsic.addMethod("_basicUnknownProperty", $Intrinsic$root$inner._unknownProperty)



_$Intrinsic.addMethod(function _signalError(message) {
  return SignalError(this, message)
})





// _beMutable _touch _captureChanges

// // It's not enought to simple make this method access the receiver's barrier.
// // Th receiver only references its original barrier, and there may be more than
// // one proxy/barrier associated with the receiver, so we need to invoke the
// // proxy to force the proper change to occur thru it.
// _$Intrinsic.addMethod(function _retarget() {
//   const $inner = this[$INNER]
//
//   if ($inner[IS_IMMUTABLE]) {
//     delete this[$DELETE_IMMUTABILITY]
//   }
//   else {
//     DefineProperty($inner, "_retarget", InvisibleConfig)
//     InSetProperty($inner, "_retarget", this, this)
//   }
//   return this
// }, BASIC_SELF_METHOD)


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


// _$Intrinsic._setImmutable()


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
