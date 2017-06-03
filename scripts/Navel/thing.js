


// _Type.addMethod(function _resetId(newId_) {
//   // delete this[$PRIOR_IDS]
//   this.id = (newId_ !== undefined) ? newId : this.oid
// })
// Move to the safer version of the RelaxedMethodPorosity after mutable copy methods defined

// mutableCopyExcept
// mutableCopy
// asMutable
// asMutableCopy

// Thing.addMethod(_basicSet)

// Thing.addMethod("_hasOwn", HasOwnProperty)








_Thing.addImmediate(function oid() {
  return `${this.iid}.${this.type.formalName}`
  // `${type.name}<${NewUniqueId()}>`
})

_Thing.addLazyProperty(function uid() {
  return this._hasOwn("guid") ? this.guid : `<${NewUniqueId()}>`
})






_Thing.addAssigner("id", function _setId(newId_) {
  const existingId = this.id
  var   newId

  if (newId_ === undefined) {
    if (existingId !== undefined) { return existingId }
    newId = this.oid
  }
  else { newId = newId_ }

  if (existingId !== undefined) {
    const priorIds = this[$PRIOR_IDS] || (this[$PRIOR_IDS] = [])
    priorIds[priorIds.length] = existingId
  }
  return newId
})


_Thing.addAssigner("name", "_setName")

_Thing.addMethod(function _init(spec_) {
  if (spec_) {
    var id   = spec_.id
    var name = spec_.name
  }
  id   && (this.id   = id)
  name && (this.name = name)
  return this
})

// CHANGE TO CHECK FOR PUBLIC PROPERTIES FIRST!!!
_Thing.addMethod(function beImmutable(visited_inPlace_, visited_) {
  const [inPlace, visited] = (typeof visited_inPlace_ === "boolean") ?
    [visited_inPlace_, visited_] : [undefined, visited_inPlace_]
  const $inner = this[$INNER]
  if ($inner[IS_IMMUTABLE]) { return $inner[$PULP] }

  var next, property, value, $value, barrier
  const $rind      = $inner[$RIND]
  const $outer     = $inner[$OUTER]
  const properties =
    $inner[KNOWN_PROPERTIES] || SetKnownProperties($inner, true)

  visited.add($rind)

  next = properties.length
  while (next--) {
    property = properties[next]
    value    = $inner[property]

    if (typeof value !== "object" || value === null)  { continue }
    if (value === $rind)                              { continue }
    if (value[IS_IMMUTABLE] || value.id != null)      { continue }
    if (visited.has(value))                           { continue }

    $value = InterMap.get(value)
    if (inPlace) {
      if ($value) { $value[$PULP].beImmutable(true, visited) }
      else        { BeImmutableObject(value, true, visited)  }
    }
    else {
      value = $value ? $Copy($value, true)[$RIND] : CopyObject(value, true)
      $inner[property] = value
      if (property[0] !== "_") { $outer[property] = value }
    }
  }

  barrier               = new ImmutableInner($inner)
  $inner[$MAIN_BARRIER] = barrier
  $outer[IS_IMMUTABLE]  = $inner[IS_IMMUTABLE] = true
  Frost($outer)
  return ($inner[$PULP] = new Proxy($inner, barrier))

}, BASIC_SELF_IMMEDIATE)





// _Thing.addMethod(function addOwnMethod(method_namedFunc__name, func__, mode___) {
//   const $inner   = this[$INNER]
//   const method   = AsMethod(method_namedFunc__name, func__, mode___)
//   const selector = method.selector
//   const methods  = $inner[OWN_METHODS]|| ($inner[OWN_METHODS] = SpawnFrom(null))
//   const supers   = $inner[$SUPERS]    || ($inner[$SUPERS]     = SpawnFrom(null))
//   SetMethod($inner, method)
//   methods[selector] = method
//   delete supers[selector]
//   // delete getters
//   return this
// })
//
// _Thing.addMethod(function addOwnImmediate(...namedFunc_name__handler) {
//   return this.addOwnMethod(...namedFunc_name__handler, IMMEDIATE)
// })
//
// _Thing.addMethod(function addOwnLazyProperty(...namedFunc_name__handler) {
//   return this.addOwnMethod(...namedFunc_name__handler, LAZY_INSTALLER)
// })

// _Thing.addSMethod(function addOMethod(method_func__name, func_) {
//   const type = method_func__name.type
//   const method = type && type.is(Method) ?
//     method_func__name : Method.new(method_func__name, func__)
//   const selector = method.selector
//   const methods = (this[INSTANCE_METHODS] ||
//     this[INSTANCE_METHODS] = { __proto__ : null })
//   methods[selector] = method
//   this[selector] = method.handler
//   return this
// })


// _Thing.addMethod(function _noSuchProperty(selector) {
//   return SOME VALUE | this._signalError(this.oid)
// })

// _Thing.addMethod(function _setCopyId() {
//    if it has a way to make a new id then set it,
//    otherwise if mutable, no id, and if immutable set id to ""

//   return this._setId(this.oid)
// })



// _Thing.addMethod(function _postCreation() {
//   this.id = this.oid
//   return this
// })



// Obsolete and unnecessary
// Thing.addMethod(function _quietGet(selector) {
//   const descriptor = PropertyDescriptor(this, selector)
//   return descriptor.value
// })
