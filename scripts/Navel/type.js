_Type.addImmediate(function _nextIID() {
  return ++this._iidCount
})

_Type.addLazyProperty(function id() {
  return `${this.formalName},${this.basicId}`
})


_Type.addImmediate(function formalName() {
  const context = this.context
  const prefix = context ? context.id + "@" : ""
  return `${prefix}${this.name}`
})


_Type.addMethod(function new_(...args) {
  const $inner = this[$INNER]
  var instance, $instance, $outer, instance_

  if ($inner.new === $inner._basicNew) {
    $instance = new this._blanker(Permeable, args)
    _instance = $instance[$PULP]

    $instance[$OUTER].$INNER = $instance
    $instance[$PERMEABILITY] = Permeable

    $instance._init.apply(_instance, args)
    if ($instance._postInit) {
      const result = $instance._postInit.call(_instance)
      if (result !== undefined && result !== _instance) { return result }
    }
    return $instance[$RIND]
  }

  if (this === _Type) {
    return this._signalError("Redefining new on Type is forbidden!!")
  }
  instance  = this.new(...args)
  $instance = InterMap.get(instance)
  $outer    = $instance[$OUTER]
  instance_ = new Proxy($outer, Permeable)

  $instance[$PERMEABILITY] = Permeable
  $instance[$RIND]         = instance_
  $outer.$INNER            = $instance
  $outer[$RIND]            = instance_

  InterMap.set(instance_, $instance)
  return instance_

}, BASIC_VALUE_METHOD)




_Type.addMethod(function methodAt(selector) {
  const $root$inner = this._blanker.$root$inner
  const $method     = $root$inner[$IMMEDIATES][selector]

  if ($method) { return ($method.mode === SET_LOADER) ? null : $method[$RIND] }

  const value = $root$inner[selector]
  return (typeof value === "function" && InterMap.get(value)) ?
    (value.method || null) : null
})


_Type.addMethod(function addSupertype(type) {
  const newSupertypes = SetImmutable([...this.supertypes, types])
  this.setSupertypes(newSupertypes)
})


_Type.addMethod(function addAlias(aliasName, name_method) {
  const sourceMethod = name_method.isMethod ?
    name_method : this.methodAt(name_method)
  if (sourceMethod == null) {
    return this._unknownMethodToAliasError(name_method)
  }
  this.addMethod(aliasName, sourceMethod.handler, sourceMethod.mode)
})


_Type.addMethod(function _addValueMethod(...namedFunc_name__handler) {
  this.addMethod(...namedFunc_name__handler, VALUE_METHOD)
})

_Type.addMethod(function _addValueImmediate(...namedFunc_name__handler) {
  this.addMethod(...namedFunc_name__handler, VALUE_IMMEDIATE)
})


_Type.addMethod(function define(spec) {
  PropertyLoader.new(this.$).load(spec, "STANDARD")
})

_Type.addMethod(function addSharedProperties(spec) {
  PropertyLoader.new(this.$).load(spec, "SHARED")
})

_Type.addMethod(function addMethods(items) {
  PropertyLoader.new(this.$).load(items, "METHOD")
})

_Type.addMethod(function addDeclarations(propertyListing) {
  const properties = propertyListing.split(/\s+/)
  var   next       = properties.length
  while (next--) { this._setSharedProperty(properties[next], null, true) }
})

_Type.addAlias("_basicNew"    , "new"                 )
_Type.addAlias("declare"      , "addDeclarations"     )
_Type.addAlias("removeMethod" , "removeSharedProperty")
_Type.addAlias("_setImmutable", "_basicSetImmutable"  )



_Type.addMethod(function newAsFact(...args) {
  // Note: same as implementation in TypeOuter and TypeInner
  const  instance = this.$pulp.new(...args)
  const $instance = InterMap.get(instance)
  const _instance = $instance[$PULP]
  if (_instance.id == null) { $instance._setImmutable.call(_instance) }
  return instance
})

_Type.addMethod(function newAsFact_(...args) {
  // Note: same as implementation in TypeOuter and TypeInner
  const  instance = this.$pulp.new_(...args)
  const $instance = InterMap.get(instance)
  const _instance = $instance[$PULP]
  if (_instance.id == null) { $instance._setImmutable.call(_instance) }
  return instance
})


_Type.addMethod(function _unknownMethodToAliasError(property) {
  this._signalError(`Can't find method '${property}' to alias!!`)
})


// Type.addMethod(INSTANCEOF, (instance) => instance[this.membershipSelector])

// Type.moveMethodTo("", target)
