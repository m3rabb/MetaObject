Thing.addMethod(function _init(spec) {
  this.setName(spec && spec.name)
})

Thing.addMethod("_hasOwn", InHasSelector)



Thing.addSMethod(function addOMethod(method_func__name, func_) {
  const type = method_func__name.type
  const method = type && type.is(Method) ?
    method_func__name : Method.new(method_func__name, func__)
  const selector = method.selector
  const methods = (this[INSTANCE_METHODS] ||
    this[INSTANCE_METHODS] = { __proto__ : null })
  methods[selector] = method
  this[selector] = method.handler
  return this
})
