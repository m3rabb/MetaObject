Tranya(function ($INNER, $PRIOR_IDS, $PULP, ValueAsName, _$Intrinsic, _Thing) {
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

  _Thing.addValueMethod(function _init(spec_) {
    if (spec_ != null) {
      for (var selector in spec_) {
        this[selector] = spec_[selector]
      }
    }
    return this
  })



  // Note: explicitly ensuring $pulp prevents printing
  // inaccuracies in Jasmine, when it has direct access to the
  // $inner or $outer object instead.
  _Thing.addValueMethod(function toString(_) { // eslint-disable-line
    const target    = this[$PULP] || this
    const name      = target.name
    const oid       = target.oid
    const separator = (name && oid) ? "," : ""
    return `${name}${separator}${oid}`
  })

  // _Thing.addValueMethod(function toString(_) { // eslint-disable-line
  //   const _this = this[$PULP]
  //   const name = _this.name
  //   return `${name}${(name) ? "," : ""}${_this.oid}`
  // })

  // _$Intrinsic.addAlias("jasmineToString", _Thing.definitionAt("toString"))
  // Is this still necessary???


  // _Thing.addMethod(function toString(_) { // eslint-disable-line
  //   const name       = this.name
  //   const namePrefix = `${name}${(name) ? "," : ""}`
  //   return `${namePrefix}${this.oid}`
  // })





  // _Thing.addDeclaration("_initFrom_")
  // _Thing.addDeclaration("_postInit")
  // _Thing.addDeclaration("_setPropertiesImmutable")

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
