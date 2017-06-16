// "use strict"

// $Inner  _self
//   $inner
//   $pulp
// $Outer   self
//   $outer
//   $rind




// Should this be made immutable???
const $BaseBlanker = {
  $root$outer : {
    __proto__      : null,
    constructor    : NewVacuousConstructor("$Something$outer"),
    [$IMMEDIATES]  : EMPTY_OBJECT,
  },
  $root$inner : {
    __proto__      : null,
    constructor    : NewVacuousConstructor("$Something$inner"),
    [$IMMEDIATES]  : EMPTY_OBJECT,
    [$SET_LOADERS] : EMPTY_OBJECT,
    [$SUPERS]      : {
      __proto__       : null,
      [$IMMEDIATES]   : EMPTY_OBJECT,
    },
  },
  maker       : _NewInnerBlanker,
}



const $PrimordialBlanker  = NewBlanker($BaseBlanker)
const   $IntrinsicBlanker = NewBlanker($PrimordialBlanker)
const     TypeBlanker     = NewBlanker($IntrinsicBlanker, _NewTypeInnerBlanker)




const Type$root$inner = TypeBlanker.$root$inner


function BootstrapType(name, blanker_) {
  const $type            = new TypeBlanker(Impermeable, [name])
  const $outer           = $type[$OUTER]
  const isImplementation = (name[0] === "$")

  $type._properties = SpawnFrom(null)
  $type._blanker    = blanker_ || NewBlanker($IntrinsicBlanker)
  $type.supertypes  = ($outer.supertypes = EMPTY_ARRAY)
  $type.ancestry    = isImplementation ? EMPTY_ARRAY : ThingAncestry
  $type.subtypes    = new Set()
  return $type[$PULP]
}

const ThingAncestry = []

const _$Primordial = BootstrapType("$Primordial", $PrimordialBlanker)
const _$Intrinsic  = BootstrapType("$Intrinsic" , $IntrinsicBlanker )
const _Thing       = BootstrapType("Thing"      , null              )
const _Type        = BootstrapType("Type"       , TypeBlanker       )
const _Method      = BootstrapType("Method"     , null              )

const $Primordial = _$Primordial[$RIND]
const $Intrinsic  = _$Intrinsic[$RIND]
const Thing       = _Thing [$RIND]
const Type        = _Type  [$RIND]
const Method      = _Method[$RIND]

ThingAncestry[0] = Thing

const $Primordial$root$inner = $PrimordialBlanker.$root$inner
const $Primordial$root$outer = $PrimordialBlanker.$root$outer
const $Intrinsic$root$inner  = $IntrinsicBlanker.$root$inner
const $Intrinsic$root$outer  = $IntrinsicBlanker.$root$outer
const $Intrinsic_properties  = _$Intrinsic._properties
const Method$root$inner      = _Method._blanker.$root$inner


// Stubs for known properties
$Primordial$root$inner[$BARRIER]             = null
$Primordial$root$inner[$PERMEABILITY]        = Impermeable
// This secret is only known by inner objects
$Primordial$root$inner[$SECRET]              = $INNER
$Primordial$root$outer[$SECRET]              = null




$Primordial$root$outer.type                  = null
$Intrinsic$root$inner._propagateIntoSubtypes = ALWAYS_SELF



_SetSharedProperty.call(_$Primordial, IS_IMMUTABLE    , false, true)
_SetSharedProperty.call(_$Primordial, "id"            , null , true)


_SetSharedProperty.call(_$Intrinsic, DURABLES                 , null, true)
// Perhaps remove these later???
_SetSharedProperty.call(_$Intrinsic, "_postInit"              , null, true)
_SetSharedProperty.call(_$Intrinsic, "_initFrom_"             , null, true)
_SetSharedProperty.call(_$Intrinsic, "_setPropertiesImmutable", null, true)

SetAsymmetricProperty(_$Intrinsic, "isOuter", false, true )
SetAsymmetricProperty(_$Intrinsic, "isInner", true , false)




Method$root$inner[$OUTER].type  = Method

Method$root$inner._setImmutable = _BasicSetImmutable

Method$root$inner._init = function _init(func_selector, func_, mode__) {
  const [selector, handler, mode = STANDARD_METHOD] =
    (typeof func_selector === "function") ?
      [func_selector.name, func_selector, func_ ] :
      [func_selector     , func_        , mode__]
  const isPublic = (selector[0] !== "_")
  const $inner   = InterMap.get(this[$RIND])
  const $outer   = $inner[$OUTER]

  if (!selector) { return this._invalidSelectorError(selector) }

  this.selector    = selector
  this.mode        = mode
  this.isPublic    = isPublic
  // this.super --> is a lazy property

  if (mode === SET_LOADER) {
    $outer.handler = $inner.handler = (typeof handler === "function") ?
      MarkFunc(handler, SET_LOADER_FUNC) : handler
  }
  else {
    const outer = mode.outer(selector, handler, isPublic)
    const inner = mode.inner(selector, handler, isPublic)

    inner[$OUTER_WRAPPER] = outer    // For access via Permeable outer
    this.isImmediate      = !(handler.length || FuncParamsListing(handler))

    outer.method   = inner.method   = this[$RIND]

    // Need to subvert function assignment to enable raw functions to be stored.
    $outer.outer   = $inner.outer   = SetImmutableFunc(outer, WRAPPER_FUNC)
    $outer.inner   = $inner.inner   = SetImmutableFunc(inner, WRAPPER_FUNC)
    $outer.handler = $inner.handler = MarkFunc        (handler, KNOWN_FUNC)
  }
}



Type$root$inner.new = {
  new : function (...args) {
    const $instance = new this._blanker(Impermeable, args)
    const _instance = $instance[$PULP]
    const _postInit = $instance._postInit

    $instance._init.apply(_instance, args)
    if (_postInit) {
      const result = _postInit.call(_instance)
      if (result !== undefined && result !== _instance) { return result }
    }
    return $instance[$RIND]
  }
}.new


Type$root$inner._setSharedProperty = _SetSharedProperty



const AddMethod = function addMethod(method_namedFunc__selector, func__, mode___) {
  const method = AsMethod(method_namedFunc__selector, func__, mode___)
  return this._setSharedProperty(method.selector, method, true)
}


AddMethod.call(_Type, AddMethod)



_Method.addMethod(Method$root$inner._init)
_Method.addMethod("_setImmutable", _BasicSetImmutable, BASIC_SELF_METHOD)


_$Intrinsic.addMethod(function _basicSet(property, value) {
  const selector = PropertyToSymbol[property] || property
  this[selector] = value
}, BASIC_SELF_METHOD)



_Type.addMethod("new", Type$root$inner.new, BASIC_VALUE_METHOD)
_Type.addMethod(Type$root$inner._setSharedProperty)



_Type.addMethod(function addRetroactiveProperty(loader_property, loader_, mode__) {
  // Will set the $inner property even on an immutable object!!!
  const [property, loader, mode = STANDARD_METHOD] =
    (typeof loader_property === "function") ?
      [loader_property.name, loader_property, loader_] :
      [loader_property     , loader_        , mode__ ]

  this.addMethod(property, AsRetroactiveProperty(property, loader), mode)
})


_Type.addMethod(function addSharedProperty(property, value) {
  this._setSharedProperty(property, value, true)
})

_Type.addMethod(function removeSharedProperty(property) {
  if (this._properties[property] !== undefined) {
    this._deleteSharedProperty(property)
  }
})


_Type.addMethod(function _deleteSharedProperty(property) {
  const blanker     = this._blanker
  const $root$inner = blanker.$root$inner
  const $root$outer = blanker.$root$outer
  const supers      = $root$inner[$SUPERS]

  delete this._properties[property]
  delete $root$inner[property]
  delete $root$outer[property]
  delete $root$inner[$IMMEDIATES][property]
  delete $root$outer[$IMMEDIATES][property]
  delete supers[property]
  delete supers[$IMMEDIATES][property]

  this._inheritProperty(property)
})

_Type.addMethod(function _propagateIntoSubtypes(property) {
  this.subtypes.forEach(subtype => {
    var $subtype = InterMap.get(subtype)
    $subtype._inheritProperty.call($subtype[$PULP], property)
  })
})

_Type.addMethod(function _inheritProperty(property) {
  const properties = this._properties
  if (properties[property] !== undefined) { return }

  const ancestry = this.ancestry

  var next, $nextType, nextProperties, value
  next = ancestry.length - 1

  while (next--) {
    $nextType = InterMap.get(ancestry[next])
    value     = $nextType._properties[property]

    if (value !== undefined) {
      return this._setSharedProperty(property, value, false)
    }
  }
})



// It's too dangerous to wipeout a types properties and methods and then rebuild
// them, since instance may need to use them, so instead we rebuild them layer
// by layer from supertype to supertype, and then delete invalide properites last.
_Type.addMethod(function _reinheritProperties() {
  const validProperties = SpawnFrom(null)
  const ancestry        = this.ancestry
  const $root$inner     = this._blanker.$root$inner

  var nextProperties, next, property, $nextType
  nextProperties = this._properties
  next           = ancestry.length - 1

  for (property in nextProperties) { validProperties[property] = true }

  while (next--) {
    $nextType  = InterMap.get(ancestry[next])
    nextProperties = $nextType._properties

    for (property in nextProperties) {
      if (!validProperties[property]) {
        validProperties[property] = true
        this._setSharedProperty(property, nextProperties[property], false)
      }
    }
  }

  nextProperties = VisibleProperties($root$inner)
  next           = nextProperties.length

  while (next--) {
    property = nextProperties[next]
    if (!validProperties[property]) { this._deleteSharedProperty(property) }
  }
})


_Type.addMethod(function _setAsSubtypeOfSupertypes() {
  // LOOK: add logic to invalidate connected types if supertypes changes!!!
  const supertypes = this.supertypes
  const subtype = this[$RIND]

  var next, $supertype, subtypes
  next = supertypes.length

  while (next--) {
    $supertype = InterMap.get(supertypes[next])
    subtypes = new Set($supertype.subtypes)
    subtypes.add(subtype)
    $supertype[$PULP].subtypes = SetImmutable(subtypes)
  }
})



_Type.addMethod(function addDeclaration(property) {
  if (this._properties[property] === undefined) {
    this._setSharedProperty(property, null, true)
  }
})


// forAddAssigner(function property() {})
// forAddAssigner("property", function () {})

_Type.addMethod(function forAddAssigner(property_assigner, assigner_) {
  const [propertyName, assigner] = (assigner_) ?
    [property_assigner     , assigner_        ] :
    [property_assigner.name, property_assigner]

  if (!propertyName) { return this._unnamedFuncError(assigner) }

  this.addDeclaration(propertyName)
  this.addMethod(propertyName, assigner, SET_LOADER)
})

_Type.addMethod(function _assignerSetterError() {
  this._signalError("Cannot define setter and assigner functions for the same property!!")
})

_Type.addMethod(function _addSetter(name_setter, property_setter_, mandatory) {
  var propertyName, loader, errorOnSet, mappedSymbol
  var [setterName, setter] = (typeof name_setter === "string") ?
        [name_setter, null] : [name_setter.name, name_setter]

  switch (typeof property_setter_) {
    case "string"   : propertyName = property_setter_ ; break
    case "function" :
      if ((propertyName = property_setter_.name)) {
        if (setter) { return this._assignerSetterError }
        loader = property_setter_
        setter = AsBasicSetter(propertyName, setterName)
      }
      else { setter = property_setter_ }
      break
  }

  if (!setterName)   { return this._unnamedFuncError(assigner)          }
  if (!propertyName) { propertyName = AsPropertyFromSetter(setterName)  }
  if (!setter)       { setter = AsBasicSetter(propertyName, setterName) }

  this.addDeclaration(propertyName)
  this.addMethod(setterName, setter)

  if (mandatory) {
    errorOnSet   = NewAssignmentErrorHandler(propertyName, setterName)
    mappedSymbol = PropertyToSymbol[propertyName] ||
      (PropertyToSymbol[propertyName] = Symbol(`$${propertyName}$`))

    this.addMethod(propertyName, errorOnSet  , SET_LOADER)
    this.addMethod(mappedSymbol, propertyName, SET_LOADER)
  }
  else if (loader) {
    this.addMethod(propertyName, loader      , SET_LOADER)
  }
})


// addSetter("setterName")
// addSetter(function setterName() {})
// addSetter("setterName", "property")
// addSetter("setterName", function () {})
// addSetter("setterName", function propertyLoader() {})

_Type.addMethod(function addSetter(name_setter, property_setter_) {
  this._addSetter(name_setter, property_setter_, false)
})



// forAddSetter("propertyName")
// forAddSetter("propertyName", "setterName")

_Type.addMethod(function forAddSetter(propertyName, setterName_) {
  const setterName = setterName_ || AsSetterFromProperty(propertyName)
  this._addSetter(setterName, propertyName, false)
})



// addMandatorySetter("setterName")
// addMandatorySetter(function setterName() {})
// addMandatorySetter("setterName", "property")
// addMandatorySetter("setterName", function () {})

_Type.addMethod(function addMandatorySetter(name_setter, property_setter_) {
  this._addSetter(name_setter, property_setter_, true)
})

// forAddMandatorySetter("property")
// forAddMandatorySetter("property", "setterName")
// forAddMandatorySetter("property", function setterName() {})

_Type.addMethod(function forAddMandatorySetter(propertyName, setter_) {
  const setter = setter_ || AsSetterFromProperty(propertyName)
  this._addSetter(setter, propertyName, true)
})




_Type.addMethod(function inheritsFrom(type) {
  return (type !== this[$RIND] && this.ancestry.includes(type))
})



_Type.addMandatorySetter(function setSupertypes(nextSupertypes) {
  if (nextSupertypes.length !== new Set(nextSupertypes).size) {
    return DuplicateSupertypeError(this)
  }
  const nextAncestry = BuildAncestryOf(this[$RIND], nextSupertypes)
  const isThing      = nextAncestry.includes(Thing)
  const blanker      = this._blanker

  if (blanker) {
    if (blanker.permeability === Permeable) {
      return AttemptedChangeOfAncestryOfPermeableTypeError(this)
    }
    if (isThing !== this.ancestry.includes(Thing)) {
      return ImproperChangeToAncestryError(this)
    }
  }
  else {
    const parentBlanker = isThing ? $IntrinsicBlanker : $PrimordialBlanker
    this._blanker    = new NewBlanker(parentBlanker)
    this._properties = SpawnFrom(null)
    this.subtypes    = SetImmutable(new Set())
  }

  this.ancestry = nextAncestry
  this._basicSet("supertypes", SetImmutable(nextSupertypes))
  this._setAsSubtypeOfSupertypes
  this._reinheritProperties
})


_Type.addMethod(function _setDisplayNames(outerName, innerName_) {
  const innerName     = innerName_ || ("_" + outerName)
  const innerTypeName = NewVacuousConstructor(innerName)
  const outerTypeName = NewVacuousConstructor(outerName)

  SetAsymmetricProperty(this, "constructor", innerTypeName, outerTypeName)
})



_Type.addSetter("setName", function name(newName) {
  const properName = AsCapitalized(newName)
  const priorName = this.name
  if (properName === priorName) { return priorName }

  if (properName[0] !== "$") {
    if (priorName != null) {
      this.removeSharedProperty(AsMembershipSelector(priorName))
    }
    const newMembershipSelector = AsMembershipSelector(properName)

    _$Intrinsic.addSharedProperty(newMembershipSelector, false)
    this.addSharedProperty(newMembershipSelector, true)
    this.membershipSelector = newMembershipSelector
  }

  this._setDisplayNames(properName)
  this._func.name = properName
  return properName
})



//  spec
//    name
//    supertype|supertypes
//    shared|sharedProperties
//    methods|instanceMethods


_Type.addMethod(function _init(spec_name, context_) {
  var name, supertypes, supertype, shared, methods, definitions

  name       = spec_name.name || spec_name
  supertypes = spec_name.supertypes

  if (supertypes === undefined) {
    supertype  = spec_name.supertype
    supertypes = (supertype === undefined) ? [Thing] :
      (supertype === null) ? [] : [supertype]
  }
  else if (supertypes === null || supertypes.isNothing) { supertypes = [] }

  declared    = spec_name.declare || spec_name.declared
  shared      = spec_name.shared  || spec_name.sharedProperties
  methods     = spec_name.methods || spec_name.instanceMethods
  definitions = spec_name.define

  this.context   = context_ || spec_name.context || null
  this._iidCount = 0

  this.setSupertypes(supertypes)
  this.setName(name)
  this.addSharedProperty("type", this[$RIND])

  declared    && this.addDeclarations(declared)
  shared      && this.addSharedProperties(shared)
  methods     && this.addMethods(methods)
  definitions && this.define(definitions)
})
// blanker.$root$outer.constructor = this._func
// blanker.$root$inner.constructor = NewVacuousConstructor()
// this._properties.constructor    = CONSTRUCTOR


_Type.addDeclaration("_blanker")
_Type.addDeclaration($OUTER_WRAPPER)


_Type       ._init(       "Type"                          )
_$Primordial._init({name: "$Primordial", supertypes: null})
_$Intrinsic ._init({name: "$Intrinsic" , supertypes: null})
_Thing      ._init({name: "Thing"      , supertypes: null})
_Method     ._init(       "Method"                        )


// Helps with debugging!!!
_$Primordial._setDisplayNames("$Intrinsic$Outer", "$Intrinsic$Inner")
_$Intrinsic    ._setDisplayNames( "$Outer",  "$Inner")


// Note: If this was called before the previous declarations,
// $IMMEDIATES, $SET_LOADERS, constructor, etc, would not be overridable
// in the descendent $roots.
Frost($BaseBlanker.$root$outer)
Frost($BaseBlanker.$root$inner)


_$Intrinsic.addMethod("_basicSetImmutable", _BasicSetImmutable, BASIC_SELF_METHOD)

_Type.addMethod(function _setImmutable(inPlace_, visited__) {
  const $inner       = this[$INNER]
  const blanker      = $inner._blanker
  const $root$outer  = blanker.$root$outer
  const $root$inner  = blanker.$root$inner
  const $root$supers = $root$inner[$SUPERS]

  delete $inner._touch

  Frost($root$outer[$IMMEDIATES])
  Frost($root$supers[$IMMEDIATES])
  Frost($root$inner[$IMMEDIATES])
  Frost($root$inner[$SET_LOADERS])
  Frost($root$outer)
  Frost($root$supers)
  Frost($root$inner)

  return $inner._basicSetImmutable()
}, BASIC_SELF_METHOD)


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
