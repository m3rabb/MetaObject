
Type.addMethod("new", function (/* arguments */) {
  const $inner = new this._blankConstructor()
  $inner[$FLESH]._init(arguments)
  return $inner[$RIND]
})

Type.addMethod(INSTANCEOF, (instance) => instance[this.membershipSelector])


Type.addMethod(function methodAt(selector) {
  // FINISH THIS
})


Type.addMethod(function addAlias(aliasName, name_method) {
  const sourceMethod = name_method.isMethod ?
    name_method : this.methodAt(name_method)
  return this.addMethod(aliasName, sourceMethod.handler, sourceMethod.mode)
})

Type.addAlias("removeMethod", "removeProperty")
