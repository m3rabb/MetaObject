// "use strict"

// $Inner  _self
//   $inner
//   $pulp
// $Outer   self
//   $outer
//   $rind




// Should this be made immutable???
const $BaseBlanker = {
  innerMaker        : NewInner,
  $root$outer : {
    __proto__       : null,
    constructor     : NewVacuousConstructor("$Something$outer"), // ???
    [$IMMEDIATES]   : null, // EMPTY_OBJECT,
  },
  $root$inner : {
    __proto__       : null,
    constructor     : NewVacuousConstructor("$Something$inner"), // ???
    [$IMMEDIATES]   : null, // EMPTY_OBJECT,
    [$ASSIGNERS]    : null, // EMPTY_OBJECT,
    [$SUPERS]       : {
      __proto__        : null,
      [$IMMEDIATES]    : null, // EMPTY_OBJECT,
      [$PULP]          : IMPLEMENTATION,
    },
  },
}

$BaseBlanker.$root$inner[$OUTER] = $BaseBlanker.$root$outer
DefineProperty($BaseBlanker.$root$outer, "constructor", InvisibleConfig)
DefineProperty($BaseBlanker.$root$inner, "constructor", InvisibleConfig)

const $SomethingBlanker   = NewBlanker($BaseBlanker)
const   $IntrinsicBlanker = NewBlanker($SomethingBlanker)
const     TypeBlanker     = NewBlanker($IntrinsicBlanker, NewDisguisedInner)




const Type$root$inner = TypeBlanker.$root$inner


function BootstrapType(name, blanker_) {
  const _$type           = new TypeBlanker([name])
  const $type           = _$type[$OUTER]
  const isImplementation = (name[0] === "$")

  _$type._definitions      = SpawnFrom(null)
  _$type._blanker          = blanker_ || NewBlanker($IntrinsicBlanker)
  _$type._subordinateTypes = new Set()
  _$type.supertypes        = ($type.supertypes = EMPTY_ARRAY)
  _$type.ancestry          = isImplementation ? EMPTY_ARRAY : ThingAncestry
  return _$type[$PULP]
}

const ThingAncestry = []

const _$Something = BootstrapType("$Something", $SomethingBlanker )
const _$Intrinsic = BootstrapType("$Intrinsic", $IntrinsicBlanker )
const _Thing      = BootstrapType("Thing"     , null              )
const _Type       = BootstrapType("Type"      , TypeBlanker       )
const _Definition = BootstrapType("Definition", null              )

const $Something = _$Something[$RIND]
const $Intrinsic = _$Intrinsic[$RIND]
const Thing      = _Thing     [$RIND]
const Type       = _Type      [$RIND]
const Definition = _Definition[$RIND]

ThingAncestry[0] = Thing

const $Something$root$inner = $SomethingBlanker.$root$inner
const $Something$root$outer = $SomethingBlanker.$root$outer
const $Intrinsic$root$inner = $IntrinsicBlanker.$root$inner
const $Intrinsic$root$outer = $IntrinsicBlanker.$root$outer
const Definition$root$inner = _Definition._blanker.$root$inner


// Stubs for known properties
$Something$root$inner[$BARRIER]                 = null
// This secret is only known by inner objects
$Something$root$inner[$PROOF]                   = INNER_SECRET
$Something$root$outer[$PROOF]                   = null

$Something$root$outer.type                      = null
$Intrinsic$root$inner._retarget                 = null
_Type._blanker.$root$inner._propagateDefinition = ALWAYS_SELF



const _SetDefinitionAt = function _setDefinitionAt(tag, value, mode = VISIBLE) {
  const _$root      = this._blanker.$root$inner
  const definitions = this._definitions

  if (definitions[tag] === value) { return this }
  this._retarget

  if (value && value.type === Definition) {
    SetDefinition(_$root, value)
  }
  else {
    const selector = tag
    CompletelyDeleteProperty(_$root, selector)
    // DefineProperty(_$root, selector, InvisibleConfig) // CHECK!!!
    InSetProperty(_$root, selector, value, this)
  }

  switch (mode) {
    case REINHERIT :
      return
    case INHERIT :
      break
    case INVISIBLE :
      DefineProperty(definitions, tag, InvisibleConfig)
      // break omitted
    case VISIBLE   :
      definitions[tag] = value
      break
  }
  return this._propagateDefinition(tag)
}


_SetDefinitionAt.call(_$Something, "isSomething", true )
_SetDefinitionAt.call(_$Something, IS_IMMUTABLE , false)

// Could have defined the follow properties later, after addDeclaration has
// been defined, however it is fast execution within each objects' barrier#get
// if implemented this way.  These properties are read very frequently.
_SetDefinitionAt.call(_$Something, "id"                     , null)
_SetDefinitionAt.call(_$Something, _DURABLES                , null)
_SetDefinitionAt.call(_$Intrinsic, "_postInit"              , null)
_SetDefinitionAt.call(_$Intrinsic, "_initFrom_"             , null)
_SetDefinitionAt.call(_$Intrinsic, "_setPropertiesImmutable", null)



SetAsymmetricProperty(_$Intrinsic, "isOuter", false, true , VISIBLE)
SetAsymmetricProperty(_$Intrinsic, "isInner", true , false, VISIBLE)




Definition$root$inner[$OUTER].type  = Definition

Definition$root$inner._setImmutable = _BasicSetImmutable

Definition$root$inner._init = function _init(func_selector, func_, mode__, property___) {
  const [selector, handler, mode = STANDARD_METHOD, property] =
    (typeof func_selector === "function") ?
      [func_selector.name, func_selector, func_ , mode__     ] :
      [func_selector     , func_        , mode__, property___]
  const isPublic = (AsName(selector)[0] !== "_")
  const $inner   = InterMap.get(this[$RIND])
  const $outer   = $inner[$OUTER]

  if (!selector) { return this._invalidSelectorError(selector) }

  this.selector      = selector
  this.mode          = mode
  this.isPublic      = isPublic
  // Move the following to shared properties!!!
  this.isImmediate   = false
  // this.super --> is a lazy property

  switch(mode) {
    case DECLARATION :
      this.isDeclaration = true
      this.tag           = `$declaration@${AsName(selector)}`
      return

    case ASSIGNER :
      this.isAssigner = true
      this.tag        = `$assigner@${AsName(selector)}`
      $outer.handler = $inner.handler = MarkFunc(handler, ASSIGNER_FUNC)
      return

    case MANDATORY_SETTER_METHOD :
      $outer.assignmentError = $inner.assignmentError =
        NewAssignmentErrorHandler(property, selector)
      this.mappedSymbol = AsPropertySymbol(property)
      // break omitted

    case SETTER_METHOD :
      this.property = property
      break

    default :
      if (!(handler.length || FuncParamsListing(handler))) {
        this.isImmediate = true
        this.mode        = IMMEDIATE_METHOD
      }
      break
  }

  this.isMethod = true
  this.tag      = AsName(selector)

  const outer = mode.outer(selector, handler, isPublic)
  const inner = mode.inner(selector, handler, isPublic)

  inner[$OUTER_WRAPPER] = outer    // Also used as a reliable method marker!!!

  outer.method   = inner.method   = this[$RIND]

  // Need to subvert function assignment to enable raw functions to be stored.
  $outer.outer   = $inner.outer   = SetImmutableFunc(outer  , OUTER_FUNC)
  $outer.inner   = $inner.inner   = SetImmutableFunc(inner  , INNER_FUNC)
  $outer.handler = $inner.handler = MarkFunc        (handler, HANDLER_FUNC)
}



Type$root$inner.new              = _BasicNew
Type$root$inner._setDefinitionAt = _SetDefinitionAt



const AddMethod = function addMethod(func_selector, func_, mode__, property___) {
  const definition = Definition(func_selector, func_, mode__, property___)
  return this._setDefinitionAt(definition.tag, definition)
}

AddMethod.call(_Type, AddMethod)



_$Something.addMethod(function isPermeable() {
  return (this[$INNER].this) ? true : false
}, BASIC_VALUE_METHOD)



_$Intrinsic.addMethod(function _basicSet(property, value) {
  const selector = PropertyToSymbol[property] || property
  this[selector] = value
  return this
}, BASIC_SELF_METHOD)


// Note: This method might need to be moved to _$Something!!!
//
// It's not enough to simple make this method access the receiver's barrier.
// Th receiver only references its original barrier, and there may be more than
// one proxy/barrier associated with the receiver, so we need to invoke the
// proxy to force the proper change to occur thru it.
_$Intrinsic.addMethod(function _retarget() {
  const $inner = this[$INNER]

  if ($inner[IS_IMMUTABLE]) {
    delete this[$DELETE_IMMUTABILITY]
    return this
  }

  DefineProperty($inner, "_retarget", InvisibleConfig)
  return ($inner._retarget = this)  // InSetProperty($inner, "_retarget", this, this)
}, BASIC_SELF_METHOD)



_Definition.addMethod(Definition$root$inner._init)
_Definition.addMethod("_setImmutable", _BasicSetImmutable, BASIC_SELF_METHOD)



_Type.addMethod("new", _BasicNew, BASIC_VALUE_METHOD)
_Type.addMethod(_SetDefinitionAt)

_Type.addMethod(function _propagateDefinition(tag) {
  this._subordinateTypes.forEach(subtype => {
    var _$subtype = InterMap.get(subtype)
    _$subtype._inheritDefinitionAt.call(_$subtype[$PULP], tag)
  })
})



// addAssigner(function property() {})
// addAssigner("property", function () {})
// forAddAssigner(function property() {})
// forAddAssigner("property", function () {})

_Type.addMethod(function addAssigner(property_assigner, assigner_) {
  const [selector, assigner] = (assigner_) ?
    [property_assigner     , assigner_        ] :
    [property_assigner.name, property_assigner]

  if (!selector) { return UnnamedFuncError(this, assigner) }

  const definition = Definition(selector, assigner, ASSIGNER)
  this._setDefinitionAt(definition.tag, definition)
})


_Type.addMethod(function addDeclaration(selector) {
  const definition = Definition(selector, null, DECLARATION)
  this._setDefinitionAt(definition.tag, definition)
})


_Type.addMethod(function addSharedProperty(selector, value) {
  this._setDefinitionAt(selector, value)
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



_Type.addMethod(function _deleteDefinitionAt(tag) {
  var   selectors, nextSelector, next
  const blanker          = this._blanker
  const $root$inner      = blanker.$root$inner
  const $root$outer      = blanker.$root$outer
  const defs             = this._definitions
  const value            = defs[tag]
  const [selector, mode] = (value && value.type === Definition) ?
    [value.selector, value.mode] : [tag, null]

  switch (mode) {
    case IMMEDIATE_METHOD :
      delete $root$inner[$IMMEDIATES][selector]
      delete $root$outer[$IMMEDIATES][selector]
      delete $root$inner[$SUPERS][$IMMEDIATES][selector]
      selectors = [selector]
      break

    case ASSIGNER :
      delete $root$inner[$ASSIGNERS][selector]
      // break omitted

    case DECLARATION :
      selectors = EMPTY_ARRAY
      if ($root$inner[selector] !== undefined)      { break } // Has value
      if (defs[selector])                           { break } // Has immediate
      if (defs[`$assigner@${AsName(selector)}`])    { break } // Has assigner
      if (defs[AsSetterFromProperty(selector)])     { break } // Has setter
      selectors = [selector]
      break

    case MANDATORY_SETTER_METHOD :
      delete $root$inner[$ASSIGNERS][value.mappedSymbol]
      delete $root$inner[$ASSIGNERS][value.property]
      // break omitted

    case SETTER_METHOD :
      selectors = [selector]
      var property = value.property
      if ($root$inner[property] !== undefined)      { break } // Has value
      if (defs[property])                           { break } // Has immediate
      if (defs[`$declaration@${AsName(property)}`]) { break } // Has def
      selectors[1] = property
      // break omitted

    default :
      selectors = [selector]
      break
  }

  next = selectors.length
  while (next--) {
    nextSelector = selectors[next]
    delete $root$inner[nextSelector]
    delete $root$outer[nextSelector]
    delete $root$inner[$SUPERS][nextSelector]
    delete definitions[tag]
  }
  this._inheritDefinitionAt(tag)
})


_Type.addMethod(function _inheritDefinitionAt(tag) {
  const definitions = this._definitions
  if (definitions[tag] !== undefined) { return }

  var ancestry, next, _$nextType, value

  ancestry = this.ancestry
  next     = ancestry.length - 1
  while (next--) {
    _$nextType = InterMap.get(ancestry[next])
    value      = _$nextType._definitions[tag]

    if (value !== undefined) {
      return this._setDefinitionAt(tag, value, INHERIT)
    }
  }
})



_Type.addMethod(function _addSetter(name_setter, property_setter_, mode) {
  var propertyName, assigner, setterName, setter

  ;[setterName, setter] = (typeof name_setter === "function") ?
    [name_setter.name, name_setter] : [name_setter, null]

  switch (typeof property_setter_) {
    case "string"   :
      propertyName = property_setter_
      break

    case "function" :
      if ((propertyName = property_setter_.name)) {
        assigner = property_setter_
        if (mode === MANDATORY_SETTER_METHOD) {
          setter = AsAssignmentSetter(propertyName, setterName, assigner)
        }
        else {
          setter = AsBasicSetter(propertyName, setterName, mode)
          this.addMethod(propertyName, assigner, ASSIGNER)
        }
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

  this.addMethod(setterName, setter, mode, propertyName)
})


// addSetter("setterName")
// addSetter(function setterName() {})
// addSetter("setterName", "property")
// addSetter("setterName", function () {})
// addSetter("setterName", function propertyAssigner() {})

_Type.addMethod(function addSetter(name_setter, property_setter_) {
  this._addSetter(name_setter, property_setter_, SETTER_METHOD)
})


// forAddSetter("propertyName")
// forAddSetter("propertyName", "setterName")

_Type.addMethod(function forAddSetter(propertyName, setterName_) {
  const setterName = setterName_ || AsSetterFromProperty(propertyName) ||
    this._signalError(`Improper property name: ${propertyName}!!`)
  this._addSetter(setterName, propertyName, SETTER_METHOD)
})


// addMandatorySetter("setterName")
// addMandatorySetter(function setterName() {}) // within must call _basicSet
// addMandatorySetter("setterName", "property")
// addMandatorySetter("setterName", function () {}) // within must call _basicSet
// addMandatorySetter("setterName", function propertyAssigner() {})
//
_Type.addMethod(function addMandatorySetter(name_setter, property_setter_) {
  this._addSetter(name_setter, property_setter_, MANDATORY_SETTER_METHOD)
})

// forAddMandatorySetter("property")
// forAddMandatorySetter("property", "setterName")
// forAddMandatorySetter("property", function setterName() {}) // within must call _basicSet

_Type.addMethod(function forAddMandatorySetter(propertyName, setter_) {
  const setter = setter_ || AsSetterFromProperty(propertyName) ||
    this._signalError(`Improper property name: ${propertyName}!!`)
  this._addSetter(setter, propertyName, MANDATORY_SETTER_METHOD)
})



_Type.addMethod(function addRetroactiveProperty(assigner_selector, assigner_) {
  // Will set the $inner selector even on an immutable object!!!
  const [selector, assigner] = (typeof assigner_selector === "function") ?
      [assigner_selector.name, assigner_selector] :
      [assigner_selector     , assigner_        ]

  this.addMethod(selector, AsRetroactiveProperty(selector, assigner))
})





_Type.addMethod(function _reinheritDefinitions(_) {
  if (this.name) {
    // Not a virgin type
    const blanker     = this._blanker
    const $root$inner = blanker.$root$inner
    const $root$outer = blanker.$root$outer
    const supers      = $root$inner[$SUPERS]

    DeleteSelectorsIn([$root$inner, $root$outer, supers])
    DeleteSelectorsIn(
      [$root$inner[$IMMEDIATES], $root$outer[$IMMEDIATES], supers[$IMMEDIATES]])
    DeleteSelectorsIn([$root$inner[$ASSIGNERS]])
  }

  const ancestry = this.ancestry
  const knowns   = SpawnFrom(null)
  var   next, _$nextType, nextDefinitions, tag, value

  next = ancestry.length
  while (next--) {
    _$nextType      = InterMap.get(ancestry[next])
    nextDefinitions = _$nextType._definitions

    for (tag in nextDefinitions) {
      if (!knowns[tag]) {
        knowns[tag] = true
        value       = nextDefinitions[tag]
        this._setDefinitionAt(tag, value, REINHERIT)
      }
    }
  }

  this._propagateReinheritance
})


_Type.addMethod(function _propagateReinheritance() {
  this._subordinateTypes.forEach(subtype => {
    var _$subtype = InterMap.get(subtype)
    _$subtype._reinheritDefinitions.call(_$subtype[$PULP])
  })
})


_Type.addMethod(function _setAsSubordinateOfSupertypes(supertypes) {
  // LOOK: add logic to invalidate connected types if supertypes changes!!!
  const subtype = this[$RIND]

  var next, _$supertype, subtypes
  next = supertypes.length

  while (next--) {
    _$supertype = InterMap.get(supertypes[next])
    if ((subtypes = _$supertype._subordinateTypes)) { subtypes.add(subtype) }
  }
})




_Type.addMandatorySetter("setSupertypes", function supertypes(nextSupertypes) {
  if (this.supertypes === nextSupertypes) { return nextSupertypes }

  if (nextSupertypes.length !== new Set(nextSupertypes).size) {
    return DuplicateSupertypeError(this)
  }
  const nextAncestry = BuildAncestryOf(this[$RIND], nextSupertypes)
  const beThing      = AncestryIncludesThing(nextAncestry)

  if (this._blanker) {
    if (this.isPermeable) {
      return AttemptedChangeOfAncestryOfPermeableTypeError(this)
    }
    const isThing = IsSubtypeOfThing(this)  //
    if (beThing !== isThing) { return ImproperChangeToAncestryError(this) }
    // Perhaps not. Might be able to redirect the _blanker of an existing type???
  }
  else {
    const parentBlanker    = beThing ? $IntrinsicBlanker : $SomethingBlanker
    this._blanker          = new NewBlanker(parentBlanker)
    this._definitions      = SpawnFrom(null)
    this._subordinateTypes = new Set()
  }

  this.ancestry = nextAncestry
  this._setAsSubordinateOfSupertypes(nextSupertypes)
  this._reinheritDefinitions()
  return nextSupertypes
})


_Type.addMethod(function _setDisplayNames(outerName, innerName_) {
  const innerName     = innerName_ || ("_" + outerName)
  const _name = NewVacuousConstructor(innerName)
  const $name = NewVacuousConstructor(outerName)

  SetAsymmetricProperty(this, "constructor", _name, $name, INVISIBLE)
})


_Type.addMandatorySetter("setName", function name(newName) {
  const properName = AsCapitalized(newName)
  const priorName = this.name
  if (properName === priorName) { return priorName }

  if (properName[0] !== "$") {
    if (priorName != null) {
      this.removeSharedProperty(AsMembershipSelector(priorName))
    }
    AddMembershipSelector(this, AsMembershipSelector(properName))
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


_Type.addMethod(function _init(spec_name, context_) {
  var context, name, supertypes, supertype, shared, methods, definitions

  context    = context_ || spec_name.context || null
  name       = spec_name.name || spec_name
  supertypes = spec_name.supertypes

  if (supertypes === undefined) {
    supertype  = spec_name.supertype
    supertypes = (supertype === undefined) ?
      [context && context.Thing || Thing] :
      ((supertype === null) ? EMPTY_ARRAY : [supertype])
  }
  else if (supertypes === null || supertypes.isNothing) {
    supertypes = EMPTY_ARRAY
  }

  declared    = spec_name.declare || spec_name.declared
  durables    = spec_name.durable || spec_name.durables
  shared      = spec_name.shared  || spec_name.sharedProperties
  methods     = spec_name.methods || spec_name.instanceMethods
  definitions = spec_name.define  || spec_name.defines

  this.context   = context
  this._iidCount = 0

  // The ordering of the following is critical to avoid breaking the bootstrapping!!!
  this.setSupertypes(supertypes)
  this.addSharedProperty("type", this[$RIND])
  // this._setDefinitionAt("type", this[$RIND], INVISIBLE)
  this.setName(name)


  declared    && this.addDeclarations(declared)
  durables    && this.addDurables(durables) // This needs to be for the root!!!
  shared      && this.addSharedProperties(shared)
  methods     && this.addMethods(methods)
  definitions && this.define(definitions)
})


_Type.addDeclaration("_blanker")
_Type.addDeclaration($OUTER_WRAPPER)



_Type      ._init(        "Type"                          )
_$Something._init({ name: "$Something", supertypes: null })
_$Intrinsic._init({ name: "$Intrinsic", supertypes: null })
_Thing     ._init({ name: "Thing"     , supertypes: null })
_Definition._init(        "Definition"                    )


// Helps with debugging!!!
_$Something._setDisplayNames("$Intrinsic$Outer", "$Intrinsic$Inner")
_$Intrinsic._setDisplayNames("$Outer"          , "$Inner"          )


// Note: If this was called before the previous declarations,
// $IMMEDIATES, $ASSIGNERS, constructor, etc, would not be overridable
// in the descendent $roots.
Frost($BaseBlanker.$root$outer)
Frost($BaseBlanker.$root$inner)


_$Intrinsic.addMethod("_basicSetImmutable", _BasicSetImmutable, BASIC_SELF_METHOD)

const PermeableNewErrorMethod = Definition(function new_(...args) {
  this._signalError("Method 'new_' cannot be called on immutable type objects!!")
})

const PermeableNewAsFactErrorMethod = Definition(function newAsFact_(...args) {
  this._signalError("Method 'newAsFact_' cannot be called on immutable type objects!!")
})


_Type.addMethod(function _setImmutable(inPlace_, visited__) {
  const $inner       = this[$INNER]
  const blanker      = $inner._blanker
  const $root$outer  = blanker.$root$outer
  const $root$inner  = blanker.$root$inner
  const $root$supers = $root$inner[$SUPERS]

  // $inner._subordinateTypes = SetImmutable([])
  delete $inner._subordinateTypes

  this.addOwnDefinition(PermeableNewErrorMethod)
  this.addOwnDefinition(PermeableNewAsFactErrorMethod)

  // Frost($root$outer[$IMMEDIATES])
  // Frost($root$supers[$IMMEDIATES])
  // Frost($root$inner[$IMMEDIATES])
  // Frost($root$inner[$ASSIGNERS])
  // Frost($root$outer)
  // Frost($root$supers)
  // Frost($root$inner)

  $inner._basicSetImmutable()
  return this
}, BASIC_SELF_METHOD)


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
