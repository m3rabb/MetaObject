// $Inate methods
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



_$Inate.addMethod(function isMutable() {
  return !this[IS_IMMUTABLE]
}, BASIC_VALUE_IMMEDIATE)

_$Inate.addMethod(function isFact() {
  return this[IS_IMMUTABLE] ? true : (this.id != null)
}, BASIC_VALUE_IMMEDIATE)


_$Inate.addMethod(function isA(type) {
  return this[type.membershipSelector]
}, BASIC_VALUE_METHOD)



_$Inate.addMethod(function copy(visited_asImmutable_, visited_) {
  const [asImmutable, visited] = (typeof visited_asImmutable_ === "boolean") ?
    [visited_asImmutable_, visited_] : [undefined, visited_asImmutable_]
  const $inner = this[$INNER]
  return (($inner[IS_IMMUTABLE] && asImmutable !== false) ?
    $inner : $Copy($inner, asImmutable, visited))[$RIND]
}, BASIC_VALUE_METHOD)

_$Inate.addMethod(function immutableCopy(visited_) {
  const $inner = this[$INNER]
  return ($inner[IS_IMMUTABLE] ? $inner : $Copy($inner, true, visited_))[$RIND]
}, BASIC_VALUE_METHOD)

_$Inate.addMethod(function mutableCopy(visited_) {
  return $Copy(this[$INNER], false, visited_)[$RIND]
}, BASIC_VALUE_METHOD)

_$Inate.addMethod(function mutableCopyExcept(property) {
  return $Copy(this[$INNER], false, undefined, property)[$RIND]
}, BASIC_VALUE_METHOD)

// Thing.add(function _nonCopy() {
//   return (this[IS_FACT] === IMMUTABLE) ? this._newBlank() : this
// })


_$Inate.addMethod(function asCopy() {
  const $inner = this[$INNER]
  return ($inner[IS_IMMUTABLE] ? $inner : $Copy($inner, false))[$RIND]
}, BASIC_VALUE_IMMEDIATE)

_$Inate.addMethod(function asMutableCopy() {
  return $Copy(this[$INNER], false)[$RIND]
}, BASIC_VALUE_IMMEDIATE)

_$Inate.addMethod(function asFact() {
  return this[IS_IMMUTABLE] || (this.id != null) ?
    this : $Copy(this[$INNER], true)[$RIND]
}, BASIC_VALUE_IMMEDIATE)

_$Inate.addMethod(function asImmutable() {
  const $inner = this[$INNER]
  return ($inner[IS_IMMUTABLE] ? $inner : $Copy($inner, true))[$RIND]
}, BASIC_VALUE_IMMEDIATE)

_$Inate.addMethod(function asMutable() {
  const $inner = this[$INNER]
  return ($inner[IS_IMMUTABLE] ? $Copy($inner, false) : $inner)[$RIND]
}, BASIC_VALUE_IMMEDIATE)



function $Copy($source, asImmutable, visited = new WeakMap(), exceptProperty_) {
  var next, property, value, traversed, $value, barrier
  const source       = $source[$RIND]
  const permeability = $source[$PERMEABILITY]
  const $inner       = new $source[$BLANKER](permeability)
  const $outer       = $inner[$OUTER]
  const $pulp        = $inner[$PULP]
  const target       = $inner[$RIND]

  if (permeability === Permeable) { $inner[$PERMEABILITY] = Permeable }

  visited.set(source, target) // to manage cyclic objects

  if ($inner._initFrom_) {
    $pulp._initFrom_($source[$PULP], asImmutable, visited, exceptProperty_)
  }
  else {
    const setOuterToo = !$source[IS_IMMUTABLE]
    const properties = $source[KNOWN_PROPERTIES] ||
      SetKnownProperties($source, setOuterToo)

    if (!$inner[KNOWN_PROPERTIES]) {
      $outer[KNOWN_PROPERTIES] = $inner[KNOWN_PROPERTIES] = properties
    }
    next = properties.length

    while (next--) {
      property = properties[next]
      if (property === exceptProperty_) { continue }

      value = $source[property]

      if (property[0] !== "_") {       // public property
        if (value === source)                    {  value = target   }
        $outer[property] = value
      }                                // private property
      else if (typeof value !== "object")        {     /* NOP */     }
      else if (value === null)                   {     /* NOP */     }
      else if (value === source)                 {  value = target   }
      else if (value[IS_IMMUTABLE])              {     /* NOP */     }
      else if (value.id != null)                 {     /* NOP */     }
      else if ((traversed = visited.get(value))) { value = traversed }
      else {   value = ($value = InterMap.get(value)) ?
                 $Copy    ($value, asImmutable, visited)[$RIND] :
                 CopyObject(value, asImmutable, visited)             }

      $inner[property] = value
    }
  }

  if ($inner._postInit) {
    const result = $inner._postInit.call($pulp)
    if (result !== undefined && result !== $pulp) {
      return asImmutable ? result.asImmutable : result
    }
  }

  if (asImmutable) {
    barrier               = new ImmutableInner($inner)
    $inner[$PULP]         = new Proxy($inner, barrier)
    $inner[$MAIN_BARRIER] = barrier
    $outer[IS_IMMUTABLE]  = $inner[IS_IMMUTABLE] = true
    Frost($outer)
  }

  return $inner
}


// _$Inate.addMethod(function _basicGet(property) {
//
// }, BASIC_VALUE_METHOD)

_$Inate.addMethod("_basicSetImmutable", _BasicSetImmutable, BASIC_SELF_METHOD)

// Warning!!! Consider complications of pulp reassignment paradox
_$Inate.addMethod(function setImmutable(visited_inPlace_, visited_) {
  if (this[IS_IMMUTABLE]) { return this }
  const [inPlace, visited] = (typeof visited_inPlace_ === "boolean") ?
    [visited_inPlace_, visited_] : [undefined, visited_inPlace_]
  return this._setImmutable(inPlace, visited)
}, BASIC_SELF_METHOD)

// Warning!!! Consider complications of
_$Inate.addMethod(function beImmutable() {
  return this[IS_IMMUTABLE] ? this : this._setImmutable()
}, BASIC_SELF_IMMEDIATE)



_$Inate.addMethod(function _newBlank() {
  return new this[$BLANKER]()[$RIND]
}, BASIC_VALUE_METHOD)


_$Inate.addMethod(function has(propertyName) {
  return (propertyName in this[$OUTER])
}, BASIC_VALUE_METHOD)

_$Inate.addMethod(function _has(propertyName) {
  return (propertyName in this[$INNER])
}, BASIC_VALUE_METHOD)

_$Inate.addMethod(function hasOwn(propertyName) {
  if (propertyName[0] === "_") { return undefined }
  return this._hasOwn(propertyName)
}, BASIC_VALUE_METHOD)


_$Inate.addMethod("_hasOwn", HasOwnProperty, BASIC_VALUE_METHOD)

// _$Inate.addMethod(function _hasOwn(propertyName) {
//   const properties = this[$KNOWN_PROPERTIES] || ResetKnownProperties(this)
//   return (properties[propertyName] !== undefined)
// }, BASIC_VALUE_METHOD)


_$Inate.addMethod(function basicId() {
  const suffix = this.isPermeable ? "_" : ""
  return `${this.uid}.${this.type.formalName}${suffix}`
}, BASIC_VALUE_IMMEDIATE)

_$Inate.addMethod(function iid() {
  const $inner = this[$INNER]

  if ($inner[IS_IMMUTABLE]) {
    // Will set the $inner iid even on an immutable object!!!
    return $inner.iid || ($inner.iid = InterMap.get(this.type)[$PULP]._nextIID)
  }

  const iid = InterMap.get(this.type)[$PULP]._nextIID
  DefineProperty($inner, "iid", InvisibleConfiguration)
  return ($inner[$OUTER].iid = $inner.iid = iid)
}, BASIC_VALUE_IMMEDIATE)

_$Inate.addMethod(function oid() {
  const suffix = this.isPermeable ? "_" : ""
  return `${this.iid}.${this.type.formalName}${suffix}`
}, BASIC_VALUE_IMMEDIATE)

_$Inate.addMethod(function uid() {
  const $inner = this[$INNER]

  if ($inner[IS_IMMUTABLE]) {
    // Will set the $inner uid even on an immutable object!!!
    return $inner.uid ||
      ($inner.uid = this._hasOwn("guid") ? this.guid : NewUniqueId())
  }

  const uid = this._hasOwn("guid") ? this.guid : NewUniqueId()
  DefineProperty($inner, "uid", InvisibleConfiguration)
  return ($inner[$OUTER].uid = $inner.uid = uid)
}, BASIC_VALUE_IMMEDIATE)


// uri

// @NamedFunction
// Navel/30303/Type/367


_$Inate.addMethod(function addOwnMethod(method_namedFunc__selector, func__, mode___) {
  const method   = AsMethod(method_namedFunc__name, func__, mode___)
  const $inner   = this[$INNER]
  const $outer   = $inner[$OUTER]
  const selector = method.selector
  var methods, immediates, supers

  if ((methods = $inner[$OWN_METHODS])) {
    supers = $inner[$SUPERS]
  }
  else {
    methods              = ($inner[$OWN_METHODS] = SpawnFrom(null))
    supers               = ($inner[$SUPERS]      = SpawnFrom($inner[$SUPERS]))
    $outer[$IMMEDIATES]  = SpawnFrom($outer[$IMMEDIATES])
    $inner[$IMMEDIATES]  = SpawnFrom($inner[$IMMEDIATES])
    $inner[$SET_LOADERS] = SpawnFrom($inner[$SET_LOADERS])
  }

  SetMethod($inner, method)
  methods[selector] = method
  delete supers[selector]
})


_$Inate.addMethod(function addOwnImmediate(...namedFunc_name__handler) {
  return this.addOwnMethod(...namedFunc_name__handler, IMMEDIATE)
})

_$Inate.addMethod(function addOwnLazyProperty(...namedFunc_name__handler) {
  return this.addOwnMethod(...namedFunc_name__handler, LAZY_INSTALLER)
})

// _$Inate.addMethod(function _addOwnValueMethod(...namedFunc_name__handler) {
//   this.addOwnMethod(...namedFunc_name__handler, VALUE_METHOD)
// })
//
// _$Inate.addMethod(function _addOwnValueImmediate(...namedFunc_name__handler) {
//   this.addOwnMethod(...namedFunc_name__handler, VALUE_IMMEDIATE)
// })

_$Inate.addMethod(function addOwnDeclaration(propertyName) {
  this[propertyName] = null
})

// _$Inate.addMethod(function addOwnAssigner(loader_property, loader_) {
//   this.addOwnMethod(...namedFunc_name__handler, VALUE_IMMEDIATE)
// })
//
// _$Inate.addMethod(function addOwnMandatorySetter(setter_property, setter_) {
//   this.addOwnMethod(...namedFunc_name__handler, VALUE_IMMEDIATE)
// })


_$Inate.addMethod(function _unknownProperty(property) {
  return this._signalError(`Receiver ${this.id} doesn't have a property: ${AsName(property)}!!`)
})

_$Inate.addMethod("_basicUnknownProperty", $Inate$root$inner._unknownProperty)



_$Inate.addMethod(function _signalError(message) {
  return SignalError(this, message)
})


_$Inate.addMethod(function _invalidPulpError() {
  this._signalError("Using old mutable inner, after be|setImmutable has made a new inner proxy!!")
})

_$Inate.addMethod(function _disallowedAssignmentError(property, setter) {
  this._signalError(`Assignment or deletion of property '${property}' is not allowed, use '${setter}' method instead!!`)
})

_$Inate.addMethod(function _unnamedFuncError(func) {
  this._signalError(`${func} function must be named!!`)
})

_$Inate.addMethod(function _assignmentOfUndefinedError() {
  this._signalError("Assignment of undefined is forbidden, use null instead!")
})

_$Inate.addMethod(function _detectedInnerError(value) {
  this._signalError(`On attempted assignment, detected that you forgot to pass the 'this' with '$' for ${value.name}#${value.oid}!!`)
})


//
// _$Inate.addImmediate(function _captureChanges() {
//   const $inner = this[$INNER]
//   if ($inner[IS_IMMUTABLE]) { delete this[_DELETE_IMMUTABILITY] }
//   DefineProperty($inner, "_captureChanges", InvisibleConfiguration)
//   return ($inner._captureChanges = this)
// }, BASIC_SELF_IMMEDIATE)
//
//
// _$Inate.addImmediate(function _captureOverwrite() {
//   const $inner = this[$INNER]
//   if ($inner[IS_IMMUTABLE]) { delete this[_DELETE_ALL_PROPERTIES] }
//   DefineProperty($inner, "_captureOverwrite", InvisibleConfiguration)
//   return ($inner._captureOverwrite = this)
// }, BASIC_SELF_IMMEDIATE)

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
