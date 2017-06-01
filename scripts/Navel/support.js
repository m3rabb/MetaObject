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
  return function $assignmentError(_target) {
    SignalError(_target[$RIND], `Assignment to property '${Property}' is not allowed, use '${Setter}' method instead!!`)
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




function Copy($source, asImmutable, visited = new WeakMap(), exceptProperty_) {
  const source  = $source[$RIND]
  var   $inner  = new $source[$BLANKER]()
  const $pulp   = $inner[$PULP]
  const $outer  = $inner[$OUTER]
  const target  = $inner[$RIND]
  var handler, next, property, value, traversed, value$inner

  visited.set(source, target) // to manage cyclic objects

  if ((handler = $inner._initFrom_)) {
    if (handler.length < 4) {
      $pulp._initFrom_($source[$PULP], visited, exceptProperty_)
    } else {
      $pulp._initFrom_($source[$PULP], visited, exceptProperty_, asImmutable)
    }
    if ($inner[IS_IMMUTABLE]) { return target }
  }
  else {
    const properties = $source[KNOWN_PROPERTIES] ||
      SetKnownProperties($source, !$source[IS_IMMUTABLE])
    $outer[KNOWN_PROPERTIES] = $inner[KNOWN_PROPERTIES] = properties

    next = properties.length
    while (next--) {
      property = properties[next]
      if (property === exceptProperty_) { continue }

      value = $source[property]
      if (typeof value !== "object" || value === null)  {     /* NOP */     }
      else if (value === source)                        { value = target    }
      else if (value[IS_IMMUTABLE] || value.id != null) {     /* NOP */     }
      else if ((traversed   =  visited.get(value)))     { value = traversed }
      else if ((value$inner = InterMap.get(value)))
           { value = Copy(value$inner, asImmutable, visited) }
      else { value = CopyObject(value, asImmutable, visited) }

      $inner[property] = value
      if (property[0] !== "_") { $outer[property] = value }
    }
  }

  if ($inner._postCreation) { $inner = $pulp._postCreation()[$INNER] }

  if (asImmutable) {
    if (handler) { return BeImmutable($inner) }

    $inner[IS_IMMUTABLE] = $inner[$OUTER][IS_IMMUTABLE] = true
    $inner[$BARRIER]     = new ImmutableInner($inner)
    Frost($outer)
  }

  return $inner[$RIND]
}

// ADD ABILITY TO BE IMMUTABLE 'INPLACE'!!!
// CHANGE TO CHECK FOR PUBLIC PROPERTIES FIRST!!!
// Note: This should only be called on mutable objects!!!
function BeImmutable($inner, inPlace, visited = new WeakSet()) {
  var next, property, value, value$inner

  const target = $inner[$RIND]
  const $outer = $inner[$OUTER]

  visited.add(target)

  if ($inner._setPropertiesImmutable) {
    $inner[$PULP]._setPropertiesImmutable(visited)
  }
  else {
    const properties =
      $inner[KNOWN_PROPERTIES] || SetKnownProperties($inner, true)

    next = properties.length
    while (next--) {
      property = properties[next]
      value    = target[property]

      if (typeof value !== "object" || value === null)  { continue }
      if (value === target)                             { continue }
      if (value[IS_IMMUTABLE] || value.id != null)      { continue }
      if (visited.has(value))                           { continue }

      value$inner = InterMap.get(value)
      if (inPlace) {
        if (value$inner) { BeImmutable(value$inner, true, visited) }
        else             { BeImmutableObject(value, true, visited) }
      }
      else {
        value = value$inner ? Copy(value$inner, true) : CopyObject(value, true)
        $inner[property] = value
        if (property[0] !== "_") { $outer[property] = value }
      }
    }
  }

  $outer[IS_IMMUTABLE] = $inner[IS_IMMUTABLE] = true
  $inner[$BARRIER]     = new ImmutableInner($inner)
  Frost($outer)
  return target
}


const BasicBeImmutable = function basicBeImmutable() {
  const $inner = this[$INNER]
  if ($inner[IS_IMMUTABLE]) { return $inner[$RIND] }
  const $outer = $inner[$OUTER]
  $outer[IS_IMMUTABLE] = $inner[IS_IMMUTABLE] = true
  $inner[$BARRIER]     = new ImmutableInner($inner)
  Frost($outer)
  return $inner[$RIND]
}
//   delete this._captureChanges
//   delete this._captureOverwrite



// Note: The CopyObject is only called AFTER confirming that the source
//       is NOT a fact!!! ***
function CopyObject(source, asImmutable, visited = new WeakMap(), pass_) {
  var target, properties, next, property, value, traversed, value$inner

  switch (source.constructor) {
    default : // Custom Object
      if ((target = source.copy)) {
        if (target !== ReliableObjectCopy) {
          // If copy method was a getter or precopied object
          if (typeof target === "function") { target = source.copy(visited) }

          // ensure logging, just in case receiver's copy method didn't
          visited.set(source, target)

          return (asImmutable && target !== source) ?
            BeImmutableObject(target) : target
          // The 2nd check is somewhat paranoid, but we don't want to mess up
          // an outside object by making it immutable, if and when it returns
          // itself as a 'copy'.
        }
      }
      else if (source.id === null || source[KNOWN_PROPERTIES]) {
        // Only copy ordinary custom object with expressed intention
      }
      else { return source } // Never copy ordinary custom objects
      // break omitted

      target = SpawnFrom(RootOf(source))
      // break omitted

    case Object :
      target     = target || {}
      properties = source[KNOWN_PROPERTIES] || SetKnownProperties(source)
      next       = properties.length

      target[KNOWN_PROPERTIES] = properties
      break

    case Array :
      target    = []
      next      = source.length
      break
  }

  visited.set(source, target) // Handles cyclic objects

  while (next--) {
    property = properties ? properties[next] : next
    value    = source[property]

    if (typeof value !== "object" || value === null)  {     /* NOP */     }
    else if (value === source)                        { value = target    }
    else if (value[IS_IMMUTABLE] || value.id != null) {     /* NOP */     }
    else if ((traversed   =  visited.get(value)))     { value = traversed }
    else if ((value$inner = InterMap.get(value)))
         { value = Copy(value$inner, asImmutable, visited) }
    else { value = CopyObject(value, asImmutable, visited) }

    target[property] = value
  }

  if (asImmutable) {
    target[IS_IMMUTABLE] = true
    Frost(target)
  }

  return target
}


const ReliableObjectCopy = function copy(asImmutable_, visited_) {
  const [asImmutable, visited] = (typeof visited_asImmutable_ === "object") ?
    [undefined, visited_asImmutable_] : [visited_asImmutable_, visited__]
  return (this[IS_IMMUTABLE] && asImmutable !== false) ?
    this : CopyObject(this, asImmutable, visited)
}



function BeImmutableObject(target, inPlace, visited = new WeakSet()) {
  let properties, next, property, value, value$inner

  visited.add(target)

  switch (target.constructor) {
    default : // Object or Custom Object
      properties = target[KNOWN_PROPERTIES] || SetKnownProperties(source)
      next       = properties.length
      break

    case Array :
      next = target.length
      break
  }

  while (next--) {
    property = properties ? properties[next] : next
    value = target[selector]

    if (typeof value !== "object" || value === null) { continue }
    if (value === target)                            { continue }
    if (value[IS_IMMUTABLE] || value.id != null)     { continue }
    if (visited.has(value))                          { continue }

    value$inner = InterMap.get(value)
    if (inPlace) {
      if (value$inner) { BeImmutable(value$inner, true, visited) }
      else             { BeImmutableObject(value, true, visited) }
    }
    else {
      target[selector] = value$inner ?
        Copy(value$inner, true) : CopyObject(value, true)
    }
  }

  target[IS_IMMUTABLE] = true
  return Frost(target)
}


// function BasicBeImmutableObject(target) {
function SetImmutable(target) {
  target[IS_IMMUTABLE] = true
  return Frost(target)
}


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
