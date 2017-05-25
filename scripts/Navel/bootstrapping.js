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
const   $InateBlanker = NewBlankerFrom($BaseBlanker , MakeInnerBlanker)
const     TypeBlanker = NewBlankerFrom($InateBlanker, MakeTypeInnerBlanker)


const Type$root$inner = TypeBlanker.$root$inner

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


const _basicSet = function _basicSet(propertyName, value) {
  InSetProperty(this[$INNER], propertyName, value, this)
  return this
}

Type$root$inner._basicSet = _basicSet

// Temporary bootstrapping #_init
Type$root$inner._init = function _bootstrap(iid, blanker_) {
  this.subtypes = new Set()
  this[$IID]    = iid
  if (blanker_) { this._blanker = blanker_ }
  // SetDisplayNames(blanker, name) // The following is not necessary but helpful for implementation debugging!!!
  return this[$PULP]
}


const _$Inate  = new TypeBlanker(["$Inate"])._init(0, $InateBlanker)
const _Thing   = new TypeBlanker(["Thing"] )._init(1)
const _Type    = new TypeBlanker(["Type"]  )._init(2, TypeBlanker)
const _Method  = new TypeBlanker(["Method"])._init(3)

const $Inate  = _$Inate[$RIND]
const Thing   = _Thing [$RIND]
const Method  = _Method[$RIND]
const Type    = _Type  [$RIND]


// // Just in case sanity failsafe to prevent infinite recursion from DefaultInnerBehavior
// $InateBlanker.$root$inner[$PULP]  = $InateBlanker.$root$inner
//


const $Inate$root$inner = $InateBlanker.$root$inner
const $Inate$root$pulp  = $InateBlanker.$root$pulp


// Stubs for default properties
$Inate$root$inner[$BARRIER]         = undefined
$Inate$root$inner[$IID]             = undefined

$Inate$root$inner._noSuchProperty   = undefined

// This secret is only known by inner objects
$Inate$root$inner[$SECRET]          = $INNER

$Inate$root$pulp.id                 = undefined
$Inate$root$pulp.splice             = undefined // Weird ref by debugger
// Perhaps remove these later
$Inate$root$pulp.beImmutable        = undefined
$Inate$root$inner._postCreation     = undefined


const $Inate_properties = _$Inate._properties

$Inate_properties._noSuchProperty   = undefined
$Inate_properties.id                = undefined
$Inate_properties.splice            = undefined // Weird ref by debugger
// Perhaps remove these later
$Inate_properties.beImmutable       = undefined
$Inate_properties._postCreation     = undefined



const MethodBlanker     = _Method._blanker
const Method$root$inner = MethodBlanker.$root$inner
const Method$root$pulp  = MethodBlanker.$root$pulp

Method$root$pulp.isMethod           = true

Method$root$inner._init = function _init(func_name, func_, mode__) {
  let [selector, handler, mode = STANDARD_METHOD] =
    (typeof func_name === "function") ?
      [func_name.name, func_name, func_] : [func_name, func_, mode__]
  let isPublic = (selector[0] !== "_")

  this.isPublic = isPublic
  this.selector = selector
  this.mode     = mode
  this.handler  = BeFrozenFunc(handler)
  // this.super --> is a lazy property
  this.inner = mode.inner[isPublic](selector, handler)
  if (isPublic) { this.outer = mode.outer(selector, handler) }
  return this
}



const AddMethod = function addMethod(method_namedFunc__name, func__, mode___) {
  const method = AsMethod(method_namedFunc__name, func__, mode___)
  return this._setSharedProperty(method.selector, method, true)
}



AddMethod.call(_Type, AddMethod)

_Method.addMethod(Method$root$inner._init)
_Type.addMethod(Type$root$inner._setSharedProperty)
_Type.addMethod("new", Type$root$inner.new, SPECIAL_METHOD)
_Type.addMethod(Type$root$inner.newAsFact, SPECIAL_METHOD)


_Type.addMethod(function addGetter(...namedFunc_name__handler) {
  return this.addMethod(...namedFunc_name__handler, STANDARD_GETTER)
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

  const $root$inner = this._blanker.$root$inner

  for (let selector in $root$inner) {
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




_Type.addMethod(function addSetLoader(propertyName, loader) {
  if (typeof loader === "string") {
    let setterName = loader
    return this.addMethod(setterName, AsBasicSetter(propertyName, setterName))
  }

  let setterName = loader.name
  if (setterName) {
    this.addMethod(setterName, AsLoaderSetter(propertyName, setterName, loader))
  }
  return this.addMethod(propertyName, loader, SET_LOADER)
})



_Type.addSetLoader("supertypes", function setSupertypes(supertypes) {
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



_Type.addSetLoader("name", function setName(newName) {
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





_Type.addMethod(function _make$copy(blanker) {
  // blanker.$root$inner[$COPY] =   Make$copy(blanker)
})


_Type.addMethod(function _init(spec, context_) {
  const name       = spec && spec.name
  const supertypes =
    spec && (spec.supertypes || spec.supertype && [spec.supertype]) || [Thing]
  const methods    = spec && spec.instanceMethods || []
  const blanker    = this._blanker
  const newBlanker = Make__newBlank(blanker)
  // $root$inner[$COPY]    = Make_$copy(Blanker)
  //
  // blanker.$root$outer.constructor = this._disguisedFunc
  // blanker.$root$inner.constructor = MakeVacuousConstructor()
  // this._properties.constructor    = CONSTRUCTOR

  this._iidCount  = 0
  this.subtypes   = new Set()
  this.context    = context_ ? context_[$RIND] : null
  this.name       = name
  this.supertypes = supertypes

  this.addSharedProperty("type", this[$RIND])
  this.addMethod(newBlanker)
  this.addAllMethods(methods)
  return this
})



_Type._init({name: "Type", supertypes: []})

Type$root$inner._basicSet = _basicSet

_$Inate._init({name: "$Inate", supertypes: []})
_$Inate._setDisplayNames("$Outer", "$Inner") // Helps with debugging!!!

_$Inate.addLazyProperty(function $() {
  return this[$RIND]
})

_$Inate.addLazyProperty(function _super() {
  return new Proxy(this[$INNER], SuperPorosity)
})

_Thing._init({name: "Thing" , supertypes: []})
_Method._init({name: "Method"})

_Thing.addMethod(_basicSet)
_Type.setSupertypes([Thing])




// Frost(Base_root)
// // Frost(Stash_root)
// Frost(Implementation_root)
// Frost(Inner_root)




//  Make earlier methods immutable!!!





/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
