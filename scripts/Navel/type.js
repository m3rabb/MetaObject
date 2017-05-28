_Type.addImmediate(function _nextIID() {
  return ++this._iidCount
})

_Type.addLazyProperty(function id() {
  return `${this.name},${this.oid}`
})


_Type.addMethod(function asPermeable() {
  const type$inner   = this[$INNER]
  const type$outer   = type$inner[$OUTER]
  const func         = type$inner._disguisedFunc
  const _type$inner  = SpawnFrom(type$inner)
  const _type$outer  = SpawnFrom(type$outer)
  const permeability = type$inner.isPermeable ? Permeable : Impermeable

  PreInitType(func, _type$inner, _type$outer, permeability)
  _type$inner._permeability = Permeable

  DefineProperty($inner, "asPermeable", InvisibleConfiguration)
  return (this.asPermeable = _type$inner[$RIND])
}, BASIC_IMMEDIATE)


_Type.addMethod(function asImpermeable() {
  const $inner = this[$INNER]
  const target = ($inner._permeability === Permeable) ? RootOf($inner) : $inner

  DefineProperty(target, "asImpermeable", InvisibleConfiguration)
  return (target[$PULP].asImpermeable = target[$RIND])
}, BASIC_IMMEDIATE)

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
