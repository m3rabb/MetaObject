_Type.addImmediate(function _nextIID() {
  return ++this._iidCount
})

_Type.addLazyProperty(function id() {
  return `${this.name},${this.oid}`
})


_Type.addLazyProperty(function formalName() {
  const context = this.context
  const prefix = context ? context.id + "@" : ""
  return `${prefix}${this.name}`
})



_Type.addMethod(function asPermeable() {
  const type$inner   = this[$INNER]
  const type$outer   = type$inner[$OUTER]
  const blanker      = type$inner._blanker

  const type$inner_  = SpawnFrom(type$inner)
  const type$outer_  = SpawnFrom(type$outer)
  const typeName_    = type$inner.name + "_"
  const func_        = MakeVacuousConstructor(typeName_)
  const permeability = type$inner.isPermeable ? Permeable : Impermeable

  const type$pulp_ = PreInitType(func_, type$inner_, type$outer_, permeability)

  type$inner_._blanker = NewBlanker({super: blanker, permeability: Permeable})

  type$pulp_._initCoreIdentity(name)
  type$pulp_.addSharedProperty("isPermeable", true)

  DefineProperty(type$inner, "asPermeable", InvisibleConfiguration)
  return (this.asPermeable = type$inner_[$RIND])
}, BASIC_VALUE_IMMEDIATE)


_Type.addMethod(function asImpermeable() {
  const $inner       = this[$INNER]
  const permeability = $inner._blanker.permeability
  const $primary     = (permeability === Impermeable) ? $inner : RootOf($inner)

  DefineProperty(primary, "asImpermeable", InvisibleConfiguration)
  return ($primary[$PULP].asImpermeable = $primary[$RIND])
}, BASIC_VALUE_IMMEDIATE)



// REVISIT!!!
_Type.addMethod(function methodAt(selector) {
  const value = this._blanker.$root$inner[selector]
  if (typeof value !== "function") { return null }
  if (InterMap.get(value)) { return value.method || null }
  return null
})

_Type.addMethod(function addAlias(aliasName, name_method) {
  const sourceMethod = name_method.isMethod ?
    name_method : this.methodAt(name_method)
  if (sourceMethod == null) {
    return UnknownMethodToAliasError(this[$RIND], name_method)
  }
  return this.addMethod(aliasName, sourceMethod.handler, sourceMethod.mode)
})



_Type.addAlias("basicNew", "new")
_Type.addAlias("removeMethod", "removeSharedProperty")
_Type.addAlias("_setImmutable", "_basicSetImmutable")



_Type.addMethod(function newAsFact(...args) {
  // Note: same as implementation in TypeOuter and TypeInner
  const  instance = this.$pulp.new(...args)
  const _instance = InterMap.get(instance)[$PULP]
  if (_instance.id == null) { _instance._setImmutable() }
  return instance
})


// Type.addMethod(INSTANCEOF, (instance) => instance[this.membershipSelector])

// Type.moveMethodTo("", target)
