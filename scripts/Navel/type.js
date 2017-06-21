_Type._addMethod(function addAlias(aliasName, name_method) {
  const sourceMethod = name_method.isMethod ?
    name_method : this.methodAt(name_method)
  if (sourceMethod == null) {
    return this._unknownMethodToAliasError(name_method)
  }
  this._addMethod(aliasName, sourceMethod.handler, sourceMethod.mode)
})

_Type._addMethod(function addLazyProperty(assigner_property, assigner_) {
  // Will set the $inner property even on an immutable object!!!
  const [property, assigner] = (typeof assigner_property === "function") ?
    [assigner_property.name, assigner_property] :
    [assigner_property     , assigner_        ]

  this._addMethod(property, AsLazyProperty(property, assigner))
})

_Type._addMethod(function addFactMethod(...namedFunc_name__handler) {
  this.addMethod(...namedFunc_name__handler, VALUE_METHOD)
})

_Type._addMethod(function addImmutableValueMethod(...namedFunc_name__handler) {
  this.addMethod(...namedFunc_name__handler, VALUE_METHOD)
})

_Type._addMethod(function addMutableValueMethod(...namedFunc_name__handler) {
  this.addMethod(...namedFunc_name__handler, VALUE_METHOD)
})

_Type._addMethod(function _nextIID() {
  // This works on an immutable type without creating a new copy.
  return ++this[$INNER]._iidCount
}, BASIC_VALUE_METHOD)

_Type.addLazyProperty(function id() {
  return `${this.formalName},${this.basicId}`
})


_Type._addMethod(function formalName() {
  const context = this.context
  const prefix = context ? context.id + "@" : ""
  return `${prefix}${this.name}`
})


_Type._addMethod(function toString(_) {
  return this.formalName
})


_Type._addMethod(function new_(...args) {
  const $inner = this[$INNER]
  var instance, $instance, _postInit, $outer, instance_

  if ($inner.new === $inner._basicNew) {
    $instance = new this._blanker(Permeable, args)
    _instance = $instance[$PULP]
    _postInit = $instance._postInit

    $instance[$OUTER].$INNER = $instance

    $instance._init.apply(_instance, args)

    if (_postInit) {
      const result = _postInit.call(_instance)
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

  $instance[$RIND] = instance_
  $outer.$INNER    = $instance
  $outer[$RIND]    = instance_

  InterMap.set(instance_, $instance)
  return instance_

}, BASIC_VALUE_METHOD)



_Type._addMethod(function methodAncestryListing(selector) {
  const ancestry = this.methodAncestry(selector)
  return ancestry.map(type => type.name).join(" ")
})

_Type._addMethod(function methodsListing() {
  return this.methods.map(method => method.selector).join(" ")
})

_Type._addMethod(function definedMethodsListing() {
  return this.definedMethods.map(method => method.selector).join(" ")
})



_Type._addMethod(function definesMethod(selector) {
  const value = this._properties[selector]
  return (value && value.type === Method)
}, BASIC_VALUE_METHOD)


_Type._addMethod(function methodAncestry(selector) {
  return SetImmutable(
    this.ancestry.filter(type => type.definesMethod(selector)))
})



_Type._addMethod(function methods() {
  const $root$inner = this._blanker.$root$inner
  const methods     = []

  for (var property in $root$inner) {
    var value  = $root$inner[property]
    var method =
      (typeof value === "function" && InterMap.get(value) === WRAPPER_FUNC) ?
        (value.method || null) : null
    if (method) { methods.push(method) }
  }
  methods.sort((a, b) => AsName(a.selector).localeCompare(AsName(b.selector)))
  return SetImmutable(methods)
})

_Type._addMethod(function definedMethods() {
  const properties = this._properties
  const methods    = []

  for (var property in properties) {
    var value = properties[property]
    if (value && value.type === Method) { methods.push(value) }
  }
  methods.sort((a, b) => AsName(a.selector).localeCompare(AsName(b.selector)))
  return SetImmutable(methods)
})


_Type._addMethod(function methodAt(selector) {
  const $root$inner = this._blanker.$root$inner
  const $method     = $root$inner[$IMMEDIATES][selector]

  if ($method) { return ($method.inner) ? $method[$RIND] : null }

  const value = $root$inner[selector]
  return (typeof value === "function" && InterMap.get(value) === WRAPPER_FUNC) ?
    (value.method || null) : null
})



_Type._addMethod(function addSupertype(type) {
  const newSupertypes = SetImmutable([...this.supertypes, types])
  this.setSupertypes(newSupertypes)
})




_Type._addMethod(function define(spec) {
  PropertyLoader.new(this.$).load(spec, "STANDARD")
})

_Type._addMethod(function addSharedProperties(spec) {
  PropertyLoader.new(this.$).load(spec, "SHARED")
})

_Type._addMethod(function addMethods(items) {
  PropertyLoader.new(this.$).load(items, "METHOD")
})

_Type._addMethod(function addDeclarations(propertyListing) {
  const properties = propertyListing.split(/\s+/)
  var   next       = properties.length
  while (next--) { this._setSharedProperty(properties[next], null, true) }
})

_Type.addAlias("_basicNew"                , "new"                 )
_Type.addAlias("declare"                  , "addDeclarations"     )
_Type.addAlias("removeMethod"             , "removeSharedProperty")



_Type._addMethod(function newAsFact(...args) {
  // Note: same as implementation in TypeOuter and TypeInner
  const  instance = this.$pulp.new(...args)
  const $instance = InterMap.get(instance)
  const _instance = $instance[$PULP]
  if (_instance.id == null) { $instance._setImmutable.call(_instance) }
  return instance
}, BASIC_VALUE_METHOD)

_Type._addMethod(function newAsFact_(...args) {
  // Note: same as implementation in TypeOuter and TypeInner
  const  instance = this.$pulp.new_(...args)
  const $instance = InterMap.get(instance)
  const _instance = $instance[$PULP]
  if (_instance.id == null) { $instance._setImmutable.call(_instance) }
  return instance
}, BASIC_VALUE_METHOD)








_Type._addMethod(function _unknownMethodToAliasError(property) {
  this._signalError(`Can't find method '${property}' to alias!!`)
})


// Type._addMethod(INSTANCEOF, (instance) => instance[this.membershipSelector])

// Type.moveMethodTo("", target)


// _Type._setImmutable()
