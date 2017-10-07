HandAxe(function (
  $INNER, $OUTER, $PRIOR_IDS, $PULP, DefineProperty, InvisibleConfig, _Thing
) {
  "use strict"


  _Thing.addSetterAndAssigner("setId", function id(newId_) {
    const existingId = this.id
    if (existingId == null) {
      this._retarget
      const $inner = this[$INNER]
      DefineProperty($inner        , "id", InvisibleConfig)
      DefineProperty($inner[$OUTER], "id", InvisibleConfig)
      return (newId_ !== undefined) ? newId_ : this.oid
    }
    if (newId_ == null || newId_ === existingId) { return existingId }

    if (existingId != null) {
      const $inner   = this[$INNER]
      const priorIds = this[$PRIOR_IDS] || []
      $inner[$PRIOR_IDS] = [...priorIds, existingId]
    }
    return newId_
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


  // _$Intrinsic.addAlias("jasmineToString", _Thing.definitionAt("toString"))
  // Is this still necessary???


})


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/





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
