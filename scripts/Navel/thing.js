


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



_Thing.addMethod(function has(propertyName) {
  return (propertyName in this[$OUTER])
}, BASIC_METHOD)

_Thing.addMethod(function _has(propertyName) {
  return (propertyName in this[$INNER])
}, BASIC_METHOD)

_Thing.addMethod(function hasOwn(propertyName) {
  if (propertyName[0] === "_") { return undefined }
  const names = this[KNOWN_PROPERTIES] || ResetKnownProperties(this)
  return (names[propertyName] !== undefined)
}, BASIC_METHOD)

_Thing.addMethod(function _hasOwn(propertyName) {
  const names = this[KNOWN_PROPERTIES] || ResetKnownProperties(this)
  return (names[propertyName] !== undefined)
}, BASIC_METHOD)





_Thing.addMethod(function iid() {
  DefineProperty(this[$INNER], "iid", InvisibleConfiguration)
  return (this.iid = InterMap.get(this.type)[$PULP]._nextIID)
}, BASIC_IMMEDIATE)

_Thing.addImmediate(function oid() {
  const type = this.type
  const context = type.context
  const prefix = context ? context.id + "@" : ""
  return `${this.iid}.${prefix}${type.name}`
  // `${type.name}<${NewUniqueId()}>`
})

_Thing.addLazyProperty(function uid() {
  return this._hasOwn("guid") ? this.guid : `<${NewUniqueId()}>`
})




_Thing.addAssigner("id", function _setId(newId_) {
  const existingId = this.id
  let   newId

  if (newId_ === undefined) {
    if (existingId !== undefined) { return existingId }
    newId = this.oid
  }
  else { newId = newId_ }

  if (existingId !== undefined) {
    let priorIds = this[$PRIOR_IDS] || (this[$PRIOR_IDS] = [])
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



// _Thing.addMethod(function _postCreation(beImmutable_) {
//   this.id = this.oid
//   return this
// })



// Obsolete and unnecessary
// Thing.addMethod(function _quietGet(selector) {
//   const descriptor = PropertyDescriptor(this, selector)
//   return descriptor.value
// })
