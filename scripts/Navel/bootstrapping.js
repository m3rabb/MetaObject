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
const     $InateBlanker = NewBlanker({ super : $BaseBlanker         })
const       TypeBlanker = NewBlanker({ maker : MakeTypeInnerBlanker })



const Type$root$inner = TypeBlanker.$root$inner

// Temporary bootstrapping #_init
Type$root$inner._init = function _bootstrap(iid, blanker_) {
  DefineProperty(this, "iid", InvisibleConfiguration)
  this.iid           = iid
  this.subtypes      = new Set()
  if (blanker_) { this._blanker = blanker_ }
  return this[$PULP]
}



const _$Inate = new TypeBlanker(["$Inate"])._init(0, $InateBlanker)
const _Thing  = new TypeBlanker(["Thing"] )._init(1)
const _Type   = new TypeBlanker(["Type"]  )._init(2, TypeBlanker)
const _Method = new TypeBlanker(["Method"])._init(3)

const $Inate = _$Inate[$RIND]
const Thing  = _Thing [$RIND]
const Method = _Method[$RIND]
const Type   = _Type  [$RIND]



const $Inate$root$inner = $InateBlanker.$root$inner
const $Inate$root$pulp  = $InateBlanker.$root$pulp


// Stubs for default properties
$Inate$root$inner[$BARRIER]       = undefined
$Inate$root$inner._noSuchProperty = undefined

// This secret is only known by inner objects
$Inate$root$inner[$SECRET]        = $INNER

$Inate$root$pulp.id               = undefined
// $Inate$root$pulp.splice             = undefined // Weird ref by debugger
// Perhaps remove these later
$Inate$root$pulp.beImmutable      = undefined
$Inate$root$inner._postCreation   = undefined



const $Inate_properties = _$Inate._properties

$Inate_properties[$BARRIER]       = undefined
$Inate_properties._noSuchProperty = undefined
$Inate_properties.id              = undefined
// $Inate_properties.splice            = undefined // Weird ref by debugger
// Perhaps remove these later
$Inate_properties.beImmutable     = undefined
$Inate_properties._postCreation   = undefined



const MethodBlanker     = _Method._blanker
const Method$root$inner = MethodBlanker.$root$inner
const Method$root$pulp  = MethodBlanker.$root$pulp

Method$root$pulp.isMethod = true

Method$root$inner._init = function _init(func_name, func_, mode__) {
  let [selector, handler, mode = STANDARD_METHOD] =
    (typeof func_name === "function") ?
      [func_name.name, func_name, func_] : [func_name, func_, mode__]
  let isPublic = (selector[0] !== "_")
  let $inner   = this[$INNER]

  this.isPublic = isPublic
  this.selector = selector
  this.mode     = mode
  // this.super --> is a lazy property

  let existing = InterMap.get(handler)
  if (existing && existing.mode !== mode) {
    SignalError(this[$rind], "Can't reuse same handler function for different types of methods!")
  }

  if (mode === SET_LOADER) {
    this.handler = BeFrozenFunc(handler, SET_LOADER_FUNC)
  }
  else {
    this.outer   = BeFrozenFunc(mode.outer(selector, handler, isPublic), $inner)
    this.inner   = BeFrozenFunc(mode.inner(selector, handler, isPublic), $inner)
    this.handler = BeFrozenFunc(handler, $inner)
  }

  return this
}



Type$root$inner.new = {
  new : function (...args) {
    let instance$inner = new this._blanker(args)
    let instance$pulp  = instance$inner[$PULP]
    instance$pulp._init(...args)
    if (instance$inner._postCreation) {
      const result = instance$pulp._postCreation()[$RIND]
      if (result !== undefined && result !== instance$pulp) { return result }
    }
    return instance$inner[$RIND]
  }
}.new

Type$root$inner.newAsFact = function newAsFact(...args) {
  // Note: same as implementation in TypeOuter and TypeInner
  let instance = this.new(...args)
  if (instance.id == null) { instance.beImmutable }
  return instance
}

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



const AddMethod = function addMethod(method_namedFunc__name, func__, mode___) {
  const method = AsMethod(method_namedFunc__name, func__, mode___)
  return this._setSharedProperty(method.selector, method, true)
}



AddMethod.call(_Type, AddMethod)

_Method.addMethod(Method$root$inner._init)
_Type.addMethod(Type$root$inner._setSharedProperty)
_Type.addMethod("new", Type$root$inner.new, BASIC_METHOD)
_Type.addMethod(Type$root$inner.newAsFact, BASIC_METHOD)



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
  let next = methods.length
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
  let properties = this._properties
  if (selector in properties) { return this }

  let ancestry = this.ancestry
  let next = ancestry.length - 1

  while (next--) {
    let type$inner = InterMap.get(ancestry[next])
    let nextProperties = type$inner._properties

    if (selector in nextProperties) {
      let value = nextProperties[selector]
      return this._setSharedProperty(selector, value, false)
    }
  }
  return this
})



// It's too dangerous to wipeout a types properties and methods and then rebuild
// them, since instance may need to use them, so instead we rebuild them layer
// by layer from supertype to supertype, and then delete invalide properites last.
_Type.addMethod(function _reinheritProperties() {
  let validProperties = SpawnFrom(null)
  let ancestry = this.ancestry
  let nextProperties = this._properties
  let next = ancestry.length - 1

  for (let selector in nextProperties) { validProperties[selector] = true }

  while (next--) {
    let nextType$inner = InterMap.get(ancestry[next])
    nextProperties = nextType$inner._properties

    for (let selector in nextProperties) {
      if (!validProperties[selector]) {
        validProperties[selector] = true
        this._setSharedProperty(selector, nextProperties[selector], false)
      }
    }
  }

  let $root$inner = this._blanker.$root$inner
  nextProperties  = VisibleProperties($root$inner)
  next            = nextProperties.length

  while (next--) {
    let selector = nextProperties[next]
    if (!validProperties[selector]) { this._deleteSharedProperty(selector) }
  }
  return this
})


_Type.addMethod(function _setAsSubtypeFor(supertypes) {
  // LOOK: add logic to invalidate connected types if supertypes changes!!!
  const subtype = this[$RIND]
  let   next = supertypes.length

  while (next--) {
    let _supertype = InterMap.get(supertypes[next])
    _supertype.subtypes.add(subtype)
  }
  return this
})

_Type.addMethod(function _buildRoughAncestry(explicitTypes_) {
  let supertypes = this.supertypes
  let roughAncestry = []
  let explicitTypes = explicitTypes_ || new Set(supertypes)

  for (let index = 0, count = supertypes.length; index < count; index++) {
    let nextType = supertypes[index]
    let nextType$inner = InterMap.get(nextType)
    if (explicitTypes_ && explicitTypes_.has(nextType)) { continue }


    let nextAncestry = nextType$inner._buildRoughAncestry(explicitTypes)
    roughAncestry.push(...nextAncestry)
  }
  roughAncestry.push(this[$RIND])
  return roughAncestry
})

_Type.addMethod(function _buildAncestry() {
  const roughAncestry = this._buildRoughAncestry()
  const visited = new Set()
  const dupFreeAncestry = []
  let next = roughAncestry.length

  while (next--) {
    let type = roughAncestry[next]
    if (!visited.has(type)) {
      dupFreeAncestry.push(type)
      visited.add(type)
    }
  }
  this.ancestry = dupFreeAncestry.reverse()
  return this
})



// addAssigner("name", "setName")
// addAssigner("name", function () {})
// addAssigner("name", function setName() {})

_Type.addMethod(function addAssigner(propertyName, loader) {
  if (typeof loader === "string") {
    return this.addMethod(loader, AsBasicSetter(propertyName, loader))
  }
  if (loader.name) {
    this.addMethod(loader.name, AsLoaderSetter(propertyName, loader))
  }
  return this.addMethod(propertyName, loader, SET_LOADER)
})


// addRequiredAssigner("name", "setName")
// addRequiredAssigner("name", function setName() {})

_Type.addMethod(function addRequiredAssigner(propertyName, setLoader) {
  if (typeof setter === "string") {
    var setterName = name
    this.addMethod(setter, AsBasicSetter(propertyName, setter))
  }
  else {
    setterName = setter.name
    if (!setterName) {
      SignalError(this[$RIND], "Setter function must be named!")
    }
    this.addMethod(setterName, AsLoaderSetter(propertyName, setter))
  }
  var handler = MakeAssignmentError(propertyName, setterName)
  return this.addMethod(propertyName, handler, SET_LOADER)
})


_Type.addAssigner("supertypes", function setSupertypes(supertypes) {
  this._basicSet("supertypes", supertypes)
  this._setAsSubtypeFor(supertypes)
  this._buildAncestry()
  this._reinheritProperties()
  return supertypes
})


_Type.addMethod(function _setDisplayNames(outerName, innerName_) {
  const innerName = innerName_ || ("_" + outerName)
  const blanker   = this._blanker

  blanker.$root$outer.constructor = MakeVacuousConstructor(outerName)
  blanker.$root$inner.constructor = MakeVacuousConstructor(innerName)
  this._properties.constructor    = CONSTRUCTOR
  return this
})



_Type.addAssigner("name", function setName(newName) {
  const priorName = this.name
  if (newName !== priorName) {
    if (priorName != null) {
      this.removeSharedProperty(AsMembershipSelector(priorName))
    }
    const newMembershipSelector = AsMembershipSelector(newName)

    _$Inate.addSharedProperty(newMembershipSelector, false)
    this.addSharedProperty(newMembershipSelector, true)
    this.membershipSelector = newMembershipSelector

    this._setDisplayNames(newName)
    this._disguisedFunc.name = newName
  }
  return newName
})





// _Type.addMethod(function _make$copy(blanker) {
//   // blanker.$root$inner[$COPY] =   Make$copy(blanker)
// })


_Type.addMethod(function _initCoreIdentity(name) {
  const blanker  = this._blanker
  this._iidCount = 0
  this.name      = name
  // blanker.$root$inner[$COPY] = Make_$COPY(blanker)

  this.addSharedProperty("type", this[$RIND])
  this.addMethod(Make__newBlank(blanker))
})


_Type.addMethod(function _init(spec, context_) {
  const name       = spec && spec.name
  const supertypes =
    spec && (spec.supertypes || spec.supertype && [spec.supertype]) || [Thing]
  const methods    = spec && spec.instanceMethods || []
  const blanker    = this._blanker

  // blanker.$root$outer.constructor = this._disguisedFunc
  // blanker.$root$inner.constructor = MakeVacuousConstructor()
  // this._properties.constructor    = CONSTRUCTOR

  this.subtypes      = new Set()
  this.context       = context_ ? context_[$RIND] : null
  this.supertypes    = supertypes

  this._initCoreIdentity(name)
  this.addAllMethods(methods)
  return this
})


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
