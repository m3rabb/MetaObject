Tranya(function (
  $INNER, $PRIOR_IDS, $PULP, $RIND, _DURABLES,
  AsName, _Thing
) {
  "use strict"


  _Thing.addSetter("setId", function id(newId_) {
    const $inner     = this[$INNER]
    const existingId = $inner.id
    var   newId, priorIds

    if (newId_ === undefined) {
      if (existingId != null) { return existingId }
      newId = this._retarget.oid
    }
    else if (newId_ === existingId) { return existingId }
    else { newId = newId_ }

    if (existingId != null) {
      priorIds = $inner[$PRIOR_IDS] || []
      $inner[$PRIOR_IDS] = [...priorIds, existingId]
    }
    return newId
  })


  _Thing.addSetter("_setName", "name")

  _Thing.addMethod(function _init(spec_) {
    if (spec_ == null) { return }
    for (var selector in spec_) {
      this[selector] = spec_[selector]
    }
  })



  // Note: explicitly ensuring $pulp prevents printing
  // inaccuracies in Jasmine, when it has access to the $inner object instead.
  _Thing.addMethod(function toString(_) { // eslint-disable-line
    const _this = this[$PULP]
    const name = _this.name
    return `${name}${(name) ? "," : ""}${_this.oid}`
  })

  _Thing.addAlias("jasmineToString", "toString")
  

  // _Thing.addMethod(function toString(_) { // eslint-disable-line
  //   const name       = this.name
  //   const namePrefix = `${name}${(name) ? "," : ""}`
  //   return `${namePrefix}${this.oid}`
  // })


  _Thing.addMethod(function _notYetImplemented(selector) {
    this._signalError(`The method ${AsName(selector)} has not been implemented yet!!`)
  })

})

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

// _Thing.addMethod(function _initFrom_(permeableSource, propertiesBeImmutable, visited, except_) {
//   this.id = this.oid
//   return this
// })


// Obsolete and unnecessary
// Thing.addMethod(function _quietGet(property) {
//   const descriptor = PropertyDescriptor(this, property)
//   return descriptor.value
// })
