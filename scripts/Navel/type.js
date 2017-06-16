_Type.addMethod(function addAlias(aliasName, name_method) {
  const sourceMethod = name_method.isMethod ?
    name_method : this.methodAt(name_method)
  if (sourceMethod == null) {
    return this._unknownMethodToAliasError(name_method)
  }
  this.addMethod(aliasName, sourceMethod.handler, sourceMethod.mode)
})

_Type.addMethod(function addLazyProperty(loader_property, loader_, mode__) {
  // Will set the $inner property even on an immutable object!!!
  const [property, loader, mode = STANDARD_METHOD] =
    (typeof loader_property === "function") ?
      [loader_property.name, loader_property, loader_] :
      [loader_property     , loader_        , mode__ ]

  this.addMethod(property, AsLazyProperty(property, loader), mode)
})

_Type.addMethod(function addFactMethod(...namedFunc_name__handler) {
  this.addMethod(...namedFunc_name__handler, VALUE_METHOD)
})

_Type.addMethod(function addImmutableValueMethod(...namedFunc_name__handler) {
  this.addMethod(...namedFunc_name__handler, VALUE_METHOD)
})

_Type.addMethod(function addMutableValueMethod(...namedFunc_name__handler) {
  this.addMethod(...namedFunc_name__handler, VALUE_METHOD)
})

_Type.addMethod(function _nextIID() {
  // This works on an immutable type without creating a new copy.
  return ++this[$INNER]._iidCount
}, BASIC_VALUE_METHOD)

_Type.addLazyProperty(function id() {
  return `${this.formalName},${this.basicId}`
})


_Type.addMethod(function formalName() {
  const context = this.context
  const prefix = context ? context.id + "@" : ""
  return `${prefix}${this.name}`
})


_Type.addMethod(function toString() {
  return this.formalName
})


_Type.addMethod(function new_(...args) {
  const $inner = this[$INNER]
  var instance, $instance, _postInit, $outer, instance_

  if ($inner.new === $inner._basicNew) {
    $instance = new this._blanker(Permeable, args)
    _instance = $instance[$PULP]
    _postInit = $instance._postInit

    $instance[$OUTER].$INNER = $instance
    $instance[$PERMEABILITY] = Permeable

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

  $instance[$PERMEABILITY] = Permeable
  $instance[$RIND]         = instance_
  $outer.$INNER            = $instance
  $outer[$RIND]            = instance_

  InterMap.set(instance_, $instance)
  return instance_

}, BASIC_VALUE_METHOD)



_Type.addMethod(function methodAncestryListing(selector) {
  const ancestry = this.methodAncestry(selector)
  return ancestry.map(type => type.name).join(" ")
})

_Type.addMethod(function methodsListing() {
  return this.methods.map(method => method.selector).join(" ")
})

_Type.addMethod(function definedMethodsListing() {
  return this.definedMethods.map(method => method.selector).join(" ")
})



_Type.addMethod(function definesMethod(selector) {
  const value = this._properties[selector]
  return (value && value.type === Method)
}, BASIC_VALUE_METHOD)


_Type.addMethod(function methodAncestry(selector) {
  return SetImmutable(
    this.ancestry.filter(type => type.definesMethod(selector)))
})



_Type.addMethod(function methods() {
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

_Type.addMethod(function definedMethods() {
  const properties = this._properties
  const methods    = []

  for (var property in properties) {
    var value = properties[property]
    if (value && value.type === Method) { methods.push(value) }
  }
  methods.sort((a, b) => AsName(a.selector).localeCompare(AsName(b.selector)))
  return SetImmutable(methods)
})


_Type.addMethod(function methodAt(selector) {
  const $root$inner = this._blanker.$root$inner
  const $method     = $root$inner[$IMMEDIATES][selector]

  if ($method) { return ($method.mode === SET_LOADER) ? null : $method[$RIND] }

  const value = $root$inner[selector]
  return (typeof value === "function" && InterMap.get(value) === WRAPPER_FUNC) ?
    (value.method || null) : null
})



_Type.addMethod(function addSupertype(type) {
  const newSupertypes = SetImmutable([...this.supertypes, types])
  this.setSupertypes(newSupertypes)
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

_Type.addAlias("_basicNew"                , "new"                 )
_Type.addAlias("declare"                  , "addDeclarations"     )
_Type.addAlias("removeMethod"             , "removeSharedProperty")



_Type.addMethod(function newAsFact(...args) {
  // Note: same as implementation in TypeOuter and TypeInner
  const  instance = this.$pulp.new(...args)
  const $instance = InterMap.get(instance)
  const _instance = $instance[$PULP]
  if (_instance.id == null) { $instance._setImmutable.call(_instance) }
  return instance
}, BASIC_VALUE_METHOD)

_Type.addMethod(function newAsFact_(...args) {
  // Note: same as implementation in TypeOuter and TypeInner
  const  instance = this.$pulp.new_(...args)
  const $instance = InterMap.get(instance)
  const _instance = $instance[$PULP]
  if (_instance.id == null) { $instance._setImmutable.call(_instance) }
  return instance
}, BASIC_VALUE_METHOD)








_Type.addMethod(function _unknownMethodToAliasError(property) {
  this._signalError(`Can't find method '${property}' to alias!!`)
})


// Type.addMethod(INSTANCEOF, (instance) => instance[this.membershipSelector])

// Type.moveMethodTo("", target)


// _Type._setImmutable()
