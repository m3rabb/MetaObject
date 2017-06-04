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
  const $outer   = $inner[$OUTER]
  const $method  = InterMap.get(method)
  const selector = $method.name
  const mode     = $method.mode

  if (mode === SET_LOADER) {
    $inner[$SET_LOADERS][selector] = $method.handler
  }
  else if (mode.isImmediate) {
    $inner[$IMMEDIATES][selector] = $method
    $inner[selector] = IMMEDIATE
    if ($method.isPublic) { $outer[selector] = IMMEDIATE }
  }
  else {
    $inner[selector] = $method.inner
    if ($method.isPublic) { $outer[selector] = $method.outer }
  }
}


// Consider caching these!!!
function MakeAssignmentError(Property, Setter) {
  return function $assignmentError(_target) {
    DisallowedAssignmentError(_target[$RIND], Property, Setter)
  }
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



function NewBlanker(spec = EMPTY_OBJECT) {
  const superBlanker = spec.super || $InateBlanker
  const blankerMaker = spec.maker || superBlanker.maker
  const permeability = spec.permeability || Impermeable
  const $root$inner  = SpawnFrom(superBlanker.$root$inner)
  const $root$outer  = SpawnFrom(superBlanker.$root$outer)
  const PairedOuter  = MakeNamelessVacuousFunction()
  const Blanker      = blankerMaker(PairedOuter, permeability)
  const supers       = SpawnFrom(spec.base ? null : $root$inner[$SUPERS])
  const immediates   = SpawnFrom(spec.base ? null : $root$inner[$IMMEDIATES])

  $root$inner[$OUTER]   = $root$outer
  PairedOuter.prototype = $root$outer
  Blanker.prototype     = $root$inner
  Blanker.$root$inner   = $root$inner
  Blanker.$root$pulp    = new Proxy($root$inner, Mutability)
  Blanker.$root$outer   = $root$outer
  Blanker.maker         = blankerMaker
  Blanker.permeability  = permeability

  supers[$IMMEDIATES]       = SpawnFrom(null)
  supers[$SUPERS]           = supers
  $root$inner[$SUPERS]      = supers
  $root$inner[$SET_LOADERS] = SpawnFrom(null)
  $root$inner[$BLANKER]     = Blanker
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

  $inner._disguisedFunc = func
  $inner[$INNER] = $inner
  $inner[$OUTER] = $outer
  $inner[$RIND]  = $rind
  $outer[$RIND]  = $rind
  InterMap.set($rind, $inner)
  // this[$PULP]  = new Proxy(NewAsFact, mutability)
  return ($inner[$PULP] = $pulp)
}


function MakeTypeInnerBlanker(PairedOuter, Permeability) {
  return function ([name_spec]) {  // $Type // NewTypeBlanker
    const typeName = (typeof name_spec === "object") ?
      name_spec.name : name_spec
    const func = MakeVacuousConstructor(typeName || "UNNAMED")
    const $outer = new PairedOuter()

    PreInitType(func, this, $outer, Permeability)

    this._properties = SpawnFrom(null)
    this._blanker    = NewBlanker()
  }
}

function MakeInnerBlanker(PairedOuter, Permeability) {
  return function () {
    const $outer = new PairedOuter()
    const $rind  = new Proxy($outer, Permeability)

    this[$INNER]  = this
    this[$PULP]   = new Proxy(this, Mutability)
    this[$OUTER]  = $outer
    this[$RIND]   = $rind
    $outer[$RIND] = $rind
    InterMap.set($rind, this)
  }
}



function AsMembershipSelector(name) {
  return `is${name[0].toUpperCase()}${name.slice(1)}`
}

function AsCapitalized(word) {
  return `${word[0].toUpperCase()}${word.slice(1)}`
}

function AsName(string_symbol) {
  if (typeof string_symbol === "string") { return string_symbol }
  const name = string_symbol.toString()
  return name.slice(7, name.length - 1)
}

function AsPropertyNameFromSetterName(name) {
  const match = name.match(/^[_$]*set([A-Z])(.*$)/)
  return `${match[1].toLowerCase()}${match[2]}`
}



function AsPropertySetterLoaderHandler(setter_loader__property, setter_loader_) {
  var propertyName, setterName, loader, setter

  if (setter_loader_) {
    propertyName = setter_loader__property

    if (typeof setter_loader_ === "string") {
      setterName = setter_loader_
      setter     = AsBasicSetter(propertyName, setterName)
    }
    else {
      loader     = setter_loader_
      setterName = loader.name
      setter     = AsLoaderSetter(propertyName, loader)
    }
  }
  else {
    if (typeof setter_loader__property === "string") {
      setterName = setter_loader__property
    }
    else {
      loader     = setter_loader__property
      setterName = loader.name
    }
    propertyName = AsPropertyNameFromSetterName(setterName)
    setter       = AsLoaderSetter(propertyName, loader)
  }
  return [propertyName, setterName, loader, setter]
}




// function ResetKnownProperties($pulp) {
//   let $inner     = $pulp[$INNER]
//   let properties = SpawnFrom(null)
//   let names      = VisibleProperties($inner)
//   let next       = selectors.length
//
//   while (next--) {
//     let name         = names[next]
//     properties[name] = name
//   }
//
//   properties[IS_IMMUTABLE] = true
//   return ($inner[$KNOWN_PROPERTIES] = Frost(properties))
// }

function SetKnownProperties(target, setOuter_) {
  const properties = VisibleProperties(target)
  properties[IS_IMMUTABLE] = true
  if (setOuter_) { target[$OUTER][KNOWN_PROPERTIES] = properties }
  return (target[KNOWN_PROPERTIES] = Frost(properties))
}



// const NewAsFact = function newAsFact(...args) {
//   let $inner = new this._blanker()
//   let $pulp  = $inner[$PULP]
//   $pulp._init(...args)
//   if ($inner._postInit) {
//     const $pulp = $pulp._postInit()
//     if ($pulp[IS_IMMUTABLE]) { return $pulp[$RIND] }
//   }
//   if ($pulp.id == null) { $pulp.beImmutable }
//   return $pulp[$RIND]
// }




// function CopyLog() {
//   const Visited = new Map()
//
//   this.pairing = (target, match) => Visited.set(target, match), this
//   this.pair    = (target) => Visited.get(target)
// }

// function NewVisitLog() {
//   const Visited = new Map()
//
//   return function $visitLog(target, match_) {
//     return (match_) ? (Visited.set(target, match_), null) : Visited.get(target)
//   }
// }










function SetImmutable(target) {
  target[IS_IMMUTABLE] = true
  return Frost(target)
}


function SetImmutableFunc(func, marker = SAFE_FUNC) {
  if (InterMap.get(func)) { return func }

  func[IS_IMMUTABLE] = true
  InterMap.set(func, marker)
  Frost(func.prototype)
  return Frost(func)
}

function MarkFunc(func, marker) {
  if (InterMap.get(func)) { return func }
  InterMap.set(func, marker)
  return func
}


const SAFE_FUNC          = Frost({id: "SAFE_FUNC"      , [IS_IMMUTABLE] : true})
const BLANKER_FUNC       = Frost({id: "BLANKER_FUNC"   , [IS_IMMUTABLE] : true})
const TAMED_FUNC         = Frost({id: "TAMED_FUNC"     , [IS_IMMUTABLE] : true})
const WRAPPER_FUNC       = Frost({id: "WRAPPER_FUNC"   , [IS_IMMUTABLE] : true})
const KNOWN_HANDLER_FUNC = Frost({id: "HANDLER_FUNC"})
//const SET_LOADER_FUNC = Frost({id: "SET_LOADER_FUNC")


// Simpleton function
const ALWAYS_FALSE     = SetImmutableFunc(          () => false       )
const ALWAYS_NULL      = SetImmutableFunc(          () => null        )
const ALWAYS_UNDEFINED = SetImmutableFunc(          () => undefined   )
const ALWAYS_SELF      = SetImmutableFunc( function () { return this })


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
