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
  const selector = $method.selector
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


function InSetProperty($inner, property, value, $pulp) {
  if (property in $inner) {
    if (value === $inner[property]) { return $pulp }
  }
  else {
    // Consider making id invisible, and ensuring that id is only set thru a special method here!!!
    delete $inner[KNOWN_PROPERTIES]
    delete $inner[$OUTER][KNOWN_PROPERTIES]
  }

  const isPublic = (property[0] !== "_")

  switch (typeof value) {
    case "undefined" :
      return $pulp._assignmentOfUndefinedError()

      case "object" :
             if (value === null)             { if (!isPublic) { break } }
        else if (value[$SECRET] === $INNER)  {
          if    (value === $pulp)            { value = $inner[$RIND]
                                               if (!isPublic) { break } }

          else  { return $pulp._detectedInnerError(value) }
        }
        else if (!isPublic)                  {          break           }
        else if (value[IS_IMMUTABLE])        {         /* NOP */        }
        else if (value.id != null)           {         /* NOP */        }
        else if (value === $inner[$RIND])    {         /* NOP */        }
        else {   value = ($value = InterMap.get(value)) ?
                   $Copy($value, true)[$RIND] : CopyObject(value, true) }

      $inner[$OUTER][property] = value
    break

    case "function" : // LOOK: will catch Type things!!!
      // Note: Checking for value.constructor is inadequate to prevent func spoofing
      switch (InterMap.get(value)) {
        default           : break
        case TYPE_PULP    : return $pulp._detectedInnerError(value)
        // case WRAPPER_FUNC : return $pulp.addOwnMethod(value.method)
        case undefined    : value = AsTameFunc(value); break
      }
    // break omitted

    default :
      if (isPublic) { $inner[$OUTER][property] = value }
    break
  }

  $inner[property] = value
  return $pulp
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



function NewBlanker(superBlanker, permeability_, maker_) {
  const isBase       = (superBlanker === $BaseBlanker)
  const blankerMaker = maker_        || superBlanker.maker
  const permeability = permeability_ || Impermeable
  const $root$inner  = SpawnFrom(superBlanker.$root$inner)
  const $root$outer  = SpawnFrom(superBlanker.$root$outer)
  const PairedOuter  = MakeNamelessVacuousFunction()
  const Blanker      = blankerMaker(PairedOuter, permeability)
  const supers       = SpawnFrom(isBase ? null : $root$inner[$SUPERS])
  const immediates   = SpawnFrom(isBase ? null : $root$inner[$IMMEDIATES])

  Blanker.maker         = blankerMaker
  Blanker.permeability  = permeability
  Blanker.prototype     = $root$inner
  Blanker.$root$inner   = $root$inner
  Blanker.$root$outer   = $root$outer
  $root$inner[$OUTER]   = $root$outer
  PairedOuter.prototype = $root$outer

  supers[$IMMEDIATES]       = SpawnFrom(null)
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
  InterMap.set($pulp, TYPE_PULP)
  return ($inner[$PULP] = $pulp)
}


function MakeTypeInnerBlanker(PairedOuter, Permeability) {
  return function ([name_spec]) {  // $Type // NewTypeBlanker
    var typeName = (typeof name_spec === "string") ? name_spec : name_spec.name
    var func = MakeVacuousConstructor(typeName || "UNNAMED")
    var $outer = new PairedOuter()

    PreInitType(func, this, $outer, Permeability)

    this.subtypes    = SetImmutable(new Set())
    this._properties = SpawnFrom(null)
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



function BuildRoughAncestryOf(supertypes, originalTypes_) {
    const roughAncestry = []
  const originalTypes = originalTypes_ || new Set(supertypes)

  supertypes.forEach(nextType => {
    if (originalTypes_ && originalTypes_.has(nextType)) { /* continue */ }
    else {
      var nextAncestry =
        BuildRoughAncestryOf(nextType.supertypes, originalTypes)
      roughAncestry.push(...nextAncestry, nextType)
    }
  })
  return roughAncestry
}


function BuildAncestryOf(type, supertypes) {
  const roughAncestry = BuildRoughAncestryOf(supertypes)
  const visited = new Set()
  const dupFreeAncestry = []
  var next, nextType

  next = roughAncestry.length
  while (next--) {
    nextType = roughAncestry[next]
    if (!visited.has(nextType)) {
      dupFreeAncestry.push(nextType)
      visited.add(nextType)
    }
  }
  dupFreeAncestry.reverse().push(type)
  return dupFreeAncestry
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





function SetKnownProperties(target, setOuter_) {
  const properties = VisibleProperties(target)
  properties[IS_IMMUTABLE] = true
  if (setOuter_) { target[$OUTER][KNOWN_PROPERTIES] = properties }
  return (target[KNOWN_PROPERTIES] = Frost(properties))
}





const _BasicSetImmutable = function _basicSetImmutable() {
  const $inner = this[$INNER]
  const $outer  = $inner[$OUTER]
  const barrier = new ImmutableInner($inner)

  $inner[$MAIN_BARRIER] = barrier
  $outer[IS_IMMUTABLE]  = $inner[IS_IMMUTABLE] = true
  Frost($outer)
  return ($inner[$PULP] = new Proxy($inner, barrier))
}
//   delete this._captureChanges
//   delete this._captureOverwrite


const _NoSuchProperty = function _noSuchProperty(property) {
  return SignalError(this, `Receiver ${this.id} doesn't have a property: ${property}!!`)
}


const _SetSharedProperty = function _setSharedProperty(property, value, isOwn) {
  const properties  = this._properties
  const existing    = properties[property]

  if (existing === value) { return this }

  const blanker     = this._blanker
  const $root$inner = blanker.$root$inner

  if (value && value.type === Method) { SetMethod($root$inner, value) }
  else      { InSetProperty($root$inner, property, value) }

  if (isOwn) { properties[property] = value }

  delete $root$inner[$SUPERS][property]
  return this._propagateIntoSubtypes(property)
}



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

function MarkFunc(func, marker = KNOWN_FUNC) {
  if (InterMap.get(func)) { return func }
  InterMap.set(func, marker)
  return func
}


const SAFE_FUNC     = Frost({id: "SAFE_FUNC"      , [IS_IMMUTABLE] : true})
const BLANKER_FUNC  = Frost({id: "BLANKER_FUNC"   , [IS_IMMUTABLE] : true})
const TAMED_FUNC    = Frost({id: "TAMED_FUNC"     , [IS_IMMUTABLE] : true})
const WRAPPER_FUNC  = Frost({id: "WRAPPER_FUNC"   , [IS_IMMUTABLE] : true})

const KNOWN_FUNC    = Frost({id: "KNOWN_FUNC"})
const TYPE_PULP     = Frost({id: "TYPE_PULP" })
//const SET_LOADER_FUNC = Frost({id: "SET_LOADER_FUNC")


// Simpleton function
const ALWAYS_FALSE     = MarkFunc(          () => false       )
const ALWAYS_NULL      = MarkFunc(          () => null        )
const ALWAYS_UNDEFINED = MarkFunc(          () => undefined   )
const ALWAYS_SELF      = MarkFunc( function () { return this })


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


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
