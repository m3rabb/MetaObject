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


_$Inate.addSharedProperty("isPermeable", false)


_$Inate.addLazyProperty(function basicId() {
  return `${this.uid}.${this.type.formalName}`
})


_$Inate.addMethod(function $() {
  const $inner = this[$INNER]
  const $rind  = $inner[$RIND]

  DefineProperty($inner, "$", InvisibleConfiguration)
  if (!$inner[IS_IMMUTABLE]) { $inner[$OUTER].$ = $rind }
  return ($inner.$ = $rind)
}, BASIC_VALUE_IMMEDIATE)

_$Inate.addMethod(function _super() {
  const $inner = this[$INNER]
  const $super = new Proxy($inner, SuperBehavior)

  DefineProperty($inner, "_super", InvisibleConfiguration)
  return ($inner._super = $super)
}, BASIC_VALUE_IMMEDIATE)


_$Inate.addMethod(function isImmutable() {
  return this[IS_IMMUTABLE] ? true : false
}, BASIC_VALUE_IMMEDIATE)

_$Inate.addMethod(function isMutable() {
  return !this[IS_IMMUTABLE]
}, BASIC_VALUE_IMMEDIATE)

_$Inate.addMethod(function isFact() {
  return this[IS_IMMUTABLE] ? true : (this.id != null)
}, BASIC_VALUE_IMMEDIATE)




function $Copy($source, asImmutable, visited = new WeakMap(), exceptProperty_) {
  var next, property, value, traversed, $value, barrier
  const source  = $source[$RIND]
  const $inner  = new $source[$BLANKER]()
  const $outer  = $inner[$OUTER]
  const $pulp   = $inner[$PULP]
  const target  = $inner[$RIND]

  visited.set(source, target) // to manage cyclic objects

  if ($inner._initFrom_) {
    $pulp._initFrom_($source[$PULP], asImmutable, visited, exceptProperty_)
  }
  else {
    const setOuterToo = !$source[IS_IMMUTABLE]
    const properties = $source[KNOWN_PROPERTIES] ||
      SetKnownProperties($source, setOuterToo)

    $outer[KNOWN_PROPERTIES] = $inner[KNOWN_PROPERTIES] = properties
    next = properties.length

    while (next--) {
      property = properties[next]
      if (property === exceptProperty_) { continue }

      value = $source[property]

           if (property[0] !== "_")              { $outer[property] = value }
      else if (typeof value !== "object")        {         /* NOP */        }
      else if (value === null)                   {         /* NOP */        }
      else if (value === source)                 { value = target           }
      else if (value[IS_IMMUTABLE])              {         /* NOP */        }
      else if (value.id != null)                 {         /* NOP */        }
      else if ((traversed = visited.get(value))) { value = traversed        }
      else {   value = ($value = InterMap.get(value)) ?
                 $Copy    ($value, asImmutable, visited)[$RIND] :
                 CopyObject(value, asImmutable, visited)                    }

      $inner[property] = value
    }
  }

  if ($inner._postInit) { $pulp._postInit() }

  if (asImmutable) {
    barrier               = new ImmutableInner($inner)
    $inner[$PULP]         = new Proxy($inner, barrier)
    $inner[$MAIN_BARRIER] = barrier
    $outer[IS_IMMUTABLE]  = $inner[IS_IMMUTABLE] = true
    Frost($outer)
  }

  return $inner
}



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


_$Inate.addMethod("_basicSetImmutable", _BasicSetImmutable, BASIC_SELF_METHOD)

_$Inate.addMethod(function setImmutable(visited_inPlace_, visited_) {
  if (this[IS_IMMUTABLE]) { return this }
  const [inPlace, visited] = (typeof visited_inPlace_ === "boolean") ?
    [visited_inPlace_, visited_] : [undefined, visited_inPlace_]
  return this._setImmutable(inPlace, visited)
}, BASIC_SELF_METHOD)

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


_$Inate.addMethod(function iid() {
  const $inner = this[$INNER]

  if ($inner[IS_IMMUTABLE]) {
    // Will set the iid even on an immutable object!!!
    return $inner.iid || ($inner.iid = InterMap.get(this.type)._nextIID)
  }

  DefineProperty($inner, "iid", InvisibleConfiguration)
  return ($inner[$OUTER].iid = $inner.iid = InterMap.get(this.type)._nextIID)
}, BASIC_VALUE_IMMEDIATE)



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
