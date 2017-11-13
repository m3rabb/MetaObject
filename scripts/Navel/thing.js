HandAxe(function ($PULP,_OwnKeysOf, _Thing) {
  "use strict"

  //// INITIALIZING ////

  _Thing.addValueMethod(function _init(spec_) {
    if (spec_ != null) {
      _OwnKeysOf(spec_).forEach(selector => (this[selector] = spec_[selector]))
    }
    return this
  })




  //// SETTING ////

  _Thing.addAlias("setId", "basicSetId")

  _Thing.addAlias("setContext", "basicSetContext")

  _Thing.addSetter("_setName", "name")




  //// CONVERTING ////

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
