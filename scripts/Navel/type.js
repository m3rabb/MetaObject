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
  const prefix  = context ? context.id + "@" : ""
  return `${prefix}${this.name}`
})


_Type._addMethod(function toString(_) {
  return this.formalName
})


_Type._addMethod(function new_(...args) {
  const $inner     = this[$INNER]
  const newHandler = $inner.new
  var $instance, _instance, _$instance, instance, instance_, _postInit

  // NOTE: add something to the handler for basicNew and new_ to differentiate it
  // handler.name === "new_"
  if (newHandler === _BasicNew ||  // The new method is the original, has not been overridden
      newHandler === new_) {       // The new method has been set to this method
    _$instance = new this._blanker(Permeable, args)
    $instance  = _$instance[$OUTER]
    _instance  = _$instance[$PULP]
    _postInit  = _$instance._postInit

    $instance.$INNER = _$instance

    _$instance._init.apply(_instance, args)

    if (_postInit) {
      const result = _postInit.call(_instance)
      if (result !== undefined && result !== _instance) { return result }
    }
    return _$instance[$RIND]
  }

  if (this === _Type) {
    return this._signalError("Redefining new on Type is forbidden!!")
  }
  instance   = this.new(...args)
  _$instance = InterMap.get(instance)
  instance_  = new Proxy(_$instance[$OUTER], Permeable)
  InterMap.set(instance_, _instance)

  $instance.$INNER = _instance
  return ($instance[$RIND] = _$instance[$RIND] = instance_)
}, BASIC_VALUE_METHOD)


function MakeNew_(existingCustomNew) {
  return function new_(...args) {
    const instance   = existingCustomNew.apply(this, args)
    const _$instance = InterMap.get(instance)
    const $instance  = _$instance[$OUTER]
    const instance_  = new Proxy($instance, Permeable)

    $instance.$INNER = _$instance
    $instance[$RIND] = _$instance[$RIND] = instance_
    InterMap.set(instance_, _$instance)
    return instance_
  }
}

// _Type._addMethod(function _postInit(_) {
//   if (this.isPermeable) {
//     if (this.new !== _BasicNew) {
//       this.addOwnMethod(MakeNew_(this.new), BASIC_VALUE_METHOD)
//     }
//     this.addOwnAlias("new"      , "new_"      )
//     this.addOwnAlias("newAsFact", "newAsFact_")
//   }
// })

_Type._addMethod(function _initFrom_(type_) {
  const properties = type_._properties
  var   propertyName, property, nextProperty, ownMethods, method, nextMethod

  this._init({
    name : type_.name,
    supertypes : type_.supertypes,
  })

  for (propertyName in properties) {
    property     = properties[propertyName]
    nextProperty = Copy(property)
    this._setSharedProperty(propertyName, property)
  }

  if ((ownMethods = type_[$OWN_METHODS])) {
    for (propertyName in ownMethods) {
      method     = ownMethods[propertyName]
      nextMethod = Copy(method)
      this.addOwnMethod(nextMethod)
    }
  }
})



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
      (typeof value === "function" && InterMap.get(value) === INNER_FUNC) ?
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
  return MethodAt(this._blanker.$root$inner, selector)
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
  const properties = IsArray(propertyListing) ?
    propertyListing : propertyListing.split(/\s*[ ,]\s*/)
  var   next       = properties.length
  while (next--) { this._setSharedProperty(properties[next], null) }
})

_Type._addMethod(function addDurableProperty(property) {
  const properties = this[DURABLES] || []
  if (!properties.includes(property)) {
    this[DURABLES] = SetImmutable([...properties, property])
    this.addDeclaration(property)
  }
  return this
}, BASIC_SELF_METHOD)



_Type._addMethod(function addDurables(propertyListing) {
  const properties = IsArray(propertyListing) ?
    propertyListing : propertyListing.split(/\s*[ ,]\s*/)
  var   next       = properties.length
  while (next--) { this._setSharedProperty(properties[next], null) }
})


_Type.addAlias("_basicNew"    , "new"                 )
_Type.addAlias("declare"      , "addDeclarations"     )
_Type.addAlias("durables"     , "addDurables"         )
_Type.addAlias("removeMethod" , "removeSharedProperty")
_Type.addAlias("defines"      , "define"              )


_Type._addMethod(function newAsFact(...args) {
  // Note: same as implementation in TypeOuter and TypeInner
  const instance  = this.new(...args)
  const _instance = InterMap.get(instance)
  const instance_ = _instance[$PULP]
  if (instance_.id == null) { _instance._setImmutable.call(instance_) }
  return instance
}, BASIC_VALUE_METHOD)

_Type._addMethod(function newAsFact_(...args) {
  // Note: same as implementation in TypeOuter and TypeInner
  const instance_  = this.new_(...args)
  const _$instance = InterMap.get(instance_)
  const _instance  = _$instance[$PULP]
  if (_instance.id == null) { _$instance._setImmutable.call(_instance) }
  return instance_
}, BASIC_VALUE_METHOD)








_Type._addMethod(function _unknownMethodToAliasError(property) {
  this._signalError(`Can't find method '${property}' to alias!!`)
})



// Type._addMethod(INSTANCEOF, (instance) => instance[this.membershipSelector])

// Type.moveMethodTo("", target)


// _Type._setImmutable()
