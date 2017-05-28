// "use strict"

// rind
//   porosity
//   outer
//
// inner
//   porosity
//   core
//     inner
//     outer
//     rind
//
// rind --> core

// rind
//   disguisedFunc
//   disguisedPrivacyPorosity
//     outer
//
// inner
//   disguisedFunc
//   disguisedMutablePorosity
//     core
//       disguised
//       inner
//       outer
//       rind
//
// rind --> core


function AsMethod(method_func__name, func__, mode___) {
  return (method_func__name.isMethod) ?
    method_func__name : Method(method_func__name, func__, mode___)
}



function SetMethod($inner, method) {
  const $outer       = $inner[$OUTER]
  const method$inner = InterMap.get(method)
  const selector     = method$inner.selector
  const mode         = method$inner.mode

  if (mode.isImmediate) {
    $inner[$IMMEDIATES][selector] = method$inner
    $inner[selector] = IMMEDIATE
    if (method$inner.isPublic) { $outer[selector] = IMMEDIATE }
  }
  else if (mode === SET_LOADER) {
    $inner[$SET_LOADERS][selector] = method$inner.handler
  }
  else {
    $inner[selector] = method$inner.inner
    if (method$inner.isPublic) { $outer[selector] = method$inner.outer }
  }
}


// Consider caching these!!!
function MakeAssignmentError(Property, Setter) {
  var $assignmentError = function () {
    SignalError(this[$RIND], `Assignment to ${Property} is not allowed, use ${Setter} instead!`)
  }
  return
}




function MakeNamelessVacuousFunction() {
  return function () {}
}


function MakeVacuousConstructor(name) {
  const funcBody = `
    return function ${name}() {
      const message = "This constructor is only used for naming!"
      return SignalError(${name}, message)
    }
  `
  const func = Function(funcBody)()
  Frost(func.prototype)
  return DefineProperty(func, "name", InvisibleConfiguration)
}



function NewBlankerFrom(superBlanker, blankerMaker) {
  const $root$inner = SpawnFrom(superBlanker.$root$inner)
  const $root$outer = SpawnFrom(superBlanker.$root$outer)
  const PairedOuter = MakeNamelessVacuousFunction()
  const Blanker     = blankerMaker(PairedOuter)
  const supers      = SpawnFrom(null)
  const immediates  = SpawnFrom(null)

  $root$inner[$OUTER]   = $root$outer
  PairedOuter.prototype = $root$outer
  Blanker.prototype     = $root$inner
  Blanker.$root$inner   = $root$inner
  Blanker.$root$pulp    = new Proxy($root$inner, Mutability)
  Blanker.$root$outer   = $root$outer

  supers[$IMMEDIATES]       = SpawnFrom(null)
  supers[$SUPERS]           = supers
  $root$inner[$SUPERS]      = supers
  $root$inner[$SET_LOADERS] = SpawnFrom(null)
  $root$inner[$IMMEDIATES]  = immediates
  $root$outer[$IMMEDIATES]  = immediates

  InterMap.set(Blanker, BLANKER_FUNC)
  return Frost(Blanker)
}

// NOT TESTED
function PreInitType(func, $inner, $outer, permeability) {
  const mutability = new TypeInner($inner)
  const $pulp      = new Proxy(func, mutability)
  mutability.$pulp = $pulp
  const porosity   = new TypeOuter($pulp, $outer, permeability)
  const $rind      = new Proxy(func, porosity)
  // const $rind           = new Proxy(NewAsFact, privacyPorosity)

  $inner[$INNER] = $inner
  $inner[$PULP]  = $pulp
  // this[$PULP]  = new Proxy(NewAsFact, mutability)
  $inner[$OUTER] = $outer
  $inner[$RIND]  = $rind
  $outer[$RIND]  = $rind
  InterMap.set($rind, $inner)
}


function MakeTypeInnerBlanker(PairedOuter) {
  return function (permeability, [name_spec]) {  // $Type // NewTypeBlanker
    const typeName = (typeof name_spec === "object") ?
      name_spec.name : name_spec
    const func = MakeVacuousConstructor(typeName || "UNNAMED")

    PreInitType(func, this, new PairedOuter(), permeability)
    this._disguisedFunc = func
    this._blanker       = NewBlankerFrom($InateBlanker, MakeInnerBlanker)
    this._properties    = SpawnFrom(null)
  }
}



function MakeInnerBlanker(PairedOuter) {
  return function (permeability) {
    const $outer = new PairedOuter()
    const $rind  = new Proxy($outer, permeability)

    this[$INNER]  = this
    this[$PULP]   = new Proxy(this, Mutability)
    this[$OUTER]  = $outer
    this[$RIND]   = $rind
    $outer[$RIND] = $rind
    InterMap.set($rind, this)
  }
}



function Make__newBlank(Blanker) {
  return function _newBlank() { return new Blanker()[$RIND] }
}

function AsMembershipSelector(name) {
  return `is${name[0].toUpperCase()}${name.slice(1)}`
}


function AsFunctionName(selector) {
  if (typeof selector !== "symbol") { return selector }
  let name = selector.toString()
  return name.slice(7, name.length - 1)
}


function ResetKnownProperties($pulp) {
  let properties = SpawnFrom(null)
  let selectors  = VisibleProperties($pulp[$INNER])
  let next       = selectors.length

  while (next--) {
    selector             = selectors[next]
    properties[selector] = selector
  }
  return ($pulp[KNOWN_PROPERTIES] = properties)
}

// const NewAsFact = function newAsFact(...args) {
//   let $inner = new this._blanker()
//   let $pulp  = $inner[$PULP]
//   $pulp._init(...args)
//   if ($inner._postCreation) {
//     const $pulp = $pulp._postCreation()
//     if ($pulp[IS_IMMUTABLE]) { return $pulp[$RIND] }
//   }
//   if ($pulp.id == null) { $pulp.beImmutable }
//   return $pulp[$RIND]
// }


function BeFrozenFunc(func, marker) {
  if (InterMap.get(func)) { return func }

  func[IS_IMMUTABLE] = true
  InterMap.set(func, marker)
  Frost(func.prototype)
  return Frost(func)
}


// Simpleton function
const ALWAYS_FALSE     = BeFrozenFunc(() => false                , SAFE_FUNC)
const ALWAYS_NULL      = BeFrozenFunc(() => null                 , SAFE_FUNC)
const ALWAYS_UNDEFINED = BeFrozenFunc(() => undefined            , SAFE_FUNC)
const ALWAYS_SELF      = BeFrozenFunc(function () { return this }, SAFE_FUNC)



/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
