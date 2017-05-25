


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

Thing.addMethod("_hasOwn", HasOwnProperty)


Thing.addGetter(function iid() {
  let iid = this[$IID]
  if (iid !== undefined) { return iid }
  // This will set the $iid, even of an immutable thing
  return (this[$INNER][$IID] = InterMap.get(this.type)[$PULP]._nextIID)
})

Thing.addGetter(function oid() {
  const type = this.type
  const context = type.context
  const prefix = context ? context.id + "@" : ""
  return `${prefix}${type.name}#${this.iid}`
  // `${type.name}<${NewUniqueId()}>`
})


Thing.addSetLoader("id", function _setId(newId_) {
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

Thing.addSetLoader("name", "_setName")

Thing.addMethod(function _init(spec_) {
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
// _Thing.addMethod(function addOwnGetter(...namedFunc_name__handler) {
//   return this.addOwnMethod(...namedFunc_name__handler, GETTER)
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
