_Type.addGetter(function _nextIID() {
  return ++this._iidCount
})

_Type.addLazyProperty(function id() {
  return this.oid
})


// _Type.addMethod(function methodAt(selector) {
//   // FINISH THIS
// })
//
// _Type.addMethod(function addAlias(aliasName, name_method) {
//   const sourceMethod = name_method.isMethod ?
//     name_method : this.methodAt(name_method)
//   return this.addMethod(aliasName, sourceMethod.handler, sourceMethod.mode)
// })
//
// _Type.addAlias("basicNew", "new")
// _Type.addAlias("removeMethod", "removeProperty")
//


// Type.addMethod(INSTANCEOF, (instance) => instance[this.membershipSelector])

// Type.moveMethodTo("", target)
