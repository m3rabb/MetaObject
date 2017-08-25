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
    [$ASSIGNERS]   : EMPTY_OBJECT,
    [$KNOWNS]      : EMPTY_OBJECT,
    [$SUPERS]      : {
      __proto__       : null,
      [$IMMEDIATES]   : EMPTY_OBJECT,
    },
  },
  innerMaker       : NewInner,
}



const $SomethingBlanker   = NewBlanker($BaseBlanker)
const   $IntrinsicBlanker = NewBlanker($SomethingBlanker)
const     TypeBlanker     = NewBlanker($IntrinsicBlanker, NewDisguisedInner)




const Type$root$inner = TypeBlanker.$root$inner


function BootstrapType(name, blanker_) {
  const $type            = new TypeBlanker()
  const $outer           = $type[$OUTER]
  const isImplementation = (name[0] === "$")

  $type._properties       = SpawnFrom(null)
  $type._blanker          = blanker_ || NewBlanker($IntrinsicBlanker)
  $type.supertypes        = ($outer.supertypes = EMPTY_ARRAY)
  $type.ancestry          = isImplementation ? EMPTY_ARRAY : ThingAncestry
  $type._subordinateTypes = new Set()
  return $type[$PULP]
}

const ThingAncestry = []

const _$Something = BootstrapType("$Something", $SomethingBlanker )
const _$Intrinsic = BootstrapType("$Intrinsic", $IntrinsicBlanker )
const _Thing      = BootstrapType("Thing"     , null              )
const _Type       = BootstrapType("Type"      , TypeBlanker       )
const _Method     = BootstrapType("Method"    , null              )

const $Something = _$Something[$RIND]
const $Intrinsic = _$Intrinsic[$RIND]
const Thing      = _Thing     [$RIND]
const Type       = _Type      [$RIND]
const Method     = _Method    [$RIND]

ThingAncestry[0] = Thing

const $Something$root$inner = $SomethingBlanker.$root$inner
const $Something$root$outer = $SomethingBlanker.$root$outer
const $Intrinsic$root$inner = $IntrinsicBlanker.$root$inner
const $Intrinsic$root$outer = $IntrinsicBlanker.$root$outer
const $Intrinsic_properties = _$Intrinsic._properties
const Method$root$inner     = _Method._blanker.$root$inner


// Stubs for known properties
$Something$root$inner[$BARRIER]             = null
// This secret is only known by inner objects
$Something$root$inner[$SECRET]              = $INNER
$Something$root$outer[$SECRET]              = null




$Something$root$outer.type                   = null
$Intrinsic$root$inner._retarget              = null
$Intrinsic$root$inner._propagateIntoSubtypes = ALWAYS_SELF




_SetSharedProperty.call(_$Something, "isSomething", true  )
_SetSharedProperty.call(_$Something, IS_IMMUTABLE , false )
_SetSharedProperty.call(_$Something, "id"         , null  )


_SetSharedProperty.call(_$Intrinsic, DURABLES                 , null)
// Perhaps remove these later???
_SetSharedProperty.call(_$Intrinsic, "_postInit"              , null)
_SetSharedProperty.call(_$Intrinsic, "_initFrom_"             , null)
_SetSharedProperty.call(_$Intrinsic, "_setPropertiesImmutable", null)

SetAsymmetricProperty(_$Intrinsic, "isOuter", false, true )
SetAsymmetricProperty(_$Intrinsic, "isInner", true , false)




Method$root$inner[$OUTER].type  = Method

Method$root$inner._setImmutable = _BasicSetImmutable

Method$root$inner._init = function _init(func_selector, func_, mode__, property___) {
  const [selector, handler, mode = STANDARD_METHOD, property] =
    (typeof func_selector === "function") ?
      [func_selector.name, func_selector, func_ , mode__     ] :
      [func_selector     , func_        , mode__, property___]
  const isPublic = (selector[0] !== "_")
  const $inner   = InterMap.get(this[$RIND])
  const $outer   = $inner[$OUTER]

  if (!selector) { return this._invalidSelectorError(selector) }

  this.selector = selector
  this.mode     = mode
  this.isPublic = isPublic
  // this.super --> is a lazy property

  switch(mode) {
    case DECLARATION : return

    case ASSIGNER    :
      $outer.handler = $inner.handler = MarkFunc(handler, ASSIGNER_FUNC)
      return

    case MANDATORY   :
      // $inner._assignmentError = NewAssignmentErrorHandler(property, selector)
      $inner._mappedSymbol = AsPropertySymbol(property)
      // break omitted

    case SETTER      :
      this.property = property
      break
  }

  const outer = mode.outer(selector, handler, isPublic)
  const inner = mode.inner(selector, handler, isPublic)

  inner[$OUTER_WRAPPER] = outer    // For access via Permeable outer
  this.isImmediate      = !(handler.length || FuncParamsListing(handler))

  outer.method   = inner.method   = this[$RIND]

  // Need to subvert function assignment to enable raw functions to be stored.
  $outer.outer   = $inner.outer   = SetImmutableFunc(outer  , OUTER_FUNC)
  $outer.inner   = $inner.inner   = SetImmutableFunc(inner  , INNER_FUNC)
  $outer.handler = $inner.handler = MarkFunc        (handler, HANDLER_FUNC)
}



Type$root$inner.new                = _BasicNew
Type$root$inner._setSharedProperty = _SetSharedProperty



const _AddMethod = function _addMethod(func_selector, func_, mode__, property___) {
  const method = Method(func_selector, func_, mode__, property___)
  return this._setSharedProperty(method.selector, method)
}


_AddMethod.call(_Type, _AddMethod)



_$Something._addMethod(function isPermeable() {
  return (this[$INNER].this) ? true : false
}, BASIC_VALUE_METHOD)



_$Intrinsic._addMethod(function _basicSet(property, value) {
  const selector = PropertyToSymbol[property] || property
  this[selector] = value
  return this
}, BASIC_SELF_METHOD)


// Note: This method might need to be moved to _$Something!!!
//
// It's not enought to simple make this method access the receiver's barrier.
// Th receiver only references its original barrier, and there may be more than
// one proxy/barrier associated with the receiver, so we need to invoke the
// proxy to force the proper change to occur thru it.
_$Intrinsic._addMethod(function _retarget() {
  const $inner = this[$INNER]

  if ($inner[IS_IMMUTABLE]) {
    delete this[$DELETE_IMMUTABILITY]
    return this
  }

  DefineProperty($inner, "_retarget", InvisibleConfig)
  return ($inner._retarget = this)  // InSetProperty($inner, "_retarget", this, this)
}, BASIC_SELF_METHOD)


_Method._addMethod(Method$root$inner._init)
_Method._addMethod("_setImmutable", _BasicSetImmutable, BASIC_SELF_METHOD)


_Type._addMethod("new", _BasicNew, BASIC_VALUE_METHOD)
_Type._addMethod(_SetSharedProperty)



_Type._addMethod(function addMethod(method_namedFunc__selector, func__) {
  const method = (method_namedFunc__selector.isMethod) ?
    method_namedFunc__selector : Method(method_namedFunc__selector, func__)
  return this._setSharedProperty(method.selector, method)
})

_Type._addMethod(function addRetroactiveProperty(assigner_property, assigner_) {
  // Will set the $inner property even on an immutable object!!!
  const [property, assigner] = (typeof assigner_property === "function") ?
      [assigner_property.name, assigner_property] :
      [assigner_property     , assigner_        ]

  this._addMethod(property, AsRetroactiveProperty(property, assigner))
})


_Type._addMethod(function addSharedProperty(property, value) {
  this._setSharedProperty(property, value)
})

_Type._addMethod(function removeSharedProperty(property) {
  if (this._properties[property] !== undefined) {
    this._deleteSharedProperty(property)
  }
})


_Type._addMethod(function _deleteSharedProperty(property) {
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

_Type._addMethod(function _propagateIntoSubtypes(property) {
  this._subordinateTypes.forEach(subtype => {
    var _$subtype = InterMap.get(subtype)
    _$subtype._inheritProperty.call(_$subtype[$PULP], property)
  })
})

_Type._addMethod(function _inheritProperty(property) {
  const properties = this._properties
  if (properties[property] !== undefined) { return }

  const ancestry = this.ancestry

  var next, _$nextType, nextProperties, value
  next = ancestry.length - 1

  while (next--) {
    _$nextType = InterMap.get(ancestry[next])
    value      = _$nextType._properties[property]

    if (value !== undefined) {
      return this._setSharedProperty(property, value, false)
    }
  }
})



// It's too dangerous to wipeout a types properties and methods and then rebuild
// them, since instance may need to use them, so instead we rebuild them layer
// by layer from supertype to supertype, and then delete invalide properites last.
_Type._addMethod(function _reinheritProperties() {
  const validProperties = SpawnFrom(null)
  const ancestry        = this.ancestry
  const $root$inner     = this._blanker.$root$inner

  var nextProperties, next, property, _$nextType
  nextProperties = this._properties
  next           = ancestry.length - 1

  for (property in nextProperties) { validProperties[property] = true }

  while (next--) {
    _$nextType     = InterMap.get(ancestry[next])
    nextProperties = _$nextType._properties

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


_Type._addMethod(function _setAsSubtypeOfSupertypes() {
  // LOOK: add logic to invalidate connected types if supertypes changes!!!
  const supertypes = this.supertypes
  const subtype = this[$RIND]

  var next, _$supertype, subtypes
  next = supertypes.length

  while (next--) {
    _$supertype = InterMap.get(supertypes[next])
    subtypes    = new Set(_$supertype._subordinateTypes)
    subtypes.add(subtype)
    _$supertype[$PULP]._subordinateTypes = SetImmutable(subtypes)
  }
})



_Type._addMethod(function addDeclaration(propertyName) {
  this._addMethod(propertyName, null, DECLARATION)
})


// forAddAssigner(function property() {})
// forAddAssigner("property", function () {})

_Type._addMethod(function forAddAssigner(property_assigner, assigner_) {
  const [propertyName, assigner] = (assigner_) ?
    [property_assigner     , assigner_        ] :
    [property_assigner.name, property_assigner]

  if (!propertyName) { return UnnamedFuncError(this, assigner) }

  this._addMethod(propertyName, assigner, ASSIGNER)
})

_Type._addMethod(function _assignerSetterError() {
  this._signalError("Cannot define setter and assigner functions for the same property!!")
})

_Type._addMethod(function _addSetter(name_setter, property_setter_, mode) {
  var propertyName, assigner, setterName, setter

  ;[setterName, setter] = (typeof name_setter === "function") ?
    [name_setter.name, name_setter] : [name_setter, null]

  switch (typeof property_setter_) {
    case "string"   : propertyName = property_setter_ ; break

    case "function" :
      if ((propertyName = property_setter_.name)) {
        assigner = property_setter_
        if (setter) { return this._assignerSetterError }
        setter = (mode === MANDATORY) ?
          AsMandatoryAssignmentSetter(propertyName, setterName, assigner) :
          AsBasicSetter(propertyName, setterName, mode)
      }
      else { setter = property_setter_ }
      break
  }

  if (!setterName)   { return UnnamedFuncError(this, assigner) }
  if (!propertyName) {
    propertyName = AsPropertyFromSetter(setterName) ||
      this._signalError(`Improper setter '${setterName}'!!`)
  }
  if (!setter) { setter = AsBasicSetter(propertyName, setterName, mode) }

  this._addMethod(setterName, setter, mode, propertyName)

  if (mode === MANDATORY) {
    assigner = NewAssignmentErrorHandler(propertyName, setterName)
  }
  if (assigner) { this._addMethod(propertyName, assigner, ASSIGNER) }
})


// addSetter("setterName")
// addSetter(function setterName() {})
// addSetter("setterName", "property")
// addSetter("setterName", function () {})
// addSetter("setterName", function propertyAssigner() {})

_Type._addMethod(function addSetter(name_setter, property_setter_) {
  this._addSetter(name_setter, property_setter_, SETTER)
})


// forAddSetter("propertyName")
// forAddSetter("propertyName", "setterName")

_Type._addMethod(function forAddSetter(propertyName, setterName_) {
  const setterName = setterName_ || AsSetterFromProperty(propertyName) ||
    this._signalError(`Improper property name: ${propertyName}!!`)
  this._addSetter(setterName, propertyName, SETTER)
})


// addMandatorySetter("setterName")
// addMandatorySetter(function setterName() {}) // within must call _basicSet
// addMandatorySetter("setterName", "property")
// addMandatorySetter("setterName", function () {}) // within must call _basicSet
// addMandatorySetter("setterName", function propertyAssigner() {})
//
_Type._addMethod(function addMandatorySetter(name_setter, property_setter_) {
  this._addSetter(name_setter, property_setter_, MANDATORY)
})

// forAddMandatorySetter("property")
// forAddMandatorySetter("property", "setterName")
// forAddMandatorySetter("property", function setterName() {}) // within must call _basicSet

_Type._addMethod(function forAddMandatorySetter(propertyName, setter_) {
  const setter = setter_ || AsSetterFromProperty(propertyName) ||
    this._signalError(`Improper property name: ${propertyName}!!`)
  this._addSetter(setter, propertyName, MANDATORY)
})




_Type.addMandatorySetter(function setSupertypes(nextSupertypes) {
  if (nextSupertypes.length !== new Set(nextSupertypes).size) {
    return DuplicateSupertypeError(this)
  }
  const nextAncestry = BuildAncestryOf(this[$RIND], nextSupertypes)
  const isThing      = nextAncestry.includes(Thing)

  if (this._blanker) {
    if (this.isPermeable) {
      return AttemptedChangeOfAncestryOfPermeableTypeError(this)
    }
    if (isThing !== this.ancestry.includes(Thing)) {
      return ImproperChangeToAncestryError(this)
    }
  }
  else {
    const parentBlanker    = isThing ? $IntrinsicBlanker : $SomethingBlanker
    this._blanker          = new NewBlanker(parentBlanker)
    this._properties       = SpawnFrom(null)
    this._subordinateTypes = SetImmutable(new Set())
  }

  this.ancestry = nextAncestry
  this._basicSet("supertypes", SetImmutable(nextSupertypes))
  this._setAsSubtypeOfSupertypes
  this._reinheritProperties
})


_Type._addMethod(function _setDisplayNames(outerName, innerName_) {
  const innerName     = innerName_ || ("_" + outerName)
  const innerTypeName = NewVacuousConstructor(innerName)
  const outerTypeName = NewVacuousConstructor(outerName)

  SetAsymmetricProperty(this, "constructor", innerTypeName, outerTypeName)
})


// Make mandatory setter!!!
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
  this[$DISGUISE].name = properName
  return properName
})



//  spec
//    name
//    supertype|supertypes
//    shared|sharedProperties
//    methods|instanceMethods


_Type._addMethod(function _init(spec_name, context_) {
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
  durables    = spec_name.durable || spec_name.durables
  shared      = spec_name.shared  || spec_name.sharedProperties
  methods     = spec_name.methods || spec_name.instanceMethods
  definitions = spec_name.define  || spec_name.defines

  this.context   = context_ || spec_name.context || null
  this._iidCount = 0

  this.setSupertypes(supertypes)
  this.setName(name)
  this.addSharedProperty("type", this[$RIND])

  declared    && this.addDeclarations(declared)
  durables    && this.addDurableProperties(durables) // This needs to be for the root!!!
  shared      && this.addSharedProperties(shared)
  methods     && this.addMethods(methods)
  definitions && this.define(definitions)
})
// blanker.$root$outer.constructor = this[$DISGUISE]
// blanker.$root$inner.constructor = NewVacuousConstructor()
// this._properties.constructor    = CONSTRUCTOR


_Type._addMethod(Disguise_postInit)

_Type.addDeclaration("_blanker")
_Type.addDeclaration($OUTER_WRAPPER)



_Type      ._init(        "Type"                          )._postInit()
_$Something._init({ name: "$Something", supertypes: null })._postInit()
_$Intrinsic._init({ name: "$Intrinsic", supertypes: null })._postInit()
_Thing     ._init({ name: "Thing"     , supertypes: null })._postInit()
_Method    ._init(        "Method"                        )._postInit()

// _$Something
// _$Intrinsic._postInit()
// _Thing._postInit()
// _Type._postInit()
// _Method._postInit()


// Helps with debugging!!!
_$Something._setDisplayNames("$Intrinsic$Outer", "$Intrinsic$Inner")
_$Intrinsic._setDisplayNames("$Outer"          , "$Inner"          )


// Note: If this was called before the previous declarations,
// $IMMEDIATES, $ASSIGNERS, constructor, etc, would not be overridable
// in the descendent $roots.
Frost($BaseBlanker.$root$outer)
Frost($BaseBlanker.$root$inner)


_$Intrinsic._addMethod("_basicSetImmutable", _BasicSetImmutable, BASIC_SELF_METHOD)

const PermeableNewErrorMethod = Method(function new_(...args) {
  this._signalError("Method 'new_' cannot be called on immutable type objects!!")
})

const PermeableNewAsFactErrorMethod = Method(function newAsFact_(...args) {
  this._signalError("Method 'newAsFact_' cannot be called on immutable type objects!!")
})


_Type._addMethod(function _setImmutable(inPlace_, visited__) {
  const $inner       = this[$INNER]
  const blanker      = $inner._blanker
  const $root$outer  = blanker.$root$outer
  const $root$inner  = blanker.$root$inner
  const $root$supers = $root$inner[$SUPERS]

  this.addOwnMethod(PermeableNewErrorMethod)
  this.addOwnMethod(PermeableNewAsFactErrorMethod)

  // Frost($root$outer[$IMMEDIATES])
  // Frost($root$supers[$IMMEDIATES])
  // Frost($root$inner[$IMMEDIATES])
  // Frost($root$inner[$ASSIGNERS])
  // Frost($root$inner[$KNOWNS])
  // Frost($root$outer)
  // Frost($root$supers)
  // Frost($root$inner)

  $inner._basicSetImmutable()
  return this
}, BASIC_SELF_METHOD)


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
