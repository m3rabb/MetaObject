ObjectSauce(function (
  $INNER, $OUTER, $PRIOR_IDS, $RIND, _DURABLES,
  AsName, _Thing
) {
  "use strict"


  _Thing.addSetter("_setId", function id(newId_) {
    const existingId = this[$INNER].id
    var   newId, priorIds

    if (newId_ === undefined) {
      if (existingId != null) { return existingId }
      newId = this._retarget.oid
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




  _Thing.addMethod(function toString(_) { // eslint-disable-line
    const name = this.name
    return `${name}${(name) ? "," : ""}${this.basicId}`
  })


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
