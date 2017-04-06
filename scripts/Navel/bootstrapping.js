// "use strict"

const InterMap = new WeakMap()



// UNTESTED
const DefaultOuterBehavior = {
  __proto__ : null,

  get (base$root, selector, $plup) {
    const $core = InterMap.get($plup[RIND])
    if (selector[0] === "_") {
      if ($core._externalPrivateAccess) {
        return $core[$TWIN]._externalPrivateAccess(selector)
      }
    }
    return $core._noSuchProperty ?
      $core[$TWIN]._noSuchProperty(selector) : undefined
  },
  // getPrototypeOf (base$root) { return base$root }
}

const DefaultCoreBehavior = {
  __proto__ : null,

  get (base$root, selector, $core) {
    return $core._noSuchProperty ?
      $core[$TWIN]._noSuchProperty(selector) : undefined
  },

  // getPrototypeOf (base$root) { return base$root }
}


function Make$copy() {}


const Base$root         = SpawnFrom(null)
// const   Stash$root      = SpawnFrom(Base$root)
const   Base$root$plup = new Proxy(Base$root, DefaultOuterBehavior)
const   Base$root$core  = new Proxy(Base$root, DefaultCoreBehavior)


const $BaseBlanker = {$root$plup: Base$root$plup, $root$core: Base$root$core}
const   $InateBlanker   = NewBlankerFrom($BaseBlanker , MakeCoreBlanker)
const     MethodBlanker = NewBlankerFrom($InateBlanker, MakeCoreBlanker)
const     TypeBlanker   = NewBlankerFrom($InateBlanker, MakeTypeCoreBlanker)

const $Inate$root$core = $InateBlanker.$root$core
const Method$root$core = MethodBlanker.$root$core
const Type$root$core   = TypeBlanker.$root$core
// // Just in case sanity failsafe to prevent infinite recursion from CoreBaseBehavior
// $InateBlanker.$root$core[$TWIN]  = $InateBlanker.$root$core
//

// This secret is only known by inner objects
$Inate$root$core[$SECRET]          = $TWIN
$Inate$root$core[$INNER_POROSITY]  = undefined
$Inate$root$core[$KNOWN_SELECTORS] = undefined
$Inate$root$core._noSuchProperty   = undefined
$InateBlanker.$root$twin.id       = undefined
$InateBlanker.$root$twin.atIndex  = undefined
$InateBlanker.$root$twin.splice   = undefined // Weird ref by debugger



InPutMethod(Method$root$core, function _init(func_name, func_, mode__) {
  const [selector, handler, mode] = (typeof func_name === "function") ?
    [func_name.name, func_name, func_] : [func_name, func_, mode__]

  this.selector = selector
  this.handler  = AsSafeFunction(handler)
  this.mode     = mode || STANDARD
  this.isPublic = (selector[0] !== "_")
})

// Bootstrap #_init
InPutMethod(Type$root$core, function _init(name, blanker) {
  this.name = name
  this._blanker = blanker
  this._ancestors = []
  // this._subtypes = new Set()
  this._properties = SpawnFrom(null)
  // blanker.$root$twin[KIND] = name
  SetDisplayNames(blanker, name)
  return this
})


const $Inate$core  = (new TypeBlanker())._init("$Inate" , $InateBlanker )
const Method$core  = (new TypeBlanker())._init("Method" , MethodBlanker )
const Type$core    = (new TypeBlanker())._init("Type"   , TypeBlanker   )

const $Inate  = $Inate$core[RIND]
const Method  = Method$core[RIND]
const Type    = Type$core  [RIND]

SetDisplayNames($InateBlanker, "$Outer", "$Inner")


Type$root$core._updateMethodInSubtypes = ALWAYS_NULL


function addMethod(method_func__name, func__, mode___) {
  const method        = AsMethod(method_func__name, func__, mode___)
  const mode          = method.mode
  const selector      = method.selector
  const handler       = method.handler
  const isPublic      = method.isPublic
  const blanker       = this._blanker
  const $root$plup   = blanker.$root$plup
  const $root$core    = blanker.$root$core
  const doRecord      = (mode___ !== DONT_RECORD)

  if (mode === STANDARD) {
    if (isPublic) {
      $root$plup[selector] = PublicHandlerFor(selector)
    }
    $root$core[selector] = handler
  }
  else {
    const getHandler = (mode === GETTER) ? handler : MakeLazyLoader(handler)
    if (isPublic) {
      _AddGetter($root$plup, selector, true, PublicHandlerFor(selector, true))
    }
    _AddGetter($root$core, selector, true, getHandler)
  }

  if (doRecord) {
    this._properties[selector] = method
    this._updateMethodInSubtypes(method)
  }
  return this
}


addMethod.call(Type$core, addMethod)


Type$core.addMethod(function _init(spec, context_) {
  const name            = spec && spec.name
  const supertypes      =
    spec && (spec.supertypes || spec.supertype && [spec.supertype]) || [Thing]
  const methods         = spec && spec.instanceMethods || []
  const blanker         = this._blanker

  // blanker.$root$twin[KIND] = name
  SetDisplayNames(blanker, name)

  this._nextIID         = 0
  this._subtypes        = new Set()
  this._properties      = SpawnFrom(null)
  this.context          = context_ ? context_[RIND] : null

  this.addMethod("_newBlank", () => new blanker()[RIND])
  this._make$copy(blanker)
  this.setId()
  this.setName(name)
  this.setSupertypes(supertypes)
  this.addProperty("type", this[RIND])
  this.addAllMethods(methods)
  return this
})

Type$core.addMethod(function _make$copy(blanker) {
  // blanker.$root$core[$COPY] =   Make$copy(blanker)
})

Type$core.addMethod(function setId() {

})

Type$core.addMethod(function setName(name) {
  this.name = name
})

Type$core.addMethod(function setSupertypes(supertypes) {
  // LOOK: add logic to invalidate connected types if supertypes changes!!!
  const supertypes$cores = []
  let   next = supertypes.length

  while (next--) {
    $supertype$core = InterMap.get(supertypes[next])
    $supertype$core._subtypes.add(this[RIND])
    supertypes$cores.push($supertype$core)
  }
  this._supertypes = supertypes  // change this to be this.supertypes
  this._ancestors = MakeAncestors(supertypes$cores)
})

Type$core.addMethod(function _updatePropertyInSubtypes(selector, value) {

})

Type$core.addMethod(function addProperty(selector, value) {
  this._blanker.$root$twin[selector] = value
  this._properties[selector] = PROPERTY
  return this._updatePropertyInSubtypes(selector, value)
})

Type$core.addMethod(function addAllMethods(methods) {
  let next = methods.length
  while (next--) { this.addMethod(methods[next]) }
  return this
})



const Thing = Type({name: "Thing", supertypes: []})

$Inate$core [$TWIN]._init({name: "$Inate" , supertypes: []})
Method$core [$TWIN]._init({name: "Method" })
Type$core   [$TWIN]._init({name: "Type"   })

SetDisplayNames($InateBlanker, "$Outer", "$Inner")

Method$core .addMethod(Method$root$core._init)
Type$core   .addMethod(Type$root$core._init)
Type$core   .addMethod(Type$root$core._updatePropertyInSubtypes)
Type$core   .addMethod(Type$root$core._make$copy)
Type$core   .addMethod(Type$root$core.addMethod)
Type$core   .addMethod(Type$root$core.setId)
Type$core   .addMethod(Type$root$core.setName)
Type$core   .addMethod(Type$root$core.setSupertypes)
Type$core   .addMethod(Type$root$core.addProperty)
Type$core   .addMethod(Type$root$core.addAllMethods)






// Frost(Base_root)
// // Frost(Stash_root)
// Frost(Implementation_root)
// Frost(Inner_root)









/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
