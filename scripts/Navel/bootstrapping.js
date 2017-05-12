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
    const $inner = InterMap.get($outer[RIND])
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


// Stubs for default properties
$Inate$root$inner[$INNER_POROSITY]  = undefined
$Inate$root$inner[$KNOWN_SELECTORS] = undefined
$Inate$root$inner[$IID]             = undefined
$Inate$root$inner._noSuchProperty   = undefined
// This secret is only known by inner objects
$Inate$root$inner[$SECRET]          = $INNER

$Inate$root$pulp.id                 = undefined
$Inate$root$pulp.atIndex            = undefined
$Inate$root$pulp.splice             = undefined // Weird ref by debugger

Method$root$pulp.isMethod           = true


// Temporary bootstrapping #_init
Type$root$inner._init = function _bootstrapping_init(name, blanker) {
  SetDisplayNames(blanker, name) // Not necessary but helpful for debugging
  this.name                   = name
  this[$OUTER].name           = name
  this._blanker               = blanker
  this._subtypes              = new Set()
  this._properties            = SpawnFrom(null)
  blanker.$root$inner[$SUPERS] = SpawnFrom(null)
  return this
}


const $Inate$inner  = (new TypeBlanker())._init("$Inate", $InateBlanker )
const Method$inner  = (new TypeBlanker())._init("Method", MethodBlanker )
const Type$inner    = (new TypeBlanker())._init("Type"  , TypeBlanker   )

const $Inate  = $Inate$inner[RIND]
const Method  = Method$inner[RIND]
const Type    = Type$inner  [RIND]


Method$root$inner._init = function _init(func_name, func_, mode__) {
  const [selector, handler, mode] = (typeof func_name === "function") ?
    [func_name.name, func_name, func_] : [func_name, func_, mode__]

  this.selector    = selector
  this.handler     = AsSafeFunction(handler)
  this.mode       = mode || STANDARD
  this.isPublic    = (selector[0] !== "_")
}



const BasicId = function basicId() {
  const type = this.type
  const context = type.context
  const prefix = context ? context.id + "@" : ""
  const iid = this[$IID] || (this[$IID] = InterMap.get(type)._nextIID++)
  return `${iid}.${prefix}${type.name}`
}

AddGetter(Type$root$inner, "basicId", true, BasicId)


Type$root$inner.setId = function setId(newId_) {
  const existingId = this.id

  if (newId_ === undefined) {
    if (this[$IID] !== undefined) { return this }
    this.id = NewUniqueId(this.basicId + "-")
  }
  else if (newId_ === existingId) { return this }
  else {
    if (this[$IID] === undefined) {
      this[$IID] = InterMap.get(this.type)._nextIID++
    }
    this.id = newId_
  }

  if (existingId !== undefined) {
    let priorIds = this[$PRIOR_IDS] || (this[$PRIOR_IDS] = [])
    priorIds[priorIds.length] = existingId
  }

  return this
}


Type$root$inner._propagateIntoSubtypes = ALWAYS_SELF

Type$root$inner._setSharedProperty = function _setSharedProperty(selector, value, isOwn) {
  const properties  = this._properties
  const existing    = properties[selector]

  if (existing === value) { return this }

  const blanker     = this._blanker
  const $root$inner = blanker.$root$inner

  if (value && value.isMethod) {
    SetMethod($root$inner, blanker.$root$outer, value)
  }
  else {
    blanker.$root$pulp[selector] = value
  }
  if (isOwn) { properties[selector] = value }
  delete $root$inner[$SUPERS][selector]
  return this._propagateIntoSubtypes(selector)
}


const AddMethod = function addMethod(method_namedFunc__name, func__, mode___) {
  const method = AsMethod(method_namedFunc__name, func__, mode___)
  return this._setSharedProperty(method.selector, method, true)
}



AddMethod.call(Type$inner, AddMethod)


Type.addMethod(function _deleteSharedProperty(selector) {
  const blanker     = this._blanker
  const $root$inner = blanker.$root$inner
  const getters     = $root$inner[GETTERS]

  delete this._properties[selector]
  delete blanker.$root$pulp[selector]
  delete $root$inner[$SUPERS][selector]
  if (getters) { delete getters[selector] }
  return this._propagateIntoSubtypes(selector)
})

Type.addMethod(function _propagateIntoSubtypes(selector) {
  let subtypes = this._subtypes
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
  const subtype = this[RIND]
  let   next = supertypes.length

  while (next--) {
    let _supertype = InterMap.get(supertypes[next])
    _supertype._subtypes.add(subtype)
  }
  return this
})

Type.addMethod(function _buildRoughAncestry(explicitTypes_) {
  let supertypes = this.supertypes
  let roughAncestry = []
  let explicitTypes = explicitTypes_ || new Set(supertypes)

  for (let index = 0, count = supertypes.length; index < count; index++) {
    let nextSupertype = supertypes[index]
    if (explicitTypes_ && explicitTypes_.has(nextSupertype)) { continue }

    let nextAncestry = nextSupertype._buildRoughAncestry(explicitTypes)
    ancestry.push(...nextAncestry)
  }
  roughAncestry.push(this[RIND])
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
    const priorMembershipSelector = AsMembershipSelector(priorName)
    const newMembershipSelector   = AsMembershipSelector(newName)
    this.removeProperty(priorMembershipSelector)
    this.addProperty(newMembershipSelector, true)
    $Inate.addProperty(newMembershipSelector, false)
    this.name = name
    SetDisplayNames(this._blanker, name)
    return this
  }
  return this
})

Type.addMethod(function addProperty(selector, value) {
  return this._setSharedProperty(selector, value, true)
})

Type.addMethod(function removeProperty(selector) {
  return this._deleteSharedProperty(selectore)
})

Type.addMethod(function addAllMethods(methods) {
  let next = methods.length
  while (next--) { this.addMethod(methods[next]) }
  return this
})



Type.addMethod(function _init(spec, context_) {
  const name            = spec && spec.name
  const supertypes      =
    spec && (spec.supertypes || spec.supertype && [spec.supertype]) || [Thing]
  const methods         = spec && spec.instanceMethods || []
  const Blanker         = this._blanker
  const $root$inner     = Blanker.$root$inner
  const supers          = SpawnFrom(null)

  supers[$SUPERS]       = supers
  $root$inner[$SUPERS]  = supers
  // $root$inner[$COPY]    = Make$copy(Blanker)

  this._nextIID         = 0
  this._subtypes        = new Set()
  this.context          = context_ ? context_[RIND] : null

  this.addProperty("type", this[RIND])
  this.setId()
  this.setName(name)
  this.setSupertypes(supertypes)
  this.addMethod(_newBlank, () => new Blanker()[RIND])
  this.addAllMethods(methods)
  return this
})

$Inate$inner[$PULP]._init({name: "$Inate" , supertypes: []})
const Thing =        Type({name: "Thing"  , supertypes: []})
Method$inner[$PULP]._init({name: "Method" , supertypes: [Thing]})
Type$inner  [$PULP]._init({name: "Type"   , supertypes: [Thing]})

SetDisplayNames($InateBlanker, "$Outer", "$Inner")



// Frost(Base_root)
// // Frost(Stash_root)
// Frost(Implementation_root)
// Frost(Inner_root)


Type.addMethod(function addGetter(...namedFunc_name__handler) {
  return this.addMethod(...namedFunc_name__handler, GETTER)
})

Type.addMethod(function addLazyProperty(...namedFunc_name__handler) {
  return this.addMethod(...namedFunc_name__handler, LAZY_INSTALLER)
})


Method.addMethod(Method$root$inner._init)
Type.addMethod(Type$root$inner._setSharedProperty)
Thing.addMethod(Type$root$inner.setId)
Thing.addGetter(BasicId)




$Inate.addLazyProperty(function $() {
  return this[RIND]
})

$Inate.addLazyProperty(function _super() {
  return new Proxy(InterMap.get(this[RIND]), SuperPorosity)
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
  const $inner   = InterMap.get(this[RIND])
  const method   = AsMethod(method_namedFunc__name, func__, mode___)
  const selector = method.selector
  const methods  = $inner[OWN_METHODS]|| ($inner[OWN_METHODS] = SpawnFrom(null))
  const supers   = $inner[$SUPERS]    || ($inner[$SUPERS]     = SpawnFrom(null))
  SetMethod($inner, $inner[$OUTER], method)
  methods[selector] = method
  delete supers[selector]
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
