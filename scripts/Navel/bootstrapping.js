// "use strict"

// $Inner  _self
//   $inner
//   $pulp
// $Outer   self
//   $outer
//   $rind




const Base$root         = EMPTY_OBJECT
// const   Stash$root      = SpawnFrom(Base$root)
const   Base$root$outer = new Proxy(Base$root, BaseOuterBehavior)
const   Base$root$inner = new Proxy(Base$root, BaseInnerBehavior)

const $BaseBlanker = {
  $root$outer : Base$root$outer,
  $root$inner : Base$root$inner,
  maker       : MakeInnerBlanker,
}

const $PrimordialBlanker = NewBlanker($BaseBlanker, null, null)
const   $InateBlanker    = NewBlanker($PrimordialBlanker)
const     TypeBlanker    = NewBlanker($InateBlanker, null, MakeTypeInnerBlanker)



const Type$root$inner = TypeBlanker.$root$inner

// Temporary bootstrapping #_init
Type$root$inner._init = function _bootstrap(iid, blanker_) {
  DefineProperty(this, "iid", InvisibleConfiguration)
  this.iid        = iid
  this._blanker   = blanker_ || NewBlanker($InateBlanker)
  this.supertypes = this[$OUTER].supertypes = EMPTY_ARRAY
  this.ancestry   = (iid) ? ThingAncestry : EMPTY_ARRAY
  return this[$PULP]
}

const ThingAncestry = []

const _$Primordial =
                new TypeBlanker(["$Primordial"])._init(NaN, $PrimordialBlanker)
const _$Inate = new TypeBlanker(["$Inate"])     ._init(0  , $InateBlanker     )
const _Thing  = new TypeBlanker(["Thing"] )     ._init(1  , null              )
const _Type   = new TypeBlanker(["Type"]  )     ._init(2  , TypeBlanker       )
const _Method = new TypeBlanker(["Method"])     ._init(3  , null              )

const $Primordial = _$Primordial[$RIND]
const $Inate      = _$Inate[$RIND]
const Thing       = _Thing [$RIND]
const Type        = _Type  [$RIND]
const Method      = _Method[$RIND]

ThingAncestry[0] = Thing
Frost(ThingAncestry)

const $Primordial$root$inner = $PrimordialBlanker.$root$inner
const $Primordial$root$outer = $PrimordialBlanker.$root$outer
const $Inate$root$inner      = $InateBlanker.$root$inner
const $Inate$root$outer      = $InateBlanker.$root$outer
const $Inate_properties      = _$Inate._properties
const Method$root$inner      = _Method._blanker.$root$inner


// Stubs for default properties
$Primordial$root$inner[$MAIN_BARRIER]     = null
$Primordial$root$inner[$RIND]             = null
// This secret is only known by inner objects
$Primordial$root$inner[$SECRET]           = $INNER
$Primordial$root$outer[$SECRET]           = null


$Inate$root$inner.isOuter                 = false
$Inate$root$outer.isOuter                 = true
$Inate_properties.isOuter                 = PROPERTY

$Inate$root$inner.isInner                 = true
$Inate$root$outer.isInner                 = false
$Inate_properties.isInner                 = PROPERTY



$Primordial$root$outer.type                   = null
$Primordial$root$inner._propagateIntoSubtypes = ALWAYS_SELF



_SetSharedProperty.call(_$Primordial, IS_IMMUTABLE, false, true)
_SetSharedProperty.call(_$Primordial, "id"        , null , true)

// Perhaps remove these later
_SetSharedProperty.call(_$Inate, "_postInit"              , null, true)
_SetSharedProperty.call(_$Inate, "_initFrom_"             , null, true)
_SetSharedProperty.call(_$Inate, "_setPropertiesImmutable", null, true)


_SetSharedProperty.call(_Method, "type", Method, true)


Method$root$inner._init = function _init(func_selector, func_, mode__) {
  const [selector, handler, mode = STANDARD_METHOD] =
    (typeof func_selector === "function") ?
      [func_selector.name, func_selector, func_ ] :
      [func_selector     , func_        , mode__]
  const isPublic = (selector[0] !== "_")

  if (!selector) { return this._invalidSelectorError(selector) }

  this.isPublic = isPublic
  this.selector = selector
  this.mode     = mode
  this.handler  = MarkFunc(handler, KNOWN_HANDLER_FUNC)
  // this.super --> is a lazy property

  if (mode !== SET_LOADER) {
    const outer  = mode.outer(selector, handler, isPublic)
    const inner  = mode.inner(selector, handler, isPublic)
    inner.outer  = outer    // For access via Permeable outer
    outer.method = inner.method = this[$RIND]
    this.outer   = SetImmutableFunc(outer, WRAPPER_FUNC)
    this.inner   = SetImmutableFunc(inner, WRAPPER_FUNC)
  }
}



Type$root$inner.new = {
  new : function (...args) {
    const $instance = new this._blanker(args)
    const _instance  = $instance[$PULP]
    _instance._init(...args)
    if ($instance._postInit) {
      const result = _instance._postInit()[$RIND]
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


Method$root$inner._setImmutable = _BasicSetImmutable

AddMethod.call(_Type, AddMethod)


_Type.addMethod("new", Type$root$inner.new, BASIC_VALUE_METHOD)
_Type.addMethod(Type$root$inner._setSharedProperty)

_Method.addMethod(Method$root$inner._init)
_Method.addMethod("_setImmutable", _BasicSetImmutable, BASIC_SELF_METHOD)



_$Inate.addMethod(function _basicSet(propertyName, value) {
  return InSetProperty(this[$INNER], propertyName, value, this)
}, BASIC_SELF_METHOD)



_Type.addMethod(function addImmediate(...namedFunc_selector__handler) {
  this.addMethod(...namedFunc_selector__handler, STANDARD_IMMEDIATE)
})

_Type.addMethod(function addLazyProperty(...namedFunc_selector__handler) {
  this.addMethod(...namedFunc_selector__handler, LAZY_INSTALLER)
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
  const supers      = $root$inner[$SUPERS]

  delete this._properties[property]
  delete blanker.$root$inner[property]
  delete blanker.$root$outer[property]
  delete $root$inner[$IMMEDIATES][property]
  delete supers[property]
  delete supers[$IMMEDIATES][property]

  this._inheritProperty(property)
})

_Type.addMethod(function _propagateIntoSubtypes(property) {
  this.subtypes.forEach(subtype => {
    InterMap.get(subtype)[$PULP]._inheritProperty(property)
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


// addAssigner("setName")
// addAssigner(function setName() {})
// addAssigner("property", "setName")
// addAssigner("property", function () {})
// addAssigner("property", function setName() {})

_Type.addMethod(function addAssigner(loader_property, loader_) {
  var propertyName, setterName, setter, loader

  if (loader_) {
    propertyName = loader_property

    if (typeof loader_ === "string") {
      setterName = loader_
      setter     = AsBasicSetter(propertyName, setterName)
    }
    else {
      loader     = loader_
      setterName = loader.name
      setter     = AsLoaderSetter(propertyName, loader)
    }
  }
  else {
    if (typeof loader_property === "string") {
      setterName   = loader_property
      propertyName = AsPropertyNameFromSetterName(setterName)
      setter       = AsBasicSetter(propertyName, setterName)
    }
    else {
      loader       = loader_property
      setterName   = loader.name
      if (!setterName) { return this._unnamedFuncError("Assigner") }
      propertyName = AsPropertyNameFromSetterName(setterName)
      setter       = AsLoaderSetter(propertyName, loader)
    }
  }

  this.addDeclaration(propertyName)
  if (loader)     { this.addMethod(propertyName, loader, SET_LOADER) }
  if (setterName) { this.addMethod(setterName, setter) }
})


// addMandatorySetter("setName")
// addMandatorySetter(function setName() {})
// addMandatorySetter("property", "setName")
// addMandatorySetter("property", function setName() {})

_Type.addMethod(function addMandatorySetter(setter_property, setter_) {
  var propertyName, setterName, setter, loader

  if (setter_) {
    propertyName = setter_property

    if (typeof setter_ === "string") {
      setterName = setter_
      setter     = AsBasicSetter(propertyName, setterName)
    }
    else {
      setter     = setter_
      setterName = setter.name
    }
  }
  else {
    if (typeof setter_property === "string") {
      setterName   = setter_property
      propertyName = AsPropertyNameFromSetterName(setterName)
      setter       = AsBasicSetter(propertyName, setterName)
    }
    else {
      setter       = setter_property
      setterName   = setter.name
      propertyName = AsPropertyNameFromSetterName(setterName)
    }
  }

  loader = MakeAssignmentError(propertyName, setterName)

  this.addDeclaration(propertyName)
  this.addMethod(propertyName, loader, SET_LOADER)
  if (!setterName) { return this._unnamedFuncError("Setter") }
  this.addMethod(setterName, setter)

})


_Type.addMethod(function _checkAncestryChange(willInheritFromThing) {
  const currentlyInheritsFromThing = this.ancestry.includes(Thing)

  if (willInheritFromThing !== currentlyInheritsFromThing) {
    return ImproperChangeToAncestryError(this[$RIND])
  }
  if (this._blanker.permeability === Permeable) {
    return AttemptedChangeOfAncestryOfPermeableTypeError(this[$RIND])
  }
})

_Type.addMandatorySetter(function setSupertypes(supertypes) {
  const ancestry          = BuildAncestryOf(this[$RIND], supertypes)
  const inheritsFromThing = ancestry.includes(Thing)

  if (this._blanker) {
    this._checkAncestryChange(inheritsFromThing)
  }
  else {
    const superBlanker = inheritsFromThing ? $InateBlanker : $PrimordialBlanker
    this._blanker = new NewBlanker(superBlanker)
  }

  this.ancestry = ancestry
  this._basicSet("supertypes", SetImmutable(supertypes))
  this._setAsSubtypeOfSupertypes()
  this._reinheritProperties()
})


_Type.addMethod(function _setDisplayNames(outerName, innerName_) {
  const innerName = innerName_ || ("_" + outerName)
  const blanker   = this._blanker

  blanker.$root$outer.constructor = MakeVacuousConstructor(outerName)
  blanker.$root$inner.constructor = MakeVacuousConstructor(innerName)
  this._properties.constructor    = PROPERTY
})



_Type.addAssigner("name", function setName(name) {
  const properName = AsCapitalized(name)
  const priorName = this.name
  if (properName === priorName) { return priorName }

  if (properName[0] !== "$") {
    if (priorName != null) {
      this.removeSharedProperty(AsMembershipSelector(priorName))
    }
    const newMembershipSelector = AsMembershipSelector(properName)

    _$Inate.addSharedProperty(newMembershipSelector, false)
    this.addSharedProperty(newMembershipSelector, true)
    this.membershipSelector = newMembershipSelector
  }

  this._setDisplayNames(properName)
  this._disguisedFunc.name = properName
  return properName
})



_Type.addMethod(function _initCoreIdentity(name) {
  this._iidCount = 0
  this.name      = name
  this.addSharedProperty("type", this[$RIND])
})

//  spec
//    name
//    supertype|supertypes
//    shared|sharedProperties
//    methods|instanceMethods


_Type.addMethod(function inheritsFrom(type) {
  return (type !== this[$RIND] && this.ancestry.includes(type))
}, BASIC_VALUE_METHOD)


_Type.addMethod(function _init(spec_name, context_) {
  var name, supertypes, supertype, shared, methods, superBlanker

  name       = spec_name.name || spec_name
  supertypes = spec_name.supertypes

  if (supertypes === undefined) {
    supertype  = spec_name.supertype
    supertypes = (supertype === undefined) ? [Thing] :
      (supertype === null) ? [] : [supertype]
  }
  else if (supertypes === null || supertypes.isNothing) { supertypes = [] }

  declared = spec_name.declare || spec_name.declared
  shared   = spec_name.shared  || spec_name.sharedProperties
  methods  = spec_name.define  || spec_name.methods || spec_name.instanceMethods

  this.context  = context_ || spec_name.context || null

  this.setSupertypes(supertypes)
  this._initCoreIdentity(name)
  declared && this.addDeclarations(declared)
  shared   && this.addSharedProperties(shared)
  methods  && this.addMethods(methods)
})
// blanker.$root$outer.constructor = this._disguisedFunc
// blanker.$root$inner.constructor = MakeVacuousConstructor()
// this._properties.constructor    = CONSTRUCTOR


_Type.addDeclaration("_blanker")


_Type       ._init(       "Type"                          )
_$Primordial._init({name: "$Primordial", supertypes: null})
_$Inate     ._init({name: "$Inate"     , supertypes: null})
_Thing      ._init({name: "Thing"      , supertypes: null})
_Method     ._init(       "Method"                        )


_$Primordial._setDisplayNames("$$Outer", "$$Inner") // Helps with debugging!!!
_$Inate     ._setDisplayNames( "$Outer",  "$Inner") // Helps with debugging!!!





// Frost(Base_root)
// // Frost(Stash_root)
// Frost(Implementation_root)
// Frost(Inner_root)




/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
