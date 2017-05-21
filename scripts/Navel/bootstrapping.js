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
const     ThingBlanker  = NewBlankerFrom($InateBlanker, MakeInnerBlanker)
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
Type$root$inner._init = function _bootstrap(name, blanker) {
  this._blanker = blanker
  this.subtypes = new Set()
  // SetDisplayNames(blanker, name) // The following is not necessary but helpful for implementation debugging!!!
  return this
}


const $Inate$inner  = new TypeBlanker(["$Inate"])
const Thing$inner   = new TypeBlanker(["Thing"])
const Method$inner  = new TypeBlanker(["Method"])
const Type$inner    = new TypeBlanker(["Type"])

const $Inate$pulp   = $Inate$inner[$PULP]

// const $Inate  = $Inate$inner._bootstrap("$Inate", $InateBlanker )[$RIND]
const Method  = Method$inner._init("Method", MethodBlanker )[$RIND]
const Type    = Type$inner  ._init("Type"  , TypeBlanker   )[$RIND]

// Stubs for default properties
$Inate$root$inner[$BARRIER]         = undefined
$Inate$root$inner[$IID]             = undefined

$Inate$root$inner._noSuchProperty   = undefined
$Inate$root$inner._postCreation     = undefined

// This secret is only known by inner objects
$Inate$root$inner[$SECRET]          = $INNER

$Inate$root$pulp.beImmutable        = undefined
$Inate$root$pulp.id                 = undefined
$Inate$root$pulp.splice             = undefined // Weird ref by debugger


const $Inate_properties = $Inate$inner._properties

$Inate_properties.beImmutable       = undefined
$Inate_properties._noSuchProperty   = undefined
$Inate_properties._postCreation     = undefined
$Inate_properties.id                = undefined
$Inate_properties.splice            = undefined // Weird ref by debugger


Method$root$pulp.isMethod           = true


Method$root$inner._init = function _init(func_name, func_, mode__) {
  let [selector, handler, mode] = (typeof func_name === "function") ?
    [func_name.name, func_name, func_] : [func_name, func_, mode__]
  let isPublic    = (selector[0] !== "_")

  this.isPublic      = isPublic
  this.selector      = selector
  this.mode          = mode || STANDARD
  this._handler      = BeFrozenFunc(handler)
  if (mode.isLazy)   { handler = MakeLazyLoader(selector, handler) }
  this.handler       = handler

  if (isPublic) {
    const porosity      = mode.porosity
    const publicHandler = new Proxy(handler, porosity)
    InterMap.set(publicHandler, SAFE_FUNCTION)
    this.publicHandler  = publicHandler
  }
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

Type$root$inner.new = function $new(...args) {
  let instance$inner = new this._blanker(args)
  let instance$pulp  = instance$inner[$PULP]
  instance$pulp._init(...args)
  if (instance$inner._postCreation) {
    const result = instance$pulp._postCreation()[$RIND]
    if (result !== undefined && result !== instance$pulp) { return result }
  }
  return instance$inner[$RIND]
}

Type$root$inner.newAsFact = function newAsFact(...args) {
  let instance = this.new(...args)
  if (instance.id == null) { instance.beImmutable }
  return instance
}

const AddMethod = function addMethod(method_namedFunc__name, func__, mode___) {
  const method = AsMethod(method_namedFunc__name, func__, mode___)
  return this._setSharedProperty(method.selector, method, true)
}



AddMethod.call(Type$inner, AddMethod)

Method.addMethod(Method$root$inner._init)
Type.addMethod(Type$root$inner._setSharedProperty)
Type.addMethod("new", Type$root$inner.new, RELAXED_STANDARD)
Type.addMethod(Type$root$inner.newAsFact, RELAXED_STANDARD)


Type.addMethod(function addGetter(...namedFunc_name__handler) {
  return this.addMethod(...namedFunc_name__handler, GETTER)
})

Type.addMethod(function addLazyProperty(...namedFunc_name__handler) {
  return this.addMethod(...namedFunc_name__handler, LAZY_INSTALLER)
})

Type.addMethod(function addSharedProperty(selector, value) {
  return this._setSharedProperty(selector, value, true)
})

Type.addMethod(function removeSharedProperty(selector) {
  return (selector in this._properties) ?
    this._deleteSharedProperty(selector) : this
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
  delete $root$inner[$IMMEDIATES][selector]
  delete supers[selector]
  delete supers[$IMMEDIATES][selector]
  return this._inheritProperty(selector)
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
Type.addMethod(function _reinheritProperties() {
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


addSetLoader
_basicSet(selector, value)


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
      this.removeSharedProperty(priorMembershipSelector)
    }
    const newMembershipSelector = AsMembershipSelector(newName)
    this.addSharedProperty(newMembershipSelector, true)
    $Inate.addSharedProperty(newMembershipSelector, false)
    this.membershipSelector = newMembershipSelector
    this.name = newName
    this._setDisplayNames(newName)
  }
  return this
})

Type.addMethod(function _setDisplayNames(outerName, innerName_) {
  const innerName = innerName_ || ("_" + outerName)
  const blanker   = this._blanker
  this._properties.constructor    = CONSTRUCTOR
  blanker.$root$outer.constructor = MakeVacuousConstructor(outerName)
  blanker.$root$inner.constructor = MakeVacuousConstructor(innerName)
  return blanker
})



function Make_newBlank(Blanker) {
  return function _newBlank() { return new Blanker()[$RIND] }
}


Type.addGetter(function _nextIID() {
  return ++this._iidCount
})

Type.addLazyProperty(function id() {
  return this.oid
})

// Type.addMethod(function _resetId(newId_) {
//   // delete this[$PRIOR_IDS]
//   this.id = (newId_ !== undefined) ? newId : this.oid
// })


type.addMethod(function addPropertyLoader() {

})

Type.addMethod(function _init(spec, context_) {
  const name       = spec && spec.name
  const supertypes =
    spec && (spec.supertypes || spec.supertype && [spec.supertype]) || [Thing]
  const methods    = spec && spec.instanceMethods || []
  const newBlanker = Make_newBlank(this._blanker)
  // $root$inner[$COPY]    = Make$copy(Blanker)

  this._iidCount = 0
  this.subtypes  = new Set()
  this.context   = context_ ? context_[$RIND] : null

  this.addSharedProperty("type", this[$RIND])
  this.setName(name)
  this.setSupertypes(supertypes)
  this.addMethod(newBlanker)
  this.addAllMethods(methods)
  return this
})

// Type.addMethod(function _setCopyId() {
//   return this._setId(this.oid)
// })


// Type.addMethod(function _postCreation(beImmutable_) {
//   this.id = this.oid
//   return this
// })

// MAKE TYPE ID LAZY!!!




Type$inner[$PULP]._init({name: "Type", supertypes: []})

$Inate$pulp[$IID] = "0"
$Inate$pulp._init({name: "$Inate", supertypes: []})
$Inate$pulp._setDisplayNames("$Outer", "$Inner") // Helps with debugging!!!



Thing$inner[$PULP]._init({name: "Thing" , supertypes: []})
// const Thing =

Method$inner[$PULP]._init({name: "Method"})
Type.setSupertypes([Thing])


Thing.addGetter(function iid() {
  let iid = this[$IID]
  if (iid !== undefined) { return iid }
  // This will set the $iid, even of an immutable thing
  return (this[$INNER][$IID] = InterMap.get(this.type)._nextIID)
})

Thing._basicSet() // DEFINE!!!

//  Make earlier methods immutable!!!


Thing.addGetter(function oid() {
  const type = this.type
  const context = type.context
  const prefix = context ? context.id + "@" : ""
  return `${prefix}${type.name}#${this.iid}`
  // `${type.name}<${NewUniqueId()}>`
})


Thing.addMethod(function _setId(newId_) {
  const existingId = this.id

  if (newId_ === undefined) {
    if (existingId !== undefined) { return this }
    this.id = this.oid
  }
  else if (newId_ === existingId) { return this }
  else { this.id = newId_ }

  // if (existingId !== undefined) {
  //   let priorIds = this[$PRIOR_IDS] || (this[$PRIOR_IDS] = [])
  //   priorIds[priorIds.length] = existingId
  // }
  return this
})

// Move to the safer version of the RelaxedMethodPorosity after mutable copy methods defined

// mutableCopyExcept
// mutableCopy
// asMutable
// asMutableCopy




// Frost(Base_root)
// // Frost(Stash_root)
// Frost(Implementation_root)
// Frost(Inner_root)

// methodAt

// Type.moveMethodTo("", target)

Thing.addMethod(Type$inner._properties._setId)
Thing.addMethod(Type$inner._properties.oid)
Thing.addMethod(Type$inner._properties.iid)
Type.removeSharedProperty("_setId")
Type.removeSharedProperty("oid")
Type.removeSharedProperty("iid")

// _setCopyId()


$Inate.addLazyProperty(function $() {
  return this[$RIND]
})

$Inate.addLazyProperty(function _super() {
  return new Proxy(this[$INNER], SuperPorosity)
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

Method.addSharedProperty("STANDARD"      , STANDARD      )
Method.addSharedProperty("GETTER"        , GETTER        )
Method.addSharedProperty("LAZY"          , LAZY_INSTALLER)
Method.addSharedProperty("LAZY_INSTALLER", LAZY_INSTALLER)


Thing.addMethod(function _setName(name) {
  this.name = name
})

Thing.addMethod("_hasOwn", HasOwnProperty) // remove this???


// set(setSupertypes)
//
// on
//
// onSet("name", function (newName)) {
//
//   return newName
// })
//
// addSetter()

Thing.addMethod(function _init(spec_) {
  if (spec_) {
    var id   = spec_.id
    var name = spec_.name
  }
  name && (this.name = name)
  id   && (this.id   = id)
  return this
})

Thing.addMethod(function addOwnMethod(method_namedFunc__name, func__, mode___) {
  const $inner   = this[$INNER]
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


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
