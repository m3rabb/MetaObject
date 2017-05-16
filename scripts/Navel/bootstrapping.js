// "use strict"

// $Inner  _self
//   $inner
//   $pulp
// $Outer   self
//   $outer
//   $rind



// UNTESTED
const DefaultOuterBehavior = {
  __proto__ : null,

  get (base$root, selector, $outer) {
    const $inner = InterMap.get($outer[$RIND])
    if (selector[0] === "_") {
      if ($inner._externalPrivateAccess) {
        return $inner[$PULP]._externalPrivateAccess(selector)
      }
    }
    return $inner._noSuchProperty ?
      $inner[$PULP]._noSuchProperty(selector) : undefined
  },
  // getPrototypeOf (base$root) { return base$root }
}

const DefaultInnerBehavior = {
  __proto__ : null,

  get (base$root, selector, $inner) {
    return $inner._noSuchProperty ?
      $inner[$PULP]._noSuchProperty(selector) : undefined
  },

  // getPrototypeOf (base$root) { return base$root }
}




const Base$root         = SpawnFrom(null)
// const   Stash$root      = SpawnFrom(Base$root)
const   Base$root$outer = new Proxy(Base$root, DefaultOuterBehavior)
const   Base$root$inner = new Proxy(Base$root, DefaultInnerBehavior)


const $BaseBlanker = {$root$outer: Base$root$outer, $root$inner: Base$root$inner}
const   $InateBlanker   = NewBlankerFrom($BaseBlanker , MakeInnerBlanker)
const     MethodBlanker = NewBlankerFrom($InateBlanker, MakeInnerBlanker)
const     TypeBlanker   = NewBlankerFrom($InateBlanker, MakeTypeInnerBlanker)

const $Inate$root$inner = $InateBlanker.$root$inner
const $Inate$root$pulp  = $InateBlanker.$root$pulp
const Method$root$inner = MethodBlanker.$root$inner
const Method$root$pulp  = MethodBlanker.$root$pulp
const Type$root$inner   = TypeBlanker.$root$inner
// // Just in case sanity failsafe to prevent infinite recursion from DefaultInnerBehavior
// $InateBlanker.$root$inner[$PULP]  = $InateBlanker.$root$inner
//


// Temporary bootstrapping #_init
Type$root$inner._bootstrap = function (name, blanker) {
  this._blanker = blanker
  this.subtypes = new Set()
  SetDisplayNames(blanker, name) // The following is not necessary but helpful for implementation debugging!!!
  return this
}


const $Inate$inner  = new TypeBlanker()
const Method$inner  = new TypeBlanker()
const Type$inner    = new TypeBlanker()

const $Inate  = $Inate$inner._bootstrap("$Inate", $InateBlanker )[$RIND]
const Method  = Method$inner._bootstrap("Method", MethodBlanker )[$RIND]
const Type    = Type$inner  ._bootstrap("Type"  , TypeBlanker   )[$RIND]

const $Inate_properties = $Inate$inner._properties

// Stubs for default properties
$Inate$root$inner[$INNER_POROSITY]  = undefined
$Inate$root$inner[KNOWN_PROPERTIES] = undefined
$Inate$root$inner[$IID]             = undefined

$Inate$root$inner.beImmutable       = undefined
$Inate$root$inner._noSuchProperty   = undefined
$Inate$root$inner._certified        = undefined

// This secret is only known by inner objects
$Inate$root$inner[$SECRET]          = $INNER

$Inate$root$pulp.id                 = undefined
$Inate$root$pulp.atIndex            = undefined
$Inate$root$pulp.splice             = undefined // Weird ref by debugger


$Inate_properties.beImmutable       = undefined
$Inate_properties._noSuchProperty   = undefined
$Inate_properties._certified        = undefined
$Inate_properties.id                = undefined
$Inate_properties.atIndex           = undefined
$Inate_properties.splice            = undefined // Weird ref by debugger



Method$root$inner._init = function _init(func_name, func_, mode__) {
  const [selector, handler, mode] = (typeof func_name === "function") ?
    [func_name.name, func_name, func_] : [func_name, func_, mode__]

  this.isPublic = (selector[0] !== "_")
  this.selector = selector
  this.handler  = AsSafeFunction(handler)
  this.mode     = mode || STANDARD
}

Method$root$pulp.isMethod = true


Type$root$inner._propagateIntoSubtypes = ALWAYS_SELF

Type$root$inner._setSharedProperty = function _setSharedProperty(selector, value, isOwn) {
  const properties  = this._properties
  const existing    = properties[selector]

  if (existing === value) { return this }

  const blanker     = this._blanker
  const $root$inner = blanker.$root$inner
  const $root$pulp  = blanker.$root$pulp

  if (isOwn) { properties[selector] = value }

  if (value && value.isMethod) {
    SetMethod($root$inner, value)
  }
  else {
    delete $root$pulp[selector]
    $root$pulp[selector] = value
  }
  delete $root$inner[$SUPERS][selector]
  return this._propagateIntoSubtypes(selector)
}


const AddMethod = function addMethod(method_namedFunc__name, func__, mode___) {
  const method = AsMethod(method_namedFunc__name, func__, mode___)
  return this._setSharedProperty(method.selector, method, true)
}



AddMethod.call(Type$inner, AddMethod)

Method.addMethod(Method$root$inner._init)
Type.addMethod(Type$root$inner._setSharedProperty)


Type.addMethod(function addGetter(...namedFunc_name__handler) {
  return this.addMethod(...namedFunc_name__handler, GETTER)
})

Type.addMethod(function addLazyProperty(...namedFunc_name__handler) {
  return this.addMethod(...namedFunc_name__handler, LAZY_INSTALLER)
})

Type.addMethod(function addProperty(selector, value) {
  return this._setSharedProperty(selector, value, true)
})

Type.addMethod(function removeProperty(selector) {
  return this._deleteSharedProperty(selector)
})

Type.addMethod(function addAllMethods(methods) {
  let next = methods.length
  while (next--) { this.addMethod(methods[next]) }
  return this
})

Type.addMethod(function _deleteSharedProperty(selector) {
  const blanker     = this._blanker
  const $root$inner = blanker.$root$inner
  const supers      = $root$inner[$SUPERS]

  delete this._properties[selector]
  delete blanker.$root$pulp[selector]
  delete $root$inner[$GETTERS][selector]
  delete supers[selector]
  delete supers[$GETTERS][selector]
  return this._propagateIntoSubtypes(selector)
})

Type.addMethod(function _propagateIntoSubtypes(selector) {
  let subtypes = this.subtypes
  for (let index = 0, count = subtypes.length; index < count; index++) {
    InterMap.get(subtypes[index])[$PULP]._inheritProperty(selector)
  }
  return this
})

Type.addMethod(function _inheritProperty(selector) {
  let properties = this._properties
  if (selector in properties) { return this }

  let ancestry = this.ancestry
  let next = ancestry.length

  while (--next) {
    let type$inner = InterMap.get(ancestry[next])
    let nextProperties = type$inner._properties

    if (selector in nextProperties) {
      let value = nextProperties[selector]
      return this._setSharedProperty(selector, value, false)
    }
  }
  return this._deleteSharedProperty(selector)
})



// It's too dangerous to wipeout a types properties and methods and then rebuild
// them, since instance may need to use them, so instead we rebuild them layer
// by layer from supertype to supertype, and then delete invalide properites last.
Type.addMethod(function _reinheritProperties() {
  let validProperties = SpawnFrom(null)
  let ancestry = this.ancestry
  let nextProperties = this._properties
  let next = ancestry.length

  for (let selector in nextProperties) { validProperties[selector] = true }

  while (--next) {
    let nextType$inner = InterMap.get(ancestry[next])
    nextProperties = nextType$inner._properties

    for (let selector in nextProperties) {
      if (!validProperties[selector]) {
        validProperties[selector] = true
        this._setSharedProperty(selector, nextProperties[selector], false)
      }
    }
  }

  const $root$inner = this._blanker.$root$inner

  for (let selector in $root$inner) {
    if (!validProperties[selector]) { this._deleteSharedProperty(selector) }
  }
  return this
})


Type.addMethod(function _setAsSubtypeFor(supertypes) {
  // LOOK: add logic to invalidate connected types if supertypes changes!!!
  const subtype = this[$RIND]
  let   next = supertypes.length

  while (next--) {
    let _supertype = InterMap.get(supertypes[next])
    _supertype.subtypes.add(subtype)
  }
  return this
})

Type.addMethod(function _buildRoughAncestry(explicitTypes_) {
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

Type.addMethod(function _buildAncestry() {
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


Type.addMethod(function setSupertypes(supertypes) {
  this.supertypes = supertypes
  this._setAsSubtypeFor(supertypes)
  this._buildAncestry()
  this._reinheritProperties()
  return this
})



function AsMembershipSelector(name) {
  return `is${name[0].toUpperCase()}${name.slice(1)}`
}


Type.addMethod(function _make$copy(blanker) {
  // blanker.$root$inner[$COPY] =   Make$copy(blanker)
})

Type.addMethod(function setName(newName) {
  const priorName = this.name
  if (newName !== priorName) {
    if (priorName != null) {
      const priorMembershipSelector = AsMembershipSelector(priorName)
      this.removeProperty(priorMembershipSelector)
    }
    const newMembershipSelector = AsMembershipSelector(newName)
    this.addProperty(newMembershipSelector, true)
    $Inate.addProperty(newMembershipSelector, false)
    this.membershipSelector = newMembershipSelector
    this.name = newName
    SetDisplayNames(this._blanker, newName)
  }
  return this
})



function Make_newBlank(Blanker) {
  return function _newBlank() { return new Blanker()[$RIND] }
}


Type.addGetter(function basicId() {
  const type = this.type
  const context = type.context
  const prefix = context ? context.id + "@" : ""
  let iid = this[$IID] ||
    (this[$IID] = ++InterMap.get(this.type)._iidCount)
  return `${prefix}${type.name}#${iid}`
  // `${type.name}<${NewUniqueId()}>`
})

Type.addMethod(function setId(newId_) {
  const existingId = this.id

  if (newId_ === undefined) {
    if (existingId !== undefined) { return this }
    this.id = this.basicId
  }
  else if (newId_ === existingId) { return this }
  else { this.id = newId_ }

  if (existingId !== undefined) {
    let priorIds = this[$PRIOR_IDS] || (this[$PRIOR_IDS] = [])
    priorIds[priorIds.length] = existingId
  }
  return this
})

Type.addMethod(function resetId(newId_) {
  this.id = (newId_ !== undefined) ? newId : this.basicId
})


Type.addMethod(function _init(spec, context_) {
  const name       = spec && spec.name
  const supertypes =
    spec && (spec.supertypes || spec.supertype && [spec.supertype]) || [Thing]
  const methods    = spec && spec.instanceMethods || []
  const newBlanker = Make_newBlank(this._blanker)
  // $root$inner[$COPY]    = Make$copy(Blanker)

  this._iidCount = 0
  this.subtypes = new Set()
  this.context  = context_ ? context_[$RIND] : null

  this.addProperty("type", this[$RIND])
  this.setName(name)
  this.setId()
  this.setSupertypes(supertypes)
  this.addMethod(newBlanker)
  this.addAllMethods(methods)
  return this
})

// Type.addMethod(function _certified(beImmutable_) {
//   return this.setId(this.basicId, true)
// })




Type$inner  [$PULP]._init({name: "Type", supertypes: []})

$Inate$inner[$PULP][$IID] = "0"

$Inate$inner[$PULP]._init({name: "$Inate", supertypes: []})

const Thing        = Type({name: "Thing" , supertypes: []})

Method$inner[$PULP]._init({name: "Method"})
Type.setSupertypes([Thing])

SetDisplayNames($InateBlanker, "$Outer", "$Inner") // Helps with debugging!!!



// Frost(Base_root)
// // Frost(Stash_root)
// Frost(Implementation_root)
// Frost(Inner_root)

// methodAt

Thing.addMethod(Type$inner._properties.setId)
Thing.addMethod(Type$inner._properties.basicId)
Type.removeProperty("setId")
Type.removeProperty("basicId")


$Inate.addLazyProperty(function $() {
  return this[$RIND]
})

$Inate.addLazyProperty(function _super() {
  return new Proxy(InterMap.get(this[$RIND]), SuperPorosity)
})

Method.addLazyProperty($SUPER, function () {
  return new Proxy(this.handler, SuperMethodPorosity)
})

Method.addLazyProperty(function isGetter() {
  return (this.mode === GETTER)
})

Method.addLazyProperty(function isLazy() {
  return (this.mode === LAZY_INSTALLER)
})

Method.addLazyProperty(function isStandard() {
  return (this.mode === STANDARD)
})

Method.addProperty("STANDARD"      , STANDARD      )
Method.addProperty("GETTER"        , GETTER        )
Method.addProperty("LAZY"          , LAZY_INSTALLER)
Method.addProperty("LAZY_INSTALLER", LAZY_INSTALLER)



Thing.addMethod(function addOwnMethod(method_namedFunc__name, func__, mode___) {
  const $inner   = InterMap.get(this[$RIND])
  const method   = AsMethod(method_namedFunc__name, func__, mode___)
  const selector = method.selector
  const methods  = $inner[OWN_METHODS]|| ($inner[OWN_METHODS] = SpawnFrom(null))
  const supers   = $inner[$SUPERS]    || ($inner[$SUPERS]     = SpawnFrom(null))
  SetMethod($inner, method)
  methods[selector] = method
  delete supers[selector]
  // delete getters
  return this
})

Thing.addMethod(function addOwnGetter(...namedFunc_name__handler) {
  return this.addOwnMethod(...namedFunc_name__handler, GETTER)
})

Thing.addMethod(function addOwnLazyProperty(...namedFunc_name__handler) {
  return this.addOwnMethod(...namedFunc_name__handler, LAZY_INSTALLER)
})


// Thing.addMethod(function _quietGet(selector) {
//   const descriptor = PropertyDescriptor(this, selector)
//   return descriptor.value
// })


// Thing.addMethod(function _resetId() {
//   this.id = this.basicId
//   return this
// })


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
