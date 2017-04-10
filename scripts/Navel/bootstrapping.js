// "use strict"

const InterMap = new WeakMap()



// UNTESTED
const DefaultOuterBehavior = {
  __proto__ : null,

  get (base$root, selector, $outer) {
    const $inner = InterMap.get($outer[RIND])
    if (selector[0] === "_") {
      if ($inner._externalPrivateAccess) {
        return $inner[$FLESH]._externalPrivateAccess(selector)
      }
    }
    return $inner._noSuchProperty ?
      $inner[$FLESH]._noSuchProperty(selector) : undefined
  },
  // getPrototypeOf (base$root) { return base$root }
}

const DefaultCoreBehavior = {
  __proto__ : null,

  get (base$root, selector, $inner) {
    return $inner._noSuchProperty ?
      $inner[$FLESH]._noSuchProperty(selector) : undefined
  },

  // getPrototypeOf (base$root) { return base$root }
}




const Base$root         = SpawnFrom(null)
// const   Stash$root      = SpawnFrom(Base$root)
const   Base$root$outer = new Proxy(Base$root, DefaultOuterBehavior)
const   Base$root$inner  = new Proxy(Base$root, DefaultCoreBehavior)


const $BaseBlanker = {$root$outer: Base$root$outer, $root$inner: Base$root$inner}
const   $InateBlanker   = NewBlankerFrom($BaseBlanker , MakeCoreBlanker)
const     MethodBlanker = NewBlankerFrom($InateBlanker, MakeCoreBlanker)
const     TypeBlanker   = NewBlankerFrom($InateBlanker, MakeTypeCoreBlanker)

const $Inate$root$inner = $InateBlanker.$root$inner
const Method$root$inner = MethodBlanker.$root$inner
const Type$root$inner   = TypeBlanker.$root$inner
// // Just in case sanity failsafe to prevent infinite recursion from CoreBaseBehavior
// $InateBlanker.$root$inner[$FLESH]  = $InateBlanker.$root$inner
//

// This secret is only known by inner objects
$Inate$root$inner[$INNER_POROSITY]  = undefined
$Inate$root$inner[$KNOWN_SELECTORS] = undefined
$Inate$root$inner._noSuchProperty   = undefined
$InateBlanker.$root$flesh.id       = undefined
$InateBlanker.$root$flesh.atIndex  = undefined
$InateBlanker.$root$flesh.splice   = undefined // Weird ref by debugger


// Bootstrap #_init
InPutMethod(Type$root$inner, function _init(name, blanker) {
  this.name = name
  this._blanker = blanker
  this._subtypes = new Set()
  this._properties = SpawnFrom(null)
  SetDisplayNames(blanker, name) // Not necessary but helpful for debugging
  return this
})


const $Inate$inner  = (new TypeBlanker())._init("$Inate" , $InateBlanker )
const Method$inner  = (new TypeBlanker())._init("Method" , MethodBlanker )
const Type$inner    = (new TypeBlanker())._init("Type"   , TypeBlanker   )

const $Inate  = $Inate$inner[RIND]
const Method  = Method$inner[RIND]
const Type    = Type$inner  [RIND]

Type$root$inner._propagateIntoSubtypes = ALWAYS_SELF


InPutMethod(Method$root$inner, function _init(func_name, func_, mode__) {
  const [selector, handler, mode] = (typeof func_name === "function") ?
    [func_name.name, func_name, func_] : [func_name, func_, mode__]

  this.selector = selector
  this.handler  = AsSafeFunction(handler)
  this.mode     = mode || STANDARD
  this.isPublic = (selector[0] !== "_")
})


InPutMethod(Type$root$inner, function _propagateIntoSubtypes(value, selector_) {
  let [selector, isMethod] = selector_ ?
    [selector_, false] : [value.selector, true]
  let subtypes =

  this._subtypes.forEach(function (subtype) {
    let _subtype = InterMap.get(subtype)
    let properties = _subtype._properties

    if (!properties[selector]) {
      if (isMethod) { InSetMethod(this, value) }
      else { InSetProperty(this, selector, value) }
      _subtype._propagateIntoSubtypes(value, selector_)
    }
  })
})

function addMethod(method_func__name, func__, mode___) {
  const method = AsMethod(method_func__name, func__, mode___)
  InSetMethod(this, method)
  this._properties[method.selector] = method
  return this._propagateIntoSubtypes(method)
}


addMethod.call(Type$inner, addMethod)



Type$inner.addMethod(function _inheritPropertiesFrom(_supertypes) {
  const existing = this._properties

  for (let next = 0, count = _supertypes.length; next < count; next++) {
    let _supertype = _supertypes[next]
    let properties = _supertype._properties

    for (let selector in properties) {
      if (!existing[selector]) {
        let value = properties[selector]

        if (value !== PROPERTY) { InSetMethod(this, value) }
        else { InSetProperty(this, selector, _supertype[selector]) }
      }
    }
  }
})

Type$inner.addMethod(function setSupertypes(supertypes) {
  // LOOK: add logic to invalidate connected types if supertypes changes!!!
  const _supertypes = []
  let   next = supertypes.length

  while (next--) {
    let _supertype = InterMap.get(supertypes[next])

    _supertype._subtypes.add(this[RIND])
    _supertypes.push(_supertype)
  }
  this._supertypes = supertypes  // change this to be this.supertypes
  this._ancestors = MakeAncestors(_supertypes)
  this._inheritPropertiesFrom(_supertypes)
  return this
})

Type$inner.addMethod(function _make$copy(blanker) {
  // blanker.$root$inner[$COPY] =   Make$copy(blanker)
})

Type$inner.addMethod(function setId() {
  return this
})

Type$inner.addMethod(function setName(name) {
  this.name = name
  return this
})

Type$inner.addMethod(function addProperty(selector, value) {
  InSetProperty(this, selector, value)
  this._properties[selector] = PROPERTY
  return this._propagateIntoSubtypes(value, selector)
})

Type$inner.addMethod(function addAllMethods(methods) {
  let next = methods.length
  while (next--) { this.addMethod(methods[next]) }
  return this
})


Type$inner.addMethod(function _init(spec, context_) {
  const name            = spec && spec.name
  const supertypes      =
    spec && (spec.supertypes || spec.supertype && [spec.supertype]) || [Thing]
  const methods         = spec && spec.instanceMethods || []
  const blanker         = this._blanker

  // blanker.$root$flesh[KIND] = name
  SetDisplayNames(blanker, name)

  this._nextIID         = 0
  this._subtypes        = new Set()
  this._properties      = SpawnFrom(null)
  this.context          = context_ ? context_[RIND] : null

  this.addMethod("_newBlank", () => new blanker()[RIND]) //
  this._make$copy(blanker) //
  this.setId()
  this.setName(name)
  this.setSupertypes(supertypes)
  this.addProperty("type", this[RIND])
  this.addAllMethods(methods)
  return this
})

const typeProperties = Type$inner._properties

$Inate$inner [$FLESH]._init({name: "$Inate" , supertypes: []})
const Thing =          Type({name: "Thing"  , supertypes: []})
Method$inner [$FLESH]._init({name: "Method" , supertypes: [Thing]})
Type$inner   [$FLESH]._init({name: "Type"   , supertypes: [Thing]})

SetDisplayNames($InateBlanker, "$Outer", "$Inner")

Method$inner.addMethod(Method$root$inner._init)
Type$inner._inheritPropertiesFrom([{_properties : typeProperties}])



// Frost(Base_root)
// // Frost(Stash_root)
// Frost(Implementation_root)
// Frost(Inner_root)









/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
