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

const KnownProperties = function knownProperties() {
  return this[$KNOWN_PROPERTIES]
}

_$Innate.addMethod(KnownProperties, BASIC_VALUE_METHOD)

_$Innate.addMethod(KNOWN_PROPERTIES, KnownProperties, BASIC_VALUE_METHOD)



_$Innate.addMethod(function isMutable() {
  return !this[IS_IMMUTABLE]
}, BASIC_VALUE_METHOD)

_$Innate.addMethod(function isFact() {
  return this[IS_IMMUTABLE] ? true : (this.id != null)
}, BASIC_VALUE_METHOD)


_$Innate.addMethod(function isA(type) {
  return this[type.membershipSelector]
}, BASIC_VALUE_METHOD)


_$Innate.addSharedProperty("isVoid", false)



_$Innate.addMethod(function copy(visited_asImmutable_, visited_) {
  const [asImmutable, visited] = (typeof visited_asImmutable_ === "boolean") ?
    [visited_asImmutable_, visited_] : [undefined, visited_asImmutable_]
  const $inner = this[$INNER]
  return (($inner[IS_IMMUTABLE] && asImmutable !== false) ?
    $inner : $Copy($inner, asImmutable, visited))[$RIND]
}, BASIC_VALUE_METHOD)

_$Innate.addMethod(function immutableCopy(visited_) {
  const $inner = this[$INNER]
  return ($inner[IS_IMMUTABLE] ? $inner : $Copy($inner, true, visited_))[$RIND]
}, BASIC_VALUE_METHOD)

_$Innate.addMethod(function mutableCopy(visited_) {
  return $Copy(this[$INNER], false, visited_)[$RIND]
}, BASIC_VALUE_METHOD)

_$Innate.addMethod(function mutableCopyExcept(property) {
  return $Copy(this[$INNER], false, undefined, property)[$RIND]
}, BASIC_VALUE_METHOD)

// Thing.add(function _nonCopy() {
//   return (this[IS_FACT] === IMMUTABLE) ? this._newBlank() : this
// })


_$Innate.addMethod(function asCopy() {
  const $inner = this[$INNER]
  return ($inner[IS_IMMUTABLE] ? $inner : $Copy($inner, false))[$RIND]
}, BASIC_VALUE_METHOD)

_$Innate.addMethod(function asMutableCopy() {
  return $Copy(this[$INNER], false)[$RIND]
}, BASIC_VALUE_METHOD)

_$Innate.addMethod(function asFact() {
  return this[IS_IMMUTABLE] || (this.id != null) ?
    this : $Copy(this[$INNER], true)[$RIND]
}, BASIC_VALUE_METHOD)

_$Innate.addMethod(function asImmutable() {
  const $inner = this[$INNER]
  return ($inner[IS_IMMUTABLE] ? $inner : $Copy($inner, true))[$RIND]
}, BASIC_VALUE_METHOD)

_$Innate.addMethod(function asMutable() {
  const $inner = this[$INNER]
  return ($inner[IS_IMMUTABLE] ? $Copy($inner, false) : $inner)[$RIND]
}, BASIC_VALUE_METHOD)



function $Copy($source, asImmutable, visited = new WeakMap(), exceptProperty_) {
  var next, property, value, traversed, $value, barrier
  const source       = $source[$RIND]
  const permeability = $source[$PERMEABILITY]
  const $inner       = new $source[$BLANKER](permeability)
  const $outer       = $inner[$OUTER]
  const $pulp        = $inner[$PULP]
  const target       = $inner[$RIND]
  const _initFrom_   = $inner._initFrom_

  if (permeability === Permeable) {
    $outer.$INNER         = $inner
    $inner[$PERMEABILITY] = Permeable
  }

  visited.set(source, target) // to manage cyclic objects

  if (_initFrom_) {
   _initFrom_.call($pulp, $source[$PULP], asImmutable, visited, exceptProperty_)
  }
  else {
    const properties = $source[$KNOWN_PROPERTIES] ||
      SetKnownProperties($source, $KNOWN_PROPERTIES)

    if (!$inner[$KNOWN_PROPERTIES]) { $inner[$KNOWN_PROPERTIES] = properties }
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
    barrier               = new ImmutableInner()
    $inner[$PULP]         = new Proxy($inner, barrier)
    $inner[$MAIN_BARRIER] = barrier
    $outer[IS_IMMUTABLE]  = $inner[IS_IMMUTABLE] = true
    Frost($outer)
  }

  return $inner
}


// _$Innate.addMethod(function _basicGet(property) {
//
// }, BASIC_VALUE_METHOD)


// Warning!!! Consider complications of pulp reassignment paradox
_$Innate.addMethod(function setImmutable(visited_inPlace_, visited_) {
  if (this[IS_IMMUTABLE]) { return this }
  const [inPlace, visited] = (typeof visited_inPlace_ === "boolean") ?
    [visited_inPlace_, visited_] : [undefined, visited_inPlace_]
  return this._setImmutable(inPlace, visited)
})


// Warning!!! Consider complications of
_$Innate.addMethod(function beImmutable() {
  return this[IS_IMMUTABLE] ? this : this._setImmutable()
})



_$Innate.addMethod(function _newBlank() {
  const $inner       = this[$INNER]
  const permeability = $inner[$PERMEABILITY]
  const $instance    = new $inner[$BLANKER](permeability)

  if (permeability === Permeable) {
    $instance[$OUTER].$INNER = $instance
    $instance[$PERMEABILITY] = Permeable
  }
  return $instance[$RIND]
}, BASIC_VALUE_METHOD)


_$Innate.addMethod(function has(propertyName) {
  return (propertyName in this[$OUTER])
}, BASIC_VALUE_METHOD)

_$Innate.addMethod(function _has(propertyName) {
  return (propertyName in this[$INNER])
}, BASIC_VALUE_METHOD)

_$Innate.addMethod(function hasOwn(propertyName) {
  if (propertyName[0] === "_") { return undefined }
  return this._hasOwn(propertyName)
}, BASIC_VALUE_METHOD)


_$Innate.addMethod("_hasOwn", HasOwnProperty, BASIC_VALUE_METHOD)

// _$Innate.addMethod(function _hasOwn(propertyName) {
//   const properties = this[$KNOWN_PROPERTIES] || ResetKnownProperties(this)
//   return (properties[propertyName] !== undefined)
// }, BASIC_VALUE_METHOD)


_$Innate.addMethod(function basicId() {
  const suffix = this.isPermeable ? "_" : ""
  return `${this.uid}.${this.type.formalName}${suffix}`
})

_$Innate.addMethod(function oid() {
  const suffix = this.isPermeable ? "_" : ""
  return `${this.iid}.${this.type.formalName}${suffix}`
})


_$Innate.addRetroactiveProperty(function uid() {
  return this._hasOwn("guid") ? this.guid : NewUniqueId()
}, BASIC_VALUE_METHOD)


_$Innate.addRetroactiveProperty(function iid() {
  return InterMap.get(this.type)[$PULP]._nextIID
}, BASIC_VALUE_METHOD)




// uri

// @NamedFunction
// Navel/30303/Type/367


_$Innate.addMethod(function addOwnMethod(method_namedFunc__selector, func__, mode___) {
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
}, BASIC_SELF_METHOD)


_$Innate.addMethod(function addOwnLazyProperty(...namedFunc_name__handler) {
  return this.addOwnMethod(...namedFunc_name__handler, LAZY_INSTALLER)
}, BASIC_SELF_METHOD)

// _$Innate.addMethod(function _addOwnValueMethod(...namedFunc_name__handler) {
//   this.addOwnMethod(...namedFunc_name__handler, VALUE_METHOD)
// })
//
// _$Innate.addMethod(function _addOwnValueImmediate(...namedFunc_name__handler) {
//   this.addOwnMethod(...namedFunc_name__handler, VALUE_IMMEDIATE)
// })

_$Innate.addMethod(function addOwnDeclaration(propertyName) {
  this[propertyName] = null
}, BASIC_SELF_METHOD)

// _$Innate.addMethod(function addOwnAssigner(loader_property, loader_) {
//   this.addOwnMethod(...namedFunc_name__handler, VALUE_IMMEDIATE)
// })
//
// _$Innate.addMethod(function addOwnMandatorySetter(setter_property, setter_) {
//   this.addOwnMethod(...namedFunc_name__handler, VALUE_IMMEDIATE)
// })


_$Primordial.addMethod(Symbol.toPrimitive, function (hint) {
  return this.toString()
})



_$Innate.addMethod(function _unknownProperty(property) {
  return this._signalError(`Receiver ${this.id} doesn't have a property: ${AsName(property)}!!`)
})

_$Innate.addMethod("_basicUnknownProperty", $Innate$root$inner._unknownProperty)



_$Innate.addMethod(function _signalError(message) {
  return SignalError(this, message)
})


_$Innate.addMethod(function _invalidPulpError() {
  this._signalError("Using old mutable inner, after be|setImmutable has made a new inner proxy!!")
})

_$Innate.addMethod(function _disallowedAssignmentError(property, setter) {
  this._signalError(`Assignment or deletion of property '${property}' is not allowed, use '${setter}' method instead!!`)
})

_$Innate.addMethod(function _unnamedFuncError(func) {
  this._signalError(`${func} function must be named!!`)
})

_$Innate.addMethod(function _assignmentOfUndefinedError() {
  this._signalError("Assignment of undefined is forbidden, use null instead!")
})

_$Innate.addMethod(function _detectedInnerError(value) {
  this._signalError(`On attempted assignment, detected that you forgot to pass the 'this' with '$' for ${value.name}#${value.oid}!!`)
})


//
// _$Innate.addImmediate(function _captureChanges() {
//   const $inner = this[$INNER]
//   if ($inner[IS_IMMUTABLE]) { delete this[_DELETE_IMMUTABILITY] }
//   DefineProperty($inner, "_captureChanges", InvisibleConfiguration)
//   return ($inner._captureChanges = this)
// }, BASIC_SELF_METHOD)
//
//
// _$Innate.addImmediate(function _captureOverwrite() {
//   const $inner = this[$INNER]
//   if ($inner[IS_IMMUTABLE]) { delete this[_DELETE_ALL_PROPERTIES] }
//   DefineProperty($inner, "_captureOverwrite", InvisibleConfiguration)
//   return ($inner._captureOverwrite = this)
// }, BASIC_SELF_METHOD)

// Must we delete the _captureChanges and _captureOverwrite when copying or
// otherwise done using them???


// _$Innate._setImmutable()


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
