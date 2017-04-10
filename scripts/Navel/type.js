
Type.addMethod("new", function (/* arguments */) {
  const $inner = new this._blankConstructor()
  $inner[$FLESH]._init(arguments)
  return $inner[RIND]
})

Type.addMethod(INSTANCEOF, (instance) => instance[IS_TYPE_SELECTOR])


Type.addMethod(function addGetter(...args) {
  return this.add(...args, GETTER)
})

Type.addMethod(function addLazyInstaller(...args) {
  return this.add(...args, LAZY_INSTALLER)
})

Type.addMethod(function addAlias(aliasName, name_method) {
  const oldMethod = (typeof name_method === "string") ?
    this._properties[name_method] : name_method
  return this.add(aliasName, oldMethod.handler, oldMethod.mode)
})
