


_Thing.addSetter("_setId", function id(newId_) {
  const existingId = this.id
  var   newId, priorIds

  if (newId_ === undefined) {
    if (existingId != null) { return existingId }
    newId = this.oid
  }
  else if (newId_ === existingId) { return existingId }
  else { newId = newId_ }

  if (existingId != null) {
    priorIds = this[$PRIOR_IDS] || []
    this[$PRIOR_IDS] = [...priorIds, existingId]
  }
  return newId
})


_Thing.addSetter("_setName", "name")

_Thing.addMethod(function _init(spec_) {
  if (spec_) {
    var id   = spec_.id
    var name = spec_.name
  }
  id   && (this.id   = id)
  name && (this.name = name)
})


_Thing.addMethod(function _setImmutable(inPlace, visited = new WeakMap()) {
  var next, property, value, $value, barrier
  const $inner                  = this[$INNER]
  const $outer                  = $inner[$OUTER]
  const $rind                   = $inner[$RIND]
  const _setPropertiesImmutable = $inner._setPropertiesImmutable

  visited.set($rind, $rind)

  if (_setPropertiesImmutable) {
    _setPropertiesImmutable.call($pulp, inPlace, visited)
  }
  else {
    const properties = $inner[$KNOWN_PROPERTIES] ||
      SetKnownProperties($inner, $KNOWN_PROPERTIES)

    next = properties.length

    while (next--) {
      property = properties[next]
      if (property[0] !== "_")       { continue }

      value = $inner[property]

      if (typeof value !== "object") { continue }
      if (value === null)            { continue }
      if (value === $rind)           { continue }
      if (value[IS_IMMUTABLE])       { continue }
      if (value.id != null)          { continue }
      if (visited.get(value))        { continue }

      $value = InterMap.get(value)
      if (inPlace) {
        if ($value) { $value._setImmutable.call($value[$PULP], true, visited) }
        else        { SetImmutableObject(value, true, visited)                }
      }
      else {
        $inner[property] = ($value) ?
          $Copy($value, true, visited)[$RIND] :
          CopyObject(value, true, visited)
      }
    }
  }

  barrier               = new ImmutableInner()
  $inner[$MAIN_BARRIER] = barrier
  $outer[IS_IMMUTABLE]  = $inner[IS_IMMUTABLE] = true
  Frost($outer)
  return ($inner[$PULP] = new Proxy($inner, barrier))

})



// _Thing._setImmutable()




// _Thing.addMethod(function _setCopyId() {
//    if it has a way to make a new id then set it,
//    otherwise if mutable, no id, and if immutable set id to ""

//   return this._setId(this.oid)
// })



// _Thing.addMethod(function _postInit() {
//   this.id = this.oid
//   return this
// })

// _Thing.addMethod(function _setPropertiesImmutable(inPlace, visited) {
//   this.id = this.oid
//   return this
// })

// _Thing.addMethod(function _initFrom_(_source, propertiesBeImmutable, visited, exceptProperty_) {
//   this.id = this.oid
//   return this
// })


// Obsolete and unnecessary
// Thing.addMethod(function _quietGet(property) {
//   const descriptor = PropertyDescriptor(this, property)
//   return descriptor.value
// })
