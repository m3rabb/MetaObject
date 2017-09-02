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
    (this.methodAt(selector_definition) ||
      this._unknownMethodToAliasError(selector_definition))

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

// MAKE THIS use a Definition!!!
_Type.addMethod(function addDurable(selector) {
  const $root$inner = this._blanker.$root$inner
  const durables    = $root$inner[_DURABLES] || []
  if (!durables.includes(selector)) {
    $root$inner[_DURABLES] = SetImmutable([...durables, selector])
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

_Type.addMethod(function addDurables(items) {
  PropertyLoader.new(this.$).load(items, "DURABLES")
})



_Type.addMethod(function removeAssigner(selector) {
  const tag = `$assigner@${AsName(selector)}`
  if (this._definitions[tag] !== undefined) {
    this._deleteDefinitionAt(tag)
  }
})

_Type.addMethod(function removeDeclaration(selector) {
  const tag = `$declaration@${AsName(selector)}`
if (this._definitions[tag] !== undefined) {
    this._deleteDefinitionAt(tag)
  }
})

_Type.addMethod(function removeSharedProperty(selector) {
  if (this._definitions[selector] !== undefined) {
    this._deleteDefinitionAt(selector)
  }
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



_Type.addMethod(function addSupertype(type) {
  const newSupertypes = SetImmutable([...this.supertypes, types])
  this.setSupertypes(newSupertypes)
})

_Type.addMethod(function inheritsFrom(type) {
  var self, ancestry, next
  self     = this[$RIND]
  ancestry = this.ancestry
  next     = ancestry.length - 1
  while (next--) { if (ancestry[next] === self) { return true } }
  return false
})



_Type.addMethod(function hasDefinedMethod(selector) {
  const value = this._definitions[selector]
  return (value) ? value.isMethod : false
}, BASIC_VALUE_METHOD)


_Type.addMethod(function methodAt(selector) {
  const property = PropertyAt(this._blanker.$root$inner, selector)
  return property.isMethod ? property : null
})

_Type.addMethod(function definitionAt(selector) {
  return this._definitions[selector] || null
})


_Type.addMethod(function methodAncestry(selector) {
  return SetImmutable(
    this.ancestry.filter(type => type.hasDefinedMethod(selector)))
})

_Type.addMethod(function methodAncestryListing(selector) {
  const ancestry = this.methodAncestry(selector)
  return ancestry.map(type => type.name).join(" ")
})



_Type.addMethod(function allKnownSelectors() {
  return AllSelectorsSorted(this._blanker.$root$inner, OwnSelectors)
})

_Type.addMethod(function allPublicSelectors() {
  // All visible public selectors
  return OwnSelectorsSorted(this._blanker.$root$outer)
})

_Type.addMethod(function allDefinedSelectors() {
  return OwnSelectorsSorted(this._blanker.$root$inner)
})

_Type.addMethod(function definedSelectors() {
  return OwnSelectorsSorted(this._definitions)
})

_Type.addMethod(function publicSelectors() {
  return this.definedSelectors.filter(s => AsName(s)[0] !== "_")
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




_Type.addMethod(function _initFrom_(_type) {
  var tag, definitions

  this._init({
    name       : _type.name,
    supertypes : _type.supertypes,
  })

  definitions = _type._definitions
  for (tag in definitions) {
    if (tag !== "type") { this._setDefinitionAt(tag, Copy(definitions[tag])) }
  }

  if ((definitions = _type[$OWN_DEFINITIONS])) {
    for (tag in definitions) {
      this.addOwnDefinition(tag, Copy(definitions[tag]))
    }
  }
})


_Type.addAlias("_basicNew"        , "new"                  )
_Type.addAlias("declare"          , "addDeclaration"       )
_Type.addAlias("removeMethod"     , "removeSharedProperty" )
_Type.addAlias("defines"          , "define"               )
_Type.addAlias("forAddAssigner"   , "addAssigner"          )
_Type.addAlias("forRemoveAssigner", "removeAssigner"       )








// Type.addMethod(INSTANCEOF, (instance) => instance[this.membershipSelector])

// Type.moveMethodTo("", target)

////=====


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



// _Type.addMethod(function _getDefinedMethods(onlyPublic) {
//   const definitions = this._definitions
//   const methods     = []
//   var   tag, value
//
//   for (tag in definitions) {
//     value = definitions[tag]
//     if (value && value.isMethod) {
//       if (!onlyPublic || value.isPublic) { methods.push(value) }
//     }
//   }
//   methods.sort((methodA, methodB) => methodA.tag.localeCompare(methodB.tag))
//   return methods
// })
//
//
// _Type.addMethod(function _getImmediateMethods(onlyPublic) {
//   var methods, selector
//   const immediates = onlyPublic ?
//     this._blanker.$root$outer[$IMMEDIATES] :
//     this._blanker.$root$inner[$IMMEDIATES]
//
//   methods = []
//   for (selector in immediates) { methods.push(immediates[selector].method) }
//   methods.sort((methodA, methodB) => methodA.tag.localeCompare(methodB.tag))
//   return methods
// })
//
// _Type.addMethod(function _getMethods(onlyPublic) {
//   var methods, selector, selectors, next, value, method
//   const selectorPicker   = onlyPublic ? KnownSelectors : OwnVisibleNames
//   const root             = onlyPublic ?
//     this._blanker.$root$outer : this._blanker.$root$inner
//   const immediateMethods = this._getImmediateMethods(onlyPublic)
//   const somethingMethods = _$Something._getDefinedMethods(onlyPublic)
//   const intrinsicMethods = IsSubtypeOfThing(this) ?
//     _$Intrinsic._getDefinedMethods(onlyPublic) : EMPTY_ARRAY
//
//   methods   = [].concat(immediateMethods, somethingMethods, intrinsicMethods)
//   selectors = selectorPicker(root)
//   next      = selectors.length
//   while (next--) {
//     selector = selectors[next]
//     value    = root[selector]
//     if (typeof value === "function" && InterMap.get(value) === marker) {
//       if ((method = value.method)) { methods.push(method) }
//     }
//   }
//   methods.sort((methodA, methodB) => methodA.tag.localeCompare(methodB.tag))
//   return methods
// })
//
//
//
//
// _Type.addMethod(function _immediateMethods() {
//   return SetImmutable(this._getImmediateMethods(false))
// })
//
// _Type.addMethod(function _methods() {
//   return SetImmutable(this._getMethods(false))
// })
//
// _Type.addMethod(function _definedMethods() {
//   return SetImmutable(this._getDefinedMethods(false))
// })
//
//
// _Type.addMethod(function immediateMethods() {
//   return SetImmutable(this._getImmediateMethods(true))
// })
//
// _Type.addMethod(function methods() {
//   return SetImmutable(this._getMethods(true))
// })
//
// _Type.addMethod(function definedMethods() {
//   return SetImmutable(this._getDefinedMethods(true))
// })
//
//
// _Type.addMethod(function methodsListing() {
//   return this.methods.map(method => method.tag).join(" ")
// })
//
// _Type.addMethod(function definedMethodsListing() {
//   return this.definedMethods.map(method => method.tag).join(" ")
// })
