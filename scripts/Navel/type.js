// _Type.addMethod(function addFactMethod(...namedFunc_name__handler) {
//   this.addMethod(...namedFunc_name__handler, VALUE_METHOD)
// })
//
// _Type.addMethod(function addImmutableValueMethod(...namedFunc_name__handler) {
//   this.addMethod(...namedFunc_name__handler, VALUE_METHOD)
// })
//
// _Type.addMethod(function addMutableValueMethod(...namedFunc_name__handler) {
//   this.addMethod(...namedFunc_name__handler, VALUE_METHOD)
// })



// addDefinition(definition)
// addDefinition(tag, definition)
// addDefinition(namedFunc, mode_)
// addDefinition(selector, func, mode_)

_Type.addMethod(function addDefinition(...args) {
  const definition = AsDefinition(...args)
  this._setDefinitionAt(definition.tag, definition)
})


_Type.addMethod(function addAlias(aliasName, selector_definition) {
  const definition = selector_definition.isDefinition ?
    selector_definition :
    this.instanceMethodAt(selector_definition) ||
    this._unknownMethodToAliasError(selector_definition)

  this.addDefinition(aliasName, definition)
})

_Type.addMethod(function _unknownMethodToAliasError(selector) {
  this._signalError(`Can't find method '${AsName(selector)}' to alias!!`)
})


_Type.addMethod(function addLazyProperty(assigner_selector, assigner_) {
  // Will set the $inner AsName( even on) an immutable object!!!
  const [selector, assigner] = (typeof assigner_selector === "function") ?
    [assigner_selector.name, assigner_selector] :
    [assigner_selector     , assigner_        ]

  this.addMethod(selector, AsLazyProperty(selector, assigner))
})


_Type.addMethod(function addDurableProperty(selector) {
  const properties = this[DURABLES] || []
  if (!properties.includes(selector)) {
    this[DURABLES] = SetImmutable([...properties, selector])
    this.addDeclaration(selector)
  }
  return this
}, BASIC_SELF_METHOD)






_Type.addMethod(function define(spec) {
  PropertyLoader.new(this.$).load(spec, "STANDARD")
})

_Type.addMethod(function addSharedProperties(spec) {
  PropertyLoader.new(this.$).load(spec, "SHARED")
})

_Type.addMethod(function addMethods(items) {
  PropertyLoader.new(this.$).load(items, "METHOD")
})

_Type.addMethod(function addDeclarations(items) {
  PropertyLoader.new(this.$).load(items, "DECLARATION")
})

_Type.addMethod(function addDurableProperties(items) {
  PropertyLoader.new(this.$).load(items, "DURABLES")
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
  const prefix  = context ? context.id + "@" : ""
  return `${prefix}${this.name}`
})


_Type.addMethod(function toString(_) {
  return this.formalName
})




_Type.addMethod(function inheritsFrom(type) {
  return (type !== this[$RIND] && this.ancestry.includes(type))
})


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




_Type.addMethod(function instanceMethodAt(selector) {
  return MethodAt(this._blanker.$root$inner, selector)
})

_Type.addMethod(function definedMethodAt(selector) {
  //
})


_Type.addMethod(function instanceMethods() {
  const $root$inner = this._blanker.$root$inner
  const methods     = []

  for (var selector in $root$inner) {
    var value  = $root$inner[selector]
    var method =
      (typeof value === "function" && InterMap.get(value) === INNER_FUNC) ?
        (value.method || null) : null
    if (method) { methods.push(method) }
  }
  methods.sort((a, b) => AsName(a.selector).localeCompare(AsName(b.selector)))
  return SetImmutable(methods)
})

_Type.addMethod(function definedMethods() {
  const properties = this._properties
  const methods    = []

  for (var selector in properties) {
    var value = properties[selector]
    if (value && value.type === Definition) { methods.push(value) }
  }
  methods.sort((a, b) => AsName(a.selector).localeCompare(AsName(b.selector)))
  return SetImmutable(methods)
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

_Type.addMethod(function addDeclarations(items) {
  PropertyLoader.new(this.$).load(items, "DECLARATION")
})

_Type.addMethod(function addDurableProperties(items) {
  PropertyLoader.new(this.$).load(items, "DURABLES")
})








_Type.addMethod(_BasicNew_, BASIC_VALUE_METHOD)

// _basicNew_
_Type.addOwnMethod(function new_(...args) {
  const instance = this._super.new_(...args)
  instance.addOwnAlias("new"      , "new_"      )
  instance.addOwnAlias("newAsFact", "newAsFact_")
  return instance
})


_Type.addMethod(function newAsFact(...args) {
  // Note: same as implementation in TypeOuter and TypeInner
  const instance  = this.new(...args)
  const _instance = InterMap.get(instance)
  const instance_ = _instance[$PULP]
  if (instance_.id == null) { _instance._setImmutable.call(instance_) }
  return instance
}, BASIC_VALUE_METHOD)

_Type.addMethod(function newAsFact_(...args) {
  // Note: same as implementation in TypeOuter and TypeInner
  const instance_  = this.new_(...args)
  const _$instance = InterMap.get(instance_)
  const _instance  = _$instance[$PULP]
  if (_instance.id == null) { _$instance._setImmutable.call(_instance) }
  return instance_
}, BASIC_VALUE_METHOD)


// function MakeNew_(existingCustomNew) {
//   return function new_(...args) {
//     const instance   = existingCustomNew.apply(this, args)
//     const _$instance = InterMap.get(instance)
//     const $instance  = _$instance[$OUTER]
//     const instance_  = new Proxy($instance, Permeable)
//
//     $instance.this = _$instance
//     $instance[$RIND] = _$instance[$RIND] = instance_
//     InterMap.set(instance_, _$instance)
//     return instance_
//   }
// }


_Type.addMethod(function _initFrom_(_type) {
  var   propertyName, property, nextProperty, ownMethods, method, nextMethod

  this._init({
    name : _type.name,
    supertypes : _type.supertypes,
  })

  const definitions = _type._definitions

  for (tag in definitions) {
    value        = definitions[tag]
    nextValue    = Copy(value)
    this._setDefinitionAt(tag, nextValue, VISIBLE)
  }

  if ((ownDefinitions = _type[$OWN_DEFINITIONS])) {
    for (tag in ownDefinitions) {
      value     = ownMethods[propertyName]
      nextValue = Copy(value)
      (nextValue.isDefinition) ?
        this._addOwnDefinition(nextValue) :
        this.addOwnDefinition(tag, nextValue)
    }
  }
})


_Type.addAlias("_basicNew"        , "new"                 )
_Type.addAlias("declare"          , "addDeclaration"      )
_Type.addAlias("removeMethod"     , "removeSharedProperty")
_Type.addAlias("defines"          , "define"              )
_Type.addAlias("addDurables"      , "addDurableProperties")
_Type.addAlias("forAddAssigner"   , "addAssigner"         )
_Type.addAlias("forRemoveAssigner", "removeAssigner"      )









// Type.addMethod(INSTANCEOF, (instance) => instance[this.membershipSelector])

// Type.moveMethodTo("", target)
