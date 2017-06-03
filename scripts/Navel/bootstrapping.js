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

//const NothingBlanker
const     $InateBlanker = NewBlanker({ super : $BaseBlanker, base : true })
const       TypeBlanker = NewBlanker({ maker : MakeTypeInnerBlanker })



const Type$root$inner = TypeBlanker.$root$inner

// Temporary bootstrapping #_init
Type$root$inner._init = function _bootstrap(iid, blanker_) {
  DefineProperty(this, "iid", InvisibleConfiguration)
  this.iid      = iid
  this.subtypes = new Set()
  if (blanker_) { this._blanker = blanker_ }
  return this[$PULP]
}



const _$Inate = new TypeBlanker(["$Inate"])._init(0, $InateBlanker)
const _Thing  = new TypeBlanker(["Thing"] )._init(1)
const _Type   = new TypeBlanker(["Type"]  )._init(2, TypeBlanker)
const _Method = new TypeBlanker(["Method"])._init(3)



const $Inate$root$inner = $InateBlanker.$root$inner
const $Inate$root$pulp  = $InateBlanker.$root$pulp
const $Inate$root$outer = $InateBlanker.$root$outer


// Stubs for default properties
$Inate$root$inner[$MAIN_BARRIER]          = undefined
$Inate$root$inner._noSuchProperty         = undefined

// This secret is only known by inner objects
$Inate$root$inner[$SECRET]                = $INNER
$Inate$root$outer[$SECRET]                = undefined

$Inate$root$pulp[IS_IMMUTABLE]            = false
// $Inate$root$pulp[IMMUTABILITY]    = null
$Inate$root$pulp.id                       = undefined
// $Inate$root$pulp.splice             = undefined // Weird ref by debugger
// Perhaps remove these later
$Inate$root$pulp.beImmutable              = undefined
$Inate$root$inner._postCreation           = undefined
$Inate$root$inner._initFrom_              = undefined
$Inate$root$inner._setPropertiesImmutable = undefined


const $Inate = _$Inate[$RIND]
const Thing  = _Thing [$RIND]
const Method = _Method[$RIND]
const Type   = _Type  [$RIND]


const $Inate_properties = _$Inate._properties

$Inate_properties[$MAIN_BARRIER]          = undefined
$Inate_properties._noSuchProperty         = undefined
$Inate_properties.id                      = undefined
// $Inate_properties.splice            = undefined // Weird ref by debugger
// Perhaps remove these later
$Inate_properties.beImmutable             = undefined
$Inate_properties._postCreation           = undefined
$Inate_properties._initFrom_              = undefined
$Inate_properties._setPropertiesImmutable = undefined



const MethodBlanker     = _Method._blanker
const Method$root$inner = MethodBlanker.$root$inner
const Method$root$pulp  = MethodBlanker.$root$pulp

Method$root$pulp.isMethod = true

Method$root$inner._init = function _init(func_name, func_, mode__) {
  const [selector, handler, mode = STANDARD_METHOD] =
    (typeof func_name === "function") ?
      [func_name.name, func_name, func_] : [func_name, func_, mode__]
  const isPublic = (selector[0] !== "_")

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

  return this
}



Type$root$inner.new = {
  new : function (...args) {
    const $instance = new this._blanker(args)
    const _instance  = $instance[$PULP]
    _instance._init(...args)
    if ($instance._postCreation) {
      const result = _instance._postCreation()[$RIND]
      if (result !== undefined && result !== _instance) { return result }
    }
    return $instance[$RIND]
  }
}.new

Type$root$inner._propagateIntoSubtypes = ALWAYS_SELF

Type$root$inner._setSharedProperty = function _setSharedProperty(selector, value, isOwn) {
  const properties  = this._properties
  const existing    = properties[selector]

  if (existing === value) { return this }

  const blanker     = this._blanker
  const $root$inner = blanker.$root$inner
  const $root$pulp  = blanker.$root$pulp

  if (isOwn) { properties[selector] = value }

  delete $root$pulp[selector]
  if (value && value.isMethod) { SetMethod($root$inner, value) }
  else                         { $root$pulp[selector] = value  }

  delete $root$inner[$SUPERS][selector]
  return this._propagateIntoSubtypes(selector)
}


const BasicBeImmutable = function _basicBeImmutable() {
  const $inner = this[$INNER]
  if ($inner[IS_IMMUTABLE]) { return $inner[$PULP] }
  const $outer  = $inner[$OUTER]
  const barrier = new ImmutableInner($inner)

  $inner[$MAIN_BARRIER] = barrier
  $outer[IS_IMMUTABLE]  = $inner[IS_IMMUTABLE] = true
  Frost($outer)
  return ($inner[$PULP] = new Proxy($inner, barrier))
}
//   delete this._captureChanges
//   delete this._captureOverwrite


const AddMethod = function addMethod(method_namedFunc__name, func__, mode___) {
  const method = AsMethod(method_namedFunc__name, func__, mode___)
  return this._setSharedProperty(method.selector, method, true)
}



AddMethod.call(_Type, AddMethod)

_Method.addMethod("beImmutable", BasicBeImmutable, BASIC_SELF_IMMEDIATE)
_Method.addMethod(Method$root$inner._init, BASIC_SELF_METHOD)

_Type.addMethod(Type$root$inner._setSharedProperty)
_Type.addMethod("new", Type$root$inner.new, BASIC_VALUE_METHOD)
_Type.addMethod(_Method._properties.beImmutable.beImmutable)
_Type._properties.addMethod.beImmutable


_$Inate.addMethod(function _basicSet(propertyName, value) {
  return InSetProperty(this[$INNER], propertyName, value, this)
})



_Type.addMethod(function addImmediate(...namedFunc_name__handler) {
  return this.addMethod(...namedFunc_name__handler, STANDARD_IMMEDIATE)
})

_Type.addMethod(function addLazyProperty(...namedFunc_name__handler) {
  return this.addMethod(...namedFunc_name__handler, LAZY_INSTALLER)
})

_Type.addMethod(function addSharedProperty(selector, value) {
  return this._setSharedProperty(selector, value, true)
})

_Type.addMethod(function removeSharedProperty(selector) {
  return (selector in this._properties) ?
    this._deleteSharedProperty(selector) : this
})

_Type.addMethod(function addAllMethods(methods) {
  var next = methods.length
  while (next--) { this.addMethod(methods[next]) }
  return this
})

_Type.addMethod(function _deleteSharedProperty(selector) {
  const blanker     = this._blanker
  const $root$inner = blanker.$root$inner
  const supers      = $root$inner[$SUPERS]

  delete this._properties[selector]
  delete blanker.$root$pulp[selector]
  delete $root$inner[$IMMEDIATES][selector]
  delete supers[selector]
  delete supers[$IMMEDIATES][selector]
  return this._inheritProperty(selector)
})

_Type.addMethod(function _propagateIntoSubtypes(selector) {
  this.subtypes.forEach(subtype => {
    InterMap.get(subtype)[$PULP]._inheritProperty(selector)
  })
  return this
})

_Type.addMethod(function _inheritProperty(selector) {
    const properties = this._properties
  if (selector in properties) { return this }

  const ancestry = this.ancestry

  var next, $nextType, nextProperties, value
  next = ancestry.length - 1

  while (next--) {
    $nextType      = InterMap.get(ancestry[next])
    nextProperties = $nextType._properties

    if (selector in nextProperties) {
      value = nextProperties[selector]
      return this._setSharedProperty(selector, value, false)
    }
  }
  return this
})



// It's too dangerous to wipeout a types properties and methods and then rebuild
// them, since instance may need to use them, so instead we rebuild them layer
// by layer from supertype to supertype, and then delete invalide properites last.
_Type.addMethod(function _reinheritProperties() {
  const validProperties = SpawnFrom(null)
  const ancestry        = this.ancestry
  const $root$inner     = this._blanker.$root$inner

  var nextProperties, next, selector, $nextType
  nextProperties = this._properties
  next           = ancestry.length - 1

  for (selector in nextProperties) { validProperties[selector] = true }

  while (next--) {
    $nextType  = InterMap.get(ancestry[next])
    nextProperties = $nextType._properties

    for (selector in nextProperties) {
      if (!validProperties[selector]) {
        validProperties[selector] = true
        this._setSharedProperty(selector, nextProperties[selector], false)
      }
    }
  }

  nextProperties = VisibleProperties($root$inner)
  next           = nextProperties.length

  while (next--) {
    selector = nextProperties[next]
    if (!validProperties[selector]) { this._deleteSharedProperty(selector) }
  }
  return this
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
  return this
})

_Type.addMethod(function _buildRoughAncestry(explicitTypes_) {
  const supertypes = this.supertypes
  const roughAncestry = []
  const explicitTypes = explicitTypes_ || new Set(supertypes)
  var index, count, nextType, $nextType, nextAncestry

  for (index = 0, count = supertypes.length; index < count; index++) {
    nextType  = supertypes[index]
    $nextType = InterMap.get(nextType)
    if (explicitTypes_ && explicitTypes_.has(nextType)) { continue }

    nextAncestry = $nextType._buildRoughAncestry(explicitTypes)
    roughAncestry.push(...nextAncestry)
  }
  roughAncestry.push(this[$RIND])
  return roughAncestry
})

_Type.addMethod(function _buildAncestry() {
  const roughAncestry = this._buildRoughAncestry()
  const visited = new Set()
  const dupFreeAncestry = []

  var next, type
  next = roughAncestry.length

  while (next--) {
    type = roughAncestry[next]
    if (!visited.has(type)) {
      dupFreeAncestry.push(type)
      visited.add(type)
    }
  }
  this.ancestry = dupFreeAncestry.reverse()
  return this
})


// addAssigner("setName")
// addAssigner(function setName() {})
// addAssigner("property", "setName")
// addAssigner("property", function () {})
// addAssigner("property", function setName() {})

_Type.addMethod(function addAssigner(setter_loader__property, setter_loader_) {
  const [propertyName, setterName, loader, setter] =
    AsPropertySetterLoaderHandler(setter_loader__property, setter_loader_)

  if (setterName) { this.addMethod(setterName, setter) }
  if (loader)     { this.addMethod(propertyName, loader, SET_LOADER) }
  return this
})


// addMandatorySetter("setName")
// addMandatorySetter(function setName() {})
// addMandatorySetter("property", "setName")
// addMandatorySetter("property", function setName() {})

_Type.addMethod(function addMandatorySetter(setter_loader__property, setter_loader_) {
  var [propertyName, setterName, loader, setter] =
    AsPropertySetterLoaderHandler(setter_loader__property, setter_loader_)

  if (!setterName) { UnnamedLoaderError(this[$RIND]) }
  this.addMethod(setterName, setter)
  loader = MakeAssignmentError(propertyName, setterName)
  return this.addMethod(propertyName, loader, SET_LOADER)
})




_Type.addMandatorySetter(function setSupertypes(supertypes) {
  this._basicSet("supertypes", SetImmutable(supertypes))
  this._setAsSubtypeOfSupertypes()
  this._buildAncestry()
  this._reinheritProperties()
})


_Type.addMethod(function _setDisplayNames(outerName, innerName_) {
  const innerName = innerName_ || ("_" + outerName)
  const blanker   = this._blanker

  blanker.$root$outer.constructor = MakeVacuousConstructor(outerName)
  blanker.$root$inner.constructor = MakeVacuousConstructor(innerName)
  this._properties.constructor    = CONSTRUCTOR
  return this
})



_Type.addAssigner("name", function setName(name) {
  const properName = AsCapitalized(name)
  const priorName = this.name
  if (properName !== priorName) {
    if (priorName != null) {
      this.removeSharedProperty(AsMembershipSelector(priorName))
    }
    const newMembershipSelector = AsMembershipSelector(properName)

    _$Inate.addSharedProperty(newMembershipSelector, false)
    this.addSharedProperty(newMembershipSelector, true)
    this.membershipSelector = newMembershipSelector

    this._setDisplayNames(properName)
    this._disguisedFunc.name = properName
  }
  return properName
})





// _Type.addMethod(function _make$copy(blanker) {
//   // blanker.$root$inner[$COPY] =   Make$copy(blanker)
// })


_Type.addMethod(function _initCoreIdentity(name) {
  this._iidCount = 0
  this.name      = name
  this.addSharedProperty("type", this[$RIND])
})


_Type.addMethod(function _init(spec, context_) {
  const name       = spec && spec.name
  const supertypes =
    spec && (spec.supertypes || spec.supertype && [spec.supertype]) || [Thing]
  const methods    = spec && spec.instanceMethods || []
  const blanker    = this._blanker

  this.subtypes   = SetImmutable(new Set())
  this.context    = context_ ? context_[$RIND] : null

  this._initCoreIdentity(name)
  this.setSupertypes(supertypes)
  this.addAllMethods(methods)
  return this
})
// blanker.$root$outer.constructor = this._disguisedFunc
// blanker.$root$inner.constructor = MakeVacuousConstructor()
// this._properties.constructor    = CONSTRUCTOR


_Type  ._init({name: "Type"  , supertypes: []})
_$Inate._init({name: "$Inate", supertypes: []})
_Thing ._init({name: "Thing" , supertypes: []})
_Method._init({name: "Method"})

_Type.setSupertypes([Thing])




// Frost(Base_root)
// // Frost(Stash_root)
// Frost(Implementation_root)
// Frost(Inner_root)




//  Make earlier methods immutable!!!





/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
